import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  const characterId = req.nextUrl.searchParams.get("characterId");
  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    const rv = await sql("SELECT * FROM history WHERE character_id = ($1)", [
      characterId,
    ]);
    // 데이터 있다
    if (rv.length > 0) {
      return NextResponse.json({ data: rv, message: "OK" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "No data" }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const myJson = await req.json();
  const characterId: string = myJson.characterId;
  const histories: TestCharacterHistory = myJson.histories;
  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    // 조회
    const data = await sql("SELECT * FROM history WHERE character_id = ($1)", [
      characterId,
    ]);
    if (data.length <= 0) {
      // 없다 -> 값 넣기
      await sql(
        "INSERT INTO history (character_id, history_dict) VALUES ($1, $2)",
        [characterId, JSON.stringify(histories)]
      );
      return NextResponse.json(
        { message: "Histories added successfully" },
        { status: 201 }
      );
    } else {
      // 있다 -> 값 수정
      await sql(
        "UPDATE history SET history_dict = ($1), create_time = CURRENT_TIMESTAMP WHERE character_id = ($2)",
        [JSON.stringify(histories), characterId]
      );

      return NextResponse.json(
        { message: "Histories Updated successfully" },
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
