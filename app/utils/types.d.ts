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

interface EquipmentResponse {
  item_id: string;
  item_name: string;
  rarity: string;
  set_id: string;
  slot_id: string;
  item_type_detail_id: string;
  is_fusion: boolean;
  is_distinct: boolean;
}

interface CharacterResponse {
  server_id: string;
  server_name: string;
  character_id: string;
  character_name: string;
  adventure_name: string;
  job_name: string;
}

interface Character {
  serverId: string;
  serverName: string;
  characterId: string;
  characterName: string;
  adventureName: string;
  jobName: string;
}

interface SimpleCharacterResponse {
  server_id: string;
  character_id: string;
  character_name: string;
  adventure_name: string;
}

interface SimpleCharacter {
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
