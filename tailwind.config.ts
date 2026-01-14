import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                header: ["var(--font-header)"],
                body: ["var(--font-body)"],
                mono: ["var(--font-mono)"],
            },
            animation: {
                "spin-slow": "spin-slow 8s linear infinite",
                "pulse-slow": "pulse-slow 3s ease-in-out infinite",
                "fade-in": "fade-in 0.5s ease-out forwards",
            },
        },
    },
    plugins: [],
};
export default config;
