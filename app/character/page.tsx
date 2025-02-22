"use client";

import CharacterPage from "./characterPage";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CharacterPage />
    </Suspense>
  );
}
