// pages/api/createUser.ts

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../problem-adder/src/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const user = await prisma.user.create({
    data: {
      email: "dummy@example.com",
      firstName: "Dummy",
      lastName: "User",
      password: "securepassword", // Note: In a real application, never store plain text passwords
      role: "USER",
    },
  });
  console.log(user);

  return NextResponse.json({ message: "sadad" });
}
