
export interface Background {
    id: string;
    name: string;
    skills: string[];
    feature: string;
    desc: string;
}

export const BACKGROUNDS: Background[] = [
    {
        id: "acolyte",
        name: "Acolyte",
        skills: ["Insight", "Religion"],
        feature: "Shelter of the Faithful",
        desc: "You have spent your life in service to a temple."
    },
    {
        id: "charlatan",
        name: "Charlatan",
        skills: ["Deception", "Sleight of Hand"],
        feature: "False Identity",
        desc: "You have a habit of embezzling money."
    },
    {
        id: "criminal",
        name: "Criminal",
        skills: ["Deception", "Stealth"],
        feature: "Criminal Contact",
        desc: "You have a history of breaking the law."
    },
    {
        id: "entertainer",
        name: "Entertainer",
        skills: ["Acrobatics", "Performance"],
        feature: "By Popular Demand",
        desc: "You can always find a place to perform."
    },
    {
        id: "folk_hero",
        name: "Folk Hero",
        skills: ["Animal Handling", "Survival"],
        feature: "Rustic Hospitality",
        desc: "The common people love you."
    },
    {
        id: "guild_artisan",
        name: "Guild Artisan",
        skills: ["Insight", "Persuasion"],
        feature: "Guild Membership",
        desc: "You are a member of a guild."
    },
    {
        id: "hermit",
        name: "Hermit",
        skills: ["Medicine", "Religion"],
        feature: "Discovery",
        desc: "You have been in isolation for a long time."
    },
    {
        id: "noble",
        name: "Noble",
        skills: ["History", "Persuasion"],
        feature: "Position of Privilege",
        desc: "You were born into wealth and power."
    },
    {
        id: "outlander",
        name: "Outlander",
        skills: ["Athletics", "Survival"],
        feature: "Wanderer",
        desc: "You grew up in the wilds."
    },
    {
        id: "sage",
        name: "Sage",
        skills: ["Arcana", "History"],
        feature: "Researcher",
        desc: "You are a scholar."
    },
    {
        id: "sailor",
        name: "Sailor",
        skills: ["Athletics", "Perception"],
        feature: "Ship's Passage",
        desc: "You are at home on the sea."
    },
    {
        id: "soldier",
        name: "Soldier",
        skills: ["Athletics", "Intimidation"],
        feature: "Military Rank",
        desc: "You have served in an army."
    },
    {
        id: "urchin",
        name: "Urchin",
        skills: ["Sleight of Hand", "Stealth"],
        feature: "City Secrets",
        desc: "You grew up on the streets."
    }
];
