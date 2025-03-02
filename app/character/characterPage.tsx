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
  Switch,
  Spacer,
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
  const [infoUpdating, setInfoUpdating] = useState<boolean>(false);
  const [infoLoaded, setInfoLoaded] = useState<boolean>(false);
  const [latestUpdate, setLatestUpdate] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [characterHistory, setCharacterHistory] =
    useState<CharacterHistory | null>(null);
  const [itemHistoryDict, setItemHistoryDict] =
    useState<AdventureCharacterHistory | null>(null);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const sId = searchParams.get("sId");
    const cId = searchParams.get("cId");
    if (!sId || !cId) {
      router.push("/");
      return;
    }

    getCharacterBasicInfo();
  }, [searchParams]);

  useEffect(() => {
    if (character) {
      getCharacterHistory();
    }
  }, [character]);

  useEffect(() => {
    if (character && characterHistory) {
      makeAdventureItemHistory();
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

  async function getCharacterHistory() {
    if (!character) {
      return;
    }

    try {
      const response = await fetch(
        `api/query/history?characterId=${character.characterId}`
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("error");
        return;
      }

      if (data.data) {
        setLatestUpdate(data.data.create_time);
        // 캐릭터 히스토리 있다
        setCharacterHistory(data.data.history_dict);
      } else {
        // 없다
        const rv: HistoryItem[] = await getCharacterTimelineFromAPI(character);

        rv.sort((a, b) => {
          const dateA = dayjs(a.date);
          const dateB = dayjs(b.date);
          return dateA.isBefore(dateB, "minute") ? -1 : 1;
        });

        const testCharacterHistory: CharacterHistory | undefined =
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
        addCharacterHistory(rv);
        setLatestUpdate(dayjs().toISOString());
      }
    } catch (error) {
      console.error(error);
    }

    setInfoUpdating(false);
  }
  function addCharacterHistory(historyItems: HistoryItem[]) {
    if (!character || !characterHistory) {
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
    characterHistory: CharacterHistory
  ) {
    if (!characterHistory || !character) {
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

  function testGetEquipment(itemId: string): Equipment | null {
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

  function testMakeCharacterHistory(timelineInfos: HistoryItem[]) {
    if (!character) {
      return;
    }

    // 0. 생성 및 characterInfo 설정
    let tempCharacterHistory: CharacterHistory = {
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
    const tempTimelines: HistoryItem[] = [];

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
              const foundItem: Equipment | null = testGetEquipment(
                res.data.itemId
              );
              if (!foundItem) {
                continue;
              }
              const timelineInfo: HistoryItem = {
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

  function makeAdventureItemHistory() {
    if (!character || !characterHistory) {
      return;
    }
    const temp: AdventureCharacterHistory = {
      highest: characterHistory.highest,
      characters: {
        [character.adventureName]: characterHistory,
      },
    };
    setItemHistoryDict(temp);
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
        setInfoUpdating(true);
        updateCharacterHistory(character);
      }
    }
  }

  function onChangeAnonymous(checked: boolean) {
    console.log("checked is ", checked);
    setIsAnonymous(checked);
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
              {/* <HStack
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
              </HStack> */}
              <Box>
                <Flex>
                  <Spacer />
                  <HStack>
                    <Text>익명</Text>
                    <Switch
                      checked={isAnonymous}
                      onChange={({ target: { checked } }) =>
                        onChangeAnonymous(checked)
                      }
                    />
                  </HStack>
                </Flex>
                <Box // 캐릭터 상자
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  mt={2}
                  borderColor="dimgray"
                  width="240px"
                  minWidth="240px"
                  boxShadow="base">
                  <Image
                    src={isAnonymous ? "/anonymous.png" : characterImageUrl}
                    mt={-10}
                    ml={1.5}
                    alt="characterImageURL"
                  />
                  <Flex direction="column">
                    <Center flexDirection={"column"}>
                      <Text as="b" fontSize={"lg"}>
                        {isAnonymous
                          ? "익명의 모험가"
                          : character?.characterName}
                      </Text>
                      {/* <Text fontSize="sm">{character?.adventureName}</Text> */}
                      {!isAnonymous && character?.adventureName && (
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
                      {!isAnonymous &&
                        `${getServerName(character?.serverId)} | ${
                          character.jobName
                        }`}
                      {/* {getServerName(character?.serverId)} |{" "}
                      {character?.jobName} */}
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
                        {infoUpdating ? (
                          <Button colorScheme="teal" isLoading>
                            갱신
                          </Button>
                        ) : (
                          <Button
                            colorScheme="teal"
                            onClick={() => {
                              handleUpdateButtonClicked();
                            }}>
                            갱신
                          </Button>
                        )}

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
            </Box>
            {itemHistoryDict && (
              <Box>
                <ItemTable
                  isAdventure={false}
                  adventureHistory={itemHistoryDict}
                />
              </Box>
            )}
          </HStack>
          {characterHistory && characterHistory.weaponList && (
            <WeaponList weaponList={characterHistory.weaponList} />
          )}
          {characterHistory && characterHistory.potList && (
            <PotList potList={characterHistory.potList} />
          )}
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
