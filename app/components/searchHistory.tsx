import {
  Box,
  Center,
  ListItem,
  Text,
  UnorderedList,
  Grid,
  GridItem,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { ServerBadge } from "./badges";

interface SearchHistoryProps {
  searchHistory: SearchHistory[];
  setSearchHistory: React.Dispatch<React.SetStateAction<SearchHistory[]>>;
  setSearchInfo: React.Dispatch<React.SetStateAction<SearchHistory>>;
}

export default function SearchHistory({
  searchHistory,
  setSearchHistory,
  setSearchInfo,
}: SearchHistoryProps) {
  useEffect(() => {
    // localStorage에서 검색 기록 불러오기
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  function handleDelete(idx: number) {
    const updatedHistory = searchHistory.filter((_, i) => i !== idx);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  }

  function handleHistoryClick(idx: number) {
    console.log("이거 클릭함 : ", searchHistory[idx]);
    setSearchInfo(searchHistory[idx]);
  }

  return (
    <Center>
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {searchHistory.map((history, idx) => (
          <GridItem key={`searchHistory${idx}`}>
            <Center
              p={1}
              width={"200px"}
              border={`1px solid #999999`}
              justifyContent="space-between">
              <Center
                p={1}
                gap={1}
                onClick={() => handleHistoryClick(idx)}
                cursor="pointer">
                <ServerBadge serverId={history.serverId} />
                <Text> {history.characterName}</Text>
              </Center>
              <Center p={2} onClick={() => handleDelete(idx)} cursor="pointer">
                <CloseIcon boxSize={3} />
              </Center>
            </Center>
          </GridItem>
        ))}
      </Grid>
    </Center>
  );
}
