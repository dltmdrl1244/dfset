type ItemSlotData = {
  slotName: string;
  slotId: string;
  slotDisplayName: string;
  bgColor: string;
};

export const itemSlots: ItemSlotData[] = [
  {
    slotName: "상의",
    slotId: "3da92241d44bdafcf7554057e6479c83",
    slotDisplayName: "상의",
    bgColor: "#afeeee",
  },
  {
    slotName: "하의",
    slotId: "7c4b28699ae7994798289f187d519992",
    slotDisplayName: "하의",
    bgColor: "#afeeee",
  },
  {
    slotName: "머리어깨",
    slotId: "f2976a25a516451e3e8667bac328b308",
    slotDisplayName: "어깨",
    bgColor: "#afeeee",
  },
  {
    slotName: "벨트",
    slotId: "934ed2dea99f55f775df256fc29c5d56",
    slotDisplayName: "벨트",
    bgColor: "#afeeee",
  },
  {
    slotName: "신발",
    slotId: "ef6fcc3b39b2bbcbf09a71da6cbafe06",
    slotDisplayName: "신발",
    bgColor: "#afeeee",
  },
  {
    slotName: "목걸이",
    slotId: "390e3966118b0c466ce9f8eae45e1629",
    slotDisplayName: "목걸이",
    bgColor: "#98FB98",
  },
  {
    slotName: "팔찌",
    slotId: "80bddf423629c28c7b4459c328fdffaf",
    slotDisplayName: "팔찌",
    bgColor: "#98FB98",
  },
  {
    slotName: "반지",
    slotId: "b04c7fb9b29b27b91a0a9e5a1822bc8f",
    slotDisplayName: "반지",
    bgColor: "#98FB98",
  },
  {
    slotName: "보조장비",
    slotId: "2fef5d81b7f59f0c75241890a8d941c9",
    slotDisplayName: "보장",
    bgColor: "#FA98FA",
  },
  {
    slotName: "마법석",
    slotId: "fe5f3db78175f5a3196385c688d29681",
    slotDisplayName: "마법석",
    bgColor: "#FA98FA",
  },
  {
    slotName: "귀걸이",
    slotId: "601834074c49bb0e48cb65a75a8667bc",
    slotDisplayName: "귀걸이",
    bgColor: "#FA98FA",
  },
];

export function getSlotIdBySlotName(slotName: string): string {
  for (const slot of itemSlots) {
    if (slot.slotName === slotName) {
      return slot.slotId;
    }
  }
  return "null";
}
