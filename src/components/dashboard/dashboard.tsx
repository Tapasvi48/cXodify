import React from "react";

import FeaturedProblem from "@/components/problems/FeaturedProblems";
import RecentlySolvedProblems from "@/components/problems/RecentlySolvedProblems";
import UserStats from "@/components/problems/UserStats";
import TopUsers from "@/components/problems/TopUsers";
import Problems from "@/components/problems/Problem";
import { GetServerSideProps } from "next";
import { auth } from "../problems/auth";
import { getAllProblem, getTopUsers, getUserStats } from "@/app/db/problem";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth(context.req, context.res);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  try {
    const problems = await getAllProblem();
    const userStats = await getUserStats(session.user.id || "");
    const topUsers = await getTopUsers();

    return {
      props: {
        problems,
        userStats,
        topUsers,
      },
    };
  } catch (error) {
    console.error("Error fetching data for dashboard:", error);
    return {
      props: {
        problems: [],
        userStats: {},
        topUsers: [],
      },
    };
  }
};

const DashboardPage = ({
  problems,
  userStats,
  topUsers,
}: {
  problems: any[];
  userStats: any;
  topUsers: any[];
}) => {
  const featuredProblem = problems?.length > 0 ? problems[0] : null;
  const recentlySolvedProblems = problems?.slice(0, 4);

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3 space-y-4">
        <FeaturedProblem problem={featuredProblem} />
        <RecentlySolvedProblems problems={recentlySolvedProblems} />
        <Problems problems={problems} />
      </div>
      <div className="lg:col-span-1 sticky top-16 space-y-4">
        <UserStats />
        <TopUsers users={topUsers} />
      </div>
    </div>
  );
};

export default DashboardPage;
