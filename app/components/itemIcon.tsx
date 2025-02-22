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
} from "@chakra-ui/react";

import {
  ItemRarityBadge,
  ItemObtainCodeBadge,
  CharacterNameBadge,
} from "../components/badges";
import { itemSets } from "../context/setIds";
import { itemSlots } from "../context/slotIds";

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

interface ItemIconProps {
  itemId?: string;
  histories?: TimelineInfo[];
  setIdx: number;
  slotIdx: number;
  rarity?: number;
  historyItem?: HistoryItem;
  isAdventure: boolean;
}

function getRarityColor(rarity: number) {
  switch (rarity) {
    case 2:
      return "#28D931";
    case 1:
      return "#FFB400";
    case 0:
      return "#FF7800";
    default:
      return "";
  }
}

export const ItemIcon: React.FC<ItemIconProps> = ({
  setIdx,
  slotIdx,
  historyItem,
  isAdventure,
}) => {
  const imgURL =
    historyItem === undefined
      ? `/set115/1.png`
      : `https://img-api.neople.co.kr/df/items/${historyItem?.highest.itemId}`;

  return (
    <Center>
      {historyItem?.highest.itemId && (
        <Popover>
          <PopoverTrigger>
            <Center
              width="48px"
              height="48px"
              border={`3px solid ${getRarityColor(
                historyItem?.highest.rarity
              )}`}>
              <Center>
                {historyItem?.highest.itemId && (
                  <Image src={imgURL} boxSize="44px" />
                )}
              </Center>
            </Center>
          </PopoverTrigger>
          <PopoverContent
            border={`2px solid black`}
            bgColor={"beige"}
            width="270px">
            <PopoverArrow border={`2px solid black`} />
            <PopoverHeader>
              <Text as="b" fontSize={"sm"}>
                {itemSets[setIdx].setName}: {itemSlots[slotIdx].slotName}
              </Text>
            </PopoverHeader>
            <PopoverBody overflowY="auto" maxHeight="200px">
              <Flex direction="column" gap={1}>
                {isAdventure
                  ? historyItem.histories.map((history, characterIdx) => (
                      <Flex
                        key={`characterName${characterIdx}`}
                        flexDirection={"column"}
                        mt={characterIdx == 0 ? 0 : 2}>
                        <CharacterNameBadge
                          str={history.characterName}
                          key={`characterNameBadge${characterIdx}`}
                        />
                        <UnorderedList
                          key={`unorderedList${characterIdx}`}
                          styleType={"none"}>
                          {history.timelines.map((timeline, timelineIdx) => (
                            <ListItem
                              key={`itemHistory${characterIdx}-${timelineIdx}`}
                              ml={-5}>
                              <HStack p={1} borderRadius="lg" gap={2}>
                                <ItemRarityBadge
                                  itemRarity={timeline.item.rarity}
                                />

                                <ItemObtainBadge
                                  obtainCode={timeline.obtainCode}
                                />
                                <DateBadge date={timeline.date} />
                              </HStack>
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </Flex>
                    ))
                  : historyItem.histories.map((history, characterIdx) =>
                      history.timelines.map((timeline, timelineIdx) => (
                        <HStack
                          key={`ItemHistory${setIdx}-${slotIdx}-${characterIdx}-${timelineIdx}`}
                          p={1}
                          borderRadius="lg"
                          gap={2}>
                          <ItemRarityBadge itemRarity={timeline.item.rarity} />{" "}
                          |
                          <ItemObtainBadge obtainCode={timeline.obtainCode} />
                          <DateBadge date={timeline.date} />
                          {isAdventure && (
                            <CharacterNameBadge str={history.characterName} />
                          )}
                        </HStack>
                      ))
                    )}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      )}
    </Center>
  );
};
