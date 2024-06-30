// pages/api/createUser.ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../problem-adder/src/prisma";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";

export async function POST(req: NextRequest, res: NextResponse) {
  const { id } = await req.json();
  if (id !== "") {
    try {
      const easyCount = await db.solvedProblem.count({
        where: {
          userId: id,
          problem: {
            difficulty: "EASY",
          },
        },
      });

      const mediumCount = await db.solvedProblem.count({
        where: {
          userId: id,
          problem: {
            difficulty: "MEDIUM",
          },
        },
      });

      const hardCount = await db.solvedProblem.count({
        where: {
          userId: id,
          problem: {
            difficulty: "HARD",
          },
        },
      });

      console.log("Easy Problems Solved:", easyCount);
      console.log("Medium Problems Solved:", mediumCount);
      console.log("Hard Problems Solved:", hardCount);

      return NextResponse.json({
        message: "sadad",
        easyCount,
        mediumCount,
        hardCount,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw new Error("Failed to fetch user stats");
    }
  }
}
