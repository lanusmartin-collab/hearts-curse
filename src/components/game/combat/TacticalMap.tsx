import React from 'react';
import { Combatant } from '@/types/combat';
import { User, Skull, Ghost } from 'lucide-react';

interface TacticalMapProps {
    combatants: Combatant[];
    activeCombatantId?: string;
    canMove: boolean;
    onMove: (id: string, x: number, y: number) => void;
    aoeMode?: { radius: number, onConfirm: (x: number, y: number) => void } | null;
    targetingMode?: { range: number, onSelect: (targetId: string | null) => void } | null;
}

// 10x10 Grid for simplicity
const GRID_SIZE = 10;

export default function TacticalMap({ combatants, activeCombatantId, canMove, onMove, aoeMode, targetingMode }: TacticalMapProps) {
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
    const [hoveredTile, setHoveredTile] = React.useState<{ x: number, y: number } | null>(null);

    React.useEffect(() => {
        // Initialize positions if empty or mismatch
        if (combatants.length === 0) return;

        setPositions(prev => {
            const newPos = { ...prev };
            let changed = false;
            combatants.forEach((c, i) => {
                if (!newPos[c.id]) {
                    if (c.type === 'player') {
                        newPos[c.id] = { x: 2, y: 4 };
                    } else {
                        newPos[c.id] = { x: 9, y: 2 + (i % 6) }; // Spread better
                    }
                    changed = true;
                }
            });
            return changed ? newPos : prev;
        });
    }, [combatants, activeCombatantId]); // Add activeCombatantId dependency to ensure redraw

    const getDistance = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) * 5;
    };

    const handleTileClick = (x: number, y: number) => {
        if (aoeMode) {
            aoeMode.onConfirm(x, y);
            return;
        }

        // If simply clicking a tile in targeting mode (no target there), do nothing or handle ground click
        if (targetingMode) {
            // Check if valid target exists here
            const target = combatants.find(c => {
                const pos = positions[c.id];
                return pos && pos.x === x && pos.y === y;
            });

            if (target) {
                const sourcePos = activeCombatantId ? positions[activeCombatantId] : null;
                if (sourcePos) {
                    const dist = getDistance(sourcePos, { x, y });
                    if (dist <= targetingMode.range) {
                        targetingMode.onSelect(target.id);
                    }
                }
            }
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

    const activePos = activeCombatantId ? positions[activeCombatantId] : null;

    return (
        <div
            className="relative w-[800px] h-[600px] border-4 border-[#333] shadow-2xl overflow-hidden grid grid-cols-12 grid-rows-8 gap-1 p-4"
            style={{
                backgroundColor: '#1a1515',
                backgroundImage: "url('/locations/dungeon_floor.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            onMouseLeave={() => setHoveredTile(null)}
        >
            {/* Grid Cells */}
            {Array.from({ length: 96 }).map((_, i) => {
                const x = i % 12;
                const y = Math.floor(i / 12);

                let isHighlighted = false;
                let isOutOfRange = false;

                // AOE Logic
                if (aoeMode && hoveredTile) {
                    const dist = Math.sqrt(Math.pow(x - hoveredTile.x, 2) + Math.pow(y - hoveredTile.y, 2)) * 5;
                    if (dist <= aoeMode.radius + 2.5) {
                        isHighlighted = true;
                    }
                }

                // Range Logic
                if ((aoeMode || targetingMode) && activePos) {
                    const distToActive = getDistance(activePos, { x, y });
                    // If AOE, we check range to CENTER of AOE
                    // If Targeting, we check range to TILE
                    const maxRange = aoeMode ? 120 : (targetingMode?.range || 5); // Default 120 for spells

                    if (distToActive > maxRange + 2.5) {
                        isOutOfRange = true;
                    }
                }


                return (
                    <div
                        key={i}
                        onClick={() => handleTileClick(x, y)}
                        onMouseEnter={() => setHoveredTile({ x, y })}
                        className={`border border-[#ffffff10] transition-colors
                            ${!isOutOfRange && !aoeMode && !targetingMode ? 'hover:bg-[#ffffff20] cursor-crosshair' : ''}
                            ${isHighlighted ? 'bg-red-500/40 border-red-500 shadow-[inset_0_0_10px_red]' : ''}
                            ${isOutOfRange ? 'bg-black/60 cursor-not-allowed border-black/50' : ''}
                            ${(aoeMode && !isOutOfRange && !isHighlighted) ? 'hover:bg-red-900/20 cursor-crosshair' : ''}
                            ${(targetingMode && !isOutOfRange) ? 'hover:bg-blue-900/20 cursor-pointer' : ''}
                        `}
                    ></div>
                );
            })}

            {/* Entities */}
            {combatants.map(c => {
                const pos = positions[c.id] || { x: 0, y: 0 };
                const isActive = c.id === activeCombatantId;

                // Check if this entity is a valid target in range
                let isValidTarget = false;
                if (targetingMode && activePos) {
                    const dist = getDistance(activePos, pos);
                    if (dist <= targetingMode.range) {
                        isValidTarget = true;
                    }
                }

                return (
                    <div
                        key={c.id}
                        onClick={() => handleTileClick(pos.x, pos.y)}
                        className={`absolute transition-all duration-500 ease-in-out flex flex-col items-center justify-center 
                         ${isValidTarget ? 'cursor-pointer z-30' : 'pointer-events-none'}`}
                        // Note: We need pointer-events-auto for click to pass through to grid IF we rely on grid click, 
                        // BUT we might want direct click on entity. 
                        // The grid handles the click logic by coordinates, so pointer-events-none is safer 
                        // UNLESS we explicitly add onClick here. 
                        // Current Architecture: Grid click handler finds entity at X,Y. So pointer-events-none is correct.
                        style={{
                            left: `${16 + pos.x * ((800 - 32) / 12) + ((800 - 32) / 24) - 24}px`,
                            top: `${16 + pos.y * ((600 - 32) / 8) + ((600 - 32) / 16) - 24}px`,
                            width: '3rem',
                            height: '3rem'
                        }}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg
                            ${c.type === 'player' ? 'bg-blue-900 border-blue-400' : 'bg-red-900 border-red-500'}
                            ${isActive ? 'scale-125 ring-2 ring-white z-20' : 'scale-100 z-10'}
                            ${isValidTarget ? 'ring-2 ring-green-400 animate-pulse' : ''}
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
