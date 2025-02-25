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
    useState<TestAdventureCharacterHistory>({
      highest: {},
      characters: {},
    });

  // useEffect(() => {
  //   testMakeAdventureItemHistory();
  // }, []);
  // const [characterNameToItemHistory, setCharacterNameToItemHistory] =
  //   useState<CharacterNameToItemHistory>({});
  // const [adventureItemHistory, setAdventureItemHistory] = useState<ItemHistory>(
  //   {}
  // );

  // useEffect(() => {
  //   if (Object.keys(characterNameToItemHistory).length <= 0) {
  //     return;
  //   }

  //   makeAdventureItemTable();
  // }, [characterNameToItemHistory]);

  // function makeAdventureItemTable() {
  //   if (Object.keys(characterNameToItemHistory).length <= 0) {
  //     return;
  //   }
  //   const tempAdventureItemHistory: ItemHistory = {};
  //   for (const [characterName, historyDict] of Object.entries(
  //     characterNameToItemHistory
  //   )) {
  //     // historyDict는 ItemHistory 타입
  //     for (const [key, value] of Object.entries(historyDict)) {
  //       const itemKey: number = Number(key); // 아이템키
  //       const historyItem: HistoryItem = value; // HistoryItem

  //       if (itemKey in tempAdventureItemHistory) {
  //         tempAdventureItemHistory[itemKey].histories.push({
  //           characterName: characterName,
  //           timelines: historyItem.histories[0].timelines,
  //         });
  //         if (
  //           historyItem.highest.rarity >
  //           tempAdventureItemHistory[itemKey].highest.rarity
  //         ) {
  //           tempAdventureItemHistory[itemKey].highest = historyItem.highest;
  //         }
  //       } else {
  //         tempAdventureItemHistory[itemKey] = {
  //           histories: [
  //             {
  //               characterName: characterName,
  //               timelines: historyItem.histories[0].timelines,
  //             },
  //           ],
  //           highest: historyItem.highest,
  //         };
  //       }
  //     }
  //   }
  //   setAdventureItemHistory(tempAdventureItemHistory);
  // }

  // async function getAdventureItemTable() {
  //   if (!adventureName) {
  //     return;
  //   }
  //   const tempCharacterNameToItemHistory: CharacterNameToItemHistory = {};
  //   const params = new URLSearchParams();
  //   params.set("adventureName", adventureName);

  //   try {
  //     const response = await fetch(`api/query/adventure?${params.toString()}`);
  //     const data = await response.json();

  //     for (const character of data.data) {
  //       const characterparam = new URLSearchParams();
  //       characterparam.set("characterId", character.character_id);

  //       const characterResponse = await fetch(
  //         `api/query/history?${characterparam.toString()}`
  //       );
  //       const characterData = await characterResponse.json();

  //       if (characterData.data && characterData.data.history_dict) {
  //         tempCharacterNameToItemHistory[character.character_name] =
  //           characterData.data.history_dict;
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   setCharacterNameToItemHistory(tempCharacterNameToItemHistory);
  // }

  async function testMakeAdventureItemHistory() {
    if (characterList.length <= 0) {
      return;
    }
    const tempAdventureItemHistory: TestAdventureCharacterHistory = {
      highest: {},
      characters: {},
    };

    for (const character of characterList) {
      const response = await fetch(
        `api/query/testHistory?characterId=${character.characterId}`
      );
      const data = await response.json();

      if (data.data) {
        // console.log(data.data[0]);
        const characterHistory: TestCharacterHistory =
          data.data[0].history_dict;

        tempAdventureItemHistory.characters[character.characterName] =
          characterHistory;

        Object.entries(characterHistory.highest).map(([key, highestInfo]) => {
          const itemKey = Number(key);
          if (
            !(itemKey in tempAdventureItemHistory.highest) ||
            highestInfo.rarity >
              tempAdventureItemHistory.highest[itemKey].rarity
          ) {
            tempAdventureItemHistory.highest[itemKey] = highestInfo;
          }
        });
      }
    }
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
              <Button colorScheme="teal" onClick={testMakeAdventureItemHistory}>
                조회
              </Button>
              <ItemTable
                isAdventure={true}
                testItemHistory={adventureItemHistory}
              />
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
