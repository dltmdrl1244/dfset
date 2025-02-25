"use client";

import { Box } from "@chakra-ui/react";
import { adventureInfo } from "@/public/adventure";
import { getServerName } from "../context/serverOptions";

interface TempCharacter {
  serverId: string;
  serverName: string;
  characterId: string;
  characterName: string;
  adventureName: string;
  jobName: string;
  createTime: string;
}

async function testfunc() {
  for (const character of adventureInfo) {
    const response = await fetch(
      `api/query/testcharacter?characterId=${character.character_id}`
    );
    const data = await response.json();

    if (data.message === "OK") {
      const newCharacter: TempCharacter = {
        characterId: character.character_id,
        characterName: character.character_name,
        jobName: data.data[0].job_name,
        serverId: character.server_id,
        serverName: getServerName(character.server_id),
        adventureName: character.adventure_name,
        createTime: character.create_time,
      };

      console.log(newCharacter);

      const response = await fetch("api/query/testcharacter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: newCharacter,
        }),
      });
      const aaa = await response.json();
      console.log(aaa);
    }
  }
}

export default function Home() {
  //   testfunc();
  return <Box>test page</Box>;
}
