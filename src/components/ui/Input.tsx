import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ className, label, id, error, ...props }: InputProps) {
    return (
        <div className="space-y-1.5 flex-1">
            {label && (
                <label
                    htmlFor={id}
                    className="text-xs font-serif uppercase tracking-widest text-neutral-500"
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                className={cn(
                    "flex h-12 w-full border-b bg-transparent px-0 py-2 text-sm transition-all duration-300 placeholder:text-neutral-400 focus:outline-none font-serif text-inherit",
                    error ? "border-red-500" : "border-neutral-300 focus:border-white/50",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-red-500 text-[10px] uppercase tracking-tighter italic">
                    {error}
                </p>
            )}
        </div>
    );
}
