"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserProfile = {
    id: string;
    name: string;
    isPro: boolean;
};

type UserContextType = {
    user: UserProfile | null;
    isLoading: boolean;
    login: (name: string) => void;
    logout: () => void;
    upgradeToPro: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial Load
    useEffect(() => {
        const savedUser = localStorage.getItem("hc_user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to restore user", e);
            }
        }
        setIsLoading(false);
    }, []);

    // Persist on Change
    useEffect(() => {
        if (user) {
            localStorage.setItem("hc_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("hc_user");
        }
    }, [user]);

    const login = (name: string) => {
        // Simulating a "Free Tier" login
        setUser({
            id: Date.now().toString(),
            name,
            isPro: false
        });
    };

    const logout = () => {
        setUser(null);
    };

    const upgradeToPro = () => {
        if (!user) return;
        setUser({ ...user, isPro: true });
        alert("🎉 UPGRADE SUCCESSFUL!\n\nWelcome to the Inner Circle, Dungeon Master.\nAll restrictions have been lifted.");
    };

    return (
        <UserContext.Provider value={{ user, isLoading, login, logout, upgradeToPro }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
