"use client";

import {
  Center,
  Box,
  Image,
  Text,
  Spinner,
  Flex,
  Button,
  HStack,
  useToast,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getServerName } from "../context/serverOptions";
import { ItemTable } from "../components/itemTable";
import dayjs from "dayjs";
import { WeaponList } from "../components/weaponList";
import { PotList } from "../components/potList";
import Link from "next/link";
import BaseLayout from "../components/baseLayout";
import { InfoIcon } from "@chakra-ui/icons";
import { equipments } from "@/public/equipment";
import { itemSets } from "../context/setIds";

interface TimelineApiResponse {
  code: number;
  date: string;
  data: TimelineApiResponseData;
}

interface TimelineApiResponseData {
  itemId: string;
  itemName: string;
  itemRarity: string;
  channelName: string;
  channelNo: number;
  dungeonName: string;
}

export default function CharacterPage() {
  const searchParams = useSearchParams();

  const [character, setCharacter] = useState<Character | null>(null);
  const [infoLoaded, setInfoLoaded] = useState<boolean>(false);
  const [latestUpdate, setLatestUpdate] = useState<string>("");

  const [itemTimeline, setItemTimeline] = useState<TimelineInfo[]>([]);
  const [itemCountArray, setItemCountArray] = useState([0, 0, 0]);

  // 이거는 itemTable에 전달해야 돼서 중요함 !!!!!
  const [itemHistoryDict, setItemHistoryDict] = useState<ItemHistory>({});
  // 이거는 itemTable에 전달해야 돼서 중요함 !!!!!

  const [weaponList, setWeaponList] = useState<Weapon[]>([]);
  const [potList, setPotList] = useState<SetItem[]>([]);

  //////// 테스트 영역
  const [testTimelines, setTestTimelines] = useState<TimelineInfo[]>([]);
  const [characterHistory, setCharacterHistory] =
    useState<TestCharacterHistory | null>(null);
  const [testItemHistoryDict, setTestItemHistoryDict] =
    useState<TestAdventureCharacterHistory | null>(null);
  //////// 테스트 영역

  const rarityIndex = ["레전더리", "에픽", "태초"];
  const toast = useToast();
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

  const router = useRouter();

  useEffect(() => {
    const sId = searchParams.get("sId");
    const cId = searchParams.get("cId");
    if (!sId || !cId) {
      router.push("/");
      return;
    }

    // serverId = sId;
    // characterId = cId;

    getCharacterBasicInfo();
  }, [searchParams]);

  useEffect(() => {
    if (character) {
      testGetCharacterHistory();
    }
  }, [character]);

  useEffect(() => {
    if (character && characterHistory) {
      testMakeItemHistory();
    }
  }, [characterHistory]);

  const getCharacterBasicInfo = async () => {
    const serverId = searchParams.get("sId");
    const characterId = searchParams.get("cId");

    if (!serverId || !characterId) {
      router.push("/");
      return;
    }
    const params = new URLSearchParams();
    params.set("characterId", characterId);
    try {
      const response = await fetch(`api/query/character?${params.toString()}`);
      const data = await response.json();
      // 캐릭터 검색
      if (data.data) {
        // 있으면 바로 꺼내서 setCharacter
        const newCharacter: Character = {
          serverId: data.data.server_id,
          characterId: data.data.character_id,
          characterName: data.data.character_name,
          jobName: data.data.job_name,
          adventureName: data.data.adventure_name,
        };

        setCharacter(newCharacter);
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
        setCharacter(newCharacter);
      }
    } catch (error) {
      console.error("Error searching characters:", error);
    }
  };

  // 모험단
  // Update: 모험단 테이블을 따로 안 둬도 될것 같아서 일단 지워봄
  // const getAdventureInfo = async () => {
  //   if (!character) {
  //     return;
  //   }

  //   const adventureParams = new URLSearchParams();
  //   adventureParams.set("characterId", character.characterId);

  //   try {
  //     const adventureResponse = await fetch(
  //       `api/query/adventure?${adventureParams.toString()}`
  //     );
  //     const adventureData = await adventureResponse.json();

  //     if (!adventureData.data) {
  //       // 없으면
  //       const postResponse = await fetch(`api/query/adventure`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           characterId: character.characterId,
  //           serverId: character.serverId,
  //           adventureName: character?.adventureName,
  //           characterName: character.characterName,
  //         }),
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  /*
  characterId를 통해 먼저 DB에서 최근 타임라인을 탐색
  만약 DB에 타임라인 정보가 없다면 API 호출 및 DB에 새롭게 저장
  */
  // Update: DB에 타임라인 정보는 없어도 될 것 같음.
  async function getCharacterTimeline() {
    if (!character) {
      return;
    }
    const params = new URLSearchParams();
    params.set("characterId", character.characterId);

    try {
      const response = await fetch(`api/query/timeline?${params.toString()}`);
      const data = await response.json();

      if (
        data.data &&
        Array.isArray(data.data.timeline) &&
        data.data.timeline.length > 0
      ) {
        // db에 데이터 있음
        setLatestUpdate(data.data.create_time);
        setItemTimeline(data.data.timeline);
      } else {
        // db에 데이터 없음
        const rv = await getCharacterTimelineFromAPI(character);
        rv.sort((a, b) => {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);
          return dateA.isBefore(dateB, "minute") ? -1 : 1;
        });
        if (rv.length > 0) {
          saveCharacterTimeline(rv);
        }
        setItemTimeline(rv);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  // async function updateCharacterTimeline() {
  //   if (!character) {
  //     return;
  //   }

  //   const params = new URLSearchParams();
  //   params.set("characterId", character?.characterId);

  //   try {
  //     const response = await fetch(`api/query/timeline?${params.toString()}`);
  //     const data = await response.json();

  //     if (
  //       data.data &&
  //       Array.isArray(data.data.timeline) &&
  //       data.data.timeline.length > 0
  //     ) {
  //       setLatestUpdate(data.data.create_time);
  //       let tempTimelines: TimelineInfo[] = data.data.timeline;

  //       // db에 데이터 있음
  //       const rv: TimelineInfo[] = await getCharacterTimelineFromAPI(
  //         character,
  //         data.data.create_time
  //       );

  //       tempTimelines = [...tempTimelines, ...rv];

  //       tempTimelines.sort((a, b) => {
  //         const dateA = dayjs(a.date);
  //         const dateB = dayjs(b.date);
  //         return dateA.isBefore(dateB, "minute") ? -1 : 1;
  //       });

  //       saveCharacterTimeline(tempTimelines);

  //       if (rv.length > 0) {
  //         setItemTimeline(tempTimelines);
  //       }
  //     } else {
  //       // db에 데이터 없음
  //       const rv = await getCharacterTimelineFromAPI(character);
  //       if (rv.length > 0) {
  //         saveCharacterTimeline(rv);
  //       }

  //       rv.sort((a, b) => {
  //         const dateA = dayjs(a.date);
  //         const dateB = dayjs(b.date);
  //         return dateA.isBefore(dateB, "minute") ? -1 : 1;
  //       });

  //       setItemTimeline(rv);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     return;
  //   }
  // }

  async function saveCharacterTimeline(timelineInfos: TimelineInfo[]) {
    if (timelineInfos.length <= 0) {
      return;
    }
    // DB에 저장
    try {
      await fetch("api/query/timeline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character?.characterId,
          timelines: timelineInfos,
        }),
      });
      // console.log("DB가 업데이트되었습니다.");
      toast({
        title: "캐릭터 정보가 갱신되었습니다.",
        status: "success",
        isClosable: true,
      });
      getCharacterTimeline();
    } catch (error) {
      console.error(error);
    }
  }

  async function getCharacterHistory() {
    if (!character) {
      return;
    }
    const params = new URLSearchParams();
    params.set("characterId", character.characterId);

    try {
      const response = await fetch(`api/query/history?${params.toString()}`);
      const data = await response.json();

      if (data.data && data.data.history_dict) {
        // setItemHistoryDict(data.data.history_dict);
        setCharacterHistory(data.data.history_dict);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function saveCharacterHistory(histories: ItemHistory) {
    if (Object.keys(histories).length <= 0) {
      // console.log("no data to save");
      return;
    }
    // DB에 저장
    try {
      await fetch("api/query/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: character?.characterId,
          histories: histories,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function TestTempUpdateCharacterHistory(chId: string) {
    const params = new URLSearchParams();
    params.set("characterId", chId);
    try {
      const response = await fetch(`api/query/character?characterId=${chId}`);
      const data = await response.json();
      // 캐릭터 검색
      if (data.data) {
        // 있으면 바로 꺼내서 setCharacter
        const newCharacter: Character = {
          serverId: data.data.server_id,
          characterId: data.data.character_id,
          characterName: data.data.character_name,
          jobName: data.data.job_name,
          adventureName: data.data.adventure_name,
        };

        ///////////////////////////////////////////////////////////////
        const rv: TestHistoryItem[] = await getCharacterTimelineFromAPI(
          newCharacter
        );

        rv.sort((a, b) => {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);
          return dateA.isBefore(dateB, "minute") ? -1 : 1;
        });

        const testCharacterHistory: TestCharacterHistory | undefined =
          testMakeCharacterHistory(rv);
        if (testCharacterHistory) {
          testSaveCharacterHistory(newCharacter, testCharacterHistory);
        }
      }
    } catch (error) {
      console.error("Error searching characters:", error);
    }
  }

  async function testGetCharacterHistory() {
    if (!character) {
      return;
    }

    try {
      const response = await fetch(
        `api/query/testHistory?characterId=${character.characterId}`
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("error");
        return;
      }

      if (data.data) {
        console.log(data.data);
        setLatestUpdate(data.data[0].create_time);
        // 캐릭터 히스토리 있다
        setCharacterHistory(data.data[0].history_dict);
      } else {
        // 없다
        const rv: TestHistoryItem[] = await getCharacterTimelineFromAPI(
          character
        );

        rv.sort((a, b) => {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);
          return dateA.isBefore(dateB, "minute") ? -1 : 1;
        });

        const testCharacterHistory: TestCharacterHistory | undefined =
          testMakeCharacterHistory(rv);
        if (testCharacterHistory) {
          setCharacterHistory(testCharacterHistory);
          testSaveCharacterHistory(character, testCharacterHistory);
          setLatestUpdate(dayjs().toISOString());
        }
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async function updateCharacterHistory(targetCharacter: Character) {
    if (!targetCharacter) {
      return;
    }

    try {
      const response = await fetch(
        `api/query/history?characterId=${targetCharacter.characterId}`
      );
      const data = await response.json();

      if (data.data) {
        // console.log(data.data);
        const createTime: string = data.data.create_time;
        // console.log("createTime : ", createTime);
        const rv: TestHistoryItem[] = await getCharacterTimelineFromAPI(
          targetCharacter,
          createTime
        );

        rv.sort((a, b) => {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);
          return dateA.isBefore(dateB, "minute") ? -1 : 1;
        });
        addCharacterHistory(rv);
        setLatestUpdate(dayjs().toISOString());
      }
    } catch (error) {
      console.error(error);
    }
  }
  function addCharacterHistory(historyItems: TestHistoryItem[]) {
    if (historyItems.length <= 0 || !character || !characterHistory) {
      return;
    }

    let tempCharacterHistory = characterHistory;

    for (const historyItem of historyItems) {
      const itemKey: number =
        historyItem.item.setIdx * itemSets.length + historyItem.item.slotIdx;

      // highest 갱신
      if (
        !(itemKey in tempCharacterHistory.highest) ||
        historyItem.item.rarity > tempCharacterHistory.highest[itemKey].rarity
      ) {
        tempCharacterHistory.highest[itemKey] = {
          itemId: historyItem.item.itemId,
          rarity: historyItem.item.rarity,
        };
      }
      // histories에 추가
      if (itemKey in tempCharacterHistory.histories) {
        tempCharacterHistory.histories[itemKey].push(historyItem);
      } else {
        tempCharacterHistory.histories[itemKey] = [historyItem];
      }

      // 3. itemCount 갱신
      tempCharacterHistory.itemCount[historyItem.item.rarity]++;

      // 4. weaponList
      if (historyItem.item.weaponType != "") {
        tempCharacterHistory.weaponList.push({
          itemId: historyItem.item.itemId,
          itemName: historyItem.item.itemName,
          rarity: historyItem.item.rarity,
        });
      }

      // 5. potList
      if (historyItem.obtainCode === 504) {
        tempCharacterHistory.potList.push({
          itemId: historyItem.item.itemId,
          itemName: historyItem.item.itemName,
          rarity: historyItem.item.rarity,
        });
      }
    }

    setCharacterHistory(tempCharacterHistory);
    testSaveCharacterHistory(character, tempCharacterHistory);
  }

  async function testSaveCharacterHistory(
    targetCharacter: Character,
    characterHistory: TestCharacterHistory
  ) {
    if (!characterHistory || !character) {
      return;
    }

    try {
      await fetch("api/query/testHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: targetCharacter?.characterId,
          histories: characterHistory,
        }),
      });
      toast({
        title: "캐릭터 정보가 갱신되었습니다.",
        status: "success",
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function testGetEquipment(itemId: string): TestEquipment | null {
    const foundItem: TestEquipmentResponse | undefined = equipments.find(
      (item) => item.item_id === itemId
    );

    if (foundItem !== undefined) {
      const newItem: TestEquipment = {
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

  function testMakeCharacterHistory(timelineInfos: TestHistoryItem[]) {
    if (timelineInfos.length <= 0) {
      return;
    }

    if (!character) {
      return;
    }

    // 0. 생성 및 characterInfo 설정
    let tempCharacterHistory: TestCharacterHistory = {
      characterInfo: {
        characterId: character.characterId,
        characterName: character.characterName,
      },
      highest: {},
      histories: {},
      itemCount: [0, 0, 0],
      weaponList: [],
      potList: [],
    };

    for (const tl of timelineInfos) {
      // 아이템키
      const itemKey: number =
        tl.item.setIdx * itemSets.length + tl.item.slotIdx;
      // 레어리티
      // tl.item.rarity

      // 1. highest 갱신
      if (
        !(itemKey in tempCharacterHistory.highest) ||
        tl.item.rarity > tempCharacterHistory.highest[itemKey].rarity
      ) {
        tempCharacterHistory.highest[itemKey] = {
          itemId: tl.item.itemId,
          rarity: tl.item.rarity,
        };
      }

      // 2. historyItem 만들어서 histories에 추가
      // let historyItem: TestHistoryItem = {
      //   item: tl.item,
      //   obtainCode: tl.obtainCode,
      //   dungeonName: item.dungeonName,
      //   channelName: item.channelName,
      //   channelNo: item.channelNo,
      //   date: tl.date,
      // };
      if (itemKey in tempCharacterHistory.histories) {
        tempCharacterHistory.histories[itemKey].push(tl);
      } else {
        tempCharacterHistory.histories[itemKey] = [tl];
      }

      // 3. itemCount 갱신
      tempCharacterHistory.itemCount[tl.item.rarity]++;

      // 4. weaponList
      if (tl.item.weaponType != "") {
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

    // setCharacterHistory(tempCharacterHistory);
    return tempCharacterHistory;
  }

  /*
  Neople API를 호출해서 타임라인 정보를 가져옴.
  */
  const getCharacterTimelineFromAPI = async (
    targetCharacter: Character,
    startDate?: string
  ) => {
    const tempTimelines: TestHistoryItem[] = [];

    if (!character) {
      router.push("/");
      return tempTimelines;
    }

    // if (startDate) {
    //   console.log("startDate : ", startDate);
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    async function fetchData(startDate: string, endDate: string, next: string) {
      if (!character) {
        console.error("sId, cId not found");
        router.push("/");
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
              const res: TestTimelineResponse = timeline;
              const foundItem: TestEquipment | null = testGetEquipment(
                res.data.itemId
              );
              if (!foundItem) {
                continue;
              }
              const timelineInfo: TestHistoryItem = {
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
      currentStartDate = dayjs(startDate).add(9, "hours");
      currentEndDate = dayjs(startDate).add(9, "hours");
    } else {
      // 중천 시작일
      currentStartDate = dayjs("2025-01-09 06:00:00");
      currentEndDate = dayjs("2025-01-09 06:00:00");
    }

    // console.log(latestUpdate);
    // console.log("탐색 시작 날짜 : ", currentStartDate.toISOString());

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
      // console.log(`fetch : ${curStartDateString} ~ ${curEndDateString}`);

      currentStartDate = currentEndDate.add(1, "day").set("h", 0).set("m", 0);
    }

    return tempTimelines;
  };

  function testMakeItemHistory() {
    if (!character || !characterHistory) {
      return;
    }
    const temp: TestAdventureCharacterHistory = {
      highest: characterHistory.highest,
      characters: {
        [character.adventureName]: characterHistory,
      },
    };
    setTestItemHistoryDict(temp);
    setInfoLoaded(true);
  }

  async function updateItemDetails() {
    const tempItemHistoryDict: ItemHistory = {};
    const tempItemCountArray = [0, 0, 0];
    const tempWeaponList: Weapon[] = [];
    const tempPotList: SetItem[] = [];
    // let tempHighestRarityDict: HighestRarity = {};
    ////////////////////////////////////////////////////////////////////
    function updateItemHistoryDict(
      itemKey: number,
      timelineItem: TimelineInfo,
      newRarity: number,
      newItemId: string
    ) {
      if (!character) {
        return;
      }
      if (itemKey in tempItemHistoryDict) {
        // histories.timelines에 추가
        // tempItemHistoryDict[itemKey].histories[0].timelines.push(timelineItem);
        tempItemHistoryDict[itemKey] = {
          ...tempItemHistoryDict[itemKey],
          histories: [
            {
              ...tempItemHistoryDict[itemKey].histories[0],
              timelines: [
                ...tempItemHistoryDict[itemKey].histories[0].timelines,
                timelineItem,
              ],
            },
          ],
        };
        // highest 수정
        if (newRarity > tempItemHistoryDict[itemKey].highest.rarity) {
          // tempItemHistoryDict[itemKey].highest = {
          //   rarity: newRarity,
          //   itemId: newItemId,
          // };
          tempItemHistoryDict[itemKey] = {
            ...tempItemHistoryDict[itemKey],
            highest: { rarity: newRarity, itemId: newItemId },
          };
        }
      } else {
        // 새로 만듦
        tempItemHistoryDict[itemKey] = {
          histories: [
            {
              characterName: character.characterName,
              timelines: [timelineItem],
            },
          ],
          highest: {
            rarity: newRarity,
            itemId: newItemId,
          },
        };
      }
    }

    function updateItemCount(rarity: number) {
      tempItemCountArray[rarity]++;
    }

    function updateWeaponList(newWeapon: Weapon) {
      tempWeaponList.push(newWeapon);
    }

    function updatePotList(newItem: SetItem) {
      tempPotList.push(newItem);
    }

    ////////////////////////////////////////////////////////////////////

    if (!character) {
      return;
    }

    if (!itemTimeline || itemTimeline.length <= 0) {
      return;
    }

    for (const timeline of itemTimeline) {
      if ("setId" in timeline.item) {
        const item: SetItem = timeline.item;
        if (item.setIdx == undefined || item.slotIdx == undefined) {
          // 에픽 융합석이나 흑아 장비
          // console.log(`error. ${item.setId}, ${item.slotId}`);
          // console.log(timeline);
          continue;
        }

        const itemKey: number = item.setIdx * 13 + item.slotIdx;
        // const rarity: number = rarityIndex.indexOf(item.rarity);

        updateItemHistoryDict(itemKey, timeline, item.rarity, item.itemId);
        updateItemCount(item.rarity);
        // updateHighestRarity(itemKey, rarity, item.itemId);

        if (timeline.obtainCode == 504) {
          updatePotList(item);
        }
      } else {
        const item: Weapon = timeline.item;
        // const rarity: number = rarityIndex.indexOf(item.rarity);

        updateItemCount(item.rarity);
        updateWeaponList(item);

        if (timeline.obtainCode == 504) {
          // 항아리
          updatePotList(item);
        }
      }
    } // end of for loop

    // 데이터 반영
    setItemHistoryDict({ ...tempItemHistoryDict });
    setItemCountArray([...tempItemCountArray]);
    setWeaponList([...tempWeaponList]);
    setPotList([...tempPotList]);
    // setHighestRarityItemDict({ ...tempHighestRarityDict });
    saveCharacterHistory(tempItemHistoryDict);

    setInfoLoaded(true);
  }

  function convertToKSTMinute(isoString: string) {
    var currentTime = dayjs(isoString.slice(0, isoString.length - 1));

    currentTime = currentTime.add(9, "hours");
    return `${currentTime.get("year")}-${String(
      currentTime.get("month") + 1
    ).padStart(2, "0")}-${String(currentTime.get("date")).padStart(
      2,
      "0"
    )} ${String(currentTime.get("hour")).padStart(2, "0")}:${String(
      currentTime.get("minute")
    ).padStart(2, "0")}`;
  }

  async function handleUpdateButtonClicked() {
    if (!character) {
      return;
    }
    const currentTime = dayjs();
    const latestUpdateTime = dayjs(latestUpdate);
    if (currentTime.diff(latestUpdateTime, "minute") < 20) {
      toast({
        title: `최소 20분마다 갱신 가능합니다.`,
        status: "warning",
        isClosable: true,
      });
    } else {
      const response = await fetch("/api/servers");
      if (response.status === 503) {
        toast({
          title: `서버 점검중`,
          description: "캐릭터 갱신이 불가능합니다.",
          status: "warning",
          isClosable: true,
        });
      } else {
        updateCharacterHistory(character);
      }
    }
  }

  const characterImageUrl = infoLoaded
    ? `https://img-api.neople.co.kr/df/servers/${character?.serverId}/characters/${character?.characterId}?zoom=1`
    : ``;

  return (
    <BaseLayout>
      {infoLoaded && character ? (
        <Center gap={4} flexWrap={"wrap"} p={5}>
          {/* <Center> */}
          <HStack gap={10}>
            <Box>
              <HStack
                width="240px"
                border="1px solid dimgray"
                p={4}
                borderRadius="md">
                <InfoIcon />
                <UnorderedList>
                  <ListItem>
                    <Text fontSize={"xs"}>흑아 장비는 조회되지 않습니다.</Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize={"xs"}>
                      초월로 넘긴/넘겨받은 정보는 조회되지 않습니다.
                    </Text>
                  </ListItem>
                  <ListItem>
                    <Text fontSize={"xs"}>
                      두 기능 모두 업데이트 예정입니다.
                    </Text>
                  </ListItem>
                </UnorderedList>
              </HStack>
              <Box // 캐릭터 상자
                p={4}
                borderWidth="1px"
                borderRadius="md"
                mt={5}
                borderColor="dimgray"
                width="240px"
                minWidth="240px"
                boxShadow="base">
                <Image
                  src={characterImageUrl}
                  mt={-10}
                  ml={1.5}
                  alt="characterImageURL"
                />
                <Flex direction="column">
                  <Center flexDirection={"column"}>
                    <Text as="b" fontSize={"lg"}>
                      {character?.characterName}
                    </Text>
                    {/* <Text fontSize="sm">{character?.adventureName}</Text> */}
                    {character?.adventureName && (
                      <Link
                        href={{
                          pathname: `adventure`,
                          query: {
                            adventure: character.adventureName,
                          },
                        }}>
                        <Text fontSize="sm" color={"teal"} as="b">
                          {character.adventureName}
                        </Text>
                      </Link>
                    )}
                  </Center>
                  <Center>
                    {getServerName(character?.serverId)} | {character?.jobName}
                  </Center>
                  <Box mt={3} borderTop={`1px solid #696969`} p={4}>
                    <Box>
                      <Text>
                        획득한 태초 : {characterHistory?.itemCount[2]}
                      </Text>
                      <Text>
                        획득한 에픽 : {characterHistory?.itemCount[1]}
                      </Text>
                      <Text>
                        획득한 레전더리 : {characterHistory?.itemCount[0]}
                      </Text>
                    </Box>

                    <Flex direction="column" mt={2}>
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          handleUpdateButtonClicked();
                        }}>
                        갱신
                      </Button>
                      <Text fontSize="sm" mt={1}>
                        최근 업데이트:
                      </Text>
                      <Text fontSize="xs">
                        {convertToKSTMinute(latestUpdate)}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            </Box>

            {/* </Center> */}
            {/* <Center> */}
            {testItemHistoryDict && (
              <Box>
                <ItemTable
                  itemHistory={itemHistoryDict}
                  isAdventure={false}
                  testItemHistory={testItemHistoryDict}
                />
              </Box>
            )}
          </HStack>
          {/* </Center> */}
          {/* <Center> */}
          {characterHistory && characterHistory.weaponList && (
            <WeaponList weaponList={characterHistory.weaponList} />
          )}
          {/* <WeaponList weaponList={characterHistory && characterHistory.weaponList} /> */}
          {characterHistory && characterHistory.potList && (
            <PotList potList={characterHistory.potList} />
          )}
          {/* <PotList potList={characterHistory && characterHistory.potList} /> */}
          {/* <Flex direction="column" gap={4}>
            </Flex> */}
          {/* </Center> */}
        </Center>
      ) : (
        <Center minHeight="600px" gap={4}>
          <Spinner />
          <Text>캐릭터 정보 로딩 중...</Text>
        </Center>
      )}
    </BaseLayout>
  );
}
