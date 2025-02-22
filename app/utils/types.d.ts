interface SearchHistory {
  serverId: string;
  characterName: string;
}

interface Equipment {
  itemId: string;
  itemName: string;
  rarity: number;
}

interface SetItem extends Equipment {
  setId?: string;
  setIdx?: number;
  slotId?: string;
  slotIdx?: number;
}

interface Weapon extends Equipment {
  itemTypeDetailId?: string;
}

type EquipmentType = SetItem | Weapon;

interface TimelineInfo {
  item: EquipmentType;
  obtainCode: number; // 505 : 드랍, 504 : 항아리, 513 : 카드보상, 520 : 제작
  date: string;
  channelName?: string; // code가 513이면 없음
  channelNo?: number; // code가 513이면 없음
  dungeonName?: string; // code가 504이면 없음
}

interface HistoryItem {
  histories: {
    characterName: string;
    timelines: TimelineInfo[];
  }[];
  highest: {
    rarity: number;
    itemId: string;
  };
}

interface Character {
  serverId: string;
  serverName: string;
  characterId: string;
  characterName: string;
  adventureName: string;
  jobName: string;
}

interface CharacterBasic {
  serverId: string;
  characterId: string;
  characterName: string;
  adventureName: string;
}

type HighestRarityItemId = Record<number, string>;
type HighestRarityBit = Record<number, number>;
type ItemHistory = Record<number, HistoryItem>;
type CharacterNameToItemHistory = Record<string, ItemHistory>;
type HighestRarity = Record<number, { rarity: number; itemId: string }>;
