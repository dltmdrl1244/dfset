import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(req: NextRequest) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const result = await client.query("SELECT * FROM test_table1");
    const data = result.rows;

    return new NextResponse(
      JSON.stringify({
        data: data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: error,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
