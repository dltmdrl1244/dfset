"use client";

import { useEffect, useState } from "react";
import { serverOptions, getServerName } from "../context/serverOptions";
import {
  FormControl,
  Input,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Center,
  Text,
  useToast,
} from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { useColorMode } from "@chakra-ui/react";

interface FormProps {
  setSearchResult: React.Dispatch<React.SetStateAction<Character[]>>;
  setSearchHistory: React.Dispatch<React.SetStateAction<SearchHistory[]>>;
  searchHistory: SearchHistory[];
  searchInfo: SearchHistory;
  setSearchInfo: React.Dispatch<React.SetStateAction<SearchHistory>>;
  setIsSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CharacterResponse {
  serverId: string;
  characterName: string;
  characterId: string;
  jobGrowName: string;
  adventureName: string;
}

export default function Form({
  setSearchResult,
  setSearchHistory,
  searchHistory,
  searchInfo,
  setSearchInfo,
  setIsSearched,
}: FormProps) {
  const [serverId, setServerId] = useState("all");
  const [characterName, setCharacterName] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    if (searchInfo.characterName === "" && searchInfo.serverId === "") {
      return;
    }
    searchCharacters();
  }, [searchInfo]);

  const searchCharacters = async () => {
    if (searchInfo.characterName === "" && searchInfo.serverId === "") {
      return;
    }

    if (searchInfo.serverId === "adventure") {
      const newHistory: SearchHistory = {
        characterName: searchInfo.characterName,
        serverId: searchInfo.serverId,
      };
      const isDuplicate = searchHistory.find(
        (item) =>
          item.characterName === newHistory.characterName &&
          item.serverId === newHistory.serverId
      );
      if (!isDuplicate) {
        const updatedHistory = [newHistory, ...searchHistory.slice(0, 5)];
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      }
      const param = new URLSearchParams();
      param.set("adventure", searchInfo.characterName);
      // router.push(`/adventure?${param}`);
      redirect(`/adventure?${param}`);
    }

    const params = new URLSearchParams();
    params.set("serverId", searchInfo.serverId);
    params.set("characterName", searchInfo.characterName);

    try {
      const response = await fetch(`/api/characterName?${params.toString()}`);
      const data = await response.json();

      if (response.status === 503 && !response.ok) {
        console.log("던파 서버 점검 중");
        // setSearchResult([]);
        toast({
          title: "서버 점검중",
          description: "모험단 검색만 가능합니다.",
          status: "warning",
          isClosable: true,
        });
        return;
      }

      setIsSearched(true);
      const characters: Character[] = data.data.rows.map(
        (item: CharacterResponse): Character => ({
          serverId: item.serverId,
          characterName: item.characterName,
          characterId: item.characterId,
          jobName: item.jobGrowName,
          adventureName: item.adventureName,
        })
      );
      setSearchResult(characters);
      const newHistory: SearchHistory = {
        characterName: searchInfo.characterName,
        serverId: searchInfo.serverId,
      };
      const isDuplicate = searchHistory.find(
        (item) =>
          item.characterName === newHistory.characterName &&
          item.serverId === newHistory.serverId
      );
      if (!isDuplicate) {
        const updatedHistory = [newHistory, ...searchHistory.slice(0, 5)];
        setSearchHistory(updatedHistory);
        localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error("Error searching characters:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSearchInfo({
      serverId: serverId,
      characterName: characterName,
    });
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(event.target.value);
  };

  const containerHeight = "50px";

  return (
    <Center p={4} flexDirection="column">
      <form onSubmit={handleSubmit}>
        <HStack height={containerHeight} gap={4} alignItems="center">
          <FormControl w="fit-content" height="100%">
            <Menu>
              <MenuButton
                as={Button}
                height="100%"
                width="100px"
                border="1px solid #999999"
                bgColor={`${colorMode === "light" ? "white" : "#1a202c"}`}
                _hover={{ borderColor: "black" }}>
                {serverOptions.find((option) => option.serverId === serverId)
                  ?.serverName || "서버 선택"}
              </MenuButton>
              <MenuList height="100%">
                {serverOptions.map((option) => (
                  <MenuItem
                    key={option.serverId}
                    onClick={() => setServerId(option.serverId)}>
                    <Text>{option.serverName}</Text>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </FormControl>

          <FormControl w="250px" height="100%">
            <Input
              type="text"
              id="nickname"
              value={characterName}
              onChange={handleNicknameChange}
              height="100%"
              borderColor="#999999" // 테두리 색상 변경
              placeholder="캐릭터명 입력"
              _hover={{ borderColor: "black" }}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue" size="md" height="100%">
            조회
          </Button>
        </HStack>
      </form>
    </Center>
  );
}
