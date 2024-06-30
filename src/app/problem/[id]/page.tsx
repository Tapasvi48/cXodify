import Markdown from "@/components/markdown-renderer/Markdown";

import React from "react";
import CodeEditor from "../../../components/code-editor/CodeEditor";
import { getProblemById } from "@/app/db/problem";
import EditorSubmissionTab from "@/components/problems/EditorSubmissionTab";

const page = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const problem = await getProblemById(id);

  console.log("problem is", problem?.defaultCode);
  console.log(problem);

  return (
    <div className="flex flex-row  items-start justify-between gap-3 h-full p-4 ">
      <EditorSubmissionTab
        id={id}
        defaultCode={problem?.defaultCode || []}
        description={problem?.description || ""}
      />
    </div>
  );
};

export default page;
