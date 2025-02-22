import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get("characterId");

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM character_basic WHERE characterId = (?)",
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
}

export async function POST(req: NextRequest) {
  const myJson = await req.json();
  const character: Character = myJson.character;

  if (!character) {
    return NextResponse.json({ error: "Invalid character" }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO character_basic (characterId, characterName, serverId, serverName, adventureName, jobName) VALUES (?, ?, ?, ?, ?, ?)",
      [
        character.characterId,
        character.characterName,
        character.serverId,
        character.serverName,
        character.adventureName,
        character.jobName,
      ]
    );

    connection.release();
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
