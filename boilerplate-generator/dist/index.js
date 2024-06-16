"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ProblemGenerator_1 = require("./ProblemGenerator");
function generateProblemCode(generatorFilePath) {
    const inputFilePath = path_1.default.join(process.cwd() + generatorFilePath, "Structure.md");
    const boilerplatePath = path_1.default.join(process.cwd() + generatorFilePath, "boilerplate");
    //boilerplate folder
    // Read the input file
    const input = fs_1.default.readFileSync(inputFilePath, "utf-8");
    // Parse the input
    const parser = new ProblemGenerator_1.ProblemDefinitionParser();
    parser.parse(input);
    // Generate the boilerplate code
    const javaGenerator = new ProblemGenerator_1.JavaCodeGenerator();
    const cppGenerator = new ProblemGenerator_1.CppCodeGenerator();
    parser.setCodeGenerator(cppGenerator);
    const cppCode = parser.generateCode();
    parser.setCodeGenerator(javaGenerator);
    const javaCode = parser.generateCode();
    // Ensure the boilerplate directory exists
    if (!fs_1.default.existsSync(boilerplatePath)) {
        fs_1.default.mkdirSync(boilerplatePath, { recursive: true });
    }
    // Write the boilerplate code to respective files
    fs_1.default.writeFileSync(path_1.default.join(boilerplatePath, "function.cpp"), cppCode);
    fs_1.default.writeFileSync(path_1.default.join(boilerplatePath, "function.java"), javaCode);
    console.log("Boilerplate code generated successfully!");
}
function generateFullProblemCode(generatorFilePath) {
    const inputFilePath = path_1.default.join(process.cwd() + generatorFilePath, "Structure.md");
    const boilerplatePath = path_1.default.join(process.cwd() + generatorFilePath, "boilerplate-full");
    //boilerplate folder
    // Read the input file
    const input = fs_1.default.readFileSync(inputFilePath, "utf-8");
    // Parse the input
    const parser = new ProblemGenerator_1.ProblemDefinitionParser();
    parser.parse(input);
    // Generate the boilerplate code
    const javaGenerator = new ProblemGenerator_1.JavaCodeGenerator();
    const cppGenerator = new ProblemGenerator_1.CppCodeGenerator();
    parser.setCodeGenerator(cppGenerator);
    const cppCode = parser.generateFullCode();
    parser.setCodeGenerator(javaGenerator);
    const javaCode = parser.generateFullCode();
    // Ensure the boilerplate directory exists
    if (!fs_1.default.existsSync(boilerplatePath)) {
        fs_1.default.mkdirSync(boilerplatePath, { recursive: true });
    }
    // Write the boilerplate code to respective files
    fs_1.default.writeFileSync(path_1.default.join(boilerplatePath, "function.cpp"), cppCode);
    fs_1.default.writeFileSync(path_1.default.join(boilerplatePath, "function.java"), javaCode);
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
