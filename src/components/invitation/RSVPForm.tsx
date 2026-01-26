"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { generateICS } from '@/lib/calendar';
import { Calendar, CheckCircle2, Users, Baby, Utensils, MessageSquare, XCircle } from 'lucide-react';
import { LaravelInvitationResponse } from '@/hooks/useInvitation';

interface RSVPFormValues {
    name: string;
    status: 'attending' | 'declined';
    adults: number;
    children: number;
    allergies: string;
    message: string;
}

interface RSVPFormProps {
    onSubmit: (data: RSVPFormValues) => void;
    variant?: 'light' | 'dark';
    eventData?: LaravelInvitationResponse;
}

export function RSVPForm({ onSubmit, variant = 'dark', eventData }: RSVPFormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { register, handleSubmit, watch, control, formState: { errors } } = useForm<RSVPFormValues>({
        defaultValues: {
            status: 'attending',
            adults: 1,
            children: 0,
            allergies: '',
            message: ''
        }
    });

    const status = watch('status');

    const onFormSubmit = (data: RSVPFormValues) => {
        if (data.status === 'attending') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#ffffff', '#aa8800']
            });
        }
        onSubmit(data);
        setIsSubmitted(true);
    };

    const handleCalendarClick = () => {
        if (!eventData) return;
        generateICS({
            title: eventData.title,
            date: eventData.event_date,
            location: eventData.location?.address || eventData.location?.name || '',
            description: `Invitation pour ${eventData.title}.`
        });
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 px-4"
            >
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <CheckCircle2 className="text-green-500 w-10 h-10" />
                    </div>
                </div>
                <h4 className="text-3xl font-serif mb-4 text-inherit">Merci pour votre réponse !</h4>
                <p className="text-neutral-500 text-sm italic mb-10 max-w-xs mx-auto">
                    {status === 'attending'
                        ? "Nous avons hâte de célébrer ce moment d'exception avec vous."
                        : "Nous regrettons que vous ne puissiez pas être des nôtres."}
                </p>

                {status === 'attending' && (
                    <Button
                        onClick={handleCalendarClick}
                        className="flex items-center gap-2 mx-auto bg-neutral-900 border border-white/10 text-white hover:bg-neutral-800"
                    >
                        <Calendar size={18} />
                        Ajouter au calendrier
                    </Button>
                )}
            </motion.div>
        );
    }

    const isLight = variant === 'light';
    const textColor = isLight ? 'text-black' : 'text-white';
    const borderColor = isLight ? 'border-black/10' : 'border-white/10';
    const subTextColor = isLight ? 'text-neutral-500' : 'text-neutral-400';

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            {/* Status Selection */}
            <div className="grid grid-cols-2 gap-4">
                <label className="cursor-pointer group">
                    <input
                        type="radio"
                        {...register('status')}
                        value="attending"
                        className="peer hidden"
                    />
                    <div className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300",
                        "peer-checked:bg-white peer-checked:text-black peer-checked:border-white group-hover:bg-neutral-800/50",
                        !isLight && "border-white/10 bg-white/5",
                        isLight && "border-black/5 bg-black/5 peer-checked:bg-black peer-checked:text-white"
                    )}>
                        <CheckCircle2 size={20} />
                        <span className="text-[10px] uppercase tracking-widest font-serif font-bold">Je confirme</span>
                    </div>
                </label>

                <label className="cursor-pointer group">
                    <input
                        type="radio"
                        {...register('status')}
                        value="declined"
                        className="peer hidden"
                    />
                    <div className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300",
                        "peer-checked:bg-white peer-checked:text-black peer-checked:border-white group-hover:bg-neutral-800/50",
                        !isLight && "border-white/10 bg-white/5",
                        isLight && "border-black/5 bg-black/5 peer-checked:bg-black peer-checked:text-white"
                    )}>
                        <XCircle size={20} />
                        <span className="text-[10px] uppercase tracking-widest font-serif font-bold">Je décline</span>
                    </div>
                </label>
            </div>

            <div className="space-y-6">
                <Input
                    label="Nom complet"
                    placeholder="M. ou Mme Jean Dupont"
                    {...register('name', { required: "Ce champ est requis" })}
                    error={errors.name?.message}
                    className={cn("bg-transparent", borderColor, textColor)}
                />

                <AnimatePresence mode="wait">
                    {status === 'attending' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6 overflow-hidden"
                        >
                            {/* Guests Counters */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-serif text-neutral-500">
                                        <Users size={14} /> Adultes
                                    </label>
                                    <Controller
                                        control={control}
                                        name="adults"
                                        rules={{ min: { value: 1, message: "Min 1" } }}
                                        render={({ field }) => (
                                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-1 justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange(Math.max(1, field.value - 1))}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="font-serif text-lg">{field.value}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange(field.value + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    />
                                    {errors.adults && <p className="text-red-500 text-[10px]">{errors.adults.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-serif text-neutral-500">
                                        <Baby size={14} /> Enfants
                                    </label>
                                    <Controller
                                        control={control}
                                        name="children"
                                        render={({ field }) => (
                                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-1 justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange(Math.max(0, field.value - 1))}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="font-serif text-lg">{field.value}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange(field.value + 1)}
                                                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-serif text-neutral-500">
                                    <Utensils size={14} /> Allergies ou régimes spécifiques
                                </label>
                                <textarea
                                    {...register('allergies')}
                                    placeholder="Ex: Sans gluten, Végétarien..."
                                    className={cn(
                                        "w-full bg-white/5 border rounded-2xl p-4 text-sm font-serif min-h-[80px] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all",
                                        borderColor, textColor
                                    )}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-serif text-neutral-500">
                        <MessageSquare size={14} /> Message aux hôtes
                    </label>
                    <textarea
                        {...register('message')}
                        placeholder="Un petit mot pour nous..."
                        className={cn(
                            "w-full bg-white/5 border rounded-2xl p-4 text-sm font-serif min-h-[100px] focus:outline-none focus:ring-1 focus:ring-white/20 transition-all",
                            borderColor, textColor
                        )}
                    />
                </div>
            </div>

            <Button
                type="submit"
                variant="none"
                className={cn(
                    "w-full rounded-2xl py-6 transition-all active:scale-95 font-serif uppercase tracking-[0.3em] text-[10px] font-bold shadow-2xl",
                    isLight ? 'bg-black text-white hover:bg-neutral-800' : 'bg-white text-black hover:bg-neutral-200'
                )}
            >
                Envoyer ma réponse
            </Button>
        </form>
    );
}
