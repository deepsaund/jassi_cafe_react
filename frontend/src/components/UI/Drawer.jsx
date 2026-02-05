import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Drawer = ({ isOpen, onClose, title, children }) => {
    const { theme } = useTheme();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className={`w-screen max-w-2xl shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${theme === 'dark' ? 'bg-[#070b14]' : 'bg-white'}`}>
                    <div className="h-full flex flex-col">
                        <div className={`px-8 py-6 border-b flex items-center justify-between ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                            <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
                            <button
                                onClick={onClose}
                                className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
