import { ApiError } from "next/dist/server/api-utils";
//custom error class  type defined in next js
import { NextResponse, NextRequest } from "next/server";

export const custom_middleware =
  (...handlers: Function[]) =>
  async (req: NextRequest, res: NextResponse) => {
    try {
      for (const handler of handlers) {
        //wrap the function call in a try catch block amnd throw error
        return await handler(req, res);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode }
        );
      } else {
        /// Log server errors using winston or your preferred logger
        console.log(error);
        return NextResponse.json(
          { message: "Server died for some reason" },
          { status: 500 }
        );
      }
    }
  };
