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

    // Initial State: Collapsed (Icon only)
    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed-bottom-right arcane-button animate-pulse-slow"
                title="Open Arcane Engine"
            >
                {isPlaying ? (
                    <Music className="w-6 h-6 animate-spin-slow" style={{ width: '24px', height: '24px' }} />
                ) : (
                    <Music className="w-6 h-6" style={{ width: '24px', height: '24px' }} />
                )}
            </button>
        );
    }

    return (
        <div className="fixed-bottom-right animate-slide-up" style={{ width: '320px', zIndex: 90 }}>
            {/* Main Panel */}
            <div className="glass-panel">
                {/* Header */}
                <div className="p-4" style={{ borderBottom: '1px solid rgba(163,34,34,0.3)', background: 'linear-gradient(to right, #000, #1a0505, #000)' }}>

                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2" style={{ color: '#a32222' }}>
                            <Music className="w-4 h-4 animate-pulse-slow" style={{ width: '16px', height: '16px' }} />
                            <h3 className="text-xs uppercase tracking-widest font-bold" style={{ color: '#eecfa1' }}>Shadow Caster v2.0</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('local')}
                                className="text-xs font-bold uppercase"
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    background: activeTab === 'local' ? '#a32222' : 'transparent',
                                    color: activeTab === 'local' ? '#fff' : '#666',
                                    border: 'none'
                                }}
                            >
                                Local
                            </button>
                            <button
                                onClick={() => setActiveTab('spotify')}
                                className="text-xs font-bold uppercase"
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    background: activeTab === 'spotify' ? '#1DB954' : 'transparent',
                                    color: activeTab === 'spotify' ? '#000' : '#666',
                                    border: 'none'
                                }}
                            >
                                Spotify
                            </button>
                            <button onClick={() => setIsExpanded(false)} style={{ color: '#666', border: 'none', padding: 0 }}>
                                <ChevronDown style={{ width: '16px', height: '16px' }} />
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div style={{ minHeight: '140px' }}>
                        {activeTab === 'local' && (
                            <div className="flex-col gap-4">
                                {/* Visualizer Simulation */}
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', height: '40px', marginBottom: '10px', opacity: 0.5 }}>
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                width: '4px',
                                                backgroundColor: '#a32222',
                                                height: isPlaying ? `${Math.random() * 100}%` : '5%',
                                                transition: 'height 0.2s ease'
                                            }}
                                        />
                                    ))}
                                </div>

                                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#eecfa1', marginBottom: '4px' }}>
                                        {currentTrack?.title || "Awaiting Input..."}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {currentTrack?.category || "System Idle"}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <button
                                        onClick={togglePlay}
                                        disabled={!currentTrack}
                                        style={{
                                            background: '#a32222',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            padding: '12px',
                                            border: 'none',
                                            boxShadow: '0 0 15px rgba(163,34,34,0.4)',
                                            opacity: !currentTrack ? 0.5 : 1
                                        }}
                                    >
                                        {isPlaying ? <Pause style={{ width: '20px', height: '20px', fill: 'currentColor' }} /> : <Play style={{ width: '20px', height: '20px', fill: 'currentColor', marginLeft: '2px' }} />}
                                    </button>

                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={toggleMute} style={{ color: '#666', border: 'none' }}>
                                            {isMuted || volume === 0 ? <VolumeX style={{ width: '16px', height: '16px' }} /> : <Volume2 style={{ width: '16px', height: '16px' }} />}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={isMuted ? 0 : volume}
                                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                                            style={{ width: '100%', accentColor: '#a32222', height: '4px', background: '#333', borderRadius: '2px' }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => setShowPlaylist(!showPlaylist)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '4px',
                                            color: showPlaylist ? '#a32222' : '#666',
                                            background: showPlaylist ? 'rgba(163,34,34,0.1)' : 'transparent',
                                            border: 'none'
                                        }}
                                    >
                                        <ListMusic style={{ width: '20px', height: '20px' }} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'spotify' && (
                            <div className="flex-col gap-2">
                                <select
                                    style={{
                                        width: '100%',
                                        background: '#111',
                                        border: '1px solid #333',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        padding: '8px',
                                        color: '#ccc',
                                        marginBottom: '10px'
                                    }}
                                    onChange={(e) => setSpotifyUrl(e.target.value)}
                                    value={spotifyUrl}
                                >
                                    {SPOTIFY_PLAYLISTS.map((pl, i) => (
                                        <option key={i} value={pl.url}>{pl.name}</option>
                                    ))}
                                </select>

                                <iframe
                                    style={{ borderRadius: "8px", border: "none", width: "100%", height: "152px" }}
                                    src={spotifyUrl}
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
