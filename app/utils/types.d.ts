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
  set_id: string | null;
  slot_id: string | null;
  item_type_detail_id: string | null;
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

///////////////////////////////////////////////////////////////////////////////////
type TestCharacterNameToCharacterHistory = Record<string, TestCharacterHistory>;

interface TestAdventureCharacterHistory {
  highest: Record<number, TestHighestItem>;
  characters: TestCharacterNameToCharacterHistory;
}

interface TestCharacterHistory {
  characterInfo: TestCharacterInfo;
  highest: Record<number, TestHighestItem>;
  histories: Record<number, TestHistoryItem[]>;
  itemCount: itemCountArray;
  weaponList: SimpleEquipment[];
  potList: SimpleEquipment[];
}

interface SimpleEquipment {
  itemId: string;
  itemName: string;
  rarity: number;
}

type itemCountArray = [number, number, number];

interface TestCharacterInfo {
  characterId: string;
  characterName: string;
}

interface TestHighestItem {
  rarity: number;
  itemId: string;
}

interface TestEquipment {
  itemId: string;
  itemName: string;
  rarity: number;
  slotIdx: number;
  setIdx: number;
  weaponType: string;
  isFusion: boolean;
}

interface TestEquipmentResponse {
  item_id: string;
  item_name: string;
  rarity: number;
  slot_idx: number;
  set_idx: number;
  weapon_type: string;
  is_fusion: boolean;
}

interface TestHistoryItem {
  item: TestEquipment;
  obtainCode: number;
  dungeonName: string;
  channelName: string;
  channelNo: number;
  date: string;
}

interface TestTimelineResponse {
  code: number;
  name: string;
  date: string;
  data: TestTimelineResponseItem;
}

interface TestTimelineResponseItem {
  itemId: string;
  itemName: string;
  itemRarity: string;
  channelName: string;
  channelNo: number;
  dungeonName: string;
  mistGear: boolean;
}

interface TestTimelineInfo {
  item: TestEquipment;
  obtainCode: number; // 505 : 드랍, 504 : 항아리, 513 : 카드보상, 520 : 제작
  date: string;
  channelName?: string; // code가 513이면 없음
  channelNo?: number; // code가 513이면 없음
  dungeonName?: string; // code가 504이면 없음
}
