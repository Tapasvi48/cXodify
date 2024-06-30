"use client";
import SubmissionTable from "@/components/submission-table/SubmissionTable";
import { useSession } from "next-auth/react";
import React from "react";

const page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const { data: session, status } = useSession();
  console.log(session, "session is sadad");
  return (
    <div className="flex  w-full  h-full  dark:bg-gray-900">
      <SubmissionTable id={id} userId={session?.user?.id || ""} />
    </div>
  );
};

export default page;
