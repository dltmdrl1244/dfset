import { Button, Center, HStack, Image } from "@chakra-ui/react";
import Link from "next/link";

export default function Footer() {
  return (
    <Center width="100vw" borderTop={`1px solid #999999`} bg="#e9e9e9" pt={1}>
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
          <Image src="/poweredby.png" />
        </HStack>
      </Center>
    </Center>
  );
}
