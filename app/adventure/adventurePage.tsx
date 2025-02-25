"use client";

import {
  FormControl,
  Input,
  Center,
  Button,
  HStack,
  VStack,
  Grid,
  GridItem,
  Spinner,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CharacterAdventureBox from "../components/characterAdventureBox";
import BaseLayout from "../components/baseLayout";
import { AdventureAccordion } from "../components/adventureAccordion";

export default function AdventurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [adventureName, setAdventureName] = useState<string>("");
  const [characterBasicList, setCharacterBasicList] = useState<
    SimpleCharacter[]
  >([]);
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [tempAdventureName, setTempAdventureName] = useState<string>("");
  const [characterLoaded, setCharacterLoaded] = useState<boolean>(false);

  const [adventureItemHistory, setAdventureItemHistory] =
    useState<TestAdventureCharacterHistory | null>(null);

  useEffect(() => {
    const aName = searchParams.get("adventure");
    if (!aName) {
      setAdventureName("");
    } else {
      setAdventureName(aName);
      setTempAdventureName(aName);
    }
  }, []);

  useEffect(() => {
    if (adventureName) {
      loadAdventureInfo(adventureName);
    }
  }, [adventureName]);

  useEffect(() => {
    if (characterBasicList.length <= 0) {
      return;
    }
    getCharacterBasicInfo();
  }, [characterBasicList]);

  useEffect(() => {
    if (characterList.length <= 0) {
      return;
    }

    testMakeAdventureItemHistory();
  }, [characterList]);

  async function loadAdventureInfo(aName: string) {
    const params = new URLSearchParams();
    params.set("adventureName", aName);

    const tempSimpleCharacterList: SimpleCharacter[] = [];

    try {
      const response = await fetch(`api/query/adventure?${params.toString()}`);
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        data.data.map((character: SimpleCharacterResponse) => {
          const newCharacter: SimpleCharacter = {
            serverId: character.server_id,
            characterId: character.character_id,
            characterName: character.character_name,
            adventureName: character.adventure_name,
          };
          tempSimpleCharacterList.push(newCharacter);
        });
        setCharacterBasicList(tempSimpleCharacterList);
      } else {
        setCharacterLoaded(true);
      }
    } catch (error) {
      console.error("error ,", error);
    }
  }

  const getCharacterBasicInfo = async () => {
    if (characterBasicList.length <= 0) {
      return;
    }
    const tempCharacterList: Character[] = [];
    for (const character of characterBasicList) {
      const param = new URLSearchParams();
      param.set("characterId", character.characterId);
      try {
        const response = await fetch(`api/query/character?${param.toString()}`);
        const data = await response.json();
        if (data.data) {
          const newCharacter: Character = {
            serverId: data.data.server_id,
            serverName: data.data.server_name,
            characterId: data.data.character_id,
            characterName: data.data.character_name,
            adventureName: data.data.adventure_name,
            jobName: data.data.job_name,
          };
          tempCharacterList.push(newCharacter);
        }
      } catch (error) {
        console.error(error);
        continue;
      }
    }
    setCharacterList(tempCharacterList);
    setCharacterLoaded(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (tempAdventureName !== adventureName) {
      router.push(`/adventure?adventure=${tempAdventureName}`);
      setCharacterList([]);
      setAdventureName(tempAdventureName);
      setCharacterLoaded(false);
    }
  };

  const handleAdventureNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTempAdventureName(event.target.value);
  };

  async function testMakeAdventureItemHistory() {
    if (characterList.length <= 0) {
      return;
    }
    const tempAdventureItemHistory: TestAdventureCharacterHistory = {
      highest: {},
      characters: {},
    };

    for (const character of characterList) {
      const response = await fetch(
        `api/query/testHistory?characterId=${character.characterId}`
      );
      const data = await response.json();

      if (data.data) {
        // console.log(data.data[0]);
        const characterHistory: TestCharacterHistory =
          data.data[0].history_dict;

        tempAdventureItemHistory.characters[character.characterName] =
          characterHistory;

        Object.entries(characterHistory.highest).map(([key, highestInfo]) => {
          const itemKey = Number(key);
          if (
            !(itemKey in tempAdventureItemHistory.highest) ||
            highestInfo.rarity >
              tempAdventureItemHistory.highest[itemKey].rarity
          ) {
            tempAdventureItemHistory.highest[itemKey] = highestInfo;
          }
        });
      }
    }
    setAdventureItemHistory(tempAdventureItemHistory);
  }

  return (
    <BaseLayout>
      <VStack>
        <Center mt={5}>
          <form onSubmit={handleSubmit}>
            <HStack height="50px">
              <FormControl w="250px" height="100%">
                <Input
                  type="text"
                  id="nickname"
                  value={tempAdventureName}
                  onChange={handleAdventureNameChange}
                  height="100%"
                  borderColor="#999999"
                  placeholder="모험단명 입력"
                  _hover={{ borderColor: "black" }}
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                size="md"
                height="100%"
                mr={2}>
                조회
              </Button>
            </HStack>
          </form>
        </Center>
        {characterLoaded ? (
          <Box>
            {characterList.length > 0 ? (
              <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={5}>
                {characterList.map((character, idx) => (
                  <GridItem key={`advCharacter${idx}`}>
                    <CharacterAdventureBox character={character} />
                  </GridItem>
                ))}
              </Grid>
            ) : (
              <Center>
                <Text>
                  {adventureName} 모험단의 캐릭터를 찾을 수 없습니다. <br></br>
                  한 번이라도 검색된 캐릭터만 표시됩니다.
                </Text>
              </Center>
            )}
            {characterList.length > 0 && (
              <Center mt={5} mb={5}>
                <AdventureAccordion characterList={characterList} />
              </Center>
            )}
          </Box>
        ) : (
          <Flex gap={4}>
            <Spinner /> <Text>모험단 정보를 가져오는 중...</Text>
          </Flex>
        )}
      </VStack>
    </BaseLayout>
  );
}
