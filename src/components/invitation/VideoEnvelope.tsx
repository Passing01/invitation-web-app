"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface VideoEnvelopeProps {
    children: React.ReactNode;
    videoSrc: string;
    host?: string;
}

export function VideoEnvelope({ children, videoSrc, host }: VideoEnvelopeProps) {
    const [isStarted, setIsStarted] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [error, setError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleStart = () => {
        setIsStarted(true);
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.error("Video play failed:", err);
                // If play fails, we might still want to skip to opened
                // but let's try to just show the video and hope user can click play
            });
        }
    };

    const handleVideoEnd = () => {
        setIsOpened(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F265B0', '#4BC9FF', '#FFD700']
        });
    };

    const handleSkip = () => {
        setIsOpened(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F265B0', '#4BC9FF', '#FFD700']
        });
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const hostInitial = host ? host.charAt(0).toUpperCase() : 'J';

    return (
        <div className="relative w-full h-full min-h-screen bg-black overflow-hidden">
            <AnimatePresence>
                {!isOpened && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                        className="absolute inset-0 z-[100] flex items-center justify-center bg-black"
                    >
                        {/* Pre-render video but hide it until started */}
                        <video
                            ref={videoRef}
                            src={videoSrc}
                            className={cn(
                                "w-full h-full object-cover transition-opacity duration-1000",
                                isStarted ? "opacity-100" : "opacity-0 pointer-events-none"
                            )}
                            onEnded={handleVideoEnd}
                            onError={() => {
                                console.error("Video load error");
                                setError(true);
                            }}
                            playsInline
                        />

                        {(!isStarted || error) && (
                            <div
                                onClick={handleStart}
                                className="absolute inset-0 flex items-center justify-center cursor-pointer group bg-black/60 z-20"
                            >
                                <div className="relative flex flex-col items-center">
                                    <div className="absolute -inset-20 bg-[#D4AF37]/20 blur-3xl rounded-full animate-pulse" />
                                    <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-md group-hover:scale-105 transition-transform duration-500 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#D4AF37] to-[#b8860b] rounded-full flex items-center justify-center shadow-lg border border-white/20">
                                                <span className="text-white text-3xl md:text-5xl font-serif">{hostInitial}</span>
                                            </div>
                                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-serif pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Ouvrir</span>
                                        </div>
                                    </div>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="mt-8 text-white/40 text-[10px] uppercase tracking-[0.5em] font-light text-center px-6"
                                    >
                                        {error ? "Une erreur est survenue. Cliquer pour entrer quand même." : "Cliquer pour découvrir notre histoire"}
                                    </motion.p>
                                </div>
                            </div>
                        )}

                        {isStarted && !isOpened && (
                            <button
                                onClick={handleSkip}
                                className="absolute bottom-10 right-10 z-[110] px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/40 text-[10px] uppercase tracking-widest hover:bg-black/60 hover:text-white transition-all"
                            >
                                Passer l'intro
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0 }}
                animate={isOpened ? { opacity: 1 } : {}}
                transition={{ duration: 1 }}
                className={cn(
                    "w-full h-full",
                    !isOpened && "invisible"
                )}
            >
                {children}
            </motion.div>
        </div>
    );
}
