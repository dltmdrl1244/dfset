import { Center, Button, Box } from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const DarkmodeButton = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Center p={2} cursor={"pointer"}>
      {colorMode === "light" ? (
        <MoonIcon onClick={toggleColorMode} />
      ) : (
        <SunIcon onClick={toggleColorMode} />
      )}
    </Center>
  );
};
