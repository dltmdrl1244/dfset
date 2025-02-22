import React, { createContext, Dispatch, SetStateAction } from "react";

const WeaponListContext = createContext<{
  weaponList: Weapon[];
  setWeaponList: Dispatch<SetStateAction<Weapon[]>>;
}>({
  weaponList: [],
  setWeaponList: () => {},
});

export default WeaponListContext;
