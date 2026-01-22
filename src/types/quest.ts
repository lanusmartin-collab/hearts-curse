export type QuestStatus = "active" | "completed" | "failed";

export interface QuestStep {
    id: string;
    description: string;
    isCompleted: boolean;
    targetNodeId?: string; // If the step requires visiting a location
    targetItem?: string; // If the step requires an item
    targetMonster?: string; // If the step requires killing a monster
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    status: QuestStatus;
    steps: QuestStep[];
    rewards?: {
        gold?: number;
        items?: string[];
        xp?: number;
    };
    givenBy?: string; // NPC Name
}

export interface QuestState {
    activeQuests: Quest[];
    completedQuests: Quest[]; // Archives
}
