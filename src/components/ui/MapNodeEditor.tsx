import { MapNode } from "@/lib/data/maps";
import { useState, useEffect } from "react";

interface MapNodeEditorProps {
    node: MapNode;
    onSave: (node: MapNode) => void;
    onDelete: (nodeId: string) => void;
    onClose: () => void;
}

export default function MapNodeEditor({ node, onSave, onDelete, onClose }: MapNodeEditorProps) {
    const [editedNode, setEditedNode] = useState<MapNode>({ ...node });

    useEffect(() => {
        setEditedNode({ ...node });
    }, [node]);

    const handleChange = (field: keyof MapNode, value: string | number) => {
        setEditedNode(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border-2 border-amber-600 w-full max-w-lg p-6 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                <h3 className="text-xl font-bold text-amber-500 mb-4 uppercase tracking-widest border-b border-gray-700 pb-2">
                    Edit Node: {editedNode.id}
                </h3>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                    {/* ID */}
                    <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">ID (Unique)</label>
                        <input
                            type="text"
                            value={editedNode.id}
                            onChange={(e) => handleChange("id", e.target.value)}
                            className="w-full bg-black border border-gray-700 p-2 text-white font-mono text-sm"
                        />
                    </div>

                    {/* Label */}
                    <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">Label</label>
                        <input
                            type="text"
                            value={editedNode.label}
                            onChange={(e) => handleChange("label", e.target.value)}
                            className="w-full bg-black border border-gray-700 p-2 text-white font-mono text-sm"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">Type</label>
                        <select
                            value={editedNode.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            className="w-full bg-black border border-gray-700 p-2 text-white font-mono text-sm uppercase"
                        >
                            <option value="encounter">Encounter (Sword)</option>
                            <option value="boss">Boss (Skull)</option>
                            <option value="loot">Loot (Chest)</option>
                            <option value="quest">Quest (!)</option>
                            <option value="info">Info (i)</option>
                            <option value="entrance">Entrance (Door)</option>
                            <option value="trap">Trap (Triangle)</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">Description (Markdown Supported)</label>
                        <textarea
                            value={editedNode.description || ""}
                            onChange={(e) => handleChange("description", e.target.value)}
                            rows={5}
                            className="w-full bg-black border border-gray-700 p-2 text-white font-mono text-sm resize-y"
                        />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">Nav Link (Optional)</label>
                        <input
                            type="text"
                            value={editedNode.link || ""}
                            onChange={(e) => handleChange("link", e.target.value)}
                            placeholder="/maps?id=some_map"
                            className="w-full bg-black border border-gray-700 p-2 text-white font-mono text-sm"
                        />
                    </div>

                    {/* Item ID */}
                    <div>
                        <label className="block text-xs uppercase text-gray-500 mb-1">Item ID (Optional, for Shop/Loot logic)</label>
                        <input
                            type="text"
                            value={editedNode.itemId || ""}
                            onChange={(e) => handleChange("itemId", e.target.value)}
                            placeholder="Exact Item Name"
                            className="w-full bg-black border border-gray-700 p-2 text-white font-mono text-sm"
                        />
                    </div>

                    {/* Coordinates */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs uppercase text-gray-500 mb-1">X %</label>
                            <input
                                type="number"
                                value={Math.round(editedNode.x)}
                                onChange={(e) => handleChange("x", parseInt(e.target.value))}
                                className="w-full bg-black border border-gray-700 p-2 text-white font-mono text-sm"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs uppercase text-gray-500 mb-1">Y %</label>
                            <input
                                type="number"
                                value={Math.round(editedNode.y)}
                                onChange={(e) => handleChange("y", parseInt(e.target.value))}
                                className="w-full bg-black border border-gray-700 p-2 text-white font-mono text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                    <button
                        onClick={() => onDelete(editedNode.id)}
                        className="bg-red-900/50 hover:bg-red-900 text-red-200 text-xs uppercase px-4 py-2 border border-red-800 transition-colors"
                    >
                        Delete Node
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs uppercase px-4 py-2 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave(editedNode)}
                            className="bg-green-900/50 hover:bg-green-800 text-green-100 text-xs uppercase px-4 py-2 border border-green-700 transition-colors font-bold"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
