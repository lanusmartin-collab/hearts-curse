import { Suspense } from "react";
import MapsClient from "./MapsClient";

export default function MapsPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-20 font-mono text-xl animate-pulse">Initializing Cartography Systems...</div>}>
            <MapsClient />
        </Suspense>
    );
}
