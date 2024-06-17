import Markdown from "@/components/markdown-renderer/Markdown";
import React from "react";
import CodeEditor from "../../../components/code-editor/CodeEditor";

const page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  return (
    <div className="flex flex-row  items-center justify-between">
      <Markdown params={params} />
      <CodeEditor
        initialCode="vector<int> Average(vector<int> num1) {
vector<int> result; 
  return result;
}
"
      />
    </div>
  );
};

export default page;
