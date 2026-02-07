"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface EnvelopeProps {
    children: React.ReactNode;
    host: string;
}

export function Envelope({ children, host }: EnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isBreaking, setIsBreaking] = useState(false);

    const handleOpen = () => {
        setIsBreaking(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F265B0', '#4BC9FF', '#FFD700']
        });
        setTimeout(() => setIsOpen(true), 800);
    };

    // Get first letter of host or 'V' for Vouvoie
    const initial = host ? host.charAt(0).toUpperCase() : 'V';

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#0f0f0f]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0, transition: { duration: 0.8 } }}
                        className="z-50 w-full max-w-lg px-4 cursor-pointer"
                        onClick={handleOpen}
                    >
                        <div className="relative group">
                            {/* Envelope Shadow */}
                            <div className="absolute -inset-4 bg-white/5 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />

                            {/* Outer Envelope */}
                            <div className="relative aspect-[4/3] bg-[#fdfaf5] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-[1.02] overflow-hidden rounded-sm">
                                {/* Texture Overlay */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                                {/* Flap Top */}
                                <motion.div
                                    className="absolute top-0 left-0 right-0 h-1/2 bg-[#f4ece0] z-20 origin-top shadow-md"
                                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                                    animate={isBreaking ? { rotateX: -160, y: -10, filter: 'brightness(0.8)' } : {}}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                />

                                {/* Content Peek */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border-[12px] border-double border-neutral-100/50 m-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <span className="text-[10px] uppercase tracking-[0.5em] font-light text-neutral-400 mb-4 block">Invitation Exclusive</span>
                                        <h2 className="text-3xl md:text-4xl font-serif text-neutral-800 tracking-tight leading-tight">
                                            {host}
                                        </h2>
                                        <div className="mt-8 flex items-center justify-center gap-4">
                                            <div className="h-[1px] w-8 bg-neutral-200" />
                                            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]">Prestige</span>
                                            <div className="h-[1px] w-8 bg-neutral-200" />
                                        </div>
                                        <p className="mt-12 text-[9px] uppercase tracking-[0.3em] text-neutral-400 animate-pulse">Toucher pour rompre le sceau</p>
                                    </motion.div>
                                </div>

                                {/* Bottom Part of Envelope */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#fdfaf5] z-10" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 50%)' }} />

                                {/* Wax Seal */}
                                <motion.div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                                    animate={isBreaking ? {
                                        scale: [1, 1.2, 0],
                                        opacity: [1, 1, 0],
                                        rotate: [0, 5, -5]
                                    } : {}}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-[#D4AF37] blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                                        <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] via-[#f5d061] to-[#b8860b] rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_5px_rgba(255,255,255,0.5)] flex items-center justify-center border border-[#b8860b]/50 relative overflow-hidden">
                                            {/* Reflection */}
                                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            <span className="text-white font-serif text-3xl drop-shadow-md select-none">{initial}</span>
                                        </div>
                                        {/* Seal Edges Effect */}
                                        <div className="absolute -inset-1 border-4 border-[#D4AF37]/20 rounded-full scale-110" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isOpen ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "w-full h-full relative z-0",
                    !isOpen && "hidden"
                )}
            >
                {children}
            </motion.div>
        </div>
    );
}
