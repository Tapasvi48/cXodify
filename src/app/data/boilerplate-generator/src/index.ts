import fs from "fs";
import path from "path";
import {
  CppCodeGenerator,
  JavaCodeGenerator,
  ProblemDefinitionParser,
} from "./ProblemGenerator";

function generateProblemCode(generatorFilePath: string) {
  const inputFilePath = path.join(
    process.cwd() + generatorFilePath,
    "Structure.md"
  );
  const boilerplatePath = path.join(
    process.cwd() + generatorFilePath,
    "boilerplate"
  );
  //boilerplate folder

  // Read the input file
  const input = fs.readFileSync(inputFilePath, "utf-8");

  // Parse the input
  const parser = new ProblemDefinitionParser();
  parser.parse(input);

  // Generate the boilerplate code
  const javaGenerator = new JavaCodeGenerator();
  const cppGenerator = new CppCodeGenerator();
  parser.setCodeGenerator(cppGenerator);
  const cppCode = parser.generateCode();
  parser.setCodeGenerator(javaGenerator);
  const javaCode = parser.generateCode();

  // Ensure the boilerplate directory exists
  if (!fs.existsSync(boilerplatePath)) {
    fs.mkdirSync(boilerplatePath, { recursive: true });
  }

  // Write the boilerplate code to respective files
  fs.writeFileSync(path.join(boilerplatePath, "function.cpp"), cppCode);
  fs.writeFileSync(path.join(boilerplatePath, "function.java"), javaCode);
  console.log("Boilerplate code generated successfully!");
}

function generateFullProblemCode(generatorFilePath: string) {
  const inputFilePath = path.join(
    process.cwd() + generatorFilePath,
    "Structure.md"
  );
  const boilerplatePath = path.join(
    process.cwd() + generatorFilePath,
    "boilerplate-full"
  );
  //boilerplate folder

  // Read the input file
  const input = fs.readFileSync(inputFilePath, "utf-8");

  // Parse the input
  const parser = new ProblemDefinitionParser();
  parser.parse(input);

  // Generate the boilerplate code
  const javaGenerator = new JavaCodeGenerator();
  const cppGenerator = new CppCodeGenerator();
  parser.setCodeGenerator(cppGenerator);
  const cppCode = parser.generateFullCode();
  parser.setCodeGenerator(javaGenerator);
  const javaCode = parser.generateFullCode();

  // Ensure the boilerplate directory exists
  if (!fs.existsSync(boilerplatePath)) {
    fs.mkdirSync(boilerplatePath, { recursive: true });
  }

  // Write the boilerplate code to respective files
  fs.writeFileSync(path.join(boilerplatePath, "function.cpp"), cppCode);
  fs.writeFileSync(path.join(boilerplatePath, "function.java"), javaCode);
  console.log("Boilerplate code generated successfully!");
}
const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Please provide the path to the problem directory.");
  process.exit(1);
}
const generatorFilePath = args[0];

generateProblemCode(`/problems/${generatorFilePath}`);
generateFullProblemCode(`/problems/${generatorFilePath}`);
