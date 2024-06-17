"use client";
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Select, SelectItem, Button } from "@nextui-org/react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
import { CheckIcon, PlayIcon } from "@radix-ui/react-icons";

const languages = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
];

const CodeEditor = ({ initialCode }: { initialCode: string }) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");

  const handleRun = () => {
    console.log("Run code:", code);
    // Implement your run logic here
  };

  const handleSubmit = () => {
    console.log("Submit code:", code);
    // Implement your submit logic here
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "light" : "vs-dark"));
  };

  return (
    <div className="flex flex-col w-full h-screen  rounded-lg shadow-lg overflow-hidden border p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <Select
            className="ml-2"
            value={language}
            placeholder="Select a language"
          >
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex items-center">
          <Switch
            checked={theme === "vs-dark"}
            onChange={toggleTheme}
            className="mr-4"
          >
            {theme === "vs-dark" ? (
              <SunIcon className="h-5 w-5 text-white" />
            ) : (
              <MoonIcon className="h-5 w-5 text-yellow-500" />
            )}
          </Switch>
          <div className="flex gap-4 flex-row ">
            <Button
              onClick={handleRun}
              className="bg-gray-100 text-gray-800 border-1 border-gray-100 rounded-lg flex items-center"
            >
              <PlayIcon className="h-5 w-5" />
              Run
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gray-100 text-green-500 border-1 border-gray-100 font-bold rounded-lg flex items-center"
            >
              <CheckIcon className="h-5 w-5" />
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-grow">
        <Editor
          height="70%"
          language={language}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            padding: {
              top: 10,
              bottom: 10,
            },
          }}
          className="border border-gray-700 rounded-lg"
        />
      </div>
      <div>Test case</div>
    </div>
  );
};

export default CodeEditor;
