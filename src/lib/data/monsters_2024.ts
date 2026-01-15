/* eslint-disable @typescript-eslint/no-explicit-any */
import { Statblock, STATBLOCKS } from "./statblocks";
import RAW_DATA from "./monsters_2024_final.json";
import DROW_DATA from "./drow_monsters.json";
import CUSTOM_DATA from "./monsters_custom.json";
import MIGRATED_DATA from "./monsters_migrated.json";

const typedData: Record<string, Statblock> = {};

// Manual overrides for broken or missing images from the source
const CUSTOM_IMAGE_MAPPINGS: Record<string, string> = {
  "acererak": "https://www.aidedd.org/dnd/images/lich.jpg",
  "abjurer-wizard": "https://www.aidedd.org/dnd/images/archmage.jpg",
  "conjurer-wizard": "https://www.aidedd.org/dnd/images/archmage.jpg",
  "diviner-wizard": "https://www.aidedd.org/dnd/images/archmage.jpg",
  "enchanter-wizard": "https://www.aidedd.org/dnd/images/archmage.jpg",
  "evoker-wizard": "https://www.aidedd.org/dnd/images/archmage.jpg",
  "illusionist-wizard": "https://www.aidedd.org/dnd/images/archmage.jpg",
  "necromancer-wizard": "https://www.aidedd.org/dnd/images/archmage.jpg",
  "transmuter-wizard": "https://www.aidedd.org/dnd/images/archmage.jpg",
};

// Helper to map raw data to Statblock
function mapToStatblock(m: any): Statblock {
  // Map image_url/image_path/imageUrl to image if image is missing
  // Priority: Custom Override > image > image_path (local) > image_url (remote) > imageUrl (camelCase remote)
  const image = CUSTOM_IMAGE_MAPPINGS[m.slug] || m.image || m.image_path || m.image_url || m.imageUrl;
  return {
    ...m,
    image
  } as Statblock;
}

// 1. Load Main Data
(RAW_DATA as any[]).forEach((m: any) => {
  if (m.slug) {
    typedData[m.slug] = mapToStatblock(m);
  }
});

// 2. Load Drow Data (Overrides Main)
(DROW_DATA as any[]).forEach((m: any) => {
  if (m.slug) {
    typedData[m.slug] = mapToStatblock(m);
  }
});

// 3. Load Custom Data (Overrides Drow/Main)
(CUSTOM_DATA as any[]).forEach((m: any) => {
  // Only add if it has a valid slug
  if (m.slug) {
    typedData[m.slug] = mapToStatblock(m);
  }
});

// 4. Load Migrated Data (Merges with existing)
(MIGRATED_DATA as any[]).forEach((m: any) => {
  if (m.slug) {
    typedData[m.slug] = mapToStatblock(m);
  }
});

// 4. Load Code-Defined Statblocks (Highest Priority)
Object.entries(STATBLOCKS).forEach(([key, val]) => {
  typedData[key] = val;
});

export const MONSTERS_2024 = typedData;
export const ALL_MONSTERS = Object.values(typedData);
