"use client";

import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
    text: string;
    speed?: number;
    delay?: number;
    onComplete?: () => void;
    className?: string;
    cursorChar?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
    text,
    speed = 30,
    delay = 0,
    onComplete,
    className = "",
    cursorChar = "▋"
}) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const index = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Reset when text changes
    useEffect(() => {
        setDisplayedText("");
        setIsComplete(false);
        index.current = 0;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        const startTyping = () => {
            timeoutRef.current = setTimeout(() => {
                if (index.current < text.length) {
                    setDisplayedText((prev) => prev + text.charAt(index.current));
                    index.current++;
                    startTyping();
                } else {
                    setIsComplete(true);
                    if (onComplete) onComplete();
                }
            }, speed);
        };

        if (delay > 0) {
            timeoutRef.current = setTimeout(startTyping, delay);
        } else {
            startTyping();
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [text, speed, delay, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {!isComplete && (
                <span className="animate-pulse ml-1 text-[#a32222]">{cursorChar}</span>
            )}
        </span>
    );
};
