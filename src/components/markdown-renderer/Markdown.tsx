import { getProblemById } from "@/app/db/problem";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Markdown = async ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const result = await getProblemById(id);

  return (
    <div className="prose w-full dark:prose-dark max-w-none mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {result[0].description}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
