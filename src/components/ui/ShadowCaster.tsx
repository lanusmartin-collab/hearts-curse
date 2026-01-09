"use client";

import { useState } from "react";
import { useAudio } from "@/components/providers/AudioProvider";
import { Music, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown, ListMusic } from "lucide-react";
import clsx from "clsx";

export default function ShadowCaster() {
    const { currentTrack, isPlaying, volume, isMuted, playTrack, togglePlay, setVolume, toggleMute, availableTracks } = useAudio();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);

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
        <div className="fixed bottom-4 right-4 z-[90] w-72 bg-black/90 text-white border border-accent rounded-lg shadow-2xl backdrop-blur-md overflow-hidden flex flex-col font-sans animate-in slide-in-from-bottom-4 duration-300">
            {/* Header / Main Control */}
            <div className="p-4 bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs uppercase tracking-widest text-accent font-bold flex items-center gap-2">
                        <Music className="w-3 h-3" /> Shadow Caster
                    </h3>
                    <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white">
                        <ChevronDown className="w-4 h-4" />
                    </button>
                </div>

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
            </div>

            {/* Playlist (Collapsible) */}
            {showPlaylist && (
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
