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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import {
  ItemRarityBadge,
  ItemObtainCodeBadge,
  CharacterNameBadge,
} from "../components/badges";
import { itemSets } from "../context/setIds";
import { itemSlots } from "../context/slotIds";
import { useColorMode } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

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
    case 5160:
      return <ItemObtainCodeBadge str={"초월받음"} />;
    case 5161:
      return <ItemObtainCodeBadge str={"초월해줌"} />;
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
  character?: Character;
  onOpen?: () => void;
  setBeyondItem: Dispatch<SetStateAction<BeyondItemInfo>>;
}

export const ItemIcon: React.FC<ItemIconProps> = ({
  setIdx,
  slotIdx,
  isAdventure,
  adventureHistory,
  character,
  onOpen,
  setBeyondItem,
}) => {
  const itemKey = setIdx * itemSets.length + slotIdx;

  const imgURL =
    itemKey in adventureHistory.highest &&
    adventureHistory.highest[itemKey].length > 0
      ? `https://img-api.neople.co.kr/df/items/${
          adventureHistory.highest[itemKey][
            adventureHistory.highest[itemKey].length - 1
          ].itemId
        }`
      : `/set115/1.png`;
  const { colorMode, toggleColorMode } = useColorMode();

  function checkLegendaryValid() {
    for (const val of Object.values(adventureHistory.characters)) {
      for (const historyItem of val.histories[itemKey]) {
        if (historyItem.item.rarity == 0) {
          const item: Equipment = historyItem.item;
          setBeyondItem({
            id: item.itemId,
            rarity: item.rarity,
            slotIdx: item.slotIdx,
            setIdx: item.setIdx,
          });
          return true;
        }
      }
    }
    return false;
  }

  function legendaryBeyondButtonClicked() {
    if (checkLegendaryValid() && onOpen) {
      onOpen();
    }
  }

  return (
    <Center>
      {itemKey in adventureHistory.highest &&
        adventureHistory.highest[itemKey].length > 0 && (
          <Popover>
            <PopoverTrigger>
              <Center
                width="48px"
                height="48px"
                border="4px solid transparent"
                css={`
                  border-image: ${getRarityColor(
                    adventureHistory.highest[itemKey][
                      adventureHistory.highest[itemKey].length - 1
                    ].rarity
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
                    // 모험단 페이지
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
                    // 캐릭터 페이지
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
                          {/* <Button
                            bgColor={"#b25400"}
                            color="white"
                            onClick={legendaryBeyondButtonClicked}
                            _hover={{ bgColor: "#6f3400" }}>
                            레전더리 초월처리
                          </Button> */}
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
