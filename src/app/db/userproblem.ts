import { db } from "./index";
// get all problem
export const getUserSolvedProblem = async ({ id }: { id: string }) => {
  console.log(id, "id is");
  if (id != "") {
    const user = await db.solvedProblem.findMany({
      where: {
        userId: id,
      },
    });

    return user;
  }
};
