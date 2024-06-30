import React from "react";
import { ProblemCard } from "./Problem";

const RecentlySolvedProblem = ({
  problems,
  userSolvedProblem,
}: {
  problems: any[];
  userSolvedProblem: any[];
}) => {
  console.log(problems, "problem is");
  const solvedProblemIds = userSolvedProblem?.map(
    (problem: any) => problem.problemId
  );

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Recently Solved Problem</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems?.map((problem) => (
            <ProblemCard
              problem={problem}
              key={problem.id}
              isSolved={solvedProblemIds.includes(problem.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlySolvedProblem;
