"use client";

import Title from "./components/title";
import Form from "./components/form";
import SearchResult from "./components/characterSearchResult";
import { useState } from "react";
import {
  HStack,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import BaseLayout from "./components/baseLayout";
import SearchHistory from "./components/searchHistory";
import { InfoIcon } from "@chakra-ui/icons";

export default function Home() {
  const [searchResult, setSearchResult] = useState<Character[]>([]);
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
        />
        <SearchHistory
          searchHistory={searchHistory}
          setSearchHistory={setSearchHistory}
          setSearchInfo={setSearchInfo}
        />
      </VStack>
      <SearchResult searchResult={searchResult} />

      <HStack
        width="500px"
        border="1px solid dimgray"
        p={4}
        borderRadius="md"
        gap={3}>
        <InfoIcon />
        <VStack>
          <Text fontSize={"sm"}>
            2025-02-26 01:00부로 DB 구조가 업데이트되었습니다. <br></br>
            캐릭터별로 검색을 새로 해주셔야 모험단 전체 테이블에 정보가
            반영됩니다. <br></br>
            이용에 불편을 드려 죄송합니다.
          </Text>
        </VStack>
      </HStack>
    </BaseLayout>
  );
}
