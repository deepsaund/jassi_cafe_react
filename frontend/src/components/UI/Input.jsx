import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Input = ({ label, id, error, className = '', ...props }) => {
    const { theme } = useTheme();
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={id}
                    className={`block text-[10px] font-black uppercase tracking-wider ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`w-full px-5 py-3 border-2 border-transparent rounded-2xl text-sm font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all duration-300 ${theme === 'dark'
                        ? 'bg-white/5 text-white focus:bg-white/10'
                        : 'bg-slate-50 text-slate-900 focus:bg-white'
                    } ${error ? 'border-red-500/50 bg-red-50' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-[10px] font-black uppercase ml-1">{error}</p>}
        </div>
    );
};
