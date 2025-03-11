import { Badge, Text } from "@chakra-ui/react";
import { serverOptions } from "../context/serverOptions";

interface ServerBadgeProps {
  serverId: string;
}

interface SetPointBadgeProps {
  point: number;
}

interface BadgeTextProps {
  str: string;
}

interface BadgeTextColorProps {
  str: string;
  color: string;
}

const rareSetPoint = 750;
const uniqueSetPoint = 1200;
const legendarySetPoint = 1650;
const epicSetPoint = 2100;
const taechoSetPoint = 2550;
const setPointStep = 80;
const romeText = ["I", "II", "III", "IV", "V", "V"];

export const ServerBadge: React.FC<ServerBadgeProps> = ({ serverId }) => {
  const server = serverOptions.find((server) => server.serverId === serverId);
  return (
    <Badge bgColor={"gray"} variant="solid" fontSize="sm">
      {server?.serverName}
    </Badge>
  );
};

export const TextBadge: React.FC<BadgeTextColorProps> = ({ str, color }) => {
  return (
    <Badge bgColor={color} variant="solid" fontSize="sm">
      {str}
    </Badge>
  );
};

export const RareBadge = () => {
  return (
    <Badge bgColor={"#B36BFF"} variant="solid" fontSize="sm">
      레어
    </Badge>
  );
};

export const RareTextBadge: React.FC<BadgeTextProps> = ({ str }) => {
  return (
    <Badge bgColor={"#B36BFF"} variant="solid" fontSize="sm" color={"black"}>
      {str}
    </Badge>
  );
};

export const UniqueBadge = () => {
  return (
    <Badge bgColor={"#FF00FF"} variant="solid" fontSize="sm">
      유니크
    </Badge>
  );
};

export const UniqueTextBadge: React.FC<BadgeTextProps> = ({ str }) => {
  return (
    <Badge bgColor={"#FF00FF"} variant="solid" fontSize="sm" color={"black"}>
      {str}
    </Badge>
  );
};

export const LegendaryBadge = () => {
  return (
    <Badge bgColor={"#b25400"} variant="solid" fontSize="sm">
      레전
    </Badge>
  );
};

export const LegendaryTextBadge: React.FC<BadgeTextProps> = ({ str }) => {
  return (
    <Badge bgColor={"#b25400"} variant="solid" fontSize="sm" color={"black"}>
      {str}
    </Badge>
  );
};

export const EpicBadge = () => {
  return (
    <Badge bgColor={"#FFB400"} variant="solid" fontSize="sm">
      에픽
    </Badge>
  );
};

export const EpicTextBadge: React.FC<BadgeTextProps> = ({ str }) => {
  return (
    <Badge bgColor={"#FFB400"} variant="solid" fontSize="sm" color={"black"}>
      {str}
    </Badge>
  );
};

export const TaechoBadge = () => {
  return (
    <Badge
      variant="solid"
      fontSize="sm"
      bgImage={`linear-gradient(180deg, #28d931, #33acea)`}>
      태초
    </Badge>
  );
};

export const TaechoTextBadge: React.FC<BadgeTextProps> = ({ str }) => {
  return (
    <Badge
      variant="solid"
      fontSize="sm"
      bgImage={`linear-gradient(180deg, #28d931, #33acea)`}
      color={"black"}>
      {str}
    </Badge>
  );
};

export const SetPointBadge: React.FC<SetPointBadgeProps> = ({ point }) => {
  if (rareSetPoint <= point && point < uniqueSetPoint) {
    const tempPoint = point - rareSetPoint;
    return (
      <RareTextBadge str={romeText[Math.floor(tempPoint / setPointStep)]} />
    );
  } else if (uniqueSetPoint <= point && point < legendarySetPoint) {
    const tempPoint = point - uniqueSetPoint;
    return (
      <UniqueTextBadge str={romeText[Math.floor(tempPoint / setPointStep)]} />
    );
  } else if (legendarySetPoint <= point && point < epicSetPoint) {
    const tempPoint = point - legendarySetPoint;
    return (
      <LegendaryTextBadge
        str={romeText[Math.floor(tempPoint / setPointStep)]}
      />
    );
  } else if (epicSetPoint <= point && point < taechoSetPoint) {
    const tempPoint = point - epicSetPoint;
    return (
      <EpicTextBadge str={romeText[Math.floor(tempPoint / setPointStep)]} />
    );
  } else if (taechoSetPoint <= point) {
    return <TaechoTextBadge str={"I"} />;
  } else {
    return <Text>{point}</Text>;
  }
};

export const ItemObtainCodeBadge: React.FC<BadgeTextProps> = ({ str }) => {
  return (
    <Badge bgColor={"darkgreen"} variant="solid" fontSize="sm">
      {str}
    </Badge>
  );
};

export const CharacterNameBadge: React.FC<BadgeTextProps> = ({ str }) => {
  return (
    <Badge colorScheme="blue" variant="solid" fontSize="sm">
      {str}
    </Badge>
  );
};

interface ObtainServerBadgeProps {
  channelName: string;
  channelNo: number;
}

export const ObtainServerBadge: React.FC<ObtainServerBadgeProps> = ({
  channelName,
  channelNo,
}) => {
  return (
    <Badge bgColor={"darkslategray"} variant="solid" fontSize="sm">
      {channelName}-{channelNo}
    </Badge>
  );
};
// linear-gradient(top, #28d931, #33acea)

interface ItemRarityBadgeProps {
  itemRarity: number;
}

export const ItemRarityBadge: React.FC<ItemRarityBadgeProps> = ({
  itemRarity,
}) => {
  switch (itemRarity) {
    case 2:
      return <TaechoBadge />;
    case 1:
      return <EpicBadge />;
    case 0:
      return <LegendaryBadge />;
    default:
      return null; // 또는 다른 컴포넌트나 메시지를 반환할 수 있습니다.
  }
};
