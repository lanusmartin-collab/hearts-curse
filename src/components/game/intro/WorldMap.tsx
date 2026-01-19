"use client";
import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Skull, Mountain, Info } from "lucide-react";

interface WorldMapProps {
    onSelectLocation: (locationId: string) => void;
}

interface MapLocation {
    id: string;
    name: string;
    description: string;
    top: string;
    left: string;
    icon: React.ReactNode;
    difficulty: "Low" | "High" | "Deadly";
    locked?: boolean;
}

const LOCATIONS: MapLocation[] = [
    {
        id: "heart_chamber",
        name: "The Heart's Chamber",
        description: "Larloch's inner sanctum. Facing the Shadow King himself.",
        top: "45%",
        left: "52%",
        icon: <Skull className="w-6 h-6 text-red-500 animate-pulse" />,
        difficulty: "Deadly"
    },
    {
        id: "underdark",
        name: "Upper Underdark",
        description: "Endless tunnels filled with dangerous denizens.",
        top: "70%",
        left: "30%",
        icon: <Mountain className="w-6 h-6 text-gray-400" />,
        difficulty: "High"
    },
    {
        id: "khelben_tower",
        name: "Blackstaff Tower",
        description: "Home of Khelben Arunsun. (Coming Soon)",
        top: "20%",
        left: "40%",
        icon: <Info className="w-6 h-6 text-blue-400" />,
        difficulty: "Low",
        locked: true
    }
];

export default function WorldMap({ onSelectLocation }: WorldMapProps) {
    const [hoveredLoc, setHoveredLoc] = useState<MapLocation | null>(null);

    return (
        <div className="fixed inset-0 z-50 bg-[#050505] text-[#d4c391] font-serif flex items-center justify-center overflow-hidden">

            {/* BACKGROUND MAP */}
            <div className="absolute inset-0 opacity-60">
                <Image
                    src="/netheril_map.png"
                    alt="World Map"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            </div>

            {/* HEADER */}
            <div className="absolute top-8 left-0 right-0 text-center z-10 pointer-events-none">
                <h1 className="text-4xl font-bold uppercase tracking-[0.3em] text-[var(--gold-accent)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    Region Map
                </h1>
                <p className="text-sm text-gray-400 mt-2 tracking-widest">Select your destination</p>
            </div>

            {/* PINS CONTAINER */}
            <div className="relative w-full h-full max-w-5xl max-h-[80vh] border border-[#333] shadow-2xl bg-[#111]/50 backdrop-blur-sm rounded-lg overflow-hidden">
                <Image
                    src="/netheril_map.png"
                    alt="Region"
                    fill
                    className="object-cover opacity-80 hover:scale-105 transition-transform duration-[10s] ease-linear"
                />

                {/* LOCATIONS */}
                {LOCATIONS.map(loc => (
                    <button
                        key={loc.id}
                        onClick={() => !loc.locked && onSelectLocation(loc.id)}
                        onMouseEnter={() => setHoveredLoc(loc)}
                        onMouseLeave={() => setHoveredLoc(null)}
                        style={{ top: loc.top, left: loc.left }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-full border-2 transition-all duration-300 z-20
                            ${loc.locked
                                ? "bg-gray-800 border-gray-600 opacity-50 cursor-not-allowed"
                                : "bg-black/80 border-[#d4c391] hover:bg-[#a32222] hover:border-red-500 hover:scale-125 shadow-[0_0_15px_rgba(212,195,145,0.3)]"
                            }
                        `}
                    >
                        {loc.icon}
                    </button>
                ))}

                {/* TOOLTIP / INFO PANEL */}
                {hoveredLoc && (
                    <div
                        className="absolute z-30 w-64 p-4 bg-black/90 border border-[#d4c391] rounded-lg shadow-2xl pointer-events-none flex flex-col gap-2"
                        style={{
                            top: hoveredLoc.top,
                            left: hoveredLoc.left,
                            transform: "translate(20px, -50%)"
                        }}
                    >
                        <h3 className="font-bold text-lg text-[var(--gold-accent)]">{hoveredLoc.name}</h3>
                        <p className="text-xs text-gray-300 italic">{hoveredLoc.description}</p>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">Threat Level</span>
                            <span className={`text-xs font-bold ${hoveredLoc.difficulty === "Deadly" ? "text-red-500 animate-pulse" :
                                    hoveredLoc.difficulty === "High" ? "text-orange-400" : "text-green-400"
                                }`}>
                                {hoveredLoc.difficulty}
                            </span>
                        </div>
                        {hoveredLoc.locked && (
                            <div className="text-center text-xs text-red-800 font-bold bg-red-900/20 py-1 mt-1 rounded">
                                [LOCKED]
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* BACK BUTTON */}
            <div className="absolute bottom-8 left-8 z-50">
                <button className="px-6 py-2 bg-black/50 border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-all uppercase text-xs tracking-widest">
                    Return to Menu
                </button>
            </div>
        </div>
    );
}
