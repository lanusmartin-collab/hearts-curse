"use client";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="no-print"
            style={{
                padding: "0.5rem 1rem",
                border: "2px solid var(--fg-color)",
                background: "transparent",
                color: "var(--fg-color)",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                cursor: "pointer",
                alignSelf: "start"
            }}
        >
            [PRINT_RECORD]
        </button>
    );
}
