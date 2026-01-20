import { Combatant } from "@/types/combat";
import { ShopItem } from "@/lib/data/shops";

export interface GameSaveData {
    id: string;
    timestamp: number;
    name: string; // "Character Name - Level X"
    version: string;
    playerCharacter: Combatant;
    currentMapId: string;
    currentNodeId: string;
    questState: Record<string, any>;
    inventory: ShopItem[];
    gold: number;
    playtime: number; // Seconds
}

const STORAGE_KEY_PREFIX = "hearts_curse_save_";

export class SaveManager {
    static saveGame(slotId: string, data: GameSaveData): boolean {
        if (typeof window === 'undefined') return false;
        try {
            const key = `${STORAGE_KEY_PREFIX}${slotId}`;
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (e) {
            console.error("Failed to save game:", e);
            return false;
        }
    }

    static loadGame(slotId: string): GameSaveData | null {
        if (typeof window === 'undefined') return null;
        try {
            const key = `${STORAGE_KEY_PREFIX}${slotId}`;
            const serialized = localStorage.getItem(key);
            if (!serialized) return null;
            const data = JSON.parse(serialized);

            // Migration: Inventory string[] -> ShopItem[]
            if (data.inventory && data.inventory.length > 0 && typeof data.inventory[0] === 'string') {
                // Convert string IDs to placeholder objects to prevent crash
                data.inventory = data.inventory.map((id: string) => ({
                    id: id,
                    name: "Unknown Item",
                    description: "Legacy Item",
                    cost: 0,
                    type: "misc",
                    stock: 1
                }));
            }

            return data as GameSaveData;
        } catch (e) {
            console.error("Failed to load game:", e);
            return null;
        }
    }

    static getAllSaves(): GameSaveData[] {
        if (typeof window === 'undefined') return [];
        const saves: GameSaveData[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
                try {
                    const serialized = localStorage.getItem(key);
                    if (serialized) {
                        const data = JSON.parse(serialized);
                        // Migration Helper & Validation
                        if (!data.playerCharacter) {
                            console.warn(`Skipping invalid save (missing char): ${key}`);
                            continue;
                        }

                        if (data.inventory && data.inventory.length > 0 && typeof data.inventory[0] === 'string') {
                            data.inventory = [];
                        }
                        saves.push(data);
                    }
                } catch (e) {
                    console.warn(`Corrupt save file found: ${key}`);
                }
            }
        }
        return saves.sort((a, b) => b.timestamp - a.timestamp);
    }

    static deleteSave(slotId: string): void {
        const key = `${STORAGE_KEY_PREFIX}${slotId}`;
        localStorage.removeItem(key);
    }

    static createNewSaveId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}
