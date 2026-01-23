"use client";

import React from 'react';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface StickyBottomBarProps {
    onRSVP: () => void;
    onItinerary: () => void;
    onCalendar: () => void;
}

export function StickyBottomBar({ onRSVP, onItinerary, onCalendar }: StickyBottomBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none">
            <div className="max-w-md mx-auto flex items-center justify-between gap-3 p-2 bg-white/40 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full pointer-events-auto">
                <button
                    onClick={onCalendar}
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-black/5 transition-all active:scale-90"
                    title="Ajouter au calendrier"
                >
                    <Calendar size={20} className="text-neutral-700" strokeWidth={1.5} />
                </button>

                <Button onClick={onRSVP} className="flex-1 rounded-full text-[10px] h-12 shadow-sm" size="md">
                    <CheckCircle2 size={14} className="mr-2" />
                    Répondre (RSVP)
                </Button>

                <button
                    onClick={onItinerary}
                    className="flex items-center justify-center w-12 h-12 rounded-full hover:bg-black/5 transition-all active:scale-90"
                    title="Itinéraire"
                >
                    <MapPin size={20} className="text-neutral-700" strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
}
