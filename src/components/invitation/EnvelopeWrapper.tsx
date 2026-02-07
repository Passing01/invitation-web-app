"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

import { TemplateConfig } from '@/lib/templates';
import { VideoEnvelope } from './VideoEnvelope';

interface EnvelopeWrapperProps {
    children: React.ReactNode;
    host: string;
    themeColor?: string;
    config: TemplateConfig;
}

export function EnvelopeWrapper({ children, host, themeColor = "#D4AF37", config }: EnvelopeWrapperProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullyOpen, setIsFullyOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // If the template has a video opening, use the VideoEnvelope component
    if (config.openingVideoUrl) {
        return (
            <VideoEnvelope videoSrc={config.openingVideoUrl} host={host}>
                {children}
            </VideoEnvelope>
        );
    }

    return (
        <div ref={containerRef} className="relative flex items-center justify-center min-h-[100dvh] overflow-hidden bg-[#0f0f0f]">
            <AnimatePresence>
                {!isFullyOpen && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        exit={{
                            scale: 1.2,
                            opacity: 0,
                            y: -500,
                            transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
                        }}
                        className="z-50 w-full max-w-lg px-4 cursor-pointer perspective-1000"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="relative preserve-3d">
                            {/* Back of Envelope */}
                            <div className="relative aspect-[4/3] bg-[#fdfaf5] shadow-2xl rounded-sm">
                                {/* Internal Content Peek */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-40">
                                    <div className="w-32 h-40 border border-neutral-300 rounded shadow-sm bg-white/50" />
                                </div>

                                {/* Bottom Flap (Back) */}
                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#f4ece0] clip-path-bottom-flap z-10" />

                                {/* Side Flaps */}
                                <div className="absolute inset-y-0 left-0 w-1/2 bg-[#fcf5eb] clip-path-left-flap z-10" />
                                <div className="absolute inset-y-0 right-0 w-1/2 bg-[#fcf5eb] clip-path-right-flap z-10" />

                                {/* Top Flap (Animated) */}
                                <motion.div
                                    initial={false}
                                    animate={{ rotateX: isOpen ? -180 : 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    onAnimationComplete={() => isOpen && setIsFullyOpen(true)}
                                    className="absolute top-0 left-0 right-0 h-1/2 bg-[#efe6d8] origin-top z-20 shadow-lg"
                                    style={{
                                        clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                                        transformStyle: 'preserve-3d',
                                        backfaceVisibility: 'hidden',
                                    }}
                                />

                                {/* Seal */}
                                <motion.div
                                    animate={{
                                        opacity: isOpen ? 0 : 1,
                                        scale: isOpen ? 0.5 : 1,
                                        y: isOpen ? -20 : 0
                                    }}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                                >
                                    <div
                                        className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center bg-gradient-to-br from-[#D4AF37] via-[#f5d061] to-[#b8860b] border border-white/20"
                                    >
                                        <span className="text-white font-serif text-2xl drop-shadow-md">
                                            {host.charAt(0)}
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Label */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-0">
                                    <span className="text-[10px] uppercase tracking-[0.4em] font-light text-neutral-400 mb-2">Invitation Exclusive</span>
                                    <h2 className="text-xl md:text-2xl font-serif text-neutral-800 tracking-tight">{host}</h2>
                                    <div className="mt-6 w-12 h-[1px] bg-[#D4AF37]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                animate={isFullyOpen ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn(
                    "w-full h-full",
                    !isFullyOpen && "hidden"
                )}
            >
                {children}
            </motion.div>

            <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .clip-path-bottom-flap { clip-path: polygon(0 100%, 100% 100%, 50% 0); }
        .clip-path-left-flap { clip-path: polygon(0 0, 100% 50%, 0 100%); }
        .clip-path-right-flap { clip-path: polygon(100% 0, 0 50%, 100% 100%); }
      `}</style>
        </div>
    );
}
