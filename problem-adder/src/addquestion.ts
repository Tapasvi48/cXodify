import prisma from "./prisma/index";
import fs from "fs";

const MOUNT_PATH =
  process.env.MOUNT_PATH ?? "../../boilerplate-generator/problems";
const addQuestion = async (problemSlug: string) => {
  const problemdescription = fs.readFileSync(
    `${MOUNT_PATH}/${problemSlug}/Problem.md`,
    "utf-8"
  );

  const problems = await prisma.problem.upsert({
    where: {
      slug: problemSlug,
    },
    create: {
      slug: problemSlug,
      description: problemdescription,
      hidden: false,
      title: problemSlug,
    },
    update: {
      description: problemdescription,
    },
  });
  if (problems) {
    console.log("successfully added problem in db");
  }
};
const args = process.argv.slice(2);

if (args.length < 1) {
  console.error("Please provide the problem slug.");
  process.exit(1);
}

const problemSlug = args[0];

addQuestion(problemSlug)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error adding/updating question:", err);
    process.exit(1);
  });
