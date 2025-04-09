"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  ListItem,
  Center,
  Image,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface SoulItem {
  itemName: string;
  itemId: string;
  itemColor: string;
  count: number;
}

const soulItems: SoulItem[] = [
  {
    itemName: "레어 소울 결정",
    itemId: "c4816db14d145416921f0210063cb014",
    itemColor: "linear-gradient(180deg, #B36BFF, #B36BFF)",
    count: 2,
  },
  {
    itemName: "유니크 소울 결정",
    itemId: "0620c107b1aae1f3a6cf9eee3aaf43d7",
    itemColor: "linear-gradient(180deg, #FF00FF, #FF00FF)",
    count: 4,
  },
  {
    itemName: "레전더리 소울 결정",
    itemId: "c6947ff630cc59aebdcbabfb449258d1",
    itemColor: "linear-gradient(180deg, #b25400, #b25400)",
    count: 30,
  },
  {
    itemName: "에픽 소울 결정",
    itemId: "c7d845c65ab9dbcff6e55dc910fbea87",
    itemColor: "linear-gradient(180deg, #FFB400, #FFB400)",
    count: 90,
  },
  {
    itemName: "태초 소울 결정",
    itemId: "d288ebf406a65f4ec23d1f9c33227888",
    itemColor: "linear-gradient(180deg, #28d931, #33acea)", // bgImage
    count: 1000,
  },
];

export const SoulPrice = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [soulPrices, setSoulPrices] = useState([0, 0, 0, 0, 0]);
  const [cheapestPrice, setCheapestPrice] = useState(0);

  useEffect(() => {
    const price = localStorage.getItem("price");
    if (price) {
      setSoulPrices(JSON.parse(price));
    }

    const lastUpdate = localStorage.getItem("lastUpdate");
    if (!lastUpdate || dayjs().diff(lastUpdate, "minutes") > 5) {
      updatePrice();
    }
  }, []);

  useEffect(() => {
    let tempVal = 99999999;
    let tempIdx = -1;
    soulPrices.forEach((item, index) => {
      if (item == 0) {
        return;
      }
      if (item / soulItems[index].count < tempVal) {
        tempVal = item / soulItems[index].count;
        tempIdx = index;
      }
    });

    setCheapestPrice(tempVal * 22);
  }, [soulPrices]);

  async function updatePrice() {
    let tempPrices = [];
    for (const soul of soulItems) {
      const params = new URLSearchParams();
      params.set("itemId", soul.itemId);
      params.set("itemName", soul.itemName);

      try {
        const response = await fetch(`api/auction?${params.toString()}`);
        const data = await response.json();

        if (data.data) {
          tempPrices.push(data.data.rows[0].averagePrice);
        }
      } catch (e) {
        console.error(e);
      }
    }

    localStorage.setItem("lastUpdate", dayjs().toISOString());
    localStorage.setItem("price", JSON.stringify(tempPrices));
    const text = localStorage.getItem("price");
    if (text) {
      const aaa = JSON.parse(text);
      setSoulPrices(aaa);
    }
  }

  return (
    <VStack
      p={0}
      borderWidth="1px"
      borderRadius="md"
      borderColor="dimgray"
      width="500px"
      boxShadow="base"
      mb={10}>
      <Accordion allowToggle width="100%">
        <AccordionItem>
          <AccordionButton
            bg={`${colorMode === "light" ? "beige" : "#1a202c"}`}
            p={3}>
            <Flex alignItems="center" justifyContent={"space-between"}>
              <Text as="b" size="2xl">
                소울 가격 보기
              </Text>
              <AccordionIcon />
            </Flex>
          </AccordionButton>
          <AccordionPanel overflowY="auto">
            <Text>
              {dayjs(localStorage.getItem("lastUpdate")).format("MM/DD HH:mm")}{" "}
              기준
            </Text>
            <Text>
              종말의 숭배자 한 판에 {cheapestPrice.toLocaleString()} 골드
            </Text>
            <Flex direction={"column"} gap={3} mt={2}>
              {soulItems.map((soul, index) => (
                <Flex
                  border={`2px solid transparent`}
                  borderRadius="md"
                  css={`
                    border-image: ${soul.itemColor};
                    border-image-slice: 1;
                  `}
                  p={2}
                  alignItems={"center"}
                  gap={3}
                  justifyContent={"space-between"}
                  key={`soulPriceInfo${index}`}>
                  <Flex alignItems={"center"} gap={3}>
                    <Image
                      src={`https://img-api.neople.co.kr/df/items/${soul.itemId}`}
                      boxSize={"32px"}
                    />

                    <Text as="b">{soul.itemName}</Text>
                  </Flex>

                  <Flex
                    direction={"column"}
                    alignItems={"center"}
                    gap={1}
                    justifyContent={"start"}>
                    <Flex alignItems={"center"} gap={2} alignContent={"center"}>
                      <Badge bgColor={"black"} variant="solid" fontSize="sm">
                        가격
                      </Badge>
                      <Box minWidth={"80px"}>
                        <Text>{soulPrices[index].toLocaleString()}</Text>
                      </Box>
                    </Flex>

                    <Flex alignItems={"center"} gap={2} alignContent={"center"}>
                      <Badge bgColor={"#7315ae"} variant="solid" fontSize="sm">
                        계시
                      </Badge>
                      <Box minWidth={"80px"}>
                        <Text>
                          {Math.floor(
                            soulPrices[index] / soul.count
                          ).toLocaleString()}
                        </Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};
