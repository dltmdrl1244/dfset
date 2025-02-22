interface ServerOption {
  serverId: string;
  serverName: string;
}

export const serverOptions: ServerOption[] = [
  { serverId: "all", serverName: "모두" },
  { serverId: "adventure", serverName: "모험단" },
  { serverId: "cain", serverName: "카인" },
  { serverId: "diregie", serverName: "디레지에" },
  { serverId: "siroco", serverName: "시로코" },
  { serverId: "prey", serverName: "프레이" },
  { serverId: "casillas", serverName: "카시야스" },
  { serverId: "hilder", serverName: "힐더" },
  { serverId: "anton", serverName: "안톤" },
  { serverId: "bakal", serverName: "바칼" },
];

export function getServerName(serverId: string) {
  const server = serverOptions.find((server) => server.serverId === serverId);
  return server ? server.serverName : "서버를 찾을 수 없습니다.";
}
