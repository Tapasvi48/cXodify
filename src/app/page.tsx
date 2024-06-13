import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import Image from "next/image";
import { z } from "zod";

import { columns } from "../components/problem-table/column";
import { DataTable } from "../components/problem-table/table";

import { taskSchema } from "../components/problem-table/data/schema";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), "./src/components/problem-table/data/task.json")
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function TaskPage() {
  const tasks = await getTasks();

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2"></div>
        </div>
        <div className="w-full flex gap-10">
          <div className="w-2/3">
            <DataTable data={tasks} columns={columns} />
          </div>
          <div className="w-full">Upcoming Contest</div>
        </div>
      </div>
    </>
  );
}
