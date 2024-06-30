"use client";
import React from "react";
import SubmissionTable from "@/components/submission-table/SubmissionTable";
// import { useSession } from "next-auth/react";

const page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  // const { data: session, status } = useSession();
  // console.log(session, "session is sadad");
  return (
    <div className="flex  w-full  h-full  dark:bg-gray-900">
      <SubmissionTable id={id} userId={""} />
    </div>
  );
};

export default page;
