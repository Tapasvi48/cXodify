"use client";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button, Spinner, Tabs, Tab, CardBody } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { Switch, VisuallyHidden, useSwitch } from "@nextui-org/react";
import { CheckIcon, PlayIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

import { Card, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { ToastAction } from "../ui/toast";

type LanguageKey = "cpp" | "java";

// Define the language constants type
const languageConstants: Record<LanguageKey, string> = {
  cpp: "54",
  java: "62",
};

interface LanguageOption {
  label: string;
  value: LanguageKey;
}
const languages: LanguageOption[] = [
  { label: "Cpp", value: "cpp" },
  { label: "Java", value: "java" },
];
const CodeEditor = ({
  defaultCode,
  problemId,
  onSubmissionSuccess,
}: {
  defaultCode: {
    id: string;
    code: string;
    problemId: string;
    languageId: number;
  }[];
  problemId: string;
  onSubmissionSuccess: any;
}) => {
  const [code, setCode] = useState(defaultCode[0].code);

  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submission, setSubmission] = useState(false);
  const [language, setLanguage] = useState<LanguageKey>("cpp");
  const [theme, setTheme] = useState("vs-dark");
  const [result, setResult] = useState<string | null>(null);
  useEffect(() => {
    const selectedDefaultCode =
      defaultCode.find(
        (code) => languageConstants[language] === code.languageId.toString()
      ) || "";
    setCode(selectedDefaultCode ? selectedDefaultCode.code : "");

    console.log(selectedDefaultCode);
  }, [language]);

  const testCases = [
    {
      id: 1,
      description: "Test Case 1",
      input: "1 2 3",
      expectedOutput: "6",
    },
    {
      id: 2,
      description: "Test Case 2",
      input: "2 3 5",
      expectedOutput: "10",
    },
  ];

  const pollSubmissionResult = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/getSubmissionResult?id=${id}`);
        const data = await response.json();
        if (
          data?.result?.status === "AC" ||
          data?.result?.status === "REJECTED"
        ) {
          clearInterval(interval);
          setResult(data.result.status);
          setLoading(false);
          if (data.result.status === "AC") {
            toast({
              title: "Problem successfully accepted",
              description: "Problem Accepted",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Rejected",
              description: "Problem rejected",
            });
          }
          onSubmissionSuccess();
        }
      } catch (error) {
        clearInterval(interval);
        setLoading(false);
        console.error("Error fetching submission result:", error);
        onSubmissionSuccess();
      }
    }, 3000); // Poll every 3 seconds
  };

  const handleRun = () => {
    console.log("Run code:", code);
    // Implement your run logic here
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmission(true);
    console.log("Submit code:", code);
    const data = {
      problemId: defaultCode[0].problemId,
      sourceCode: code,
      userId: session?.user.id,
      languageId: languageConstants[language],
      languageSlug: language,
    };
    console.log(data);
    const result = await axios.post("/api/submission", data);
    console.log("rsult is", result);
    pollSubmissionResult(result.data.submissionId);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "light" : "vs-dark"));
  };

  return (
    <div className="flex flex-col w-full h-full ">
      <div className="flex flex-col w-full h-full  rounded-lg shadow-lg overflow-hidden border p-4 dark:border-black  dark:bg-gray-900">
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <Select
              defaultValue="cpp"
              onValueChange={(value) => setLanguage(value as LanguageKey)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
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
            <div className="flex gap-4 flex-row">
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
        <div className="flex h-96">
          <Editor
            height="90%"
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
      </div>
      <div className="mt-2 flex flex-col p-4 rounded-md shadow-md border w-full dark:border-black  dark:bg-gray-900">
        {loading ? (
          <Tabs aria-label="Test Cases" className="w-full h-full">
            <Tab title="Loading...">
              <Card className="mb-4 w-full">
                <CardBody className="w-full h-44">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col space-y-2">
                      <Skeleton className="rounded-lg w-full h-14">
                        <div className="h-6 rounded-lg bg-gray-300 w-full"></div>
                      </Skeleton>
                      <Skeleton className="rounded-lg w-full  h-14">
                        <div className="h-6 rounded-lg bg-gray-300 w-full"></div>
                      </Skeleton>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        ) : (
          <Tabs aria-label="Test Cases" className="w-full ">
            {testCases.map((testCase) => (
              <Tab key={testCase.id} title={testCase.description}>
                <Card className="mb-4 w-full  dark:bg-white">
                  <CardBody className="w-full h-full">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col space-y-2">
                        <span className="font-semibold dark:text-black ">
                          Input:
                        </span>
                        <span className="bg-gray-100 p-2 rounded w-full dark:text-black">
                          {testCase.input}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className="font-semibold dark:text-black">
                          Expected Output:
                        </span>
                        <span className="bg-gray-100 p-2 rounded w-full dark:text-black">
                          {testCase.expectedOutput}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
