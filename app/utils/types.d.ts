interface SearchHistory {
  serverId: string;
  characterName: string;
}

interface CharacterResponse {
  server_id: string;
  server_name: string;
  character_id: string;
  character_name: string;
  adventure_name: string;
  job_name: string;
  create_time: string;
}

interface Character {
  serverId: string;
  characterId: string;
  characterName: string;
  adventureName: string;
  jobName: string;
}

type CharacterNameToCharacterHistory = Record<string, CharacterHistory>;

interface AdventureCharacterHistory {
  highest: Record<number, HighestItem[]>;
  characters: CharacterNameToCharacterHistory;
}

interface CharacterHistory {
  characterInfo: CharacterInfo;
  highest: Record<number, HighestItem[]>;
  histories: Record<number, HistoryItem[]>;
  itemCount: itemCountArray;
  weaponList: SimpleEquipment[];
  potList: SimpleEquipment[];
  updateDate: string;
}

interface SimpleEquipment {
  itemId: string;
  itemName: string;
  rarity: number;
}

type itemCountArray = [number, number, number];

interface CharacterInfo {
  characterId: string;
  characterName: string;
}

interface HighestItem {
  rarity: number;
  itemId: string;
  count: number;
}

interface Equipment {
  itemId: string;
  itemName: string;
  rarity: number;
  slotIdx: number;
  setIdx: number;
  weaponType: string;
  isFusion: boolean;
}

interface EquipmentResponse {
  item_id: string;
  item_name: string;
  rarity: number;
  slot_idx: number;
  set_idx: number;
  weapon_type: string;
  is_fusion: boolean;
}

interface HistoryItem {
  item: Equipment;
  obtainCode: number; // 초월 넘겨준것은 5161, 받은것은 5160
  date: string;
}

interface NormalHistoryItem extends HistoryItem {
  dungeonName: string;
  channelName: string;
  channelNo: number;
}

interface TimelineResponse {
  code: number;
  name: string;
  date: string;
  data: TimelineResponseItem;
}

interface TimelineResponseItem {
  itemId: string;
  itemName: string;
  itemRarity: string;
  channelName: string;
  channelNo: number;
  dungeonName: string;
  mistGear: boolean;
}

interface TimelineInfo {
  item: Equipment;
  obtainCode: number; // 505 : 드랍, 504 : 항아리, 513 : 카드보상, 520 : 제작
  date: string;
  channelName?: string; // code가 513이면 없음
  channelNo?: number; // code가 513이면 없음
  dungeonName?: string; // code가 504이면 없음
}

interface BeyondItemInfo {
  id: string;
  rarity: number;
  slotIdx: number;
  setIdx: number;
}
