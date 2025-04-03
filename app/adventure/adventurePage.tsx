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
import { useCharacter } from "../context/characterContext";

export default function AdventurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [adventureName, setAdventureName] = useState<string>("");
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [tempAdventureName, setTempAdventureName] = useState<string>("");
  const [characterLoaded, setCharacterLoaded] = useState<boolean | null>(null);

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

    const aName = searchParams.get("adventure");
    if (!aName) {
      setAdventureName("");
      setCharacterList([]);
      setTempAdventureName("");
      setCharacterLoaded(null);
    } else {
      setAdventureName(aName);
      setTempAdventureName(aName);
    }
  }, [searchParams]);

  useEffect(() => {
    if (adventureName) {
      loadAdventureInfo(adventureName);
    }
  }, [adventureName]);

  async function loadAdventureInfo(aName: string) {
    setCharacterLoaded(false);
    const params = new URLSearchParams();
    params.set("adventureName", aName);

    const tempCharacterList: Character[] = [];

    try {
      const response = await fetch(`api/query/adventure?${params.toString()}`);
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        data.data.map((character: CharacterResponse) => {
          const newCharacter: Character = {
            serverId: character.server_id,
            characterId: character.character_id,
            characterName: character.character_name,
            adventureName: character.adventure_name,
            jobName: character.job_name,
          };
          tempCharacterList.push(newCharacter);
        });
        setCharacterList(tempCharacterList);
        setCharacterLoaded(true);
      }
    } catch (error) {
      console.error("error ,", error);
    }
  }

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
        {characterLoaded !== null ? (
          characterLoaded === true ? (
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
                <Center mt={10}>
                  <Text>
                    {adventureName} 모험단의 캐릭터를 찾을 수 없습니다.{" "}
                    <br></br>한 번이라도 검색된 캐릭터만 표시됩니다.
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
            <Flex gap={4} mt={10}>
              <Spinner /> <Text>모험단 정보를 가져오는 중...</Text>
            </Flex>
          )
        ) : (
          <></>
        )}
      </VStack>
    </BaseLayout>
  );
}
