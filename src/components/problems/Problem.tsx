import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Image,
} from "@nextui-org/react";
import { Button } from "../ui/button";
import { getAllProblem } from "@/app/db/problem";
import { FaCheckCircle, FaClipboardList, FaPercent } from "react-icons/fa";
import { CardContent } from "../ui/card";

export async function Problems() {
  const problems = await getAllProblem();

  return (
    <section className="bg-white dark:bg-gray-900 py-8 md:py-12 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Popular Problems</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Check out the most popular programming problems
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <ProblemCard problem={problem} key={problem.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({ problem }: { problem: any }) {
  return (
    <Card className="max-w-[300px] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <CardHeader className="flex gap-3 p-4 bg-blue-500 text-white">
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
        <div className="flex flex-col">
          <p className="text-md font-bold">{problem.title}</p>
          <p className="text-small text-default-200">
            {problem.difficulty || "example.com"}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="p-6">
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
          isExternal
          showAnchorIcon
          href={
            `/problem/${problem.id}` || "https://github.com/nextui-org/nextui"
          }
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
