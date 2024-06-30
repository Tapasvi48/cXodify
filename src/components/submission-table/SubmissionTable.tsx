"use client";
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const SubmissionTable = ({ id, userId }: { id: string; userId: string }) => {
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/getAllSubmission?id=${id}&userId=${userId}`
        );
        setSubmission(response?.data?.result);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const languageMap: { [key: number]: string } = {
    54: "C++",
    // Add other language codes and names as needed
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "AC":
        return "text-green-500";
      case "REJECTED":
        return "text-red-500";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="w-full h-screen overflow-y-scroll shadow-md border-1 rounded-lg dark:border-gray-800 bg-white dark:bg-gray-900">
      <Table aria-label="Submission Table" className="w-full h-full">
        <TableHeader>
          <TableColumn className="px-4 py-2 text-gray-900 dark:text-gray-100">
            STATUS
          </TableColumn>
          <TableColumn className="px-4 py-2 text-gray-900 dark:text-gray-100">
            LANGUAGE
          </TableColumn>
          <TableColumn className="px-4 py-2 text-gray-900 dark:text-gray-100">
            RUNTIME
          </TableColumn>
          <TableColumn className="px-4 py-2 text-gray-900 dark:text-gray-100">
            MEMORY
          </TableColumn>
          <TableColumn className="px-4 py-2 text-gray-900 dark:text-gray-100">
            SUBMISSION DATE
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent="No rows to display.">
          {submission &&
            submission?.map((sub: any) => (
              <TableRow key={sub.id}>
                <TableCell
                  className={`px-4 py-2 ${getStatusStyle(sub.status)}`}
                >
                  {sub.status === "AC" ? "ACCEPTED" : sub.status}
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {languageMap[sub.languageCode] || "Unknown"}
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {sub.time !== null ? `${sub.time} ms` : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {sub.memory !== null ? `${sub.memory} KB` : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-2 text-gray-900 dark:text-gray-100">
                  {new Date(sub.updatedAt).toLocaleDateString("en-US")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubmissionTable;
