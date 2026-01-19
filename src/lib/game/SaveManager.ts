import { Combatant } from "@/types/combat";

export interface GameSaveData {
    id: string;
    timestamp: number;
    name: string; // "Character Name - Level X"
    version: string;
    playerCharacter: Combatant;
    currentMapId: string;
    currentNodeId: string;
    questState: Record<string, any>;
    inventory: string[]; // IDs
    gold: number;
    playtime: number; // Seconds
}

const STORAGE_KEY_PREFIX = "hearts_curse_save_";

export class SaveManager {
    static saveGame(slotId: string, data: GameSaveData): boolean {
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
        try {
            const key = `${STORAGE_KEY_PREFIX}${slotId}`;
            const serialized = localStorage.getItem(key);
            if (!serialized) return null;
            return JSON.parse(serialized) as GameSaveData;
        } catch (e) {
            console.error("Failed to load game:", e);
            return null;
        }
    }

    static getAllSaves(): GameSaveData[] {
        const saves: GameSaveData[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
                try {
                    const serialized = localStorage.getItem(key);
                    if (serialized) {
                        saves.push(JSON.parse(serialized));
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
