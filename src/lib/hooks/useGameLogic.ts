import { useState, useEffect } from "react";
import { useGameContext } from "@/lib/context/GameContext";
import { CAMPAIGN_MAPS } from "@/lib/data/maps";
import { NarrativeEngine } from "@/lib/game/NarrativeEngine";
import { SHOPS, ShopItem } from "@/lib/data/shops";
import {
    TOWN_DAY_TABLE,
    TOWN_NIGHT_TABLE,
    OAKHAVEN_MINES_TABLE,
    UNDERDARK_TRAVEL_TABLE,
    ARACH_TINILITH_TABLE,
    NETHERIL_RUINS_TABLE,
    SILENT_WARDS_TABLE,
    LIBRARY_WHISPERS_TABLE,
    CATACOMBS_DESPAIR_TABLE,
    HEART_CHAMBER_TABLE,
    OSSUARY_TABLE,
    DWARVEN_RUINS_TABLE,
    MIND_FLAYER_COLONY_TABLE,
    BEHOLDER_LAIR_TABLE,
    SPIRE_TABLE,
    CASTLE_MOURNWATCH_TABLE,
    Encounter
} from "@/lib/data/encounters";
import { useAudio } from "@/lib/context/AudioContext";
import { useToast } from "@/lib/context/ToastContext";

export const useGameLogic = (startingRewards?: any) => {
    const {
        currentMapId,
        currentNodeId,
        navigateTo,
        playerGold,
        setPlayerGold,
        inventory,
        addToInventory,
        visitedNodes,
        saveGame,
        quests,
        startQuest,
        updateQuestStep
    } = useGameContext();

    const { playSfx, playAmbience } = useAudio();
    const { addToast } = useToast();

    // -- LOCAL UI STATE --
    const [consoleLog, setConsoleLog] = useState<string[]>([
        "> System initialized...",
        "> Rendering Narrative Interface...",
        "> Awaiting input."
    ]);
    const [inCombat, setInCombat] = useState(false);
    const [combatEnemies, setCombatEnemies] = useState<string[]>([]);
    const [showShop, setShowShop] = useState(false);

    const [activeCheck, setActiveCheck] = useState<{ skill: string; dc: number; onPass: string; onFail: string; id: string; details?: string } | null>(null);

    // -- DERIVED STATE --
    const currentMap = CAMPAIGN_MAPS.find(m => m.id === currentMapId);
    const currentNode = currentMap?.nodes?.find(n => n.id === currentNodeId);
    const currentShop = currentNode?.shopId ? SHOPS[currentNode.shopId] : null;

    // -- HELPERS --
    const addToLog = (msg: string) => {
        setConsoleLog(prev => [...prev.slice(-25), `> ${msg}`]);
    };

    const resolveCheck = (roll: number, modifier: number) => {
        if (!activeCheck) return;
        const total = roll + modifier;
        const passed = total >= activeCheck.dc;

        addToLog(passed ? `SUCCESS: ${activeCheck.onPass}` : `FAILURE: ${activeCheck.onFail}`);

        if (passed) {
            playSfx("/sfx/retro_success.mp3");
            addToast("Skill Check Passed!", "success");
        } else {
            playSfx("/sfx/ui_error.mp3");
            addToast("Skill Check Failed", "error");
        }

        setActiveCheck(null);
    };

    // -- EFFECTS --

    // 1. Initial Description
    useEffect(() => {
        if (currentNode) {
            const event = NarrativeEngine.describeLocation(currentNode);
            addToLog(event.text);
        }
        playAmbience("dungeon");
    }, []);

    // 2. Handle Starting Rewards
    useEffect(() => {
        if (startingRewards?.item === 'essence_djinn') {
            setTimeout(() => {
                addToLog("ALERT: ANOMALOUS ARTIFACT DETECTED.");
                addToLog("ACQUIRED: ESSENCE OF THE DJINN (+2 PRIM).");
                playSfx("/sfx/gain_item.mp3");
            }, 1000);
        }
    }, [startingRewards]);

    // 3. Auto-close Shop on Move
    useEffect(() => {
        setShowShop(false);
    }, [currentNodeId, currentMapId]);

    // 4. QUEST TRIGGERS
    useEffect(() => {
        if (!currentNodeId) return;

        // Nether Scrolls: Enter Library
        if (currentNodeId === 'library_entrance') {
            startQuest('nether_scrolls');
            updateQuestStep('nether_scrolls', 'enter_library');
            addToLog("Quest Update: The Lost Scrolls");
            addToast("Quest Update: The Lost Scrolls", "quest");
        }

        // Mines Rescue: Enter Mines
        if (currentNodeId === 'mine_entrance') {
            startQuest('mines_rescue');
            updateQuestStep('mines_rescue', 'enter_mines');
            addToLog("Quest Started: Lost in the Dark");
            addToast("Quest Started: Lost in the Dark", "quest");

            if (!activeCheck) {
                const evt = NarrativeEngine.requestCheck("Survival", 12, "The air is stale. Tracks are faint.", "You find recent footprints.", "You lose the trail in the dust.");
                addToLog(evt.text);
                if (evt.check) setActiveCheck({ ...evt.check, details: evt.details });
            }
        }

        // Mines Rescue: Find Miner
        if (currentNodeId === 'deep_shaft') {
            updateQuestStep('mines_rescue', 'find_miner');
            addToLog("Goal Updated: Found Bural.");
        }

        // Mines Rescue: Return (Simple check)
        if (currentNodeId === 'market') {
            const mineQuest = quests.activeQuests.find(q => q.id === 'mines_rescue');
            const foundMiner = mineQuest?.steps.find(s => s.id === 'find_miner')?.isCompleted;
            if (foundMiner) {
                updateQuestStep('mines_rescue', 'escort_miner');
                addToLog("Quest Complete: Lost in the Dark");
            }
        }
    }, [currentNodeId, quests]);

    // -- ACTIONS --

    const handleMove = (direction: "north" | "south" | "east" | "west") => {
        if (!currentNode?.exits) {
            addToLog("There are no exits here.");
            return;
        }

        const targetNodeId = currentNode.exits[direction];
        if (targetNodeId) {
            const targetNode = currentMap?.nodes?.find(n => n.id === targetNodeId);
            if (targetNode) {
                // Execute Move via Context
                navigateTo(currentMapId, targetNodeId);

                // Log Interaction
                const event = NarrativeEngine.describeLocation(targetNode, direction);
                addToLog(event.text);
                playSfx("/sfx/footsteps.mp3");
            } else {
                addToLog(`System Error: Path to '${targetNodeId}' blocked.`);
            }
        } else {
            addToLog("You cannot go that way.");
            playSfx("/sfx/bump.mp3");
        }
    };

    const startCombat = (overrideEnemies?: string[]) => {
        // 0. Manual Override (Ambush)
        if (overrideEnemies && overrideEnemies.length > 0) {
            setCombatEnemies(overrideEnemies);
            setInCombat(true);
            addToLog(`> AMBUSH! ${overrideEnemies.length} enemies appear!`);
            playSfx("/sfx/magical_effect.mp3");
            return;
        }

        // 1. Fixed Encounter
        if (currentNode?.monsters && currentNode.monsters.length > 0) {
            setCombatEnemies(currentNode.monsters);
            setInCombat(true);

            const encounter = NarrativeEngine.encounterTrigger(currentNode.monsters);
            addToLog(encounter.text);
            if (encounter.details) addToLog(encounter.details);
            return;
        }

        // 2. Random Encounter
        if (currentMap?.encounterTable) {
            let table: Encounter[] = [];
            switch (currentMap.encounterTable) {
                case "mines": table = OAKHAVEN_MINES_TABLE; break;
                case "underdark": table = UNDERDARK_TRAVEL_TABLE; break;
                case "arach": table = ARACH_TINILITH_TABLE; break;
                case "netheril": table = NETHERIL_RUINS_TABLE; break;
                case "silent_wards": table = SILENT_WARDS_TABLE; break;
                case "library": table = LIBRARY_WHISPERS_TABLE; break;
                case "dwarven_ruins": table = DWARVEN_RUINS_TABLE; break;
                case "mind_flayer": table = MIND_FLAYER_COLONY_TABLE; break;
                case "beholder": table = BEHOLDER_LAIR_TABLE; break;
                case "spire": table = SPIRE_TABLE; break;
                case "catacombs": table = CATACOMBS_DESPAIR_TABLE; break;
                case "heart": table = HEART_CHAMBER_TABLE; break;
                case "ossuary": table = OSSUARY_TABLE; break;
                case "castle": table = CASTLE_MOURNWATCH_TABLE; break;
                default: table = TOWN_DAY_TABLE;
            }

            const roll = Math.floor(Math.random() * 20) + 1;
            const event = table.find(e => roll >= e.roll[0] && roll <= e.roll[1]);

            if (event) {
                addToLog(`> Encounter Roll: ${roll} - ${event.name}`);
                addToLog(event.description);
                if (event.monsters && event.monsters.length > 0) {
                    setCombatEnemies(event.monsters);
                    setInCombat(true);
                } else {
                    playSfx("/sfx/magical_effect.mp3");
                }
            } else {
                addToLog("> The shadows are quiet... for now.");
            }
            return;
        }

        addToLog("No enemies detected here.");
    };

    const handleVictory = () => {
        setInCombat(false);
        playAmbience("dungeon");
        const result = NarrativeEngine.combatResult('victory');
        addToLog(result.text);
        if (result.details) addToLog(result.details);
    };

    const handleFlee = () => {
        setInCombat(false);
        playAmbience("dungeon");
        const result = NarrativeEngine.combatResult('flee');
        addToLog(result.text);
        if (result.details) addToLog(result.details);
    };

    const handleBuyItem = (item: ShopItem) => {
        if (playerGold >= item.cost) {
            setPlayerGold(prev => prev - item.cost);
            addToInventory(item);
            addToLog(`Purchased: ${item.name} for ${item.cost}gp.`);
            playSfx("/sfx/gain_item.mp3");
            addToast(`Purchased ${item.name}`, "success");
        } else {
            addToLog("Insufficient funds.");
            playSfx("/sfx/bump.mp3");
        }
    };

    return {
        consoleLog,
        inCombat,
        combatEnemies,
        showShop,
        setShowShop,
        currentMap,
        currentNode,
        currentShop,
        playerGold,
        inventory,
        addToInventory, // Add this
        visitedNodes,
        handleMove,
        startCombat,
        handleVictory,
        handleFlee,
        handleBuyItem,
        playSfx,
        playAmbience,
        saveGame,
        activeCheck,
        resolveCheck
    };
};
