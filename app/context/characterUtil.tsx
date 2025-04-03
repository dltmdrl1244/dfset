import dayjs from "dayjs";
import { equipments } from "@/public/equipment";
import { itemSets } from "./setIds";
import { itemSlots } from "./slotIds";

export async function utilGetCharacterInfo(
  characterId: string,
  serverId: string
) {
  if (!serverId || !characterId) {
    return null;
  }

  const params = new URLSearchParams();

  params.set("characterId", characterId);
  params.set("serverId", serverId);

  try {
    const response = await fetch(`api/query/character?${params.toString()}`);
    const data = await response.json();

    if (data.data) {
      // 있으면 바로 꺼내서 return
      const newCharacter: Character = {
        serverId: data.data.server_id,
        characterId: data.data.character_id,
        characterName: data.data.character_name,
        jobName: data.data.job_name,
        adventureName: data.data.adventure_name,
      };

      return newCharacter;
    } else {
      // 없으면 api 호출해서 Character 만들고, POST
      const getParam = new URLSearchParams();
      getParam.set("serverId", serverId);
      getParam.set("characterId", characterId);

      const getResponse = await fetch(
        `api/characterBasic?${getParam.toString()}`
      );
      const getData = await getResponse.json();
      const newCharacter: Character = {
        serverId: getData.data.serverId,
        characterId: getData.data.characterId,
        characterName: getData.data.characterName,
        jobName: getData.data.jobGrowName,
        adventureName: getData.data.adventureName,
      };

      await fetch("api/query/character", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character: newCharacter,
        }),
      });

      return newCharacter;
    }
  } catch (error) {
    console.error("Error searching characters:", error);
    return null;
  }
}

export async function utilGetCharacterHistory(targetCharacter: Character) {
  if (!targetCharacter) {
    return null;
  }

  try {
    const response = await fetch(
      `api/query/history?characterId=${targetCharacter.characterId}&serverId=${targetCharacter.serverId}`
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("error");
      return;
    }

    if (data.data) {
      // 캐릭터 히스토리 있다

      return data.data.history_dict;
    } else {
      // 없다
      const rv: HistoryItem[] = await getCharacterTimelineFromAPI(
        targetCharacter
      );

      rv.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateA.isBefore(dateB, "minute") ? -1 : 1;
      });

      const characterHistory: CharacterHistory | null = makeCharacterHistory(
        rv,
        null,
        targetCharacter
      );
      if (!characterHistory) {
        return;
      }
      utilSaveCharacterHistory(targetCharacter, characterHistory);
      return characterHistory;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getCharacterTimelineFromAPI(
  targetCharacter: Character,
  startDate?: string
) {
  const tempTimelines: HistoryItem[] = [];

  if (!targetCharacter) {
    return tempTimelines;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  async function fetchData(startDate: string, endDate: string, next: string) {
    if (!targetCharacter) {
      console.error("character not found");
      return;
    }

    const params = new URLSearchParams();
    params.set("sId", targetCharacter?.serverId);
    params.set("cId", targetCharacter.characterId);
    params.set("startDate", startDate);
    params.set("endDate", endDate);
    params.set("limit", "100");

    if (next != "") {
      params.set("next", next);
    }

    try {
      const response = await fetch(`/api/timeline?${params.toString()}`);
      const data = await response.json();

      if (response.status === 200) {
        if (data.data.timeline.rows.length > 0) {
          for (const timeline of data.data.timeline.rows) {
            const res: TimelineResponse = timeline;
            const foundItem: Equipment | null = getEquipment(res.data.itemId);
            if (!foundItem) {
              continue;
            }

            if (res.code == 516) {
              // 아이템 초월
              const beyondHistoryItem: HistoryItem = {
                item: foundItem,
                obtainCode:
                  timeline.data.adventureSafeMoveType == "in" ? 5161 : 5160,
                date: timeline.date,
              };

              tempTimelines.push(beyondHistoryItem);
              continue;
            }

            const timelineInfo: NormalHistoryItem = {
              item: foundItem,
              obtainCode: res.code,
              date: res.date,
              channelName: res.data.channelName,
              channelNo: res.data.channelNo,
              dungeonName: res.data.dungeonName,
            };

            tempTimelines.push(timelineInfo);
          }

          if (data.data.timeline.next != null) {
            await fetchData(startDate, endDate, data.data.timeline.next);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching character timeline", error);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  let currentStartDate;
  let currentEndDate;
  if (startDate) {
    // currentStartDate = dayjs(startDate).add(9, "hours");
    // currentEndDate = dayjs(startDate).add(9, "hours");
    currentStartDate = dayjs(startDate);
    currentEndDate = dayjs(startDate);
  } else {
    // 중천 시작일
    currentStartDate = dayjs("2025-01-09 06:00:00");
    currentEndDate = dayjs("2025-01-09 06:00:00");
  }

  // 현재까지
  const endDate = dayjs();
  // 직접 지정
  // let endDate = dayjs("2025-02-01 06:00:00");

  while (endDate.isAfter(currentStartDate, "second")) {
    const diff = endDate.diff(currentStartDate, "d");
    const period = Math.min(88, diff);

    currentEndDate = currentStartDate.add(period, "day");
    currentEndDate = currentEndDate.set("h", 23).set("m", 59);
    if (currentEndDate.isAfter(dayjs())) {
      currentEndDate = dayjs();
    }
    const curStartDateString = currentStartDate.format("YYYYMMDDTHHmm");
    const curEndDateString = currentEndDate.format("YYYYMMDDTHHmm");
    await fetchData(curStartDateString, curEndDateString, "");

    currentStartDate = currentEndDate.add(1, "day").set("h", 0).set("m", 0);
  }

  return tempTimelines;
}

function getEquipment(itemId: string): Equipment | null {
  const foundItem: EquipmentResponse | undefined = equipments.find(
    (item) => item.item_id === itemId
  );

  if (foundItem !== undefined) {
    const newItem: Equipment = {
      itemId: foundItem.item_id,
      itemName: foundItem.item_name,
      rarity: foundItem.rarity,
      slotIdx: foundItem.slot_idx,
      setIdx: foundItem.set_idx,
      weaponType: foundItem.weapon_type,
      isFusion: foundItem.is_fusion,
    };
    return newItem;
  }
  return null;
}

function makeCharacterHistory(
  timelineInfos: HistoryItem[],
  prevHistory: CharacterHistory | null,
  targetCharacter: Character
) {
  if (!targetCharacter) {
    return null;
  }

  let tempCharacterHistory: CharacterHistory;
  if (!prevHistory) {
    // 0. 생성 및 characterInfo 설정
    tempCharacterHistory = {
      characterInfo: {
        characterId: targetCharacter.characterId,
        characterName: targetCharacter.characterName,
      },
      highest: {},
      histories: {},
      itemCount: [0, 0, 0],
      weaponList: [],
      potList: [],
      updateDate: dayjs().toISOString(),
    };
  } else {
    tempCharacterHistory = prevHistory;
  }

  for (const tl of timelineInfos) {
    // 아이템키
    const itemKey: number = tl.item.setIdx * itemSets.length + tl.item.slotIdx;

    // 초월 넣은것 처리
    if (tl.obtainCode == 5161) {
      if (!(itemKey in tempCharacterHistory.highest)) {
        console.error("error beyond history");
        continue;
      }
      const currentHighestItem: HighestItem =
        tempCharacterHistory.highest[itemKey][
          tempCharacterHistory.highest[itemKey].length - 1
        ];
      if (currentHighestItem.count <= 0) {
        console.error("error beyond history");
        continue;
      }

      if (currentHighestItem.count == 1) {
        tempCharacterHistory.highest[itemKey].pop();
      } else {
        tempCharacterHistory.highest[itemKey][
          tempCharacterHistory.highest[itemKey].length - 1
        ] = {
          rarity: currentHighestItem.rarity,
          itemId: currentHighestItem.itemId,
          count: currentHighestItem.count - 1,
        };
      }
    } else {
      // 초월out을 포함한 일반 케이스
      if (
        !(itemKey in tempCharacterHistory.highest) ||
        tempCharacterHistory.highest[itemKey].length <= 0
      ) {
        tempCharacterHistory.highest[itemKey] = [
          {
            rarity: tl.item.rarity,
            itemId: tl.item.itemId,
            count: 1,
          },
        ];
      } else if (
        tl.item.rarity >
        tempCharacterHistory.highest[itemKey][
          tempCharacterHistory.highest[itemKey].length - 1
        ].rarity
      ) {
        tempCharacterHistory.highest[itemKey].push({
          rarity: tl.item.rarity,
          itemId: tl.item.itemId,
          count: 1,
        });
      } else {
        tempCharacterHistory.highest[itemKey][
          tempCharacterHistory.highest[itemKey].length - 1
        ] = {
          ...tempCharacterHistory.highest[itemKey][
            tempCharacterHistory.highest[itemKey].length - 1
          ],
          count:
            tempCharacterHistory.highest[itemKey][
              tempCharacterHistory.highest[itemKey].length - 1
            ].count + 1,
        };
      }
    }

    // 1. highest 갱신
    // if (
    //   !(itemKey in tempCharacterHistory.highest) ||
    //   tl.item.rarity > tempCharacterHistory.highest[itemKey].rarity
    // ) {
    //   tempCharacterHistory.highest[itemKey] = {
    //     itemId: tl.item.itemId,
    //     rarity: tl.item.rarity,
    //   };
    // }

    // 2. historyItem 만들어서 histories에 추가
    if (itemKey in tempCharacterHistory.histories) {
      tempCharacterHistory.histories[itemKey].push(tl);
    } else {
      tempCharacterHistory.histories[itemKey] = [tl];
    }

    // 3. itemCount 갱신
    tempCharacterHistory.itemCount[tl.item.rarity]++;

    // 4. weaponList
    if (tl.obtainCode != 5160 && tl.item.weaponType != "") {
      tempCharacterHistory.weaponList.push({
        itemId: tl.item.itemId,
        itemName: tl.item.itemName,
        rarity: tl.item.rarity,
      });
    }

    // 5. potList
    if (tl.obtainCode === 504) {
      tempCharacterHistory.potList.push({
        itemId: tl.item.itemId,
        itemName: tl.item.itemName,
        rarity: tl.item.rarity,
      });
    }
  } // end of for loop

  return tempCharacterHistory;
}

export async function utilUpdateCharacterHistory(targetCharacter: Character) {
  if (!targetCharacter) {
    return null;
  }
  try {
    const response = await fetch(
      `api/query/history?characterId=${targetCharacter.characterId}&serverId=${targetCharacter.serverId}`
    );
    const data = await response.json();

    if (data.data) {
      const prevHistory: CharacterHistory = data.data.history_dict;
      const createTime: string = data.data.create_time;

      const rv: HistoryItem[] = await getCharacterTimelineFromAPI(
        targetCharacter,
        createTime
      );

      rv.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateA.isBefore(dateB, "minute") ? -1 : 1;
      });
      const testCharacterHistory: CharacterHistory | null =
        makeCharacterHistory(rv, prevHistory, targetCharacter);
      if (testCharacterHistory) {
        testCharacterHistory.updateDate = dayjs().toISOString();
        return testCharacterHistory;
      }
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function utilSaveCharacterHistory(
  targetCharacter: Character,
  characterHistory: CharacterHistory
) {
  if (!characterHistory || !targetCharacter) {
    return;
  }

  try {
    await fetch("api/query/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterId: targetCharacter?.characterId,
        serverId: targetCharacter.serverId,
        histories: characterHistory,
      }),
    });
  } catch (error) {
    console.error(error);
  }
}
