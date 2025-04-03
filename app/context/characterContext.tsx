"use client";

import {
  utilUpdateCharacterHistory,
  utilGetCharacterInfo,
  utilSaveCharacterHistory,
} from "./characterUtil";

import React, { createContext, useState, useContext } from "react";

interface ICharacterContext {
  characterInfo: Character | null;
  setCharacterInfo: React.Dispatch<React.SetStateAction<Character | null>>;
  updateCharacter: (characterId: string, serverId: string) => Promise<void>;
  characterHistoryInfo: CharacterHistory | null;
  setCharacterHistoryInfo: React.Dispatch<
    React.SetStateAction<CharacterHistory | null>
  >;
}

const CharacterContext = createContext<ICharacterContext | undefined>(
  undefined
);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [characterInfo, setCharacterInfo] = useState<Character | null>(null);
  const [characterHistoryInfo, setCharacterHistoryInfo] =
    useState<CharacterHistory | null>(null);

  async function updateCharacter(characterId: string, serverId: string) {
    if (!characterId || !serverId) {
      return;
    }
    try {
      const character: Character | null = await utilGetCharacterInfo(
        characterId,
        serverId
      );
      if (!character) {
        return;
      }

      const characterHistory: CharacterHistory | null =
        await utilUpdateCharacterHistory(character);
      if (characterHistory) {
        // console.log("character History is not null", characterHistory);
        setCharacterHistoryInfo(characterHistory);
        utilSaveCharacterHistory(character, characterHistory);
      }
      // else {
      //   console.log("character History null");
      // }
    } catch (error) {
      console.error(error);
    }
  }

  const value = {
    characterInfo,
    setCharacterInfo,
    updateCharacter,
    characterHistoryInfo,
    setCharacterHistoryInfo,
  };
  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error("useCharacter");
  }
  return context;
}
