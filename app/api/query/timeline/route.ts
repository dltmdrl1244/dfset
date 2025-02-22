import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";
import { defaultAPIURL } from "@/app/utils/apiconfig";
import { ItemTimelineInfo } from "@/app/context/ItemTimelineContext";

export async function GET(req: NextRequest, res: NextResponse) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get("characterId");

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM character_timeline WHERE characterId = (?) ORDER BY create_time DESC LIMIT 1",
      [characterId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(
        { data: rows[0], message: "OK" },
        { status: 200 }
      );
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

export async function POST(req: NextRequest, res: NextResponse) {
  const myJson = await req.json();
  const timelines: ItemTimelineInfo[] = myJson.timelines;
  const characterId: string = myJson.characterId;

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
    const connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO character_timeline (characterId, timeline) VALUES (?, ?)",
      [characterId, JSON.stringify(timelines)]
    );

    connection.release();
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
