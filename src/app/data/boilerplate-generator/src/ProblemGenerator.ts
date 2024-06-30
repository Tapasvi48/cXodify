interface InputOutputField {
  name: string;
  type: string;
}
interface CodeGenerator {
  generateProblem(
    inputField: InputOutputField[],
    outputField: InputOutputField[],
    functionName: string
  ): string;
  generateFull(
    inputField: InputOutputField[],
    outputField: InputOutputField[],
    functionName: string
  ): string;
}

export class ProblemDefinitionParser {
  problemName: string;
  functionName: string;
  inputField: InputOutputField[];
  outputField: InputOutputField[];
  codeGenerator: CodeGenerator | null;
  // dependcy inversion depend on code generator rather than the class
  // also single responsibilty as dont have to change class again and again when want to add new method for new language

  constructor() {
    this.problemName = "";
    this.functionName = "";
    this.inputField = [];
    this.outputField = [];
    this.codeGenerator = null;
  }

  parse(input: string): void {
    let currentSection: string | null = null;

    const parseText = input.split("\n").map((item) => item.trim());

    parseText.forEach((item) => {
      if (item.startsWith("Problem Name:")) {
        currentSection = "problem";
      } else if (item.startsWith("Function Name:")) {
        currentSection = "function";
      } else if (item.startsWith("Input Structure:")) {
        currentSection = "input";
      } else if (item.startsWith("Output Structure:")) {
        currentSection = "output";
      }
      if (currentSection == "problem") {
        const match = item.match(/:\s*"(.*)/);
        if (match) {
          this.problemName += match[1];
        } else if (item.endsWith('"')) {
          this.problemName += ` ${item.replace(/"$/, "")}`;
          //delete the ending "
        } else {
          //space for netx line c
          this.problemName += ` ${item}`;
        }
      } else if (currentSection == "function") {
        const match = item.match(/:\s*(\w+)$/);
        if (match) {
          this.functionName = match[1];
          currentSection = null;
        }
      } else if (currentSection == "input" && item.startsWith("Input Field")) {
        const inpField = item.match(/Field:\s*(\w+(?:<[\w+s<>]+>)?)\s*(\w+)$/);
        if (inpField) {
          this.inputField.push({ type: inpField[1], name: inpField[2] });
        }
      } else if (
        currentSection == "output" &&
        item.startsWith("Output Field")
      ) {
        const outpField = item.match(/Field:\s*(\w+(?:<[\w+s<>]+>)?)\s*(\w+)$/);
        if (outpField) {
          this.outputField.push({ type: outpField[1], name: outpField[2] });
        }
      }
    });
  }
  setCodeGenerator(generator: CodeGenerator): void {
    this.codeGenerator = generator;
  }

  generateCode(): string {
    if (!this.codeGenerator) {
      throw new Error("Code generator not set.");
    }
    return this.codeGenerator.generateProblem(
      this.inputField,
      this.outputField,
      this.functionName
    );
  }
  generateFullCode(): string {
    if (!this.codeGenerator) {
      throw new Error("Code generator not set.");
    }
    return this.codeGenerator.generateFull(
      this.inputField,
      this.outputField,
      this.functionName
    );
  }
}

export class CppCodeGenerator implements CodeGenerator {
  generateProblem(
    inputField: InputOutputField[],
    outputField: InputOutputField[],
    functionName: string
  ): string {
    let cppCode = "";

    const inputParams = inputField
      .map((item) => `${this.mapToCpp(item.type)} ${item.name}`)
      .join(",");

    console.log(inputParams, "input params are");
    cppCode += `${this.mapToCpp(
      outputField[0].type
    )} ${functionName}(${inputParams}) {\n`;
    cppCode += `// Initialize result\n`;
    cppCode += `${this.mapToCpp(outputField[0].type)} result;`;
    cppCode += `  // Replace this with actual implementation logic\n`;
    cppCode += `  return result;\n`;
    cppCode += `}\n`;
    // console.log("cpp code is", cppCode);
    return cppCode;
  }
  generateFull(
    inputField: InputOutputField[],
    outputField: InputOutputField[],
    functionName: string
  ): string {
    const inputs = inputField
      .map((field) => `${field.type} ${field.name}`)
      .join(", ");
    console.log("input is", inputField);

    const inputReads = inputField
      .map((field) => {
        return this.generateCppInputRead(field);
      })
      .join("\n");
    const outputType = this.mapToCpp(outputField[0].type);
    const functionCall = `${outputType} result = ${functionName}(${inputField
      .map((field) => field.name)
      .join(", ")});`;
    const outputWrite = `std::cout << result << std::endl;`;

    return `
#include <iostream>
#include <vector>
#include <string>
using namespace std;

##USER_CODE_HERE##

int main() {
${inputReads}
${functionCall}
${outputWrite}
return 0;
}
  `;
  }
  private generateCppInputRead(field: InputOutputField): string {
    if (!field.type.startsWith("list<")) {
      return `std::cin >> ${field.name};`;
    }
    console.log("field is", field);
    // string , boolan ,int ,float, double

    //handle 2d ,3d  array
    // list<list<int>>
    // Extract inner type like 'int' from 'list<int> or list<list<int>> ->list<int>'
    const depth = this.getListDepth(field.type); // Get depth of nested lists
    console.log("depth iss ", depth);
    let code = "";

    let dimensions: string[] = [];
    for (let i = 0; i < depth; i++) {
      code += `int n${i + 1};\n`;
      code += `std::cin >> n${i + 1};\n`;
      dimensions.push(`n${i + 1}`);
    }

    // code += `${this.mapToCpp(field.type)}${field.name};\n`;
    //list type->list<int<int>>

    const match = field.type.match(/list(<.*>)+/);
    let fieldType = "";
    if (match) {
      fieldType = match[0]
        .split("<")
        [match[0].split("<").length - 1].split(">")[0];
    }
    // field Type is
    const f1 = fieldType;
    code += this.generateInitialization(field.name, f1, dimensions);
    code += this.generateRecurrsiveInput(field.name, fieldType, dimensions, 0);

    console.log("cpp codessss is", code);
    return code;
  }
  private generateInitialization(
    fieldName: string,
    type: string,
    dimensions: string[]
  ): string {
    let initCode = this.generateNestedInitialization(
      dimensions.length,
      type,
      fieldName,
      dimensions
    );
    initCode += `;\n`;

    return initCode;
  }

  private generateassign(
    depth: number,
    fieldType: string,
    fieldName: string,
    dimensions: string[]
  ): string {
    if (depth === dimensions.length + 1) {
      let str = "";
      if (fieldType == "int") {
        str = "0";
      } else if (fieldType == "bool") {
        str = "true";
      }
      for (let i = 0; i < dimensions.length; i++) {
        str += ")";
      }
      return str;
    }

    let str = "";
    if (depth !== 0) {
      str += "(";
    }

    str += dimensions[depth - 1];
    str += ",";
    for (let i = 0; i < dimensions.length - depth; i++) {
      str += `std::vector<`;
    }
    if (dimensions.length - depth > 0) {
      str += `${fieldType}`;
    }
    for (let i = 0; i < dimensions.length - depth; i++) {
      str += `>`;
    }

    str += this.generateassign(depth + 1, fieldType, fieldName, dimensions);
    return str;
  }

  private generateNestedInitialization(
    depth: number,
    fieldType: string,
    fieldName: string,
    dimensions: string[]
  ): string {
    if (depth === 0) {
      let str = `${fieldType}`;
      for (let i = 0; i < dimensions.length; i++) {
        str += ">";
      }
      str += `${fieldName}`;
      str += this.generateassign(1, fieldType, fieldName, dimensions);
      return str;
    }

    return `std::vector<${this.generateNestedInitialization(
      depth - 1,
      fieldType,
      fieldName,
      dimensions
    )}`;
  }
  private generateRecurrsiveInput(
    vectorName: string,
    listType: string,
    dimensions: string[],
    depth: number
  ): string {
    if (depth === dimensions.length) {
      return `cin >> ${vectorName};\n`;
    }

    // Otherwise, iterate through each element of the current vector
    let innerCode = "";
    innerCode += `for (auto& vec${depth} : ${vectorName}) {\n`;
    innerCode += this.generateRecurrsiveInput(
      `vec${depth}`,
      listType,
      dimensions,
      depth + 1
    );
    innerCode += `}\n`;

    return innerCode;
  }

  private getListDepth(type: string): number {
    //list<
    const match = type.match(/list(<.*>)+/);
    if (!match) {
      return 0;
    }
    return match[0].split("<").length - 1;
  }

  private mapToCpp(type: string): string {
    switch (type) {
      case "int":
        return "int";
      case "float":
        return "float";
      case "string":
        return "string";
      case "bool":
        return "bool";
      case "list<int>":
        return "vector<int>";
      case "list<bool>":
        return "vector<bool>";
      case "list<string>":
        return "vector<string>";
      case "list<list<int>>":
        return "vector<vector<int>>";
      case "list<list<list<list<string>>>>":
        return "vector<vector<vector<vector<string>>>>";
      default:
        return "unknown";
    }
  }
}

export class JavaCodeGenerator implements CodeGenerator {
  generateProblem(
    inputField: InputOutputField[],
    outputField: InputOutputField[],
    functionName: string
  ): string {
    let javaCode = "";

    const inputParams = inputField
      .map((item) => `${this.mapToJava(item.type)} ${item.name}`)
      .join(", ");

    javaCode += `public ${this.mapToJava(
      outputField[0].type
    )} ${functionName}(${inputParams}) {\n`;
    javaCode += `    ${this.mapToJava(
      outputField[0].type
    )} result; // Initialize result\n`;
    javaCode += `    // Replace this with actual implementation logic\n`;
    javaCode += `    return result;\n`;
    javaCode += `}\n`;

    return javaCode;
  }
  generateFull(
    inputField: InputOutputField[],
    outputField: InputOutputField[],
    functionName: string
  ): string {
    const inputs = inputField
      .map((field) => `${field.type} ${field.name}`)
      .join(", ");
    const inputReads = inputField
      .map((field) => {
        return this.generateInputRead(field);
      })
      .join("\n");
    const outputType = this.mapToJava(outputField[0].type);
    const functionCall = `${outputType} result = ${functionName}(${inputField
      .map((field) => field.name)
      .join(", ")});`;
    const outputWrite = `System.out.println(result);`;

    return `
${this.generateUserJavaCode()}

import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String[] input = scanner.nextLine().split(" ");
        ${inputReads}
        ${functionCall}
        ${outputWrite}
    }
}
    `;
  }
  private generateInputRead(field: InputOutputField): string {
    const listType = field.type.substring(5, field.type.length - 1); // Extract inner type like 'int' from 'list<int> or list<list<int>> ->list<int>'
    const depth = this.getListDepth(field.type); // Get depth of nested lists

    let code = "";
    for (let i = 0; i < depth; i++) {
      const arrayName = `${field.name}${"_".repeat(i)}`; // Generate array names like 'array', 'array_', 'array__' etc.
      if (i === 0) {
        code += `int size_${arrayName};\n`;
        code += `std::cin >> size_${arrayName};\n`;
        code += `${listType} ${arrayName}(size_${arrayName});\n`;
      } else {
        code += `${listType} ${arrayName}_temp;\n`;
        code += `for (int j = 0; j < ${arrayName}.size(); ++j) {\n`;
        code += `  std::cin >> ${arrayName}_temp;\n`;
        code += `  ${arrayName}[j] = ${arrayName}_temp;\n`;
        code += `}\n`;
      }
    }
    return code;
  }
  private getListDepth(type: string): number {
    //list<
    const match = type.match(/list(<.*>)+/);
    if (!match) {
      return 0;
    }
    return match[0].split("<").length - 1;
  }

  private mapToJava(type: string): string {
    switch (type) {
      case "int":
        return "int";
      case "float":
        return "float";
      case "string":
        return "String";
      case "bool":
        return "boolean";
      case "list<int>":
        return "List<Integer>";
      case "list<bool>":
        return "List<Boolean>";
      case "list<string>":
        return "List<String>";
      case "list<list<int>>":
        return "List<List<Integer>>";
      default:
        return "unknown";
    }
  }
  private parseJavaInputValue(type: string): string {
    if (type === "int" || type === "float" || type === "bool") {
      return `Integer.parseInt(input[0])`;
    } else if (type === "string") {
      return `input[0]`;
    } else if (type.startsWith("list<")) {
      return `${this.mapToJava(type)}.valueOf(input)`;
    } else {
      return `null`;
    }
  }

  private generateUserJavaCode(): string {
    return `
##USER_CODE_HERE##
    `;
  }
}

//  function name is ->Single line

// const cppGenerator = new CppCodeGenerator();
// pb1.setCodeGenerator(cppGenerator);
// const cppCode = pb1.generateFullCode();
// console.log("Generated C++ Code:");
// console.log(cppCode);

// const javaGenerator = new JavaCodeGenerator();
// pb1.setCodeGenerator(javaGenerator);
// const javaCode = pb1.generateFullCode();
// console.log("Generated Java Code:");
// console.log(javaCode);
