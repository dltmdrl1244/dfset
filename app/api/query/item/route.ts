import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/db";
import { defaultAPIURL } from "@/app/utils/apiconfig";

interface Item {
  itemId: string;
  itemName: string;
  rarity: string;
  setId: string;
  slotId: string;
  isFusion: boolean;
  isDistinct: boolean;
}

export async function GET(req: NextRequest) {
  const itemId = req.nextUrl.searchParams.get("itemId");
  const apikey = process.env.NEXT_PUBLIC_DFSET_APIKEY || "";

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM equipment115 WHERE itemId = (?)",
      [itemId]
    );

    // equipment115에 데이터가 있는 경우
    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ data: rows, message: "OK" }, { status: 200 });
    } else {
      // equipment115에 데이터가 없는 경우 (무기, 또는 115렙제가 아닌 아이템)
      const params = new URLSearchParams();
      params.set("apikey", apikey);

      // api 호출하여 새롭게 집어넣어야 함
      const url = `${defaultAPIURL}/items/${itemId}?${params.toString()}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.itemAvailableLevel == 115) {
          const connection = await pool.getConnection();
          if (data.itemType == "무기") {
            await connection.execute(
              "INSERT INTO equipment115 (itemId, itemName, rarity, itemTypeDetailId) VALUES (?, ?, ?, ?)",
              [
                data.itemId,
                data.itemName,
                data.itemRarity,
                data.itemTypeDetailId,
              ]
            );

            const [rows] = await pool.execute(
              "SELECT * FROM equipment115 WHERE itemId = (?)",
              [itemId]
            );

            if (Array.isArray(rows) && rows.length > 0) {
              return NextResponse.json(
                { data: rows, message: "OK" },
                { status: 200 }
              );
            } else {
              return new NextResponse(
                JSON.stringify({
                  message: "something wrong with fetching data",
                }),
                {
                  status: 400,
                  headers: { "Content-Type": "application/json" },
                }
              );
            }
          } else {
            // 여기 있으면 안됨...
            return new NextResponse(
              JSON.stringify({
                message: "세트 아이템이 없다고??",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json" },
              }
            );
          }
        } else {
          // 115제가 아님
          return new NextResponse(
            JSON.stringify({
              message: "115제가 아님",
            }),
            {
              status: 200,
            }
          );
        }
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
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "error",
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
  const items: Item[] = myJson.items;

  if (!Array.isArray(items)) {
    return NextResponse.json({ data: "invalid body" }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();

    await Promise.all(
      items.map(async (item: Item) => {
        await connection.execute(
          "INSERT INTO equipment115 (itemId, itemName, rarity, slotId, isFusion, isDistinct) VALUES (?, ?, ?, ?, ?, ?)",
          [
            item.itemId,
            item.itemName,
            item.rarity,
            item.slotId,
            item.isFusion,
            item.isDistinct,
          ]
        );
      })
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
