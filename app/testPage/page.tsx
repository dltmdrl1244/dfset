"use client";

import { Box } from "@chakra-ui/react";
import { equipments } from "@/public/equipments";
import { itemSets } from "../context/setIds";
import { itemSlots } from "../context/slotIds";
// import fs from "fs";

const setIdxDict: Record<string, number> = {
  "7f788a703a87d783079b41d0fe6448c9": 0, // 황금향
  b92ca7784123b5fea9cea40144925194: 1, // 용투장
  "7c9c8335b72c2907df20786f8f5b27f0": 2, // 세렌디피티
  "11f7d203a05ea6f13300c0facb39f11e": 3, // 칠흑
  "2877466bc2fc8bedf7799d88167c9fe3": 4, // 한계
  "8e9cb65cb6285d7e2f084f440aa18870": 5, // 마력
  "4ee7bd5912cda6e2a24c1f36d5202b46": 6, // 페어리
  "854dc8c01b1bc231e132dae5df3c52bc": 7, // 발키리
  "93e7825053bdec4e0f4c12837cf4f57e": 8, // 에테
  "3af7c961e7d8cd8b5b42c5f82af2a0ad": 9, // 그림자
  "4e65968c4d30898e6879434dc641b6e4": 10, // 자연
  e23286107ba4328af86c83aabc347e9e: 11, // 무리
  distinctItems: 12,
};

const slotIdxDict: Record<string, number> = {
  "3da92241d44bdafcf7554057e6479c83": 0,
  "7c4b28699ae7994798289f187d519992": 1,
  f2976a25a516451e3e8667bac328b308: 2,
  "934ed2dea99f55f775df256fc29c5d56": 3,
  ef6fcc3b39b2bbcbf09a71da6cbafe06: 4,
  "390e3966118b0c466ce9f8eae45e1629": 5,
  "80bddf423629c28c7b4459c328fdffaf": 6,
  b04c7fb9b29b27b91a0a9e5a1822bc8f: 7,
  "2fef5d81b7f59f0c75241890a8d941c9": 8,
  fe5f3db78175f5a3196385c688d29681: 9,
  "601834074c49bb0e48cb65a75a8667bc": 10,
};

const keywords = [
  // 귀검
  "무형검 - 생사경",
  "역작 금인필살도",
  "양얼의 나뭇가지 : 초",
  "특형 - 호위무신의 운검",
  "멸룡검 발뭉",
  // 격투
  "넨 아스트론",
  "미완성 코스믹 건틀릿",
  "리리스, 디 이블",
  "엠프레스 벳즈",
  "파운더 오브 마나",
  // 거너
  "노블레스 오브 레인저",
  "에볼루션 오토매틱 건",
  "리턴드 스나이퍼 오브 블랙 로즈",
  "우르반의 걸작",
  "얼어붙은 불꽃의 살",
  // 법사
  "앱솔루트 제로",
  "하쿠나마타타 : 원더풀",
  "양치기의 마지막 진실",
  "해방된 지식",
  "칠흑의 저주",
  // 프리
  "영원한 올리브 나무 십자가",
  "폴링 스타 로저리",
  "폭군의 본의",
  "소울 프레데터",
  "멸망의 근원",
  // 도적
  "여제의 영롱한 은장도",
  "샤이닝 인페르노",
  "로드 오브 호러",
  "육도의 수레바퀴",
  // 마창
  "전장의 투신",
  "眞 : 흑룡언월도",
  "성장군 : 유성계",
  "무영흑단살",
  // 총검
  "만월 : 월광야천도",
  "나스카 : 영혼의 심판",
  "Brutal-Saw",
  "코어 오리진",
  // 아처
  "시크릿 콘서트",
  "미스트 파이오니어",
  "패밀리 팔케",
  "인요의 황혼",
];

async function saveFile() {
  // const fs = require("fs");
  const rarityIndex = ["레전더리", "에픽", "태초"];
  const tempEquipments: TestEquipment[] = [];

  for (const keyword of keywords) {
    const param = new URLSearchParams();
    param.set("itemId", keyword);

    const response = await fetch(`/api/query/testapi?itemId=${keyword}`);
    const data = await response.json();
    const item = data.data[0];

    console.log(item);

    const newItem: TestEquipment = {
      itemId: item.itemId,
      itemName: item.itemName,
      // rarity: item.rarity === "레전더리" ? 0 : item.rarity === "에픽" ? 1 : 2,
      rarity: 2,
      slotIdx: -1,
      setIdx: -1,
      weaponType: item.itemTypeDetailId,
      isFusion: false,
    };

    await fetch(`/api/query/testapi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: newItem,
      }),
    });
  }

  // if (response.ok) {
  //   console.log(data.data);
  // }

  // for (const item of data.data) {
  //   const newItem: TestEquipment = {
  //     itemId: item.item_id,
  //     itemName: item.item_name,
  //     rarity: rarityIndex.indexOf(item.rarity),
  //     slotIdx: -1,
  //     setIdx: -1,
  //     weaponType: item.item_type_detail_id,
  //     isFusion: false,
  //   };

  //   await fetch(`/api/query/testapi`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       data: newItem,
  //     }),
  //   });
  // }
}

// await fetch("api/query/character", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     character: newCharacter,
//   }),
// });

// console.log(tempEquipments);
// fs.writeFile("letsgo.json", JSON.stringify(tempEquipments), function () {
//   console.log("완료");
// });

export default function Home() {
  // saveFile();

  return <Box>test page</Box>;
}
