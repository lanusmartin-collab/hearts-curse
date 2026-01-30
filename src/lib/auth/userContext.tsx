"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserProfile = {
    id: string;
    name: string;
    isPro: boolean;
    licenseKey?: string;
};

type UserContextType = {
    user: UserProfile | null;
    isLoading: boolean;
    login: (name: string) => void;
    logout: () => void;
    upgradeToPro: () => void;
    activateLicense: (key: string) => Promise<boolean>;
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
                const parsed = JSON.parse(savedUser);
                // MASTER KEY OVERRIDE: Always ensure Pro is true
                setUser({ ...parsed, isPro: true });
            } catch (e) {
                console.error("Failed to restore user", e);
            }
        } else {
            // Optional: auto-login as guest pro if needed, but for now just stop loading
        }
        setIsLoading(false);
    }, []);

    // Persist on Change
    useEffect(() => {
        if (user) {
            // Ensure we only save the pro version
            const userToSave = { ...user, isPro: true };
            localStorage.setItem("hc_user", JSON.stringify(userToSave));
        } else {
            localStorage.removeItem("hc_user");
        }
    }, [user]);

    const login = (name: string) => {
        // MASTER KEY OVERRIDE: Free Tier is now Pro Tier
        setUser({
            id: Date.now().toString(),
            name,
            isPro: true
        });
    };

    const logout = () => {
        setUser(null);
    };

    const upgradeToPro = () => {
        if (!user) return;
        setUser({ ...user, isPro: true });
        // alert("🎉 UPGRADE SUCCESSFUL (Simulation)!\n\nWelcome to the Inner Circle.");
    };

    const activateLicense = async (key: string): Promise<boolean> => {
        try {
            const res = await fetch("/api/verify-license", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ license_key: key }),
            });
            const data = await res.json();

            if (data.valid) {
                // If user exists, update them. If not, create a new profile.
                const baseUser = user || {
                    id: Date.now().toString(),
                    name: "Dungeon Master", // Default name for key-holders
                    isPro: false // Will be set to true below
                };

                setUser({ ...baseUser, isPro: true, licenseKey: key });
                return true;
            } else {
                console.error("License validation failed:", data.error);
                return false;
            }
        } catch (e) {
            console.error("License validation error:", e);
            return false;
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, login, logout, upgradeToPro, activateLicense }}>
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
