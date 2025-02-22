import { defaultAPIURL } from "@/app/utils/apiconfig";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // TODO : 마지막 업데이트 정보를 가져와서 그 이후로부터만 검색하는 로직 추가 필요

  const { searchParams } = new URL(request.url);
  const { sId, cId, next, startDate, endDate, limit } =
    Object.fromEntries(searchParams);
  const apikey = process.env.NEXT_PUBLIC_DFSET_APIKEY || "";

  if (!sId || !cId) {
    return new NextResponse(
      JSON.stringify({
        message: "no parameters",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const params = new URLSearchParams();
  params.set("apikey", apikey);
  if (next) {
    params.set("next", next);
  } else {
    params.set("code", "504,505,513,520");
    params.set("startDate", startDate);
    params.set("endDate", endDate);
    params.set("limit", limit);
  }

  const url = `${defaultAPIURL}/servers/${sId}/characters/${cId}/timeline?${params.toString()}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    return new NextResponse(
      JSON.stringify({
        message: "OK",
        data: data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(
      JSON.stringify({
        message: "character search failed",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
