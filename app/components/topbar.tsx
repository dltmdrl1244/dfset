import {
  Center,
  Button,
  Spacer,
  Flex,
  Box,
  HStack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useColorMode } from "@chakra-ui/react";
import { DarkmodeButton } from "./darkmodeButton";

interface TopBarButtonProps {
  buttonString: string;
  url: string;
}

const TopBarButton: React.FC<TopBarButtonProps> = ({ buttonString, url }) => {
  return (
    <Center height="60px" width="100px" borderRadius="5%">
      <Link href={url}>
        <Button
          colorScheme="gray"
          height="60px"
          width="100px"
          variant={"ghost"}
          _hover={{ bgColor: "#bababa" }}>
          {buttonString}
        </Button>
      </Link>
    </Center>
  );
};

export const TopBar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Center
      width="100%"
      minWidth="1000px"
      borderBottom={`1px solid #999999`}
      bg={`${colorMode === "light" ? "#e9e9e9" : "#1a202c"}`}>
      <Flex
        height={"60px"}
        width="1000px"
        minWidth="1000px"
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Text></Text>
        <Flex>
          <TopBarButton buttonString="캐릭터 검색" url="/" />
          <TopBarButton buttonString="모험단 검색" url="/adventure" />
        </Flex>
        <DarkmodeButton />
      </Flex>
    </Center>
  );
};
