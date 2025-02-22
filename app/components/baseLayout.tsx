import { Box, Center, VStack } from "@chakra-ui/react";
import { TopBar } from "./topbar";
import Footer from "./footer";

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
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
};

export default BaseLayout;
