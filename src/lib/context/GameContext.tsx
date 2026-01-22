"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Combatant } from "@/types/combat";
import { ShopItem } from "@/lib/data/shops";
import { Quest, QuestState } from "@/types/quest";
import { INITIAL_QUESTS } from "@/lib/data/quests";

// Define the View Modes available in the app
export type ViewMode =
    | "home"
    | "book"
    | "intro_narrative"
    | "main_menu"
    | "char_creation"
    | "world_map"
    | "prologue"
    | "game";

interface GameState {
    // Navigation & View
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;

    // Game World State
    currentMapId: string;
    currentNodeId: string;
    navigateTo: (mapId: string, nodeId: string) => void;
    visitedNodes: Set<string>;
    markNodeVisited: (nodeId: string) => void;

    // Player State
    playerCharacter: Combatant | undefined;
    setPlayerCharacter: (char: Combatant | undefined) => void;
    playerGold: number;
    setPlayerGold: (amount: number | ((prev: number) => number)) => void;
    inventory: ShopItem[];
    addToInventory: (item: ShopItem) => void;
    removeFromInventory: (itemName: string) => void;

    // Quests
    quests: QuestState;
    startQuest: (questId: string) => void;
    updateQuestStep: (questId: string, stepId: string) => void;

    // Factions (New)
    factions: Record<string, number>;
    setFactionReputation: (factionId: string, value: number) => void;

    // Meta
    saveGame: (saveName: string) => void;
    loadGame: (saveData: any) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameContextProvider = ({ children }: { children: ReactNode }) => {
    // -- STATE --

    // View State
    const [viewMode, setViewMode] = useState<ViewMode>("home");

    // World State
    const [currentMapId, setCurrentMapId] = useState<string>("oakhaven");
    const [currentNodeId, setCurrentNodeId] = useState<string>("market");
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set(["market"]));

    // Player State
    const [playerCharacter, setPlayerCharacter] = useState<Combatant | undefined>(undefined);
    const [playerGold, setPlayerGold] = useState<number>(100);
    const [inventory, setInventory] = useState<ShopItem[]>([]);

    const [quests, setQuests] = useState<QuestState>({
        activeQuests: [],
        completedQuests: []
    });

    // Factions State
    const [factions, setFactions] = useState<Record<string, number>>({
        zhentarim: 50,
        thay: 50,
        coalition: 75,
        drow: 10,
        larloch: 0
    });

    const setFactionReputation = (factionId: string, value: number) => {
        setFactions(prev => ({
            ...prev,
            [factionId]: Math.max(0, Math.min(100, value))
        }));
    };

    // -- ACTIONS --

    const navigateTo = (mapId: string, nodeId: string) => {
        setCurrentMapId(mapId);
        setCurrentNodeId(nodeId);
        markNodeVisited(nodeId);
    };

    const markNodeVisited = (nodeId: string) => {
        setVisitedNodes(prev => {
            const newSet = new Set(prev);
            newSet.add(nodeId);
            return newSet;
        });
    };

    const addToInventory = (item: ShopItem) => {
        setInventory(prev => [...prev, item]);
    };

    const removeFromInventory = (itemName: string) => {
        setInventory(prev => {
            const idx = prev.findIndex(i => i.name === itemName);
            if (idx > -1) {
                const newInv = [...prev];
                newInv.splice(idx, 1);
                return newInv;
            }
            return prev;
        });
    };

    // -- QUEST ACTIONS --

    const startQuest = (questId: string) => {
        // Check if already active or completed
        if (quests.activeQuests.find(q => q.id === questId)) return;
        if (quests.completedQuests.find(q => q.id === questId)) return;

        const template = INITIAL_QUESTS[questId];
        if (template) {
            setQuests(prev => ({
                ...prev,
                activeQuests: [...prev.activeQuests, { ...template }]
            }));
            // Optional: Notification via logging service? Context doesn't log.
            // Component should listen to quest state or we create a Notification Context.
        }
    };

    const updateQuestStep = (questId: string, stepId: string) => {
        setQuests(prev => {
            let quest = prev.activeQuests.find(q => q.id === questId);
            if (!quest) return prev;

            // Clone to avoid mutation
            quest = { ...quest, steps: [...quest.steps] };
            const stepIndex = quest.steps.findIndex(s => s.id === stepId);

            if (stepIndex > -1 && !quest.steps[stepIndex].isCompleted) {
                quest.steps[stepIndex] = { ...quest.steps[stepIndex], isCompleted: true };

                // Check Completion
                const allComplete = quest.steps.every(s => s.isCompleted);
                if (allComplete) {
                    quest.status = "completed";
                    // Move to completed
                    return {
                        activeQuests: prev.activeQuests.filter(q => q.id !== questId),
                        completedQuests: [...prev.completedQuests, quest]
                    };
                }

                // Update specific quest in active list
                return {
                    ...prev,
                    activeQuests: prev.activeQuests.map(q => q.id === questId ? quest! : q)
                };
            }

            return prev;
        });
    };

    // -- PERSISTENCE (Basic) --
    useEffect(() => {
        // Load visited from local storage on mount
        const savedVisited = localStorage.getItem("hc_visited");
        if (savedVisited) {
            try {
                setVisitedNodes(new Set(JSON.parse(savedVisited)));
            } catch (e) {
                console.error("Failed to load visited nodes", e);
            }
        }
    }, []);

    useEffect(() => {
        // Save visited to local storage
        localStorage.setItem("hc_visited", JSON.stringify(Array.from(visitedNodes)));
    }, [visitedNodes]);

    const saveGame = (saveName: string) => {
        // Placeholder for full save logic
        console.log("Saving game...", saveName);
    };

    const loadGame = (saveData: any) => {
        // Placeholder for load logic
        if (saveData.playerCharacter) setPlayerCharacter(saveData.playerCharacter);
        if (saveData.currentMapId) setCurrentMapId(saveData.currentMapId);
        if (saveData.currentNodeId) setCurrentNodeId(saveData.currentNodeId);
        if (saveData.gold) setPlayerGold(saveData.gold);
        if (saveData.inventory) setInventory(saveData.inventory);
        if (saveData.quests) setQuests(saveData.quests);
    };

    return (
        <GameContext.Provider
            value={{
                viewMode,
                setViewMode,
                currentMapId,
                currentNodeId,
                navigateTo,
                visitedNodes,
                markNodeVisited,
                playerCharacter,
                setPlayerCharacter,
                playerGold,
                setPlayerGold,
                inventory,
                addToInventory,
                removeFromInventory,
                quests,
                startQuest,
                updateQuestStep,
                factions,
                setFactionReputation,
                saveGame,
                loadGame
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error("useGameContext must be used within a GameContextProvider");
    }
    return context;
};
