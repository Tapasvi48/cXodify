"use client";
import React, { useEffect } from "react";
import { Card, CardBody } from "@nextui-org/card";
import { CircularProgress } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import axios from "axios";

const UserStats = ({
  easyProblems,
  mediumProblems,
  hardProblems,
}: {
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
}) => {
  const totalProblems = 100;

  const totalSolved = easyProblems + mediumProblems + hardProblems;
  const easyPercent = (easyProblems / totalProblems) * 100;
  const mediumPercent = (mediumProblems / totalProblems) * 100;
  const hardPercent = (hardProblems / totalProblems) * 100;

  return (
    <Card className="p-4 flex items-start bg-white rounded-lg shadow-md mb-6 bg-gradient-to-br from-pink-400 to-red-600">
      <h3 className="text-white mb-2">Stats</h3>
      <CardBody className="flex flex-row items-center justify-center">
        <div className="w-full  h-full ">
          <CircularProgress
            classNames={{
              svg: "w-24 h-24 drop-shadow-md ",
              indicator: "stroke-white",
              track: "stroke-white/10",
              value: "text-xl font-semibold text-white",
            }}
            value={(totalSolved / totalProblems) * 100}
            strokeWidth={4}
            showValueLabel={true}
          />
        </div>
        <div className="flex flex-col  gap-1  w-full h-full">
          <p className="text-sm text-gray-200 gap-2 flex">
            Easy
            <span className="text-green-500">
              {easyProblems}/{totalProblems}
            </span>
          </p>
          <p className="text-sm text-gray-200 gap-2 flex">
            Medium
            <span className="text-yellow-500">
              {mediumProblems}/{totalProblems}
            </span>
          </p>
          <p className="text-sm text-gray-200 gap-2 flex">
            Hard
            <span className="text-purple-300">
              {hardProblems}/{totalProblems}
            </span>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserStats;
