type ItemSetData = {
  setName: string;
  setId: string;
  keywords: string[];
};

export const itemSets: ItemSetData[] = [
  {
    setName: "영원히 이어지는 황금향",
    setId: "7f788a703a87d783079b41d0fe6448c9",
    keywords: ["화려한 황금향", "찬란한 황금향", "영롱한 황금향"],
  },
  {
    setName: "용투장의 난",
    setId: "b92ca7784123b5fea9cea40144925194",
    keywords: ["용의", "용왕의", "용제의"],
  },
  {
    setName: "세렌디피티",
    setId: "7c9c8335b72c2907df20786f8f5b27f0",
    keywords: ["굳건한 행운", "확고한 행운", "견고한 행운"],
  },
  {
    setName: "칠흑의 정화",
    setId: "11f7d203a05ea6f13300c0facb39f11e",
    keywords: [
      "타버린 정화",
      "때 묻지 않은 정화",
      "칠흑의 정화",
      "혼돈의 정화",
    ],
  },
  {
    setName: "한계를 넘어선 에너지",
    setId: "2877466bc2fc8bedf7799d88167c9fe3",
    keywords: ["절전", "충전"],
  },
  {
    setName: "마력의 영역",
    setId: "8e9cb65cb6285d7e2f084f440aa18870",
    keywords: ["은은한 마력", "가득찬 마력", "넘치는 마력"],
  },
  {
    setName: "소울 페어리",
    setId: "4ee7bd5912cda6e2a24c1f36d5202b46",
    keywords: ["엘더 페어리", "노블 페어리", "로열 페어리"],
  },
  {
    setName: "고대 전장의 발키리",
    setId: "854dc8c01b1bc231e132dae5df3c52bc",
    keywords: ["역전의 발키리", "불멸의 발키리", "발할라의 여신 발키리"],
  },
  {
    setName: "에테리얼 오브 아츠",
    setId: "93e7825053bdec4e0f4c12837cf4f57e",
    keywords: ["수습 여우", "고위 여우", "대 여우"],
  },
  {
    setName: "그림자에 숨은 죽음",
    setId: "3af7c961e7d8cd8b5b42c5f82af2a0ad",
    keywords: ["어두운 그림자", "짙은 그림자", "칠흑같은 그림자"],
  },
  {
    setName: "압도적인 자연",
    setId: "4e65968c4d30898e6879434dc641b6e4",
    keywords: ["자연의 격노", "자연의 폭주", "천재지변"],
  },
  {
    setName: "무리 사냥의 길잡이",
    setId: "e23286107ba4328af86c83aabc347e9e",
    keywords: ["무리의 유망주", "무리의 베테랑", "무리의 길잡이"],
  },
  {
    setName: "고유 장비",
    setId: "distinctItems",
    keywords: ["고유"],
  },
];

export function getSetIdByKeyword(word: string): string {
  for (const itemSet of itemSets) {
    if (itemSet.keywords.includes(word) == true) {
      return itemSet.setId;
    }
  }
  return "null";
}
