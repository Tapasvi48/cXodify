import prisma from "./prisma/index";
import fs from "fs";

const MOUNT_PATH =
  process.env.MOUNT_PATH ?? "../../boilerplate-generator/src/problems";
async function getProblemFullBoilerplateCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      "/Users/tapasviarora/Desktop/cXodify/boilerplate-generator/src/problems/average-problem/boilerplate/function.cpp",
      { encoding: "utf-8" },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
}
const addQuestion = async (problemSlug: string) => {
  const boilerplate = await getProblemFullBoilerplateCode();
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
      defaultCode: {
        create: [
          {
            languageId: 54,
            code: boilerplate,
          },
        ],
      },
    },
    update: {
      description: problemdescription,
    },
  });
  const defaultCode = await prisma.defaultCode.upsert({
    where: {
      problemId: problems.id,
    },
    create: {
      languageId: 54,
      problemId: problems.id,
      code: boilerplate,
    },
    update: {
      code: boilerplate,
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
