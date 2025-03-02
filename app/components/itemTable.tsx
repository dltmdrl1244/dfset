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
  HStack,
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

interface ItemTableProps {
  isAdventure: boolean;
  adventureHistory: AdventureCharacterHistory;
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

export const ItemTable: React.FC<ItemTableProps> = ({
  isAdventure,
  adventureHistory,
}) => {
  const [points, setPoints] = useState<Record<number, number>>({});
  const [counts, setCounts] = useState<Record<number, ItemCounts>>({});
  const [highestSet, setHighestSet] = useState<HighestSet>({
    setIdx: 0,
    setPoint: -1,
  });
  function calculateSet() {
    let tempCounts: Record<number, ItemCounts> = {};
    for (const [key, value] of Object.entries(adventureHistory.highest)) {
      const setIdx = Math.floor(Number(key) / itemSets.length);
      const rarity = value.rarity;

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
  // const rarityCount

  return (
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
                borderBottom={`${(setIdx + 1) % 3 == 0 ? 3 : 1}px solid black`}>
                <Th
                  bgColor="darkgrey"
                  border={"1px solid black"}
                  borderRight={"2px solid black"}
                  height="50px"
                  p={0}>
                  <Tooltip label={set.setName}>
                    <Center>
                      {setIdx != 12 ? (
                        <Image src={`/set115/${setIdx + 1}.png`} />
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
  );
};
