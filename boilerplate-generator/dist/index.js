"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemDefinitionParser = void 0;
class ProblemDefinitionParser {
    constructor() {
        this.problemName = "";
        this.functionName = "";
        this.inputField = [];
        this.outputField = [];
    }
    parse(input) {
        let currentSection = null;
        const parseText = input.split("\n").map((item) => item.trim());
        parseText.forEach((item) => {
            if (item.startsWith("Problem Name:")) {
                currentSection = "problem";
            }
            else if (item.startsWith("Function Name:")) {
                currentSection = "function";
            }
            else if (item.startsWith("Input Structure:")) {
                currentSection = "input";
            }
            else if (item.startsWith("Output Structure:")) {
                currentSection = "output";
            }
            if (currentSection == "problem") {
                const match = item.match(/Problem Name: "(.*)/);
                if (match) {
                    this.problemName += match[1];
                }
                else if (item.endsWith('"')) {
                    this.problemName += ` ${item.replace(/"$/, "")}`;
                    //delete the ending "
                }
                else {
                    //space for netx line c
                    this.problemName += ` ${item}`;
                }
            }
            else if (currentSection == "function") {
                const match = item.match(/Function Name: (\w+)$/);
                if (match) {
                    this.functionName = match[1];
                    currentSection = null;
                }
            }
            else if (currentSection == "input" && item.startsWith("Input Field")) {
                const inpField = item.match(/Input Field: (\w+(?:<\w+>)?) (\w+)$/);
                if (inpField) {
                    this.inputField.push({ type: inpField[1], name: inpField[2] });
                }
            }
            else if (currentSection == "output" &&
                item.startsWith("Output Field")) {
                const outpField = item.match(/Output Field: (\w+(?:<\w+>)?) (\w+)$/);
                if (outpField) {
                    this.outputField.push({ type: outpField[1], name: outpField[2] });
                }
            }
        });
        console.log(this.functionName, this.inputField, this.outputField, this.problemName);
    }
}
exports.ProblemDefinitionParser = ProblemDefinitionParser;
const pb1 = new ProblemDefinitionParser();
pb1.parse(`Problem Name: "Average of number in a array
    sadasd
    sadsad
    "
      Function Name: sums
      Input Structure:
      Input Field: list<int> num
      Output Structure:
      Output Field: int result`);
//  function name is ->Single line
