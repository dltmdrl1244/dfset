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

export default function Home() {
  const searchParams = useSearchParams();

  let serverId: string = "";
  let characterId: string = "";

  const [character, setCharacter] = useState<Character | null>(null);
  const [infoLoaded, setInfoLoaded] = useState<boolean>(false);
  const [latestUpdate, setLatestUpdate] = useState<string>("");

  const [itemTimeline, setItemTimeline] = useState<TimelineInfo[]>([]);
  const [itemCountArray, setItemCountArray] = useState([0, 0, 0]);
  const [itemHistoryDict, setItemHistoryDict] = useState<ItemHistory>({});
  const [weaponList, setWeaponList] = useState<Weapon[]>([]);
  const [potList, setPotList] = useState<SetItem[]>([]);

  const rarityIndex = ["레전더리", "에픽", "태초"];
  const toast = useToast();
  const setIdxDict: Record<string, number> = {
    "7f788a703a87d783079b41d0fe6448c9": 0,
    "11f7d203a05ea6f13300c0facb39f11e": 1,
    "7c9c8335b72c2907df20786f8f5b27f0": 2,
    "2877466bc2fc8bedf7799d88167c9fe3": 3,
    "4ee7bd5912cda6e2a24c1f36d5202b46": 4,
    "4e65968c4d30898e6879434dc641b6e4": 5,
    "854dc8c01b1bc231e132dae5df3c52bc": 6,
    "93e7825053bdec4e0f4c12837cf4f57e": 7,
    "3af7c961e7d8cd8b5b42c5f82af2a0ad": 8,
    e23286107ba4328af86c83aabc347e9e: 9,
    "8e9cb65cb6285d7e2f084f440aa18870": 10,
    b92ca7784123b5fea9cea40144925194: 11,
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
      return;
    }

    serverId = sId;
    characterId = cId;

    getCharacterBasicInfo();
  }, [searchParams]);

  useEffect(() => {
    if (character) {
      getAdventureInfo();
      getCharacterTimeline();
    }
  }, [character]);

  useEffect(() => {
    if (itemTimeline.length > 0) {
      updateItemDetails();
    }
  }, [itemTimeline]);

  const getCharacterBasicInfo = async () => {
    const params = new URLSearchParams();
    params.set("characterId", characterId);
    try {
      const response = await fetch(`api/query/character?${params.toString()}`);
      const data = await response.json();
      // 캐릭터 검색
      if (data.data) {
        // 있으면 바로 꺼내서 setCharacter
        const newCharacter: Character = {
          serverId: data.data.serverId,
          serverName: data.data.serverName,
          characterId: data.data.characterId,
          characterName: data.data.characterName,
          jobName: data.data.jobName,
          adventureName: data.data.adventureName,
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
          serverName: getServerName(getData.data.serverId),
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
  const getAdventureInfo = async () => {
    if (!character) {
      return;
    }

    const adventureParams = new URLSearchParams();
    adventureParams.set("characterId", character.characterId);

    try {
      const adventureResponse = await fetch(
        `api/query/adventure?${adventureParams.toString()}`
      );
      const adventureData = await adventureResponse.json();
      if (!adventureData.data && adventureResponse.ok) {
        // 없으면
        const postResponse = await fetch(`api/query/adventure`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            characterId: character.characterId,
            serverId: character.serverId,
            adventureName: character?.adventureName,
            characterName: character.characterName,
          }),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
  characterId를 통해 먼저 DB에서 최근 타임라인을 탐색
  만약 DB에 타임라인 정보가 없다면 API 호출 및 DB에 새롭게 저장
  TODO : 최근 타임라인 + 그 이후 데이터 API 호출해서 갱신할 수 있는 '갱신' 버튼 추가
  */
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
        const rv = await getCharacterTimelineFromAPI();
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

  async function updateCharacterTimeline() {
    if (!character) {
      return;
    }

    const params = new URLSearchParams();
    params.set("characterId", character?.characterId);

    try {
      const response = await fetch(`api/query/timeline?${params.toString()}`);
      const data = await response.json();

      if (
        data.data &&
        Array.isArray(data.data.timeline) &&
        data.data.timeline.length > 0
      ) {
        setLatestUpdate(data.data.create_time);
        let tempTimelines: TimelineInfo[] = data.data.timeline;

        // db에 데이터 있음
        const rv: TimelineInfo[] = await getCharacterTimelineFromAPI(
          data.data.create_time
        );

        tempTimelines = [...tempTimelines, ...rv];

        tempTimelines.sort((a, b) => {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);
          return dateA.isBefore(dateB, "minute") ? -1 : 1;
        });

        saveCharacterTimeline(tempTimelines);
        setItemTimeline(tempTimelines);
      } else {
        // db에 데이터 없음
        const rv = await getCharacterTimelineFromAPI();
        if (rv.length > 0) {
          saveCharacterTimeline(rv);
        }

        rv.sort((a, b) => {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);
          return dateA.isBefore(dateB, "minute") ? -1 : 1;
        });

        setItemTimeline(rv);
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }

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
      // console.log("History DB가 업데이트되었습니다.");
    } catch (error) {
      console.error(error);
    }
  }

  /*
  Neople API를 호출해서 타임라인 정보를 가져옴.
  TODO : 최근 타임라인이 DB에 있다면 갱신 시 startDate를 last update time으로 설정 
  */
  const getCharacterTimelineFromAPI = async (startDate?: string) => {
    const tempTimelines: TimelineInfo[] = [];

    if (!character) {
      router.push("/");
      return tempTimelines;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    async function fetchData(startDate: string, endDate: string, next: string) {
      if (!character) {
        console.error("sId, cId not found");
        router.push("/");
        return;
      }

      const params = new URLSearchParams();
      params.set("sId", character?.serverId);
      params.set("cId", character.characterId);
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
            const newItems: TimelineInfo[] = data.data.timeline.rows.map(
              (row: TimelineApiResponse): TimelineInfo => ({
                item: {
                  itemId: row.data.itemId,
                  itemName: row.data.itemName,
                  rarity: rarityIndex.indexOf(row.data.itemRarity),
                  // 나머지 정보들은 (slotIdx, weaponTypeId 등) 아직 채워넣지 않음
                },
                obtainCode: row.code,
                date: row.date,
                channelName: row.code != 513 ? row.data.channelName : undefined,
                channelNo: row.code != 513 ? row.data.channelNo : undefined,
                dungeonName: row.code != 504 ? row.data.dungeonName : undefined,
              })
            );

            tempTimelines.push(...newItems);

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
      // console.log(`fetch : ${curStartDateString} ~ ${curEndDateString}`);

      currentStartDate = currentEndDate.add(1, "day").set("h", 0).set("m", 0);
    }

    // 디테일 값 수정
    const timelineResult: TimelineInfo[] = [];
    for (let i = 0; i < tempTimelines.length; i++) {
      const timeline = tempTimelines[i];
      const response = await fetch(
        `/api/query/item?itemId=${timeline.item.itemId}`
      );
      const data = await response.json();

      if (
        (data.data == undefined && !Array.isArray(data.data)) ||
        data.data.length <= 0
      ) {
        continue;
      }
      const newItem = data.data[0];

      if (newItem.itemTypeDetailId !== null) {
        // 무기
        const weapon: Weapon = {
          itemId: timeline.item.itemId,
          itemName: timeline.item.itemName,
          rarity: timeline.item.rarity,
          itemTypeDetailId: newItem.itemTypeDetailId,
        };

        tempTimelines[i].item = weapon;
      } else {
        // 비 무기
        const setItem: SetItem = {
          itemId: timeline.item.itemId,
          itemName: timeline.item.itemName,
          rarity: timeline.item.rarity,
          setId: newItem.setId,
          setIdx: setIdxDict[newItem.setId],
          slotId: newItem.slotId,
          slotIdx: slotIdxDict[newItem.slotId],
        };

        tempTimelines[i].item = setItem;
      }

      timelineResult.push(tempTimelines[i]);
    }
    return timelineResult;
  };

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

  async function handleUpdateButtonClicked() {
    const currentTime = dayjs();
    const latestUpdateTime = dayjs(latestUpdate);
    if (currentTime.diff(latestUpdateTime, "minute") < 20) {
      toast({
        title: `최소 20분마다 갱신 가능합니다.`,
        status: "warning",
        isClosable: true,
      });
    } else {
      updateCharacterTimeline();
    }
  }

  const characterImageUrl = infoLoaded
    ? `https://img-api.neople.co.kr/df/servers/${character?.serverId}/characters/${character?.characterId}?zoom=1`
    : ``;

  return (
    <BaseLayout>
      {infoLoaded ? (
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
                <Text fontSize={"xs"}>
                  베누스 에픽 융합석, 흑아 장비는 현재 조회되지 않습니다.
                  업데이트 예정입니다.
                </Text>
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
                    {character?.serverName} | {character?.jobName}
                  </Center>
                  <Box mt={3} borderTop={`1px solid #696969`} p={4}>
                    <Box>
                      <Text>획득한 태초 : {itemCountArray[2]}</Text>
                      <Text>획득한 에픽 : {itemCountArray[1]}</Text>
                      <Text>획득한 레전더리 : {itemCountArray[0]}</Text>
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
                      <Text fontSize="xs">{latestUpdate}</Text>
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            </Box>

            {/* </Center> */}
            {/* <Center> */}
            <Box>
              <ItemTable itemHistory={itemHistoryDict} isAdventure={false} />
            </Box>
          </HStack>
          {/* </Center> */}
          {/* <Center> */}

          <WeaponList weaponList={weaponList} />
          <PotList potList={potList} />
          {/* <Flex direction="column" gap={4}>
            </Flex> */}
          {/* </Center> */}
        </Center>
      ) : (
        <Center minHeight="600px">
          <Spinner />
        </Center>
      )}
    </BaseLayout>
  );
}
