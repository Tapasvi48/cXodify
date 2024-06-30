"use client";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const extractExcerpt = (markdown: string, length: number) => {
  const plainText = markdown?.replace(/[#_*`>!-]/g, "").trim();
  return plainText?.length > length
    ? `${plainText?.slice(0, length)}...`
    : plainText;
};

const FeaturedProblems = ({ problem }: { problem: any }) => {
  const excerpt = extractExcerpt(problem?.description, 100);
  const router = useRouter();

  return (
    <div>
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-lg shadow-lg mb-6 h-full">
        <CardHeader className="flex items-center justify-between p-2">
          <h2 className="text-lg font-bold">Problem of the Day</h2>
        </CardHeader>
        <CardBody className="p-2">
          <h3 className="text-md font-bold">{problem?.title}</h3>
          <p className="mt-2 text-sm">{excerpt}</p>
        </CardBody>
        <CardFooter className="flex justify-end p-2">
          <Button
            className="bg-white text-black "
            onClick={() => {
              router.replace(`/problem/${problem?.id}`);
            }}
          >
            Solve Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default FeaturedProblems;
