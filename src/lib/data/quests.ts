import { Quest } from "@/types/quest";

export const INITIAL_QUESTS: Record<string, Quest> = {
    "nether_scrolls": {
        id: "nether_scrolls",
        title: "The Lost Scrolls",
        description: "Rhaugilath has tasked you with finding the fragments of the Nether Scrolls hidden within the Library of Whispers.",
        status: "active",
        givenBy: "Rhaugilath",
        steps: [
            { id: "enter_library", description: "Enter the Library of Whispers", isCompleted: false, targetNodeId: "library_entrance" },
            { id: "find_fragment_1", description: "Locate the First Fragment", isCompleted: false, targetItem: "nether_fragment_1" },
            { id: "find_fragment_2", description: "Locate the Second Fragment", isCompleted: false, targetItem: "nether_fragment_2" },
            { id: "return_rhaugilath", description: "Return to Rhaugilath", isCompleted: false, targetNodeId: "rhaugilath_study" }
        ],
        rewards: {
            gold: 500,
            items: ["Ring of Mind Shielding"],
            xp: 1000
        }
    },
    "mines_rescue": {
        id: "mines_rescue",
        title: "Lost in the Dark",
        description: "A miner has gone missing in the lower shafts of Oakhaven Mines. Find him.",
        status: "active",
        givenBy: "Foreman Gurn",
        steps: [
            { id: "enter_mines", description: "Descend into the Oakhaven Mines", isCompleted: false, targetNodeId: "mine_entrance" },
            { id: "find_miner", description: "Bural the Miner", isCompleted: false, targetNodeId: "deep_shaft" },
            { id: "escort_miner", description: "Escort Bural to safety", isCompleted: false, targetNodeId: "market" }
        ],
        rewards: {
            gold: 100,
            items: ["Gem of Brightness"]
        }
    }
};
