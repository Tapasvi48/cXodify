"use client";
import { Chip, Tab, Tabs } from "@nextui-org/react";
import { GalleryVerticalIcon, MusicIcon, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import { MdOutlineDescription } from "react-icons/md";
import { CiTimer } from "react-icons/ci";
import Markdown from "../markdown-renderer/Markdown";
import CodeEditor from "../code-editor/CodeEditor";
import SubmissionTable from "../submission-table/SubmissionTable";
import { useSession } from "next-auth/react";

const EditorSubmissionTab = ({
  id,
  defaultCode,
  description,
}: {
  id: string;
  defaultCode: any[];
  description: string;
}) => {
  const [activeTab, setActiveTab] = useState("description");
  const { data: session, status } = useSession();
  const handleCodeSubmissionSuccess = () => {
    setActiveTab("submission");
  };
  return (
    <div className="flex w-full flex-row p-2 gap-2">
      <div className="w-full">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
        >
          <Tab
            key="description"
            title={
              <div className="flex items-center space-x-2">
                <MdOutlineDescription />
                <span>Description</span>
              </div>
            }
          >
            <div>
              <Markdown description={description} />
            </div>
          </Tab>
          <Tab
            key="submission"
            title={
              <div className="flex items-center space-x-2">
                <CiTimer />
                <span>Submissions</span>
              </div>
            }
          >
            <SubmissionTable id={id} userId={session?.user?.id || ""} />
          </Tab>
        </Tabs>
      </div>
      <div className="w-full flex mt-14">
        <CodeEditor
          defaultCode={defaultCode || []}
          problemId={id}
          onSubmissionSuccess={handleCodeSubmissionSuccess}
        />
      </div>
    </div>
  );
};

export default EditorSubmissionTab;
