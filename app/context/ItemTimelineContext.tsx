import React, { createContext, Dispatch, SetStateAction } from "react";

export interface ItemTimelineInfo {
  name: string; // ex) 아이템 획득(던전 드랍), 아이템 획득(던전 카드 보상)
  date: string; // YYYY-MM-DD HH:MM
  itemId: string; // 아이템 id
  itemName: string;
  itemRarity: string; // "에픽", "레전더리"
  channelName: string; // 드랍 채널. 던전 카드 보상으로 먹은건 이 정보가 없음
  channelNo: number;
  dungeonName: string; // 침묵의 성소, 종말의 숭배자, 심연 : 종말의 숭배자, 광포 : 청해의 심장 등등
}

/*
- 항아리/상자의 경우 channelName, channelNo는 있고 dungeonName이 undefined
- 던전 카드보상의 경우 channelName, channelNo가 없음
- 던전 드랍의 경우 둘 다 있음
*/

const initialItemTimelineState: ItemTimelineInfo[] = [];

const ItemTimelineContext = createContext<{
  itemTimelineState: ItemTimelineInfo[];
  setItemTimelineState: Dispatch<SetStateAction<ItemTimelineInfo[]>>;
}>({
  itemTimelineState: initialItemTimelineState,
  setItemTimelineState: () => {},
});

export default ItemTimelineContext;
