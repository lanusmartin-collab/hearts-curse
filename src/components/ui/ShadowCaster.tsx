"use client";

import { useState } from "react";
import { useAudio } from "@/components/providers/AudioProvider";
import { Music, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown, ListMusic } from "lucide-react";
import clsx from "clsx";

export default function ShadowCaster() {
    const { currentTrack, isPlaying, volume, isMuted, playTrack, togglePlay, setVolume, toggleMute, availableTracks } = useAudio();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);

    // [NEW] Spotify State
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
                className="fixed bottom-4 right-4 z-[90] bg-black/80 text-accent border border-accent rounded-full p-3 shadow-[0_0_15px_rgba(138,28,28,0.5)] hover:scale-110 transition-transform animate-pulse-slow"
                title="Open Atmosphere Engine"
            >
                {isPlaying ? <Music className="w-6 h-6 animate-spin-slow" /> : <Music className="w-6 h-6" />}
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-[90] w-80 bg-black/90 text-white border border-accent rounded-lg shadow-2xl backdrop-blur-md overflow-hidden flex flex-col font-sans animate-in slide-in-from-bottom-4 duration-300">
            {/* Header / Main Control */}
            <div className="p-4 bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs uppercase tracking-widest text-accent font-bold flex items-center gap-2">
                        <Music className="w-3 h-3" /> Shadow Caster
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('local')}
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${activeTab === 'local' ? 'bg-accent text-black' : 'bg-gray-800 text-gray-400'}`}
                        >
                            Local
                        </button>
                        <button
                            onClick={() => setActiveTab('spotify')}
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${activeTab === 'spotify' ? 'bg-[#1DB954] text-black' : 'bg-gray-800 text-gray-400'}`}
                        >
                            Spotify
                        </button>
                        <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white ml-2">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* LOCAL AUDIO PLAYER */}
                {activeTab === 'local' && (
                    <>
                        {/* Track Info */}
                        <div className="mb-4">
                            <div className="text-sm font-bold truncate text-white">
                                {currentTrack?.title || "No Track Selected"}
                            </div>
                            <div className="text-xs text-gray-500 uppercase">{currentTrack?.category || "Idle"}</div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-between items-center">
                            <button
                                onClick={togglePlay}
                                disabled={!currentTrack}
                                className="bg-accent text-black rounded-full p-2 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                            </button>

                            <div className="flex items-center gap-2 flex-1 mx-4">
                                <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                                />
                            </div>

                            <button
                                onClick={() => setShowPlaylist(!showPlaylist)}
                                className={`p-2 rounded hover:bg-gray-800 transition-colors ${showPlaylist ? 'text-accent' : 'text-gray-400'}`}
                            >
                                <ListMusic className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}

                {activeTab === 'spotify' && (
                    <div className="space-y-3">
                        <select
                            className="w-full bg-gray-900 border border-gray-700 rounded text-xs p-1 text-white"
                            onChange={(e) => setSpotifyUrl(e.target.value)}
                            value={spotifyUrl}
                        >
                            {SPOTIFY_PLAYLISTS.map((pl, i) => (
                                <option key={i} value={pl.url}>{pl.name}</option>
                            ))}
                        </select>

                        <iframe
                            style={{ borderRadius: "12px" }}
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

            {/* Playlist (Collapsible) - Only for Local */}
            {activeTab === 'local' && showPlaylist && (
                <div className="max-h-48 overflow-y-auto bg-black/50 p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
                    {availableTracks.map(track => (
                        <button
                            key={track.id}
                            onClick={() => playTrack(track)}
                            className={clsx(
                                "w-full text-left px-3 py-2 text-xs rounded hover:bg-white/10 transition-colors flex justify-between items-center group",
                                currentTrack?.id === track.id ? "bg-accent/20 text-accent font-bold" : "text-gray-300"
                            )}
                        >
                            <span>{track.title}</span>
                            {currentTrack?.id === track.id && isPlaying && <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
