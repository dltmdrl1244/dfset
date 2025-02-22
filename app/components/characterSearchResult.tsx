import { Flex } from "@chakra-ui/react";
import CharacterBox from "./characterBox";

interface Props {
  searchResult: Character[];
}

export default function SearchResult({ searchResult }: Props) {
  return (
    <Flex wrap="wrap" justify="center" gap={4} mt={8} mb={20}>
      {searchResult.map((character) => (
        <CharacterBox key={character.characterId} character={character} />
      ))}
    </Flex>
  );
}
