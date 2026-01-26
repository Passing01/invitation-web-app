"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TemplateConfig } from '@/lib/templates';
import { DynamicTemplateRenderer } from './DynamicTemplateRenderer';
import { ChevronUp, ChevronDown, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiPageInvitationProps {
    config: TemplateConfig;
    eventData: any;
    containerWidth: number;
}

export function MultiPageInvitation({
    config,
    eventData,
    containerWidth,
}: MultiPageInvitationProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const paginate = useCallback((newDirection: number) => {
        if (isAnimating) return;
        const next = currentPage + newDirection;
        if (next >= 0 && next < config.pages.length) {
            setDirection(newDirection);
            setCurrentPage(next);
            setIsAnimating(true);
        }
    }, [currentPage, config.pages.length, isAnimating]);

    // Scroll wheel detection for vertical "scroll" feel
    useEffect(() => {
        let lastScrollTime = 0;
        const handleWheel = (e: WheelEvent) => {
            const now = Date.now();
            if (now - lastScrollTime < 1000) return; // Throttling

            if (e.deltaY > 50) {
                paginate(1);
                lastScrollTime = now;
            } else if (e.deltaY < -50) {
                paginate(-1);
                lastScrollTime = now;
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [paginate]);

    const variants = {
        enter: (direction: number) => ({
            y: direction > 0 ? 500 : -500,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            zIndex: 1,
            y: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            y: direction < 0 ? 500 : -500,
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
        }),
    };

    return (
        <div className="fixed inset-0 w-full h-full flex flex-col items-center bg-black">
            <div className="relative w-full h-full overflow-hidden">
                <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="popLayout"
                    onExitComplete={() => setIsAnimating(false)}
                >
                    <motion.div
                        key={currentPage}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            y: { type: "spring", stiffness: 200, damping: 30, mass: 1 },
                            opacity: { duration: 0.6 },
                            scale: { duration: 0.6 },
                            filter: { duration: 0.4 }
                        }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <DynamicTemplateRenderer
                            page={config.pages[currentPage]}
                            config={config}
                            eventData={eventData}
                            containerWidth={containerWidth}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Overlays (Top/Bottom) */}
                {currentPage > 0 && (
                    <button
                        onClick={() => paginate(-1)}
                        className="absolute top-10 left-1/2 -translate-x-1/2 z-[60] w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all active:scale-90 group"
                    >
                        <ChevronUp className="text-white/80 group-hover:text-white" size={28} />
                    </button>
                )}

                {currentPage < config.pages.length - 1 && (
                    <button
                        onClick={() => paginate(1)}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[60] w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all active:scale-90 group"
                    >
                        <ChevronDown className="text-white/80 group-hover:text-white" size={28} />
                    </button>
                )}

                {/* Scroll Hint */}
                {currentPage === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3, duration: 1 }}
                        className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-white/40 text-[10px] uppercase tracking-[0.4em] pointer-events-none"
                    >
                        <span className="mb-2">Découvrir</span>
                        <ArrowDown size={18} className="animate-bounce-y text-[#D4AF37]" />
                    </motion.div>
                )}
            </div>

            {/* Side Progress Bar (Vertical) */}
            <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-50">
                {config.pages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            if (i === currentPage) return;
                            setDirection(i > currentPage ? 1 : -1);
                            setCurrentPage(i);
                        }}
                        className={cn(
                            "w-1 transition-all duration-700 rounded-full",
                            currentPage === i ? "h-16 bg-white" : "h-4 bg-white/20 hover:bg-white/40"
                        )}
                        style={{
                            backgroundColor: currentPage === i ? config.accentColor : undefined
                        }}
                    />
                ))}
            </div>

            {/* Page Info Overlay */}
            <div className="fixed left-8 bottom-10 z-50 flex flex-col gap-2">
                <span className="text-[12px] font-serif text-white/40">
                    0{currentPage + 1} / 0{config.pages.length}
                </span>
                <div className="h-[1px] w-16 bg-[#D4AF37]/50" />
                <span className="text-[10px] uppercase tracking-[0.5em] text-white font-serif">
                    {config.pages[currentPage].title}
                </span>
            </div>

            <style jsx global>{`
        @keyframes bounceY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .animate-bounce-y {
          animation: bounceY 2s infinite;
        }
      `}</style>
        </div>
    );
}
