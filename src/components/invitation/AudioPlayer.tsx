"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
    url?: string;
}

export function AudioPlayer({ url }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current && isPlaying) {
            audioRef.current.play().catch(err => {
                console.warn("Autoplay blocked by browser", err);
                setIsPlaying(false);
            });
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    if (!url) return null;

    return (
        <div className="fixed top-6 right-6 z-[70]">
            <audio ref={audioRef} src={url} loop />
            <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center justify-center w-10 h-10 transition-all duration-500 bg-white/50 border border-black/10 rounded-full backdrop-blur-md hover:bg-white hover:scale-110"
                aria-label={isPlaying ? "Mute" : "Unmute"}
            >
                {isPlaying ? (
                    <Volume2 size={18} className="text-black" />
                ) : (
                    <VolumeX size={18} className="text-black/40" />
                )}
            </button>
        </div>
    );
}
