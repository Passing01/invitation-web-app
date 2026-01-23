import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function Input({ className, label, id, ...props }: InputProps) {
    return (
        <div className="space-y-1.5">
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
                    "flex h-12 w-full border-b border-neutral-300 bg-transparent px-0 py-2 text-sm transition-all duration-300 placeholder:text-neutral-400 focus:outline-none focus:border-white/50 disabled:cursor-not-allowed disabled:opacity-50 font-serif text-inherit",
                    className
                )}
                {...props}
            />
        </div>
    );
}
