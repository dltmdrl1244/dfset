import { NextRequest, NextResponse } from "next/server";
// import { pool } from "@/db";
import { neon } from "@neondatabase/serverless";
import { defaultAPIURL } from "@/app/utils/apiconfig";

export async function GET(req: NextRequest) {
  const characterId = req.nextUrl.searchParams.get("characterId");
  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    /////////////////////////////////////////////////////////////////////////////////
    const rv = await sql(
      "SELECT * FROM character_basic WHERE character_id = ($1)",
      [characterId]
    );

    // equipment115에 데이터가 있는 경우
    if (rv.length > 0) {
      return NextResponse.json({ data: rv, message: "OK" }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

interface TempCharacter {
  serverId: string;
  serverName: string;
  characterId: string;
  characterName: string;
  adventureName: string;
  jobName: string;
  createTime: string;
}

export async function POST(req: NextRequest) {
  const myJson = await req.json();
  const data: TempCharacter = myJson.data;
  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    await sql(
      "INSERT INTO character (character_id, character_name, server_id, adventure_name, job_name, create_time) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        data.characterId,
        data.characterName,
        data.serverId,
        data.adventureName,
        data.jobName,
        data.createTime,
      ]
    );

    return NextResponse.json(
      { message: "Character added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error !!" },
      { status: 500 }
    );
  }
}
