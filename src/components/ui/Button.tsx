import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'none';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-black text-white hover:bg-neutral-800 border border-black',
        secondary: 'bg-neutral-100 text-black hover:bg-neutral-200 border border-neutral-200',
        outline: 'bg-transparent border border-black text-black hover:bg-black hover:text-white',
        ghost: 'bg-transparent text-black hover:bg-neutral-100',
        none: '',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-6 py-3 text-sm tracking-widest uppercase',
        lg: 'px-8 py-4 text-base tracking-widest uppercase',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none font-serif',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
