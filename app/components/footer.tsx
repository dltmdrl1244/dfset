import { Button, Center, HStack, Image } from "@chakra-ui/react";
import Link from "next/link";
import { useColorMode } from "@chakra-ui/react";

export default function Footer() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Center
      width="100%"
      minWidth="1000px"
      borderTop={`1px solid #999999`}
      bg={`${colorMode === "light" ? "#e9e9e9" : "#1a202c"}`}
      pt={1}>
      <Center
        height={"60px"}
        width="1000px"
        minWidth="1000px"
        flexDirection={"column"}>
        <HStack>
          <Link href="https://open.kakao.com/o/spmxgxhh" target="blank">
            <Button colorScheme="black" variant="ghost">
              문의하기
            </Button>
          </Link>
          <Link href="https://developers.neople.co.kr" target="blank">
            {/* <Image src="/poweredby.png" /> */}
          </Link>
        </HStack>
      </Center>
    </Center>
  );
}
