// pages/api/createUser.ts

import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "next/dist/server/api-utils";
import { db } from "@/app/db";
import { Prisma } from "@prisma/client";

const MAX_RETRIES = 5;

export async function PUT(req: NextRequest, res: NextResponse) {
  console.log("Callback received");
  const search = req.nextUrl.searchParams;
  console.log(search);
  const id = search.get("id");
  console.log("id is", id);
  if (!id) {
    throw new ApiError(400, "id is null");
  }

  try {
    const data = await req.json();
    console.log("data", data);
    const isCorrect = data.status_id === 3;

    // Create the test case
    const testCase = await db.testCase.create({
      data: {
        status: isCorrect ? "ACCEPTED" : "FAILED",
        token: data.token,
        submissionId: id,
      },
    });

    let attempts = 0;
    let success = false;

    while (attempts < MAX_RETRIES && !success) {
      attempts++;
      try {
        await db.$transaction(
          async (db: any) => {
            // Find the submission
            if (!isCorrect) {
              const submission = await db.submission.findFirst({
                where: {
                  id: id,
                },
              });

              // Update the submission status to REJECTED
              await db.submission.update({
                where: {
                  id: id || "",
                },
                data: {
                  status: "REJECTED",
                },
              });

              // Check the status and update problem submissions count if needed
            }
            const updatedSubmission = await db.submission.update({
              where: {
                id: id || "",
              },
              data: {
                evaluatedCases: { increment: 1 },
              },
            });

            // Check if all test cases have been evaluated
            const allEvaluated =
              updatedSubmission.evaluatedCases + 1 ===
              updatedSubmission.totalCases;

            // If all test cases are evaluated and none failed, update the status to ACCEPTED
            if (allEvaluated) {
              if (updatedSubmission.status === "PENDING") {
                await db.submission.update({
                  where: {
                    id: id || "",
                  },
                  data: {
                    status: "AC",
                  },
                });
                const problem = await db.problem.update({
                  where: {
                    id: updatedSubmission.problemId,
                  },
                  data: {
                    submissions: { increment: 1 },
                    solved: { increment: 1 },
                  },
                });
                await db.submission.update({
                  where: {
                    id: id || "",
                  },
                  data: {
                    status: "AC",
                  },
                });
                await db.solvedProblem.upsert({
                  where: {
                    userId_problemId: {
                      userId: updatedSubmission.userId,
                      problemId: updatedSubmission.problemId,
                    },
                  },
                  update: {
                    difficulty: problem.difficulty,
                    solvedAt: new Date(),
                  },
                  create: {
                    userId: updatedSubmission.userId,
                    problemId: updatedSubmission.problemId,
                    difficulty: problem.difficulty,
                  },
                });
              } else {
                await db.problem.update({
                  where: {
                    id: updatedSubmission.problemId,
                  },
                  data: {
                    submissions: { increment: 1 },
                  },
                });
              }
            }
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          }
        );

        success = true;
      } catch (transactionError) {
        if (attempts >= MAX_RETRIES) {
          throw new Error(
            "Transaction failed due to a write conflict or a deadlock. Please retry your transaction."
          );
        }
        console.warn(
          `Transaction failed on attempt ${attempts}. Retrying...`,
          transactionError
        );
      }
    }

    return NextResponse.json({
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while updating the status" },
      { status: 500 }
    );
  }
}
