import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Flex,
  Button,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

import { ItemTable } from "./itemTable";
import { useEffect, useState } from "react";
import { useColorMode } from "@chakra-ui/react";

interface AdventureAccordionProps {
  characterList: Character[];
}

export const AdventureAccordion: React.FC<AdventureAccordionProps> = ({
  characterList,
}) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [adventureItemHistory, setAdventureItemHistory] =
    useState<AdventureCharacterHistory>({
      highest: {},
      characters: {},
    });
  const [adventureInfoLoading, setAdventureInfoLoading] =
    useState<boolean>(false);

  async function testMakeAdventureItemHistory() {
    if (characterList.length <= 0) {
      return;
    }
    setAdventureInfoLoading(true);
    const tempAdventureItemHistory: AdventureCharacterHistory = {
      highest: {},
      characters: {},
    };

    for (const character of characterList) {
      const response = await fetch(
        `api/query/history?characterId=${character.characterId}&serverId=${character.serverId}`
      );
      const data = await response.json();

      if (data.data) {
        const characterHistory: CharacterHistory = data.data.history_dict;
        tempAdventureItemHistory.characters[character.characterName] =
          characterHistory;

        for (const [key, highestItems] of Object.entries(
          characterHistory.highest
        )) {
          if (highestItems.length <= 0) {
            continue;
          }
          const itemKey = Number(key);
          const highestItem = highestItems[highestItems.length - 1];
          if (!(itemKey in tempAdventureItemHistory.highest)) {
            tempAdventureItemHistory.highest[itemKey] = [highestItem];
          } else if (
            tempAdventureItemHistory.highest[itemKey].length > 0 &&
            tempAdventureItemHistory.highest[itemKey][
              tempAdventureItemHistory.highest[itemKey].length - 1
            ].rarity < highestItem.rarity
          ) {
            tempAdventureItemHistory.highest[itemKey].push(highestItem);
          }
        }
      }
    }
    setAdventureInfoLoading(false);
    setAdventureItemHistory(tempAdventureItemHistory);
  }

  return (
    <Box
      p={0}
      borderWidth="1px"
      borderRadius="md"
      borderColor="dimgray"
      width="620px"
      minWidth="620px"
      boxShadow="base">
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton
            bg={`${colorMode === "light" ? "beige" : "#1a202c"}`}
            p={3}>
            <Box as="span" flex="1" textAlign="left">
              <Text as="b" size="2xl">
                전체 아이템 획득 테이블 보기
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            <UnorderedList>
              <ListItem>
                등록된 캐릭터들의 아이템 획득 현황을 한꺼번에 볼 수 있습니다.
              </ListItem>
              <ListItem>
                각 캐릭터의 최근 갱신 정보를 바탕으로 불러옵니다.
              </ListItem>
            </UnorderedList>
            <Flex direction="column" gap={2} mt={2}>
              {adventureInfoLoading ? (
                <Button colorScheme="teal" isLoading></Button>
              ) : (
                <Button
                  colorScheme="teal"
                  onClick={testMakeAdventureItemHistory}>
                  조회
                </Button>
              )}

              <ItemTable
                isAdventure={true}
                adventureHistory={adventureItemHistory}
              />
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
