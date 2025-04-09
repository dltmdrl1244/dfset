import { defaultAPIURL } from "@/app/utils/apiconfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId");
  const itemName = searchParams.get("itemName");
  const apikey = process.env.NEXT_PUBLIC_DFSET_APIKEY || "";

  if (!itemId || typeof itemId !== "string") {
    return NextResponse.json({ error: "Invalid itemId" }, { status: 400 });
  }
  if (!itemName || typeof itemName !== "string") {
    return NextResponse.json({ error: "Invalid itemName" }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.set("apikey", apikey);
  params.set("itemId", itemId);
  params.set("itemName", itemName);

  const url = `${defaultAPIURL}/auction/?${params.toString()}`;
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
