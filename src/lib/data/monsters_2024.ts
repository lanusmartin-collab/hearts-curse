/* eslint-disable @typescript-eslint/no-explicit-any */
import { Statblock } from "./statblocks";
import RAW_DATA from "./monsters_2024_final.json";
import DROW_DATA from "./drow_monsters.json";
import CUSTOM_DATA from "./monsters_custom.json";

const typedData: Record<string, Statblock> = {};

// 1. Load Main Data
(RAW_DATA as any[]).forEach((m: any) => {
  typedData[m.slug] = m as Statblock;
});

// 2. Load Drow Data (Overrides Main)
(DROW_DATA as any[]).forEach((m: any) => {
  typedData[m.slug] = m as Statblock;
});

// 3. Load Custom Data (Overrides Drow/Main)
(CUSTOM_DATA as any[]).forEach((m: any) => {
  // Only add if it has a valid slug
  if (m.slug) {
    typedData[m.slug] = m as Statblock;
  }
});

export const MONSTERS_2024 = typedData;
export const ALL_MONSTERS = Object.values(typedData);
