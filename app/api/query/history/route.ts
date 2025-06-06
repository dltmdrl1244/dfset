import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
// import { pool } from "@/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get("characterId");
  const serverId = searchParams.get("serverId");
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  try {
    const rv = await sql(
      "SELECT * FROM history WHERE character_id = ($1) and server_id = ($2)",
      [characterId, serverId]
    );

    if (rv.length > 0) {
      return NextResponse.json({ data: rv[0], message: "OK" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "no data" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const myJson = await req.json();
  const histories: CharacterHistory = myJson.histories;
  const characterId: string = myJson.characterId;
  const serverId: string = myJson.serverId;
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  // if (!histories || typeof histories !== "object") {
  //   return NextResponse.json(
  //     { error: "Invalid timeline data" },
  //     { status: 400 }
  //   );
  // }

  try {
    const data = await sql(
      "SELECT * FROM history WHERE character_id = ($1) and server_id = ($2)",
      [characterId, serverId]
    );
    if (data.length <= 0) {
      await sql(
        "INSERT INTO history (character_id, server_id, history_dict) VALUES ($1, $2, $3)",
        [characterId, serverId, JSON.stringify(histories)]
      );
      return NextResponse.json(
        { message: "Items added successfully" },
        { status: 201 }
      );
    } else {
      await sql(
        "UPDATE history SET history_dict = ($1), create_time = CURRENT_TIMESTAMP WHERE character_id = ($2) and server_id = ($3)",
        [JSON.stringify(histories), characterId, serverId]
      );
      return NextResponse.json(
        { message: "Items updated successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error !!" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const characterId = searchParams.get("characterId");
  const serverId = searchParams.get("serverId");
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!characterId || typeof characterId !== "string") {
    return NextResponse.json({ error: "Invalid characterId" }, { status: 400 });
  }

  try {
    const rv = await sql(
      "DELETE FROM history WHERE character_id = ($1) and server_id = ($2)",
      [characterId, serverId]
    );

    return NextResponse.json({ data: rv, message: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
