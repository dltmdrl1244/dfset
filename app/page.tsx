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
        {isSearched && <SearchResult searchResult={searchResult} />}
      </VStack>
      <HStack
        width="500px"
        border="1px solid dimgray"
        p={4}
        borderRadius="md"
        gap={3}
        mt={10}
        mb={10}>
        <InfoIcon />
        <VStack>
          <Text fontSize={"sm"}>
            2025-02-26 17:30부로 DB 수정 작업이 진행되었습니다. <br></br>
            캐릭터 DB 구조가 변경되어 새로 검색을 부탁드립니다. <br></br>
            이용에 불편을 드려 죄송합니다.<br></br>
          </Text>
        </VStack>
      </HStack>
    </BaseLayout>
  );
}
