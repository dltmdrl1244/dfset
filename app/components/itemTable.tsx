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
} from "@chakra-ui/react";
import { ItemIcon } from "./itemIcon";
import { itemSlots } from "../context/slotIds";
import { itemSets } from "../context/setIds";

interface ItemTableProps {
  itemHistory?: ItemHistory;
  isAdventure: boolean;
}

const hexToRGB = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const ItemTable: React.FC<ItemTableProps> = ({
  itemHistory,
  isAdventure,
}) => {
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
                          historyItem={
                            itemHistory &&
                            itemHistory[itemKey] &&
                            itemHistory[itemKey]
                          }
                          isAdventure={isAdventure}
                        />
                      </Center>
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
