"use client";

import Title from "./components/title";
import Form from "./components/form";
import SearchResult from "./components/characterSearchResult";
import { useState } from "react";
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

export default function Home() {
  const [searchResult, setSearchResult] = useState<Character[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [searchInfo, setSearchInfo] = useState<SearchHistory>({
    serverId: "",
    characterName: "",
  });

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
        <Box>
          <TextBadge str="2025.03.17" color="gray" />
          <Text fontSize="sm" mt={2}>
            현재 모험단 전체 테이블 조회가 불가능합니다. <br></br>
            오류 수정 중입니다. 이용에 불편을 드려 죄송합니다.
          </Text>
        </Box>
      </HStack>
    </BaseLayout>
  );
}
