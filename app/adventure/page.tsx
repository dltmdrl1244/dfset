"use client";

import { Suspense } from "react";
import AdventurePage from "./adventurePage";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdventurePage />
    </Suspense>
  );
}
