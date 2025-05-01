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
      <HStack
        // width="500px"
        border="1px solid dimgray"
        p={4}
        borderRadius="md"
        gap={3}
        mt={10}
        mb={10}>
        <InfoIcon />
        <Box>던파셋이 2025/05/03(토)에 서비스 종료 예정입니다. 감사합니다.</Box>
      </HStack>
      <SoulPrice />
    </BaseLayout>
  );
}
