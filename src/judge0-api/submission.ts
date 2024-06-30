import { languageConstants } from "@/constants/judge0_constants";
import axios from "axios";
export const fetchSubmissionResult = async (submissionId: string) => {
  const url = `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}?base64_encoded=true&fields=*`;

  const headers = {
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "x-rapidapi-key": "3bd80677e7msh62668660db22a9ep182a32jsn90589a69897b",
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching submission result:", error);
    return null;
  }
};
export const submitCode = async (
  sourceCode: string,
  languageId: number,
  stdin: string,
  expected_output: string
) => {
  const url = `https://judge0-ce.p.rapidapi.com/submissions`;

  const headers = {
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "x-rapidapi-key": process.env.JUDGE0_KEY,
    "Content-Type": "application/json",
  };

  const data = {
    source_code: sourceCode,
    language_id: languageId,
    stdin: stdin,
    expected_output: expected_output,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error submitting code:", error);
    return null;
  }
};
export const submitBatchCode = async (
  problemData: any,
  sourceCode: string,
  submissionId: string
) => {
  console.log("submision id", submissionId);
  const url = `https://judge0-ce.p.rapidapi.com/submissions/batch?base64_encoded=false`;

  const headers = {
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "x-rapidapi-key": process.env.JUDGE0_KEY,
    "Content-Type": "application/json",
  };
  console.log(
    problemData.fullBoilerplateCode.replace("##USER_CODE_HERE##", sourceCode),
    "code is"
  );
  const submissions = problemData.inputs.map((input: any, index: number) => ({
    language_id: languageConstants.CPP,
    source_code: problemData.fullBoilerplateCode.replace(
      "##USER_CODE_HERE##",
      sourceCode
    ),
    stdin: problemData.inputs[index],
    expected_output: problemData.outputs[index],
    callback_url: `https://cxodify.vercel.app/api/webhook/?id=${submissionId}`,
  }));
  console.log("submission", submissions, problemData.outputs[1]);

  try {
    const response = await axios.post(url, { submissions }, { headers });
    return response;
  } catch (error) {
    console.error("Error submitting batch code:", error);
    return null;
  }
};
