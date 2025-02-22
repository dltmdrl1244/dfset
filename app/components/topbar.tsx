import { Center, Button, Box, HStack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();
  return (
    <Center
      width="100%"
      minWidth="1000px"
      borderBottom={`1px solid #999999`}
      bg="#e9e9e9">
      <Center height={"60px"} width="1000px" minWidth="1000px">
        <TopBarButton buttonString="캐릭터" url="/" />
        <TopBarButton buttonString="모험단" url="/adventure" />
      </Center>
    </Center>
  );
};
