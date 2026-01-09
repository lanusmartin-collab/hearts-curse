"use client";

import Link from "next/link";
import HandoutEditor from "@/components/HandoutEditor";

export default function DeliverablesPage() {
    return (
        <div style={{ background: "#111", minHeight: "100vh" }}>
            <div className="no-print" style={{ padding: "1rem", borderBottom: "1px solid #333" }}>
                <Link href="/" style={{ color: "#aaa", textDecoration: "none" }}>{"< BACK TO MAIN"}</Link>
            </div>
            <HandoutEditor />
        </div>
    );
}
