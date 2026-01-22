"use client";

import { useState, useRef, useEffect } from "react";
import { AiService } from "@/lib/ai/AiService";
import { MessageSquare, Send, User } from "lucide-react";

interface ChatMessage {
    id: string;
    sender: "user" | "npc";
    text: string;
}

export default function NpcChat() {
    const [npcName, setNpcName] = useState("Mysterious Stranger");
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: "1", sender: "npc", text: "Greetings. What brings you to this cursed place?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = { id: Date.now().toString(), sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await AiService.generateNpcChat(npcName, ["Mysterious"], userMsg.text);
            const npcMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: "npc",
                text: response.text.replace(`[${npcName}]: `, "").replace(/^"|"$/g, "")
            };
            setMessages(prev => [...prev, npcMsg]);
        } catch (e) {
            // Error handling
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="bg-[#0e0e0e] border border-[#333] rounded-lg flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-4 border-b border-[#333] flex justify-between items-center bg-[#111]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-[var(--gold-accent)]">
                        <User size={16} />
                    </div>
                    <div>
                        <input
                            type="text"
                            className="bg-transparent text-sm font-bold text-[var(--gold-accent)] focus:outline-none focus:border-b border-[#444]"
                            value={npcName}
                            onChange={(e) => setNpcName(e.target.value)}
                        />
                        <div className="text-[10px] text-[#666] uppercase font-mono">Click name to edit</div>
                    </div>
                </div>
                <div className="text-[10px] text-[#444] font-mono px-2 py-1 border border-[#222] rounded">
                    MOCK ORACLE CONNECTED
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded text-sm ${msg.sender === "user"
                                ? "bg-[#222] text-[#d4d4d4] rounded-br-none"
                                : "bg-[#1a0505] border border-[#330505] text-[#ccc] rounded-bl-none"
                            }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-[#1a0505] border border-[#330505] px-3 py-2 rounded text-[#666] text-xs italic">
                            Typing...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[#333] flex gap-2 bg-[#111]">
                <input
                    type="text"
                    className="flex-1 bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white focus:border-[var(--gold-accent)] outline-none rounded"
                    placeholder="Type your reply..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="p-2 bg-[var(--gold-accent)] text-black rounded hover:bg-[#e0b84f] transition"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}
