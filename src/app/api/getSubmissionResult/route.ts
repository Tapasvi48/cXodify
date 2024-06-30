// pages/api/createUser.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../problem-adder/src/prisma";
import { ApiError } from "next/dist/server/api-utils";
import { db } from "@/app/db";

export async function GET(req: NextRequest, res: NextResponse) {
  console.log("Callback received");
  const search = req.nextUrl.searchParams;
  console.log(search);
  const id = search.get("id");
  console.log("id is", id);
  if (!id) {
    throw new ApiError(400, "id is null");
  }

  try {
    const result = await db.submission.findUnique({
      where: {
        id: id,
      },
    });
    console.log(result);
    console.log(result?.status);
    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while updating the status" },
      { status: 500 }
    );
  }
}
