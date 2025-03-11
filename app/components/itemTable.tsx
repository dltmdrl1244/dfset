"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Box,
  Center,
  Tooltip,
  Text,
  Button,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";
import { ItemIcon } from "./itemIcon";
import { itemSlots } from "../context/slotIds";
import { itemSets } from "../context/setIds";
import {
  EpicTextBadge,
  LegendaryBadge,
  LegendaryTextBadge,
  SetPointBadge,
  TaechoTextBadge,
} from "./badges";
import { useEffect, useState } from "react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

interface ItemTableProps {
  isAdventure: boolean;
  adventureHistory: AdventureCharacterHistory;
  character?: Character;
}

const hexToRGB = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

type ItemCounts = [number, number, number];
type HighestSet = {
  setIdx: number;
  setPoint: number;
};
const raritySetPoints = [165, 215, 265];
const uniqueSetPoint = 115;

interface ModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  character: Character;
  itemInfo: BeyondItemInfo;
}

export const BeyondModal: React.FC<ModalProps> = ({
  isOpen,
  onOpen,
  onClose,
  character,
  itemInfo,
}) => {
  const [userVerified, setUserVerified] = useState<boolean>(false);
  const [adventureCharacter, setAdventureCharacter] =
    useState<CharacterResponse | null>(null);
  const [adventureCharacterList, setAdventureCharacterList] = useState<
    CharacterResponse[]
  >([]);
  const imgURL = `https://img-api.neople.co.kr/df/items/${itemInfo.id}`;

  async function getEquipment() {
    if (!character) {
      return false;
    }

    try {
      const params = new URLSearchParams();
      params.set("sId", character.serverId);
      params.set("cId", character.characterId);
      const response = await fetch(`api/equipment?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.data) {
        for (const item of data.data.equipment) {
          if (item.slotId === "JACKET") {
            return false;
          }
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async function getAdventureCharacters() {
    if (!character) {
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set("adventureName", character.adventureName);
      const response = await fetch(`api/query/adventure?${params.toString()}`);
      const data = await response.json();

      if (data.data) {
        const tempCharacters: Character[] = [];
        for (const ch of data.data) {
          tempCharacters.push(ch);
        }

        // setAdventureCharacterList(tempCharacters);
        setAdventureCharacterList(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function confirmButtonClicked() {
    if (await getEquipment()) {
      setUserVerified(true);
      getAdventureCharacters();
    }
  }

  function adventureCharacterSelected(character: CharacterResponse) {
    setAdventureCharacter(character);
  }

  function myOnClose() {
    setAdventureCharacter(null);
    setUserVerified(false);
    onClose();
  }

  function confirmLegendaryBeyond() {
    if (
      window.confirm(
        `아이템을 초월 처리합니다. \n대상 아이템과 캐릭터를 다시 한 번 확인해주세요.`
      )
    ) {
      beyondLegendary();
    }
  }

  async function beyondLegendary() {
    if (!character || !adventureCharacter) {
      alert(
        "오류가 발생했습니다. \n페이지를 새로고침한 후 다시 시도해 주세요."
      );
      return;
    }
  }

  return (
    <>
      {itemInfo && (
        <Modal isOpen={isOpen} onClose={myOnClose} isCentered size="xl">
          <ModalOverlay />
          <ModalContent bg="beige">
            <ModalHeader>레전더리 초월하기</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {!userVerified ? (
                <Box>
                  <Center flexDirection={"column"} gap={2}>
                    <Image
                      src={imgURL}
                      alt="레전더리아이템이미지"
                      boxSize={"40px"}
                    />
                    <Text as="b">
                      {itemSets[itemInfo.setIdx].setName}{" "}
                      {itemSlots[itemInfo.slotIdx].slotName}
                    </Text>
                  </Center>
                  <Text mt={3}>
                    레전더리 등급의 초월 기록을 타임라인에서 조회할 수 없어,
                    직접 레전더리 초월 정보를 지정해 주어야 합니다.
                  </Text>

                  <Text mt="5">
                    먼저 본인 인증을 위해, 해당 캐릭터의{" "}
                    <Text as="b" fontSize={"2xl"}>
                      '상의'
                    </Text>{" "}
                    아이템을 장착 해제한 후 재접속한 뒤, 아래 '완료' 버튼을
                    눌러주세요.
                  </Text>

                  <Text mt="5">
                    장착 장비 정보 갱신에는 1분 정도의 시간이 소요됩니다.
                  </Text>
                </Box>
              ) : !adventureCharacter ? (
                <Box>
                  <Center flexDirection={"column"} gap={2}>
                    <Image
                      src={imgURL}
                      alt="레전더리아이템이미지"
                      boxSize={"40px"}
                    />
                    <Text as="b">
                      {itemSets[itemInfo.setIdx].setName}{" "}
                      {itemSlots[itemInfo.slotIdx].slotName}
                    </Text>
                  </Center>
                  <Text mt={3}>
                    인증되었습니다. <br></br>이 아이템을 넘겨받은 캐릭터를
                    선택해주세요.
                  </Text>

                  <Grid
                    templateColumns="repeat(4, 1fr)"
                    gap={4}
                    overflowY="auto"
                    maxHeight={"400px"}>
                    {adventureCharacterList.map((adventureCharacter, idx) => (
                      <Center
                        key={`characterName${idx}`}
                        flexDirection={"column"}
                        borderRadius={"20px"}
                        _hover={{ bgColor: "#c0c0aa" }}
                        onClick={() => {
                          adventureCharacterSelected(adventureCharacter);
                        }}>
                        <Image
                          src={`https://img-api.neople.co.kr/df/servers/${adventureCharacter.server_id}/characters/${adventureCharacter.character_id}?zoom=1`}
                          boxSize={"130px"}
                        />
                        <Text>{adventureCharacter.character_name}</Text>
                      </Center>
                    ))}
                  </Grid>
                </Box>
              ) : (
                <Box>
                  <Center flexDirection={"column"} gap={2}>
                    <Image
                      src={imgURL}
                      alt="레전더리아이템이미지"
                      boxSize={"40px"}
                    />
                    <Text as="b">
                      {itemSets[itemInfo.setIdx].setName}{" "}
                      {itemSlots[itemInfo.slotIdx].slotName}
                    </Text>
                  </Center>
                  <VStack mt={-5}>
                    <Center>
                      <VStack>
                        <Image
                          src={`https://img-api.neople.co.kr/df/servers/${character.serverId}/characters/${character.characterId}?zoom=1`}
                        />
                        <Text mt={-5}>{character.characterName}</Text>
                      </VStack>
                      <ArrowForwardIcon />
                      <VStack>
                        <Image
                          src={`https://img-api.neople.co.kr/df/servers/${adventureCharacter.server_id}/characters/${adventureCharacter.character_id}?zoom=1`}
                        />
                        <Text mt={-5}>{adventureCharacter.character_name}</Text>
                      </VStack>
                    </Center>
                    <Text mt={3}>
                      대상 아이템과 캐릭터가 맞다면 '완료' 버튼을 클릭해주세요.
                    </Text>
                  </VStack>
                </Box>
              )}
            </ModalBody>

            <ModalFooter gap={4}>
              {!userVerified ? (
                <>
                  <Button colorScheme="teal" onClick={confirmButtonClicked}>
                    완료
                  </Button>
                  <Button colorScheme="blue" mr={3} onClick={myOnClose}>
                    닫기
                  </Button>
                </>
              ) : !adventureCharacter ? (
                <>
                  <Button colorScheme="blue" mr={3} onClick={myOnClose}>
                    닫기
                  </Button>
                </>
              ) : (
                <>
                  <Button colorScheme="teal" onClick={confirmLegendaryBeyond}>
                    완료
                  </Button>
                  <Button colorScheme="blue" mr={3} onClick={myOnClose}>
                    닫기
                  </Button>
                </>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export const ItemTable: React.FC<ItemTableProps> = ({
  isAdventure,
  adventureHistory,
  character,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [points, setPoints] = useState<Record<number, number>>({});
  const [counts, setCounts] = useState<Record<number, ItemCounts>>({});
  const [highestSet, setHighestSet] = useState<HighestSet>({
    setIdx: 0,
    setPoint: -1,
  });
  const [beyondItem, setBeyondItem] = useState<BeyondItemInfo>({
    id: "null",
    rarity: 0,
    slotIdx: 0,
    setIdx: 0,
  });
  function calculateSet() {
    let tempCounts: Record<number, ItemCounts> = {};
    for (const [key, value] of Object.entries(adventureHistory.highest)) {
      if (!Array.isArray(value) || value.length <= 0) {
        continue;
      }
      const setIdx = Math.floor(Number(key) / itemSets.length);
      const rarity = value[value.length - 1].rarity;

      if (setIdx in tempCounts) {
        tempCounts[setIdx][rarity]++;
      } else {
        tempCounts[setIdx] = [0, 0, 0];
        tempCounts[setIdx][rarity]++;
      }
    }

    let tempPoints: Record<number, number> = {};
    let tempHighestSet: HighestSet = { setIdx: -1, setPoint: -1 };
    for (const [key, value] of Object.entries(tempCounts)) {
      const setIdx = Number(key);
      if (setIdx in tempCounts) {
        const itemCount =
          tempCounts[setIdx][0] + tempCounts[setIdx][1] + tempCounts[setIdx][2];
        tempPoints[setIdx] =
          raritySetPoints[0] * tempCounts[setIdx][0] +
          raritySetPoints[1] * tempCounts[setIdx][1] +
          raritySetPoints[2] * tempCounts[setIdx][2] +
          uniqueSetPoint * (itemSlots.length - itemCount);

        if (tempHighestSet.setPoint < tempPoints[setIdx]) {
          tempHighestSet.setIdx = setIdx;
          tempHighestSet.setPoint = tempPoints[setIdx];
        }
      }
    }

    setPoints(tempPoints);
    setCounts(tempCounts);
    setHighestSet(tempHighestSet);
  }

  useEffect(() => {
    if (!isAdventure) {
      calculateSet();
    }
  }, [adventureHistory]);

  return (
    <>
      <Box maxWidth="730px" boxShadow="base">
        <TableContainer>
          <Table border={`2px solid black`}>
            <Thead>
              <Tr border={`2px solid black`}>
                <Th
                  border={"1px solid black"}
                  p={1}
                  width="60px"
                  borderRight={`2px solid black`}
                  bg="white">
                  <Center>
                    <Text color="black">세트</Text>
                  </Center>
                </Th>
                {itemSlots.map((slot, slotIdx) => (
                  <Th
                    key={`slotTitle${slotIdx}`}
                    bgColor={slot.bgColor}
                    border={"1px solid black"}
                    borderRight={`${
                      slotIdx == 4 || slotIdx == 7 || slotIdx == 10 ? 2 : 0
                    }px solid black`}
                    borderTop={`2px solid black`}
                    p={1}
                    width="50px"
                    maxWidth="50px">
                    <Center>
                      <Text as="b" color="black">
                        {slot.slotDisplayName}
                      </Text>
                    </Center>
                  </Th>
                ))}
                {!isAdventure && (
                  <Th
                    border={"1px solid black"}
                    borderRight={`2px solid black`}
                    bg="white">
                    <Text color="black">합계</Text>
                  </Th>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {itemSets.map((set, setIdx) => (
                <Tr
                  key={`set${setIdx}`}
                  borderBottom={`${
                    (setIdx + 1) % 3 == 0 ? 3 : 1
                  }px solid black`}>
                  <Th
                    bgColor="darkgrey"
                    border={"1px solid black"}
                    borderRight={"2px solid black"}
                    height="50px"
                    p={0}>
                    <Tooltip label={set.setName}>
                      <Center>
                        {setIdx != 12 ? (
                          <Image src={`/set115/${setIdx + 1}-1.png`} />
                        ) : (
                          <Text color="black">고유</Text>
                        )}
                      </Center>
                    </Tooltip>
                  </Th>
                  {itemSlots.map((slot, slotIdx) => {
                    const itemKey = setIdx * 13 + slotIdx;
                    return (
                      <Td
                        key={`cell${setIdx}-${slotIdx}`}
                        textAlign="center"
                        border={"1px solid black"}
                        borderRight={`${
                          slotIdx == 4 || slotIdx == 7 || slotIdx == 10 ? 2 : 0
                        }px solid black`}
                        p={0}
                        bg={hexToRGB(slot.bgColor, 0.2)}>
                        <Center>
                          <ItemIcon
                            setIdx={setIdx}
                            slotIdx={slotIdx}
                            isAdventure={isAdventure}
                            adventureHistory={adventureHistory}
                            character={character && character}
                            onOpen={onOpen}
                            setBeyondItem={setBeyondItem}
                          />
                        </Center>
                      </Td>
                    );
                  })}
                  {!isAdventure && (
                    <Td
                      textAlign="center"
                      border={"1px solid black"}
                      p={0}
                      bg={`${
                        highestSet.setIdx === setIdx
                          ? "rgba(255, 0, 0, 0.4)}"
                          : "rgba(0, 0, 0, 0.2)}"
                      }`}>
                      <Tooltip label="빈 슬롯은 유니크로 간주됩니다.">
                        {setIdx != 12 ? (
                          <Center flexDirection={"column"} gap={0.5}>
                            <HStack gap={0.5}>
                              <LegendaryTextBadge
                                str={
                                  setIdx in counts
                                    ? counts[setIdx][0].toString()
                                    : "0"
                                }
                              />
                              <EpicTextBadge
                                str={
                                  setIdx in counts
                                    ? counts[setIdx][1].toString()
                                    : "0"
                                }
                              />
                              <TaechoTextBadge
                                str={
                                  setIdx in counts
                                    ? counts[setIdx][2].toString()
                                    : "0"
                                }
                              />
                            </HStack>
                            <HStack gap={0.5}>
                              <Text>
                                {setIdx in points ? points[setIdx] : "0"}
                              </Text>
                              {setIdx in points && (
                                <SetPointBadge point={points[setIdx]} />
                              )}
                            </HStack>
                          </Center>
                        ) : (
                          <></>
                        )}
                      </Tooltip>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {character && (
        <BeyondModal
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          character={character}
          itemInfo={beyondItem}
        />
      )}
    </>
  );
};
