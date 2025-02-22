import { Badge } from "@chakra-ui/react";
import { serverOptions } from "../context/serverOptions";

interface ServerBadgeProps {
  serverId: string;
}

export const ServerBadge: React.FC<ServerBadgeProps> = ({ serverId }) => {
  const server = serverOptions.find((server) => server.serverId === serverId);
  return (
    <Badge bgColor={"gray"} variant="solid" fontSize="sm">
      {server?.serverName}
    </Badge>
  );
};

export const LegendaryBadge = () => {
  return (
    <Badge bgColor={"#FF7800"} variant="solid" fontSize="sm">
      레전
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

interface BadgeTextProps {
  str: string;
}

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
