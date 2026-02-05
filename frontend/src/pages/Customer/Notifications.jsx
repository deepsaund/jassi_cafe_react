import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle, AlertCircle, Info, Clock, Trash2, CheckCircle2, MoreVertical, Lock, ShieldAlert, Cpu, Zap, UserPlus } from 'lucide-react';

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

    const isAdmin = user?.role === 'admin' || user?.role === 'staff';

    // Role-specific mock notifications
    const customerNotifications = [
        { id: 1, title: 'Identity Verified', message: 'Your Aadhaar Card verification is complete. You can now apply for Tier 2 services.', type: 'success', time: '2 hours ago', unread: true },
        { id: 2, title: 'Action Required', message: 'The photo uploaded for PAN card service is blurry. Please re-upload.', type: 'alert', time: '5 hours ago', unread: true },
        { id: 3, title: 'System Maintenance', message: 'Portal will be down for scheduled maintenance at 11:00 PM today.', type: 'info', time: '1 day ago', unread: false },
        { id: 4, title: 'Application Submitted', message: 'Your application for Birth Certificate has been received successfully.', type: 'success', time: '2 days ago', unread: false },
    ];

    const adminNotifications = [
        { id: 101, title: 'New Peer Application', message: 'A new user "Harman" has applied for Aadhaar Correction service. Review required.', type: 'task', time: 'Now', unread: true },
        { id: 102, title: 'System Resilience', message: 'Database backup synchronized successfully across all nodes.', type: 'info', time: '10 mins ago', unread: true },
        { id: 103, title: 'Security Protocol', message: 'Unauthorized login attempt detected from IP: 192.168.1.1 (External Node). Locked.', type: 'alert', time: '45 mins ago', unread: true },
        { id: 104, title: 'New B2B Partner', message: 'Entity "Jassi Telecom" registered as a B2B node. Approval pending.', type: 'success', time: '3 hours ago', unread: false },
    ];

    const [notifications, setNotifications] = useState(isAdmin ? adminNotifications : customerNotifications);

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
            case 'task': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-white/5';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={18} />;
            case 'alert': return <ShieldAlert size={18} />;
            case 'info': return <Cpu size={18} />;
            case 'task': return <UserPlus size={18} />;
            default: return <Bell size={18} />;
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/5">
                        <Bell size={32} />
                    </div>
                    <div>
                        <h1 className={`text-4xl font-black tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {isAdmin ? 'System' : 'Alert'} <span className="text-blue-500">Center</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 leading-none italic opacity-70">
                            {isAdmin ? 'Monitoring decentralized operations & task queues' : 'Stay updated with your application lifecycle'}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={markAllRead} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-blue-500/30 text-blue-400' : 'bg-white border-slate-100 hover:bg-blue-50 text-blue-600 shadow-lg shadow-slate-200/50'}`}>
                        Sync Channels
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
                        <Zap size={48} className="mx-auto mb-4 opacity-10 text-blue-500" />
                        <h3 className={`font-black text-xl uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Frequency Clear</h3>
                        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] mt-2">All sectors are currently operational and synchronized.</p>
                    </Card>
                ) : notifications.map((n) => (
                    <div key={n.id} className={`group relative p-6 rounded-[2rem] border transition-all duration-300 ${theme === 'dark' ? (n.unread ? 'bg-blue-600/5 border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.05)]' : 'bg-white/5 border-white/5 opacity-70 hover:opacity-100 grayscale-[0.3] hover:grayscale-0') : (n.unread ? 'bg-blue-50/50 border-blue-200 shadow-xl shadow-blue-500/10' : 'bg-white border-slate-100 opacity-80 hover:opacity-100')}`}>
                        <div className="flex items-start gap-6">
                            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all group-hover:rotate-6 duration-500 shadow-lg ${getTypeStyles(n.type)}`}>
                                {getTypeIcon(n.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className={`font-black text-base uppercase tracking-tight ${theme === 'dark' ? 'text-white group-hover:text-blue-400 transition-colors' : 'text-slate-900'}`}>
                                            {n.title}
                                        </h3>
                                        {n.unread && (
                                            <div className="px-2 py-0.5 rounded-full bg-blue-500 text-[8px] font-black text-white uppercase tracking-widest animate-pulse border border-white/20 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                                                New node
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                        <Clock size={10} className="text-blue-500" /> {n.time}
                                    </div>
                                </div>
                                <p className={`text-[11px] font-bold leading-relaxed tracking-tight ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{n.message}</p>

                                <div className="mt-5 flex items-center gap-6">
                                    <button className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:tracking-[0.3em] ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                                        {isAdmin ? 'Access Module' : 'View Lifecycle'}
                                    </button>
                                    {n.unread && (
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 flex items-center gap-2 transition-colors">
                                            <CheckCircle2 size={12} /> Mark as Synchronized
                                        </button>
                                    )}
                                </div>
                            </div>

                            <button className={`p-2.5 rounded-xl border transition-all opacity-0 group-hover:opacity-100 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:bg-blue-500/20 hover:border-blue-500/20' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                <MoreVertical size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isAdmin && (
                <div className={`p-8 rounded-[2.5rem] border border-dashed transition-all duration-1000 ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Info size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Protocol Information</p>
                            <p className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-tight">System-wide broadcasts are dispatched through the Admin Console. Notifications shown here are derived from decentralized identity events and staff task queues.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
