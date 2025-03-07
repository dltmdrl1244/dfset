import {
  Image,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  Text,
  Flex,
  HStack,
  Badge,
  UnorderedList,
  ListItem,
  Box,
  VStack,
} from "@chakra-ui/react";

import {
  ItemRarityBadge,
  ItemObtainCodeBadge,
  CharacterNameBadge,
} from "../components/badges";
import { itemSets } from "../context/setIds";
import { itemSlots } from "../context/slotIds";
import { useColorMode } from "@chakra-ui/react";

interface ItemObtainBadgeProps {
  obtainCode: number;
}

interface DateBadgeProps {
  date: string;
}

const ItemObtainBadge: React.FC<ItemObtainBadgeProps> = ({ obtainCode }) => {
  switch (obtainCode) {
    case 505:
      return <ItemObtainCodeBadge str={"드랍"} />;
    case 504:
      return <ItemObtainCodeBadge str={"항아리/상자"} />;
    case 513:
      return <ItemObtainCodeBadge str={"카드"} />;
    case 520:
      return <ItemObtainCodeBadge str={"제작"} />;
  }
};

const DateBadge: React.FC<DateBadgeProps> = ({ date }) => {
  return (
    <Badge colorScheme="green" variant="solid" fontSize="sm">
      {date.split(" ")[0]}
    </Badge>
  );
};

function getRarityColor(rarity: number) {
  switch (rarity) {
    case 2:
      return `linear-gradient(180deg, #28d931, #33acea)`;
    case 1:
      return `linear-gradient(180deg, #FFB400, #FFB400)`;
    // return "#FFB400";
    case 0:
      // return "#b25400";
      return `linear-gradient(180deg, #b25400, #b25400)`;
    default:
      return "";
  }
}

interface ItemIconProps {
  setIdx: number;
  slotIdx: number;
  historyItem?: HistoryItem;
  isAdventure: boolean;
  adventureHistory: AdventureCharacterHistory;
}

export const ItemIcon: React.FC<ItemIconProps> = ({
  setIdx,
  slotIdx,
  historyItem,
  isAdventure,
  adventureHistory,
}) => {
  const itemKey = setIdx * itemSets.length + slotIdx;

  const imgURL =
    itemKey in adventureHistory.highest
      ? `https://img-api.neople.co.kr/df/items/${adventureHistory.highest[itemKey].itemId}`
      : `/set115/1.png`;
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Center>
      {itemKey in adventureHistory.highest && (
        <Popover>
          <PopoverTrigger>
            <Center
              width="48px"
              height="48px"
              border="4px solid transparent"
              css={`
                border-image: ${getRarityColor(
                  adventureHistory.highest[itemKey].rarity
                )};
                border-image-slice: 1;
              `}>
              <Center>
                <Image src={imgURL} boxSize="40px" />
              </Center>
            </Center>
          </PopoverTrigger>
          <PopoverContent
            border={`2px solid black`}
            bg={`${colorMode === "light" ? "beige" : "#1a202c"}`}
            width="270px">
            <PopoverArrow border={`2px solid black`} />
            <PopoverHeader>
              <Text as="b" fontSize={"sm"}>
                {itemSets[setIdx].setName} : {itemSlots[slotIdx].slotName}
              </Text>
            </PopoverHeader>
            <PopoverBody overflowY="auto" maxHeight="200px">
              <Flex direction="column" gap={1}>
                {isAdventure ? (
                  <>
                    {Object.entries(adventureHistory.characters).map(
                      ([characterName, characterHistory], characterIdx) =>
                        characterHistory.histories[itemKey] && (
                          <Flex
                            key={`characterName${characterIdx}`}
                            flexDirection={"column"}
                            mt={characterIdx == 0 ? 0 : 2}>
                            <CharacterNameBadge
                              str={characterName}
                              key={`characterNameBadge${characterIdx}`}
                            />
                            <Flex direction="column" gap={1} p={1}>
                              {itemKey in characterHistory.histories &&
                                characterHistory.histories[itemKey].map(
                                  (historyItem, historyItemIdx) => (
                                    <Flex
                                      key={`itemHistory${characterIdx}-${historyItemIdx}`}
                                      gap={2}>
                                      <ItemRarityBadge
                                        itemRarity={historyItem.item.rarity}
                                      />
                                      <ItemObtainBadge
                                        obtainCode={historyItem.obtainCode}
                                      />
                                      <DateBadge date={historyItem.date} />
                                    </Flex>
                                  )
                                )}
                            </Flex>
                          </Flex>
                        )
                    )}
                  </>
                ) : (
                  Object.entries(adventureHistory.characters).map(
                    ([_, characterHistory], idx) => (
                      <Flex
                        key={`itemHistory${setIdx}-${slotIdx}`}
                        p={1}
                        borderRadius="lg"
                        gap={2}
                        direction="column">
                        {characterHistory.histories[itemKey].map(
                          (historyItem, historyItemIdx) => (
                            <Flex
                              key={`historyItem-${idx}-${historyItemIdx}`}
                              gap={2}>
                              <ItemRarityBadge
                                itemRarity={historyItem.item.rarity}
                              />
                              <ItemObtainBadge
                                obtainCode={historyItem.obtainCode}
                              />
                              <DateBadge date={historyItem.date} />
                            </Flex>
                          )
                        )}
                      </Flex>
                    )
                  )
                )}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </Center>
  );
};
