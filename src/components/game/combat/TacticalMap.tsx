import React from 'react';
import { Combatant } from '@/types/combat';
import { User, Skull, Ghost } from 'lucide-react';

interface TacticalMapProps {
    combatants: Combatant[];
    activeCombatantId?: string;
    canMove: boolean;
    onMove: (id: string, x: number, y: number) => void;
    aoeMode?: { radius: number, onConfirm: (x: number, y: number) => void } | null;
}

// 10x10 Grid for simplicity
const GRID_SIZE = 10;

export default function TacticalMap({ combatants, activeCombatantId, canMove, onMove, aoeMode }: TacticalMapProps) {
    // Determine positions (mock logic if not stored in combatant)
    // In a real app, combatant would have {x, y} coordinates.
    // For now, let's deterministically position them based on ID index

    // We need local state for positions since they aren't in the Combatant type yet
    // But we can't easily persist that without bubbling up.
    // Let's assume CombatLayout handles passing {x,y} in the future.
    // For this HOTFIX, we will just render them in fixed slots.

    // Better: Render a simple grid where clicking an empty cell moves the active combatant.
    // We will render a 12x8 grid.

    const [positions, setPositions] = React.useState<Record<string, { x: number, y: number }>>({});

    React.useEffect(() => {
        // Initialize positions
        const newPos: any = {};
        combatants.forEach((c, i) => {
            if (c.type === 'player') {
                newPos[c.id] = { x: 2, y: 4 }; // Left side
            } else {
                newPos[c.id] = { x: 9, y: 2 + (i * 2) }; // Right side
            }
        });
        setPositions(newPos);
    }, [combatants.length]);

    const handleTileClick = (x: number, y: number) => {
        if (aoeMode) {
            aoeMode.onConfirm(x, y);
            return;
        }

        if (canMove && activeCombatantId) {
            setPositions(prev => ({
                ...prev,
                [activeCombatantId]: { x, y }
            }));
            onMove(activeCombatantId, x, y);
        }
    };

    return (
        <div className="relative w-[800px] h-[600px] bg-[#1a1515] border-4 border-[#333] shadow-2xl overflow-hidden grid grid-cols-12 grid-rows-8 gap-1 p-4 bg-[url('/locations/dungeon_floor.jpg')] bg-cover">
            {/* Grid Cells */}
            {Array.from({ length: 96 }).map((_, i) => {
                const x = i % 12;
                const y = Math.floor(i / 12);
                return (
                    <div
                        key={i}
                        onClick={() => handleTileClick(x, y)}
                        className={`border border-[#ffffff10] hover:bg-[#ffffff20] transition-colors cursor-crosshair ${aoeMode ? 'hover:bg-red-500/30' : ''}`}
                    ></div>
                );
            })}

            {/* Entities */}
            {combatants.map(c => {
                const pos = positions[c.id] || { x: 0, y: 0 };
                const isActive = c.id === activeCombatantId;

                return (
                    <div
                        key={c.id}
                        className="absolute transition-all duration-500 ease-in-out flex flex-col items-center justify-center pointer-events-none"
                        style={{
                            left: `calc(1rem + ${pos.x} * ((800px - 2rem) / 12) + ${(800px - 2rem) / 24
            }px - 1.5rem)`, // Center in cell
                            top: `calc(1rem + ${pos.y} * ((600px - 2rem) / 8) + ${(600px - 2rem) / 16}px - 1.5rem)`,
            width: '3rem',
            height: '3rem'
                        }}
                     >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg
                            ${c.type === 'player' ? 'bg-blue-900 border-blue-400' : 'bg-red-900 border-red-500'}
                            ${isActive ? 'scale-125 ring-2 ring-white z-20' : 'scale-100 z-10'}
                         `}>
                {c.type === 'player' ? <User className="w-6 h-6 text-blue-200" /> : <Skull className="w-6 h-6 text-red-200" />}
            </div>
            {/* Health Bar */}
            <div className="w-12 h-1 bg-black mt-1">
                <div className="h-full bg-green-500" style={{ width: `${(c.hp / c.maxHp) * 100}%` }}></div>
            </div>
        </div>
    );
})}
        </div >
    );
}
