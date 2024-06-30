import React from "react";
import { getAllProblem, getTopUsers, getUserStats } from "../db/problem";

import FeaturedProblem from "@/components/problems/FeaturedProblems";
import RecentlySolvedProblems from "@/components/problems/RecentlySolvedProblems";
import UserStats from "@/components/problems/UserStats";
import TopUsers from "@/components/problems/TopUsers";
import Problems from "@/components/problems/Problem";

import { auth } from "@/components/problems/auth";
import { getServerSession } from "next-auth";

import { getUserSolvedProblem } from "../db/userproblem";
import { authOption } from "@/lib/utils";

const DashboardPage = async () => {
  const problems = await getAllProblem();
  const featuredProblem = problems[0];
  const recentlySolvedProblems = problems.slice(0, 4);
  const session = await getServerSession(authOption);
  console.log("session issa d samd", session);

  const topUsers = await getTopUsers();
  const userSolvedProblems = await getUserSolvedProblem({
    id: session?.user.id || "",
  });
  console.log("user solved problem are", userSolvedProblems);

  const userStatus = await getUserStats(session?.user?.id || "");
  console.log(topUsers);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3">
        <FeaturedProblem problem={featuredProblem} />
        <RecentlySolvedProblems
          problems={recentlySolvedProblems}
          userSolvedProblem={userSolvedProblems || []}
        />
        <Problems
          problems={problems}
          userSolvedProblem={userSolvedProblems || []}
        />
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-16 space-y-4">
          <UserStats
            easyProblems={userStatus?.easyCount || 0}
            mediumProblems={userStatus?.mediumCount || 0}
            hardProblems={userStatus?.hardCount || 0}
          />
          <TopUsers users={topUsers} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
