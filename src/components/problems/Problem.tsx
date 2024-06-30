import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import { getAllProblem } from "@/app/db/problem";
import { FaCheck, FaCheckCircle, FaClipboardList } from "react-icons/fa";
import { getUserSolvedProblem } from "@/app/db/userproblem";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { auth } from "./auth";

export default function Problems({
  problems,
  userSolvedProblem,
}: {
  problems: any[];
  userSolvedProblem: any[];
}) {
  const solvedProblemIds = userSolvedProblem?.map(
    (problem: any) => problem.problemId
  );

  console.log("solved problem", solvedProblemIds);
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Popular Problems</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Check out the most popular programming problems
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems?.map((problem: any) => (
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
}

export function ProblemCard({
  problem,
  isSolved,
}: {
  problem: any;
  isSolved: boolean;
}) {
  return (
    <Card className="max-w-[300px] rounded-lg overflow-hidden shadow-lg">
      <CardHeader
        className={`flex items-center gap-3 p-4 ${
          isSolved ? "bg-green-500" : "bg-blue-500"
        } text-white`}
      >
        <div className="flex items-center">
          <Image
            alt="problem logo"
            height={40}
            radius="sm"
            src={
              problem.logoUrl ||
              "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            }
            width={40}
          />
          <div className="flex flex-col ml-3">
            <p className="text-md font-bold">{problem.title}</p>
            <p className="text-small text-default-200">
              {problem.difficulty || "example.com"}
            </p>
          </div>
        </div>
        <div className="flex-grow"></div>
        {isSolved && (
          <div>
            <FaCheck className="text-white text-md mr-2" />
          </div>
        )}
      </CardHeader>

      <Divider />
      <CardBody className="p-6 dark:bg-gray-800">
        <div className="flex flex-row justify-between items-center space-x-4">
          <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700 flex-1">
            <FaCheckCircle className="text-green-500 text-md mb-2" />
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {problem.solved}
            </p>
            <p className="text-gray-600 text-sm dark:text-gray-400">Accepted</p>
          </div>
          <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow-md dark:bg-gray-700 flex-1">
            <FaClipboardList className="text-blue-500 text-md mb-2" />
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {problem.submissions}
            </p>
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Submissions
            </p>
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter className="p-4 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
        <Link
          showAnchorIcon
          href={`/problem/${problem.id}`}
          className="text-sm"
        >
          Go to Problem
        </Link>
        <div className="flex items-center">
          <p className="text-gray-600 text-xs dark:text-gray-400 mr-1">
            Acceptance Rate
          </p>
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {problem.solved === 0
              ? 0
              : ((problem.solved / problem.submissions) * 100).toFixed(1)}
            %
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
