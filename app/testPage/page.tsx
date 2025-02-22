"use client";

import { Box } from "@chakra-ui/react";

export default function Page() {
  async function testFunc() {
    console.log("testFunc");

    const response = await fetch(`api/testdb`);
    console.log(response);
    const data = await response.json();
    console.log(data);
  }

  testFunc();

  return <Box>this is test page</Box>;
}
