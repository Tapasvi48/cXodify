import { getProblemById } from "@/app/db/problem";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Markdown = ({ description }: { description: string }) => {
  return (
    <div className="prose w-full  dark:bg-gray-900  max-w-none mx-auto p-4  rounded-lg shadow-lg overflow-hidden border dark:text-white dark:border-black  ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {description || ""}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
