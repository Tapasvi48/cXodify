import { getproblem, getProblemData } from "@/problem-service/getproblem";
import { custom_middleware } from "@/utils/api";
import { ApiError } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../problem-adder/src/prisma";
import axios from "axios";
import { SubmissionStatus } from "@/constants/submission_constants";
import { languageConstants } from "@/constants/judge0_constants";
import { JUGE0_URI } from "@/constants";
import {
  fetchSubmissionResult,
  submitBatchCode,
} from "@/judge0-api/submission";

const submit_code = async (req: NextRequest, res: NextResponse) => {
  const { problemId, sourceCode, userId, languageId, languageSlug } =
    await req.json();
  console.log(languageSlug, userId, languageId);
  if (!problemId || !sourceCode) {
    throw new ApiError(400, "Validation Error");
    // you can do more abstarcation
  }
  const problem = await getproblem(problemId);
  //create a submission

  const problemData = await getProblemData(
    problemId,
    problem.slug,
    languageSlug
  );

  console.log(problemData, "problem data is");
  //this data will be given by the juge
  const submission = await prisma.submission.create({
    data: {
      problemId: problemId,
      userId: userId,
      status: "PENDING",
      languageCode: parseInt(languageId),
      totalCases: problemData.inputs.length,
    },
  });
  const response = await submitBatchCode(
    problemData,
    sourceCode,
    submission.id
  );

  return NextResponse.json({
    message: "Submmison made succes",
    status: 200,
    submission: submission,
    submissionId: submission.id,
  });
};

/// Wrapping handle in custom_middleware
export const POST = custom_middleware(submit_code);
