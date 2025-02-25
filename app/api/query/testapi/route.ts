import { NextRequest, NextResponse } from "next/server";
// import { pool } from "@/db";
import { neon } from "@neondatabase/serverless";
import { defaultAPIURL } from "@/app/utils/apiconfig";

export async function GET(req: NextRequest) {
  const itemId = req.nextUrl.searchParams.get("itemId");
  const apikey = process.env.NEXT_PUBLIC_DFSET_APIKEY || "";
  const sql = neon(`${process.env.DATABASE_URL}`);

  if (!itemId) {
    return;
  }
  try {
    // console.log(`${defaultAPIURL}/items/`);
    const params = new URLSearchParams();
    params.set("itemName", itemId);
    params.set("wordType", "match");
    params.set("q", "minLevel:115");
    params.set("apikey", apikey);

    const url = `${defaultAPIURL}/items?${params.toString()}`;
    console.log(url);
    const rv = await fetch(url);
    const data = await rv.json();

    // if (rv.ok) {
    //   console.log(data.rows.length);
    // }

    // console.log(data.rows);
    if (data.rows && data.rows.length > 0) {
      return NextResponse.json(
        { data: data.rows, message: "OK" },
        { status: 200 }
      );
    }
    return NextResponse.json({ message: "NO" }, { status: 400 });
    /////////////////////////////////////////////////////////////////////////////////
    // const rv = await sql(
    //   "SELECT * FROM equipment115 WHERE item_name like ($1)",
    //   [itemId]
    // );

    // // equipment115에 데이터가 있는 경우
    // if (rv.length > 0) {
    //   return NextResponse.json({ data: rv, message: "OK" }, { status: 200 });
    // }
    /////////////////////////////////////////////////////////////////////////////////

    // else {
    //   // equipment115에 데이터가 없는 경우 (무기, 또는 115렙제가 아닌 아이템)
    //   const params = new URLSearchParams();
    //   params.set("apikey", apikey);

    //   // api 호출하여 새롭게 집어넣어야 함
    //   const url = `${defaultAPIURL}/items/${itemId}?${params.toString()}`;
    //   try {
    //     const response = await fetch(url);
    //     const data = await response.json();

    //     if (data.itemAvailableLevel == 115) {
    //       if (data.itemType == "무기") {
    //         const itemRarity = ["레전더리", "에픽", "태초"];
    //         await sql(
    //           "INSERT INTO equipment (item_id, item_name, rarity, weapon_type, set_idx, slot_idx, is_fusion) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    //           [
    //             data.itemId,
    //             data.itemName,
    //             itemRarity.indexOf(data.itemRarity),
    //             data.itemTypeDetailId,
    //             null,
    //             null,
    //             false,
    //           ]
    //         );

    //         const rv = await sql(
    //           "SELECT * FROM equipment WHERE item_id = ($1)",
    //           [itemId]
    //         );

    //         if (rv.length > 0) {
    //           return NextResponse.json(
    //             { data: rv, message: "OK" },
    //             { status: 200 }
    //           );
    //         } else {
    //           return new NextResponse(
    //             JSON.stringify({
    //               message: "something wrong with fetching data",
    //             }),
    //             {
    //               status: 400,
    //               headers: { "Content-Type": "application/json" },
    //             }
    //           );
    //         }
    //       } else {
    //         // 여기 있으면 안됨...
    //         return new NextResponse(
    //           JSON.stringify({
    //             message: "세트 아이템이 없다고??",
    //           }),
    //           {
    //             status: 400,
    //             headers: { "Content-Type": "application/json" },
    //           }
    //         );
    //       }
    //     } else {
    //       // 115제가 아님
    //       return new NextResponse(
    //         JSON.stringify({
    //           message: "115제가 아님",
    //         }),
    //         {
    //           status: 200,
    //         }
    //       );
    //     }
    //   } catch (error) {
    //     return new NextResponse(
    //       JSON.stringify({
    //         message: error,
    //       }),
    //       {
    //         status: 400,
    //         headers: { "Content-Type": "application/json" },
    //       }
    //     );
    //   }
    // }
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
  const data: TestEquipment = myJson.data;
  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    await sql(
      "INSERT INTO equipment (item_id, item_name, rarity, set_idx, slot_idx, weapon_type, is_fusion) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        data.itemId,
        data.itemName,
        data.rarity,
        data.setIdx,
        data.slotIdx,
        data.weaponType,
        data.isFusion,
      ]
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
