import { defaultAPIURL } from "@/app/utils/apiconfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const characterId = searchParams.get("characterId");
  const apikey = process.env.NEXT_PUBLIC_DFSET_APIKEY || "";

  if (!serverId || typeof serverId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.set("apikey", apikey);

  const url = `${defaultAPIURL}/servers/${serverId}/characters/${characterId}?${params.toString()}`;
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
