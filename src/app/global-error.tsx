"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body style={{ background: "#0a0a0c", color: "#ff4444", fontFamily: "sans-serif", padding: "2rem" }}>
                <div style={{ maxWidth: "600px", margin: "0 auto", border: "1px solid #ff4444", padding: "2rem", borderRadius: "8px" }}>
                    <h2 style={{ marginTop: 0 }}>CRITICAL SYSTEM FAILURE</h2>
                    <p>The application has crashed. Please report the following error:</p>
                    <pre style={{ background: "#000", padding: "1rem", overflow: "auto", color: "#fff", marginBottom: "1rem" }}>
                        {error.message}
                        {error.stack && `\n\n${error.stack}`}
                    </pre>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: "0.5rem 1rem",
                            background: "#ff4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        ATTEMPT REBOOT
                    </button>
                </div>
            </body>
        </html>
    );
}
