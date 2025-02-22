import React, { createContext, Dispatch, SetStateAction } from "react";

const initialItemCountState: number[] = [0, 0, 0];

const ItemCountContext = createContext<{
  itemCountArray: number[];
  setItemCountArray: Dispatch<SetStateAction<number[]>>;
}>({
  itemCountArray: initialItemCountState,
  setItemCountArray: () => {},
});

export default ItemCountContext;
