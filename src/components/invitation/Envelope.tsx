"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnvelopeProps {
    children: React.ReactNode;
    host: string;
}

export function Envelope({ children, host }: EnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-neutral-100">
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0, y: -100 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="z-50 w-full max-w-lg cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        <div className="relative group">
                            {/* Outer Envelope */}
                            <div className="relative aspect-[4/3] bg-[#fdfaf5] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                                {/* Flap */}
                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#f4ece0] clip-path-envelope-flap z-20" />

                                {/* Content Peek */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border-4 border-double border-neutral-200 m-4">
                                    <span className="text-xs uppercase tracking-[0.3em] font-light text-neutral-400 mb-2">Invitation pour</span>
                                    <h2 className="text-2xl font-serif text-neutral-800 tracking-tight">{host}</h2>
                                    <div className="mt-8 border-t border-neutral-200 w-12" />
                                    <p className="mt-8 text-xs uppercase tracking-widest text-neutral-400 animate-pulse">Cliquer pour ouvrir</p>
                                </div>

                                {/* Wax Seal */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
                                    <div className="w-12 h-12 bg-[#D4AF37] rounded-all rotate-45 shadow-lg flex items-center justify-center">
                                        <span className="text-white font-serif text-xl -rotate-45">G</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isOpen ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={cn(
                    "w-full h-full",
                    !isOpen && "hidden"
                )}
            >
                {children}
            </motion.div>

            <style jsx global>{`
        .clip-path-envelope-flap {
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
      `}</style>
        </div>
    );
}
