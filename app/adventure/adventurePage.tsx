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
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    router.push(`/adventure?adventure=${tempAdventureName}`);
    setCharacterList([]);
    setAdventureName(tempAdventureName);
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
        <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={5}>
          {characterList.map((character, idx) => (
            <GridItem key={`advCharacter${idx}`}>
              <CharacterAdventureBox character={character} />
            </GridItem>
          ))}
        </Grid>
        {characterList.length > 0 && (
          <Center mt={5}>
            <AdventureAccordion adventureName={adventureName} />
          </Center>
        )}
      </VStack>
    </BaseLayout>
  );
}
