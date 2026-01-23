"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface RSVPFormProps {
    onSubmit: (data: { name: string; guests: number }) => void;
    variant?: 'light' | 'dark';
}

export function RSVPForm({ onSubmit, variant = 'dark' }: RSVPFormProps) {
    const [name, setName] = useState('');
    const [guests, setGuests] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, guests });
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-8">
                <h4 className="text-2xl font-serif mb-4 text-inherit">Merci de votre réponse</h4>
                <p className="text-neutral-500 text-sm italic">
                    Nous sommes impatients de vous compter parmi nous.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Input
                id="name"
                label="Votre Nom Complet"
                placeholder="M. ou Mme Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={variant === 'dark' ? 'text-white border-white/20' : 'text-black border-black/10'}
            />

            <div className="space-y-1.5">
                <label className="text-xs font-serif uppercase tracking-widest text-neutral-500">
                    Nombre de personnes
                </label>
                <div className="flex items-center gap-3">
                    {[1, 2, 3, 4].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => setGuests(num)}
                            className={cn(
                                "w-10 h-10 rounded-full border transition-all text-sm font-serif",
                                guests === num
                                    ? (variant === 'dark' ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                                    : (variant === 'dark' ? 'bg-transparent text-white border-white/20 hover:border-white' : 'bg-transparent text-black border-black/10 hover:border-black')
                            )}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <Button
                type="submit"
                variant="none"
                className={cn(
                    "w-full rounded-xl py-4 transition-all active:scale-95 font-serif uppercase tracking-widest text-xs",
                    variant === 'dark' ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                )}
            >
                Confirmer
            </Button>
        </form>
    );
}
