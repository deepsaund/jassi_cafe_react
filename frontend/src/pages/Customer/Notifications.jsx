import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle, AlertCircle, Info, Clock, Trash2, CheckCircle2, MoreVertical, Lock } from 'lucide-react';

const Card = ({ children, className = "" }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'} ${className}`}>
            {children}
        </div>
    );
};

export default function Notifications() {
    const { theme } = useTheme();
    const { user } = useAuth();

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Identity Verified', message: 'Your Aadhaar Card verification is complete. You can now apply for Tier 2 services.', type: 'success', time: '2 hours ago', unread: true },
        { id: 2, title: 'Action Required', message: 'The photo uploaded for PAN card service is blurry. Please re-upload.', type: 'alert', time: '5 hours ago', unread: true },
        { id: 3, title: 'System Maintenance', message: 'Portal will be down for scheduled maintenance at 11:00 PM today.', type: 'info', time: '1 day ago', unread: false },
        { id: 4, title: 'Application Submitted', message: 'Your application for Birth Certificate has been received successfully.', type: 'success', time: '2 days ago', unread: false },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'alert': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'info': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-white/5';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={18} />;
            case 'alert': return <AlertCircle size={18} />;
            case 'info': return <Info size={18} />;
            default: return <Bell size={18} />;
        }
    };

    if (user?.role === 'admin' || user?.role === 'staff') {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-red-500/10 rounded-[3rem] flex items-center justify-center text-red-500 mb-4 animate-pulse">
                    <Lock size={48} />
                </div>
                <div>
                    <h2 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Security Protocol</h2>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.25em] mt-2">Notification feed is exclusive to Customer Identity Channels.</p>
                </div>
                <div className="max-w-md text-[10px] text-slate-500 font-bold uppercase leading-relaxed opacity-50">
                    System-wide broadcasts can be managed through the Admin Control Panel. Personal notification logs are restricted to end-users for privacy compliance.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className={`text-3xl font-black tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Alert <span className="text-blue-500">Center</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Stay updated with your application lifecycle</p>
                </div>

                <div className="flex gap-3">
                    <button onClick={markAllRead} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-blue-500/30 text-blue-400' : 'bg-white border-slate-100 hover:bg-blue-50 text-blue-600 shadow-lg shadow-slate-200/50'}`}>
                        Mark All Read
                    </button>
                    <button onClick={clearAll} className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-red-500/10 text-red-400' : 'bg-white border-slate-100 hover:bg-red-50 text-red-600 shadow-lg shadow-slate-200/50'}`}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <Card className="p-20 text-center">
                        <Bell size={48} className="mx-auto mb-4 opacity-10" />
                        <h3 className={`font-black text-lg uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>All Caught Up!</h3>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">No new alerts found in your sector.</p>
                    </Card>
                ) : notifications.map((n) => (
                    <div key={n.id} className={`group relative p-5 rounded-3xl border transition-all duration-300 ${theme === 'dark' ? (n.unread ? 'bg-blue-500/10 border-blue-500/30 shadow-[0_0_30px_rgba(37,99,235,0.1)]' : 'bg-white/5 border-white/5 opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0') : (n.unread ? 'bg-blue-50 border-blue-100 shadow-xl shadow-blue-500/10' : 'bg-white border-slate-100 opacity-80 hover:opacity-100')}`}>
                        <div className="flex items-start gap-5">
                            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${getTypeStyles(n.type)}`}>
                                {getTypeIcon(n.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`font-black text-sm uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                        {n.title}
                                        {n.unread && <span className="ml-3 inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-500/5 px-3 py-1 rounded-full">
                                        <Clock size={10} /> {n.time}
                                    </div>
                                </div>
                                <p className={`text-xs font-medium leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{n.message}</p>

                                <div className="mt-4 flex items-center gap-4">
                                    <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:underline">View Details</button>
                                    {n.unread && (
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 flex items-center gap-1.5">
                                            <CheckCircle2 size={12} /> Mark Read
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button className={`p-2 rounded-xl border transition-all opacity-0 group-hover:opacity-100 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
