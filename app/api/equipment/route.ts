import { defaultAPIURL } from "@/app/utils/apiconfig";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const { sId, cId } = Object.fromEntries(searchParams);
  const apikey = process.env.NEXT_PUBLIC_DFSET_APIKEY || "";

  if (!sId || !cId) {
    return new NextResponse(
      JSON.stringify({
        message: "no parameters",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const params = new URLSearchParams();
  params.set("apikey", apikey);

  const url = `${defaultAPIURL}/servers/${sId}/characters/${cId}/equip/equipment?${params.toString()}`;
  try {
    const response = await fetch(url);
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
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "character search failed",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
