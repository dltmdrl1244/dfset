import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
// import { pool } from "@/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get("characterId");
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  try {
    const rv = await sql(
      "SELECT * FROM character_timeline WHERE character_id = ($1) ORDER BY create_time DESC LIMIT 1",
      [characterId]
    );

    if (rv.length > 0) {
      return NextResponse.json({ data: rv[0], message: "OK" }, { status: 200 });
    } else {
      // 만약 타임라인 정보가 없다면 api로 가져와야 하니까 그걸 알려주자
      return NextResponse.json({ message: "no data" }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal server Error !",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const myJson = await req.json();
  const timelines: TimelineInfo[] = myJson.timelines;
  const characterId: string = myJson.characterId;
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  if (!timelines || typeof timelines !== "object") {
    return NextResponse.json(
      { error: "Invalid timeline data" },
      { status: 400 }
    );
  }

  try {
    await sql(
      "INSERT INTO character_timeline (character_id, timeline) VALUES ($1, $2)",
      [characterId, JSON.stringify(timelines)]
    );

    return NextResponse.json(
      { message: "Items added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error !!" },
      { status: 500 }
    );
  }
}
