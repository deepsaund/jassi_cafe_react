import React from 'react';
import { Loader2 } from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    ...props
}) => {
    const { theme } = useTheme();
    // TEXT: Professional Tracking and Weight
    const baseStyle = "relative inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none overflow-hidden group";

    const sizes = {
        sm: "px-4 py-2 text-[10px] rounded-xl",
        md: "px-7 py-3.5 text-[11px] rounded-2xl",
        lg: "px-10 py-5 text-xs rounded-[1.8rem]"
    };

    const variants = {
        // MATCHED: Using #0f172a (Header Color) as the base for Primary
        primary: theme === 'dark'
            ? "bg-[#0f172a] text-white border border-blue-500/30 shadow-xl shadow-blue-900/10 hover:border-blue-400 hover:shadow-blue-500/20"
            : "bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700",
        secondary: theme === 'dark'
            ? "bg-slate-800 text-white hover:bg-slate-700"
            : "bg-slate-900 text-white hover:bg-slate-800",
        outline: theme === 'dark'
            ? "bg-transparent border-2 border-slate-700 text-slate-300 hover:border-blue-600 hover:text-blue-600"
            : "bg-transparent border-2 border-slate-200 text-slate-800 hover:border-blue-600 hover:text-blue-600",
        danger: "bg-red-950/50 text-red-500 border border-red-500/30 hover:bg-red-600 hover:text-white",
        glass: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/20",
        white: theme === 'dark'
            ? "bg-white/10 text-white border border-white/10 hover:bg-white/20"
            : "bg-white text-slate-900 shadow-xl border border-slate-100",
        neural: "bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20"
    };

    return (
        <button
            className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {/* SLOWER ANIMATION: 2000ms duration with Blue-White light reflection */}
            <div className="absolute inset-0 translate-x-[-250%] group-hover:translate-x-[250%] transition-transform duration-[2000ms] cubic-bezier(0.4, 0, 0.2, 1) bg-gradient-to-r from-transparent via-blue-400/30 to-transparent skew-x-[45deg] pointer-events-none" />

            {loading ? (
                <div className="flex items-center gap-2 relative z-10">
                    <Loader2 className="h-4 w-4 animate-spin text-current" />
                    <span className="opacity-70">Processing</span>
                </div>
            ) : (
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:scale-105 group-hover:text-blue-50 transition-all duration-500">
                    {children}
                </span>
            )}

            {/* Subtle Pulse Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-blue-600/5 to-transparent transition-opacity duration-1000 pointer-events-none" />
        </button>
    );
};
