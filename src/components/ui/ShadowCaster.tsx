"use client";

import { useState } from "react";
import { useAudio } from "@/components/providers/AudioProvider";
import { Music, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown, ListMusic } from "lucide-react";
import clsx from "clsx";

export default function ShadowCaster() {
    const { currentTrack, isPlaying, volume, isMuted, playTrack, togglePlay, setVolume, toggleMute, availableTracks } = useAudio();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [activeTab, setActiveTab] = useState<'local' | 'spotify'>('local');
    const [spotifyUrl, setSpotifyUrl] = useState("https://open.spotify.com/embed/playlist/314GRwl6tg6qyh33ac8aqv?utm_source=generator");

    const SPOTIFY_PLAYLISTS = [
        { name: "Curse of Strahd / Dark Ambience", url: "https://open.spotify.com/embed/playlist/314GRwl6tg6qyh33ac8aqv?utm_source=generator" },
        { name: "Dark Souls OST", url: "https://open.spotify.com/embed/album/0xhIDcWedKalYBS9WjHk8E?utm_source=generator" },
        { name: "Elden Ring OST", url: "https://open.spotify.com/embed/album/6JR4qLOXu96krMWxBTpXSR?utm_source=generator" }
    ];

    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-6 right-6 z-[90] group transition-transform hover:scale-110"
                title="Open Arcane Engine"
            >
                <div className="absolute inset-0 bg-[#a32222] opacity-20 Blur-xl rounded-full animate-pulse-slow"></div>
                <div className="relative bg-black/90 text-[#a32222] border border-[#a32222] rounded-full p-4 shadow-[0_0_20px_rgba(163,34,34,0.4)] ring-2 ring-black/50">
                    {isPlaying ? (
                        <Music className="w-6 h-6 animate-spin-slow drop-shadow-[0_0_5px_currentColor]" />
                    ) : (
                        <Music className="w-6 h-6" />
                    )}
                </div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-[90] w-80 perspective-1000 animate-in slide-in-from-bottom-8 duration-500 fade-in">
            {/* Main Panel */}
            <div className="bg-[#0a0a0a]/95 text-white border border-[#a32222]/50 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(163,34,34,0.2)] backdrop-blur-xl overflow-hidden flex flex-col font-sans ring-1 ring-white/10">
                {/* Header */}
                <div className="relative p-4 border-b border-[#a32222]/30 bg-gradient-to-r from-black via-[#1a0505] to-black">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#a32222] to-transparent opacity-50"></div>

                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-[#a32222]">
                            <Music className="w-4 h-4 animate-pulse" />
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#eecfa1]">Shadow Caster v2.0</h3>
                        </div>
                        <div className="flex gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
                            <button
                                onClick={() => setActiveTab('local')}
                                className={clsx(
                                    "px-3 py-1 text-[9px] uppercase font-bold rounded transition-all",
                                    activeTab === 'local' ? "bg-[#a32222] text-white shadow-lg" : "text-[#666] hover:text-[#bbb]"
                                )}
                            >
                                Local
                            </button>
                            <button
                                onClick={() => setActiveTab('spotify')}
                                className={clsx(
                                    "px-3 py-1 text-[9px] uppercase font-bold rounded transition-all",
                                    activeTab === 'spotify' ? "bg-[#1DB954] text-black shadow-lg" : "text-[#666] hover:text-[#bbb]"
                                )}
                            >
                                Spotify
                            </button>
                        </div>
                        <button onClick={() => setIsExpanded(false)} className="text-[#666] hover:text-[#a32222] transition-colors ml-2">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="relative min-h-[140px]">
                        {activeTab === 'local' && (
                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                {/* Visulizer Simulation */}
                                <div className="flex items-end justify-center gap-[2px] h-12 mb-2 opacity-50 mask-gradient-b">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-[#a32222]"
                                            style={{
                                                height: isPlaying ? `${Math.random() * 100}%` : '5%',
                                                transition: 'height 0.2s ease',
                                                animation: isPlaying ? `bounce ${0.5 + Math.random()}s infinite` : 'none'
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="text-center">
                                    <div className="text-sm font-bold truncate text-[#eecfa1] mb-1 font-serif tracking-wide drop-shadow-md">
                                        {currentTrack?.title || "Awaiting Input..."}
                                    </div>
                                    <div className="text-[10px] text-[#888] uppercase tracking-widest">{currentTrack?.category || "System Idle"}</div>
                                </div>

                                <div className="flex items-center gap-4 px-2">
                                    <button
                                        onClick={togglePlay}
                                        disabled={!currentTrack}
                                        className="bg-[#a32222] text-white rounded-full p-3 hover:bg-[#c93333] hover:scale-105 transition-all shadow-[0_0_15px_rgba(163,34,34,0.4)] disabled:opacity-50 disabled:grayscale"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                    </button>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <button onClick={toggleMute} className="text-[#666] hover:text-[#eecfa1]">
                                                {isMuted || volume === 0 ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={isMuted ? 0 : volume}
                                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-[#333] rounded-lg appearance-none cursor-pointer accent-[#a32222]"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowPlaylist(!showPlaylist)}
                                        className={clsx(
                                            "p-2 rounded transition-colors",
                                            showPlaylist ? 'text-[#a32222] bg-[#a32222]/10' : 'text-[#666] hover:text-[#eecfa1]'
                                        )}
                                    >
                                        <ListMusic className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'spotify' && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                <select
                                    className="w-full bg-[#111] border border-[#333] rounded text-[10px] p-2 text-[#ccc] focus:border-[#1DB954] outline-none transition-colors"
                                    onChange={(e) => setSpotifyUrl(e.target.value)}
                                    value={spotifyUrl}
                                >
                                    {SPOTIFY_PLAYLISTS.map((pl, i) => (
                                        <option key={i} value={pl.url}>{pl.name}</option>
                                    ))}
                                    # </select>

                                <iframe
                                    style={{ borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                                    src={spotifyUrl}
                                    width="100%"
                                    height="152"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>

                {/* Local Playlist Drawer */}
                {activeTab === 'local' && showPlaylist && (
                    <div className="bg-black/80 border-t border-white/5 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-[#a32222]/50">
                        {availableTracks.map(track => (
                            <button
                                key={track.id}
                                onClick={() => playTrack(track)}
                                className={clsx(
                                    "w-full text-left px-4 py-3 text-[10px] border-b border-white/5 transition-colors flex justify-between items-center group",
                                    currentTrack?.id === track.id ? "bg-[#a32222]/10 text-[#a32222]" : "text-[#888] hover:bg-white/5 hover:text-[#ccc]"
                                )}
                            >
                                <span className={clsx("font-medium", currentTrack?.id === track.id && "font-bold")}>{track.title}</span>
                                {currentTrack?.id === track.id && isPlaying && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#a32222] animate-pulse shadow-[0_0_8px_#a32222]" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-[#a32222]/20 blur-3xl rounded-full -z-10 animate-pulse-slow pointer-events-none"></div>
        </div>
    );
}
