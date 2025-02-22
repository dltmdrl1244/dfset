import { Box, Text, Image } from "@chakra-ui/react";
import Link from "next/link";

export default function CharacterBox(props: { character: Character }) {
  // 파라미터 타입 지정
  const { character } = props; // props 객체 구조분해할당
  const characterImageUrl = `https://img-api.neople.co.kr/df/servers/${character.serverId}/characters/${character.characterId}?zoom=1`;

  return (
    <Link
      href={{
        pathname: `character`,
        query: {
          sId: character.serverId,
          cId: character.characterId,
        },
      }}>
      <Box p={4} borderWidth="1px" borderRadius="md" boxShadow="base">
        <Image src={characterImageUrl} alt={character.characterName} />
        <Text>
          {character.characterName} ({character.serverName})
        </Text>
        <Text>{character.jobName}</Text>
      </Box>
    </Link>
  );
}
