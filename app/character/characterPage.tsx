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
  Tooltip,
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
import { useCharacter } from "../context/characterContext";
import {
  utilGetCharacterInfo,
  utilGetCharacterHistory,
  utilSaveCharacterHistory,
} from "../context/characterUtil";

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

  const [infoUpdating, setInfoUpdating] = useState<boolean>(false);
  const [infoLoaded, setInfoLoaded] = useState<boolean>(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const [itemHistoryDict, setItemHistoryDict] =
    useState<AdventureCharacterHistory | null>(null);

  const toast = useToast();
  const router = useRouter();

  ///////////////////////////////////
  const {
    characterInfo,
    setCharacterInfo,
    updateCharacter,
    characterHistoryInfo,
    setCharacterHistoryInfo,
  } = useCharacter();
  ///////////////////////////////////

  useEffect(() => {
    const sId = searchParams.get("sId");
    const cId = searchParams.get("cId");
    if (!sId || !cId) {
      router.push("/");
      return;
    }
    getCharacterBasicInfo();
  }, [searchParams]);

  // useEffect(() => {
  //   if (character) {
  //     getCharacterHistory();
  //   }
  // }, [character]);

  useEffect(() => {
    if (characterInfo) {
      getCharacterHistory();
    }
  }, [characterInfo]);

  useEffect(() => {
    if (characterInfo && characterHistoryInfo) {
      makeAdventureItemHistory(characterInfo, characterHistoryInfo);
    }
  }, [characterHistoryInfo]);

  const getCharacterBasicInfo = async () => {
    const serverId = searchParams.get("sId");
    const characterId = searchParams.get("cId");

    if (!serverId || !characterId) {
      router.push("/");
      return;
    }

    const newCharacter: Character | null = await utilGetCharacterInfo(
      characterId,
      serverId
    );
    if (!newCharacter) {
      router.push("/");
      return;
    }
    setCharacterInfo(newCharacter);
  };

  async function getCharacterHistory() {
    if (!characterInfo) {
      return;
    }
    const tempCharacterHistroy: CharacterHistory | null =
      await utilGetCharacterHistory(characterInfo);

    if (tempCharacterHistroy) {
      setCharacterHistoryInfo(tempCharacterHistroy);
      makeAdventureItemHistory(characterInfo, tempCharacterHistroy);
    }
  }

  function makeAdventureItemHistory(
    targetCharacter: Character,
    targetCharacterHistory: CharacterHistory
  ) {
    if (!targetCharacter || !targetCharacterHistory) {
      return;
    }
    const temp: AdventureCharacterHistory = {
      highest: targetCharacterHistory.highest,
      characters: {
        [targetCharacter.characterName]: targetCharacterHistory,
      },
    };
    setItemHistoryDict(temp);
    setInfoLoaded(true);
  }

  function convertToKSTMinute(isoString: string) {
    if (!isoString) {
      return "";
    }
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
    if (!characterInfo) {
      return;
    }

    if (characterHistoryInfo && !characterHistoryInfo.updateDate) {
      updateCharacter(characterInfo?.characterId, characterInfo?.serverId);
      return;
    }

    const currentTime = dayjs();
    const latestUpdateTime = dayjs(characterHistoryInfo?.updateDate);

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
        updateCharacter(characterInfo?.characterId, characterInfo?.serverId);
      }
    }
  }

  function onChangeAnonymous(checked: boolean) {
    setIsAnonymous(checked);
  }

  async function historyDeleteButtonClicked() {
    if (
      confirm(
        "캐릭터 정보를 초기화할까요? 아이템 정보가 누락됐을 경우 사용해주세요."
      )
    ) {
      if (await deleteCharacterHistory()) {
        alert("캐릭터 정보가 초기화되었습니다.");
        location.reload();
      } else {
        alert("에러가 발생했습니다.");
      }
    }
  }

  async function deleteCharacterHistory() {
    if (!characterInfo) {
      return false;
    }

    try {
      await fetch(
        `api/query/history?characterId=${characterInfo?.characterId}&serverId=${characterInfo.serverId}`,
        {
          method: "DELETE",
        }
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  const characterImageUrl = infoLoaded
    ? `https://img-api.neople.co.kr/df/servers/${characterInfo?.serverId}/characters/${characterInfo?.characterId}?zoom=1`
    : ``;

  return (
    <BaseLayout>
      {infoLoaded && characterInfo && characterHistoryInfo ? (
        <Center gap={4} flexWrap={"wrap"} p={5}>
          <HStack gap={10}>
            <Box>
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
                          : characterInfo?.characterName}
                      </Text>
                      {/* <Text fontSize="sm">{character?.adventureName}</Text> */}
                      {!isAnonymous && characterInfo?.adventureName && (
                        <Link
                          href={{
                            pathname: `adventure`,
                            query: {
                              adventure: characterInfo.adventureName,
                            },
                          }}>
                          <Text fontSize="sm" color={"teal"} as="b">
                            {characterInfo.adventureName}
                          </Text>
                        </Link>
                      )}
                    </Center>
                    <Center>
                      {!isAnonymous &&
                        `${getServerName(characterInfo?.serverId)} | ${
                          characterInfo.jobName
                        }`}
                      {/* {getServerName(character?.serverId)} |{" "}
                      {character?.jobName} */}
                    </Center>
                    <Box mt={3} borderTop={`1px solid #696969`} p={4}>
                      <Box>
                        <Text>
                          획득한 태초 : {characterHistoryInfo?.itemCount[2]}
                        </Text>
                        <Text>
                          획득한 에픽 : {characterHistoryInfo?.itemCount[1]}
                        </Text>
                        <Text>
                          획득한 레전더리 : {characterHistoryInfo?.itemCount[0]}
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
                          {convertToKSTMinute(characterHistoryInfo.updateDate)}
                        </Text>
                        <Tooltip label="아이템 정보가 누락됐을 경우 사용해주세요.">
                          <Button
                            colorScheme="teal"
                            onClick={historyDeleteButtonClicked}
                            mt={5}>
                            캐릭터 정보 초기화
                          </Button>
                        </Tooltip>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>{" "}
                {/* 캐릭터 상자*/}
              </Box>
            </Box>
            {itemHistoryDict && (
              <Box>
                <ItemTable
                  isAdventure={false}
                  adventureHistory={itemHistoryDict}
                  character={characterInfo}
                />
              </Box>
            )}
          </HStack>
          {characterHistoryInfo && characterHistoryInfo.weaponList && (
            <WeaponList weaponList={characterHistoryInfo.weaponList} />
          )}
          {characterHistoryInfo && characterHistoryInfo.potList && (
            <PotList potList={characterHistoryInfo.potList} />
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
