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
      "SELECT * FROM character_history WHERE character_id = ($1)",
      [characterId]
    );

    if (rv.length > 0) {
      return NextResponse.json({ data: rv[0], message: "OK" }, { status: 200 });
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
  const sql = neon(`${process.env.DATABASE_URL}`);

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
    const data = await sql(
      "SELECT * FROM character_history WHERE character_id = ($1)",
      [characterId]
    );
    if (data.length <= 0) {
      await sql(
        "INSERT INTO character_history (character_id, history_dict) VALUES ($1, $2)",
        [characterId, JSON.stringify(histories)]
      );
      return NextResponse.json(
        { message: "Items added successfully" },
        { status: 201 }
      );
    } else {
      await sql(
        "UPDATE character_history SET history_dict = ($1) WHERE character_id = ($2)",
        [JSON.stringify(histories), characterId]
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
