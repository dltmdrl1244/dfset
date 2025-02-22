import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(req: NextRequest) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  // await sql(
  //   "INSERT INTO characterInfo (characterId, serverId) VALUES ($1, $2)",
  //   ["test4", "테스트4"]
  // );
  const data = await sql("SELECT * FROM characterInfo");

  return new NextResponse(
    JSON.stringify({
      data: data,
      message: "OK",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
