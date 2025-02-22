import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button,
  Text,
  UnorderedList,
  ListItem,
  Box,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

interface HelpIconProps {
  title: string;
  main: string[];
}

export const HelpIcon: React.FC<HelpIconProps> = ({ title, main }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <InfoIcon />
      </PopoverTrigger>
      <PopoverContent bg={"beige"} border={`2px solid black`}>
        <PopoverArrow bg={"beige"} border={`2px solid black`} />
        <PopoverHeader>
          <Box p={0.5}>
            <Text as="b">{title}</Text>
          </Box>
        </PopoverHeader>
        <PopoverBody>
          <UnorderedList>
            {main.map((text, idx) => (
              <ListItem key={`helpIcon${idx}`}>
                <Text fontSize={"sm"}>{text}</Text>
              </ListItem>
            ))}
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
