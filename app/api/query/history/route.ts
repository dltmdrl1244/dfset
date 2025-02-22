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
      "SELECT * FROM character_history WHERE characterId = (?) ORDER BY create_time DESC LIMIT 1",
      [characterId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(
        { data: rows[0], message: "OK" },
        { status: 200 }
      );
    } else {
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
  const histories: ItemHistory = myJson.histories;
  const characterId: string = myJson.characterId;

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  if (!histories || typeof histories !== "object") {
    return NextResponse.json(
      { error: "Invalid timeline data" },
      { status: 400 }
    );
  }

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO character_history (characterId, historyDict) VALUES (?, ?)",
      [characterId, JSON.stringify(histories)]
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
