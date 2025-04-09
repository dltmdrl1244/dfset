"use client";

import Title from "./components/title";
import Form from "./components/form";
import SearchResult from "./components/characterSearchResult";
import { useEffect, useState } from "react";
import {
  Box,
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import BaseLayout from "./components/baseLayout";
import SearchHistory from "./components/searchHistory";
import { InfoIcon } from "@chakra-ui/icons";
import { TextBadge } from "./components/badges";
import { useCharacter } from "./context/characterContext";
import { SoulPrice } from "./components/soulPrice";

export default function Home() {
  const [searchResult, setSearchResult] = useState<Character[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [searchInfo, setSearchInfo] = useState<SearchHistory>({
    serverId: "",
    characterName: "",
  });

  const {
    characterInfo,
    setCharacterInfo,
    updateCharacter,
    characterHistoryInfo,
    setCharacterHistoryInfo,
  } = useCharacter();

  useEffect(() => {
    setCharacterInfo(null);
    setCharacterHistoryInfo(null);
  }, []);

  return (
    <BaseLayout>
      <VStack width="450px" minWidth="450px">
        <Title />
        <Form
          setSearchResult={setSearchResult}
          searchHistory={searchHistory}
          setSearchHistory={setSearchHistory}
          searchInfo={searchInfo}
          setSearchInfo={setSearchInfo}
          setIsSearched={setIsSearched}
        />
        {!isSearched && (
          <SearchHistory
            searchHistory={searchHistory}
            setSearchHistory={setSearchHistory}
            setSearchInfo={setSearchInfo}
          />
        )}
      </VStack>
      {isSearched && <SearchResult searchResult={searchResult} />}
      <SoulPrice />
      {/* <HStack
        // width="500px"
        border="1px solid dimgray"
        p={4}
        borderRadius="md"
        gap={3}
        mt={10}
        mb={10}>
        <InfoIcon />
        <Box>
          <TextBadge str="2025.04.03" color="gray" />
          <Text fontSize="sm" mt={2}>
            캐릭터의 '최근 업데이트' 시간이 보이지 않는다면 갱신을 부탁드립니다.{" "}
            <br></br>
            모험단 일괄 갱신 기능이 추가되었습니다.
          </Text>
        </Box>
      </HStack> */}
    </BaseLayout>
  );
}
