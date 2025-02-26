"use client";

import { Box, Center, VStack } from "@chakra-ui/react";
import { TopBar } from "./topbar";
import Footer from "./footer";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "../../chakra/theme";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <TopBar />
      <main>
        <Center minWidth="1000px" width="1000px" margin={"0 auto"}>
          <VStack minH="calc(100vh - 130px)">{children}</VStack>
          {/* <Box width="1000px" minWidth="1000px">
          </Box> */}
        </Center>
      </main>
      <Footer />
    </>
  );
};

export default BaseLayout;
