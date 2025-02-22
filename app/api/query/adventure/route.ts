import { NextRequest, NextResponse } from "next/server";
// import { pool } from "@/db";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get("characterId");
  const adventureName = searchParams.get("adventureName");
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!characterId && !adventureName) {
    return NextResponse.json({ error: "Invalid parameter" }, { status: 400 });
  }

  if (characterId) {
    try {
      const [rows] = await sql(
        "SELECT * FROM adventure WHERE characterId = ($1)",
        [characterId]
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json(
          { data: rows[0], message: "OK" },
          { status: 200 }
        );
      } else {
        // 만약 캐릭터 정보가 없다면 api로 가져와야 하니까 그걸 알려주자
        return NextResponse.json({ message: "no character" }, { status: 200 });
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
  } else {
    try {
      const [rows] = await sql(
        "SELECT * FROM adventure WHERE adventureName = ($1) ORDER BY create_time ASC",
        [adventureName]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json(
          { data: rows, message: "OK" },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: "no adventure" }, { status: 200 });
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
}

export async function POST(req: NextRequest) {
  const myJson = await req.json();
  const characterId: string = myJson.characterId;
  const serverId: string = myJson.serverId;
  const adventureName: string = myJson.adventureName;
  const characterName: string = myJson.characterName;
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  if (!serverId || typeof serverId !== "string") {
    return NextResponse.json({ error: "Invalid serverId" }, { status: 400 });
  }

  if (!adventureName || typeof adventureName !== "string") {
    return NextResponse.json(
      { error: "Invalid adventureName" },
      { status: 400 }
    );
  }
  if (!characterName || typeof characterName !== "string") {
    return NextResponse.json(
      { error: "Invalid characterName" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await sql(
      "SELECT * FROM adventure WHERE characterId = ($1)",
      [characterId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ message: "이미 있음" }, { status: 200 });
    }

    await sql(
      "INSERT INTO adventure (characterId, serverId, adventureName, characterName) VALUES ($1, $2, $3, $4)",
      [characterId, serverId, adventureName, characterName]
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
