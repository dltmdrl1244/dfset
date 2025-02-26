import { defaultAPIURL } from "@/app/utils/apiconfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apikey = process.env.NEXT_PUBLIC_DFSET_APIKEY || "";

  const url = `${defaultAPIURL}/servers?apikey=${apikey}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return new NextResponse(
        JSON.stringify({
          message: "OK",
          data: data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      if (response.status === 503) {
        return new NextResponse(
          JSON.stringify({
            message: "점검 중",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "server search failed",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
