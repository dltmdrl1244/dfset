import { defaultAPIURL } from "@/app/utils/apiconfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const serverId = searchParams.get("serverId");
  const characterName = searchParams.get("characterName");
  const apikey = process.env.NEXT_PUBLIC_DFSET_APIKEY || "";

  if (!serverId || typeof serverId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  if (!characterName || typeof characterName !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.set("characterName", characterName);
  params.set("apikey", apikey);
  params.set("wordType", "match");

  const url = `${defaultAPIURL}/servers/${serverId}/characters?${params.toString()}`;
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
