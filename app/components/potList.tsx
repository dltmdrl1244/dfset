import {
  Box,
  ListItem,
  UnorderedList,
  Text,
  Image,
  Flex,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { ItemRarityBadge } from "./badges";

interface PotListProps {
  potList: EquipmentType[];
}

export const PotList: React.FC<PotListProps> = ({ potList }) => {
  return (
    <Box
      p={0}
      borderWidth="1px"
      borderRadius="md"
      borderColor="dimgray"
      width="400px"
      boxShadow="base">
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton bg="beige" p={3}>
            <Box as="span" flex="1" textAlign="left">
              <Text as="b" size="2xl">
                항아리깡 기록
              </Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel overflowY="auto">
            <UnorderedList p={1} styleType={"none"} height="200px">
              <Flex direction={"column"} gap={3}>
                {potList.map((item: EquipmentType, idx) => (
                  <ListItem key={`potList${idx}`} ml={-5}>
                    <Flex gap={2} alignItems="center">
                      <Image
                        src={`https://img-api.neople.co.kr/df/items/${item.itemId}`}
                      />
                      <Center>
                        <Text mr={2}>{item.itemName}</Text>
                        <ItemRarityBadge itemRarity={item.rarity} />
                      </Center>
                    </Flex>
                  </ListItem>
                ))}
              </Flex>
            </UnorderedList>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
