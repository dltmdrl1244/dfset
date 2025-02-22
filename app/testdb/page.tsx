"use client";

import { getSetIdByKeyword } from "../context/setIds";
import { getSlotIdBySlotName } from "../context/slotIds";

interface Item {
  itemId: string;
  itemName: string;
  rarity: string;
  slotId: string;
  setId: string;
}

// async function searchItems() {
//   const baseURL = `https://api.neople.co.kr/df/items`;

//   var itemsToAdd: Item[] = [];

//   for (const word of searchKeywords) {
//     const params = new URLSearchParams();
//     params.set("itemName", word);
//     params.set("wordType", "front");
//     params.set("limit", "30");
//     params.set("apikey", "dDJeHsbmDdfSGLV4EtCzPiYEATNzvWcO");
//     params.set("q", "minLevel:115");

//     const response = await fetch(`${baseURL}?${params.toString()}`);
//     const data = await response.json();

//     for (const item of data.rows) {
//       if (item.itemAvailableLevel === 115) {
//         itemsToAdd.push({
//           itemId: item.itemId,
//           itemName: item.itemName,
//           rarity: item.itemRarity,
//           setId: getSetIdByKeyword(word),
//           slotId: getSlotIdBySlotName(item.itemTypeDetail),
//         });
//       }
//     }
//   }

//   executeQuery(itemsToAdd);
// }

const executeQuery = (itemsToAdd: Item[]) => {
  console.log("execute query");
  console.log(itemsToAdd);

  fetch("/api/query/item", {
    method: "POST",
    body: JSON.stringify({ items: itemsToAdd }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};

export default function Home() {
  // searchItems();

  return <></>;
}
