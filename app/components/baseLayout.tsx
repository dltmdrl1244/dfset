import { Box, Center, VStack } from "@chakra-ui/react";
import { TopBar } from "./topbar";
import Footer from "./footer";

export default function BaseLayout({ children }) {
  return (
    <>
      <TopBar />
      <main>
        <Center minWidth="1000px">
          <Box width="1000px" minWidth="1000px">
            <VStack minHeight="90vh">{children}</VStack>
          </Box>
        </Center>
      </main>
      <Footer />
    </>
  );
}
