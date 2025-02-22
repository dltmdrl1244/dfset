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

interface AdventureAccordionProps {
  adventureName: string;
}

export const AdventureAccordion: React.FC<AdventureAccordionProps> = ({
  adventureName,
}) => {
  const [characterNameToItemHistory, setCharacterNameToItemHistory] =
    useState<CharacterNameToItemHistory>({});
  const [adventureItemHistory, setAdventureItemHistory] = useState<ItemHistory>(
    {}
  );

  useEffect(() => {
    if (Object.keys(characterNameToItemHistory).length <= 0) {
      return;
    }

    makeAdventureItemTable();
  }, [characterNameToItemHistory]);

  function makeAdventureItemTable() {
    if (Object.keys(characterNameToItemHistory).length <= 0) {
      return;
    }
    const tempAdventureItemHistory: ItemHistory = {};
    for (const [characterName, historyDict] of Object.entries(
      characterNameToItemHistory
    )) {
      // historyDict는 ItemHistory 타입
      for (const [key, value] of Object.entries(historyDict)) {
        const itemKey: number = Number(key); // 아이템키
        const historyItem: HistoryItem = value; // HistoryItem

        if (itemKey in tempAdventureItemHistory) {
          tempAdventureItemHistory[itemKey].histories.push({
            characterName: characterName,
            timelines: historyItem.histories[0].timelines,
          });
          if (
            historyItem.highest.rarity >
            tempAdventureItemHistory[itemKey].highest.rarity
          ) {
            tempAdventureItemHistory[itemKey].highest = historyItem.highest;
          }
        } else {
          tempAdventureItemHistory[itemKey] = {
            histories: [
              {
                characterName: characterName,
                timelines: historyItem.histories[0].timelines,
              },
            ],
            highest: historyItem.highest,
          };
        }
      }
    }
    setAdventureItemHistory(tempAdventureItemHistory);
  }

  async function getAdventureItemTable() {
    if (!adventureName) {
      return;
    }
    const tempCharacterNameToItemHistory: CharacterNameToItemHistory = {};
    const params = new URLSearchParams();
    params.set("adventureName", adventureName);

    try {
      const response = await fetch(`api/query/adventure?${params.toString()}`);
      const data = await response.json();

      for (const character of data.data) {
        const characterparam = new URLSearchParams();
        characterparam.set("characterId", character.character_id);

        const characterResponse = await fetch(
          `api/query/history?${characterparam.toString()}`
        );
        const characterData = await characterResponse.json();

        if (characterData.data && characterData.data.history_dict) {
          tempCharacterNameToItemHistory[character.character_name] =
            characterData.data.history_dict;
        }
      }
    } catch (error) {
      console.error(error);
    }

    setCharacterNameToItemHistory(tempCharacterNameToItemHistory);
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
          <AccordionButton bg="beige" p={3}>
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
              <Button colorScheme="teal" onClick={getAdventureItemTable}>
                조회
              </Button>
              <ItemTable
                itemHistory={adventureItemHistory}
                isAdventure={true}
              />
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
