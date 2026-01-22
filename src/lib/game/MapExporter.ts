import { MapNode } from "@/components/editor/NodeEditorCanvas";

export function exportMap(nodes: MapNode[], filename: string = "campaign_map.json") {
    const data = JSON.stringify(nodes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function importMap(file: File): Promise<MapNode[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const nodes = JSON.parse(text) as MapNode[];
                // Basic validation
                if (!Array.isArray(nodes)) throw new Error("Invalid map format: Not an array");
                // Ensure ID existence?
                resolve(nodes);
            } catch (err) {
                reject(err);
            }
        };
        reader.readAsText(file);
    });
}
