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

export const getProblemById = () => {};
