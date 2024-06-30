import React from "react";
import { Card, CardBody } from "@nextui-org/card";
import Image from "next/image";
import image from "../../../public/back.png";

const TopUsers = ({ users }: { users: any[] }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Top Users</h2>
      <div className="space-y-4">
        {users?.map((user) => (
          <Card
            key={user?.id}
            className="p-4 flex justify-center bg-gradient-to-br from-purple-400 to-indigo-600 rounded-lg shadow-md hover:shadow-lg"
          >
            <div className="absolute  z-50 top-2 left-2 flex items-center justify-center w-6 h-6 bg-white rounded-full">
              <p className="text-purple-600 font-bold text-xs">{user?.rank}</p>
            </div>
            <CardBody className="p-4 flex flex-row items-center justify-start gap-5 text-white">
              <div className="relative w-16 h-16 ">
                <Image
                  src={user?.profilePicture || image} // Replace with user's profile picture URL
                  alt={`${user?.firstName}'s profile`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>

              <div className="flex justify-center items-center flex-col">
                <p className="text-sm font-bold mb-2 text-center">
                  {user?.firstName}
                </p>
                <p className="text-xs text-center text-gray-300">
                  Problems Solved: {user?.solvedProblemsCount}
                </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;
