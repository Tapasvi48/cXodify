import { NextResponse } from "next/server";
import { db } from "./index";
// get all problem
export const getAllProblem = async () => {
  const problems = await db.problem.findMany({
    where: {
      hidden: false,
    },
    include: {
      defaultCode: true,
    },
  });
  return problems;
};

export const getProblemById = async (id: string) => {
  const problems = await db.problem.findFirst({
    where: {
      AND: [
        {
          hidden: false,
        },
        {
          id: id,
        },
      ],
    },
    include: {
      defaultCode: true,
    },
  });
  return problems;
};
export const getAllSubmission = async (id: string) => {
  const submissions = await db.submission.findMany({
    where: {
      problemId: id,
    },
    include: {
      testcases: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return submissions;
};
export const getUserStats = async (id: string) => {
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

      return {
        easyCount,
        mediumCount,
        hardCount,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      let easyCount = 0;
      let hardCount = 0;
      let mediumCount = 0;
      return {
        easyCount,
        mediumCount,
        hardCount,
      };
    }
  }
};
export const getTopUsers = async () => {
  try {
    const topUsers = await db.user.findMany({
      take: 5,
      orderBy: {
        solvedProblems: {
          _count: "desc",
        },
      },
      include: {
        solvedProblems: true,
      },
    });

    const topUsersWithCounts = topUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
      solvedProblemsCount: user.solvedProblems.length,
    }));

    return topUsersWithCounts;
  } catch (error) {
    console.error("Error fetching top users:", error);
    throw new Error("Failed to fetch top users");
  }
};
