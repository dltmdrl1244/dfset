"use client";

import React, { useState, useEffect } from "react";
import ItemTimelineContext, { ItemTimelineInfo } from "./ItemTimelineContext";
import ItemCountContext from "./ItemCountArrayContext";
// import WeaponListContext, { Weapon } from "./WeaponListContext";
// import ItemMatrixContext from "./ItemMatrixContext";
// 다른 Context import

interface PropsType {
  children: React.ReactNode;
}
type ItemMatrixArray = number[][];

const ContextProvider: React.FC<PropsType> = ({ children }) => {
  const [itemTimelineState, setItemTimelineState] = useState<
    ItemTimelineInfo[]
  >([]);
  const [itemCountArray, setItemCountArray] = useState([0, 0, 0]);
  const [weaponList, setWeaponList] = useState<Weapon[]>([]);

  useEffect(() => {
    const storedState = localStorage.getItem("itemTimelineState");
    if (storedState) {
      setItemTimelineState(JSON.parse(storedState));
    }
  }, []);

  // 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(
      "itemTimelineState",
      JSON.stringify(itemTimelineState)
    );
  }, [itemTimelineState]);

  return (
    <ItemTimelineContext.Provider
      value={{ itemTimelineState, setItemTimelineState }}>
      <ItemCountContext.Provider value={{ itemCountArray, setItemCountArray }}>
        {children}
      </ItemCountContext.Provider>
    </ItemTimelineContext.Provider>
  );
};

export default ContextProvider;
