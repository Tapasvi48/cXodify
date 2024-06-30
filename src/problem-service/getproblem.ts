import { ApiError } from "next/dist/server/api-utils";
import prisma from "../../problem-adder/src/prisma";
import fs from "fs";
import path from "path";
import { dir } from "console";

type SUPPORTED_LANGS = "js" | "cpp" | "rs";

export const getproblem = async (id: string) => {
  const response = await prisma.problem.findUnique({
    where: {
      id: id,
    },
  });
  //id doesn't exist
  if (!response) {
    throw new ApiError(404, "Problem not found");
  }
  return response;
  //id exist
};

interface Problem {
  id: string;
  fullBoilerplateCode: string;
  inputs: string[];
  outputs: string[];
}

const MOUNT_PATH = "../../boilerplate-generator/problems";
const BOILERPLATE_PATH = path.resolve(
  process.cwd() + "/cXodify" + "../../boilerplate-generator/src/problems"
);
console.log("boiler plate path is", BOILERPLATE_PATH);
export const getProblemData = async (
  problemId: string,
  slug: string,
  languageType: SUPPORTED_LANGS
): Promise<Problem> => {
  const fullBoilerPlate = await getProblemFullBoilerplateCode(
    slug,
    languageType,
    slug
  );
  const inputs = await getProblemInputs(slug, slug);
  const outputs = await getProblemOutputs(slug, slug);

  return {
    id: problemId,
    fullBoilerplateCode: fullBoilerPlate,
    inputs: inputs,
    outputs: outputs,
  };
};

async function getProblemFullBoilerplateCode(
  problemId: string,
  languageType: SUPPORTED_LANGS,
  slug: string
): Promise<string> {
  const filePath = path.join(
    BOILERPLATE_PATH,
    problemId,
    "boilerplate-full",
    `function.${languageType}`
  );

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

async function getProblemInputs(
  problemId: string,
  slug: string
): Promise<string[]> {
  const dirPath = path.join(BOILERPLATE_PATH, problemId, "tests", "input");
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, async (err, files) => {
      if (err) {
        console.log(err);
      } else {
        await Promise.all(
          files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              fs.readFile(
                path.join(dirPath, file),
                { encoding: "utf-8" },
                (err, data) => {
                  if (err) {
                    reject(err);
                  }
                  resolve(data);
                }
              );
            });
          })
        )
          .then((data) => {
            resolve(data);
          })
          .catch((e) => reject(e));
      }
    });
  });
}

async function getProblemOutputs(
  problemId: string,
  slug: string
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const dirPath = path.join(BOILERPLATE_PATH, problemId, "tests", "output");
    fs.readdir(dirPath, async (err, files) => {
      if (err) {
        console.log(err);
      } else {
        await Promise.all(
          files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              fs.readFile(
                path.join(dirPath, file),
                { encoding: "utf-8" },
                (err, data) => {
                  if (err) {
                    reject(err);
                  }
                  resolve(data);
                }
              );
            });
          })
        )
          .then((data) => {
            resolve(data);
          })
          .catch((e) => reject(e));
      }
    });
  });
}
