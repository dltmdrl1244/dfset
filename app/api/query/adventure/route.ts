import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adventureName = searchParams.get("adventureName");
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!adventureName) {
    return NextResponse.json({ error: "Invalid parameter" }, { status: 400 });
  }

  try {
    const rv = await sql(
      "SELECT * FROM character WHERE adventure_name = ($1) ORDER BY create_time ASC",
      [adventureName]
    );

    if (rv.length > 0) {
      return NextResponse.json({ data: rv, message: "OK" }, { status: 200 });
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
