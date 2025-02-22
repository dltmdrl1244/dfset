"use client";

import Title from "./components/title";
import Form from "./components/form";
import SearchResult from "./components/characterSearchResult";
import { useState } from "react";
import { VStack } from "@chakra-ui/react";
import BaseLayout from "./components/baseLayout";
import SearchHistory from "./components/searchHistory";

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
    </BaseLayout>
  );
}
