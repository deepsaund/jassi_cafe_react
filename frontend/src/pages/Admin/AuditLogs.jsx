import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, UserCheck, AlertTriangle, PackageSearch, Terminal, Database, Fingerprint } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

export default function AuditLogs() {
    const { theme } = useTheme();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        fetch(`${API_BASE}/admin/logs`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLogs(data);
                setLoading(false);
            });
    }, []);

    const getActionStyle = (action) => {
        const a = action.toLowerCase();
        if (a.includes('complete') || a.includes('success') || a.includes('verify')) {
            return theme === 'dark'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        }
        if (a.includes('reject') || a.includes('delete') || a.includes('revoke')) {
            return theme === 'dark'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-red-50 text-red-600 border border-red-100';
        }
        if (a.includes('claim') || a.includes('update') || a.includes('assign')) {
            return theme === 'dark'
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-blue-50 text-blue-600 border border-blue-100';
        }
        return theme === 'dark'
            ? 'bg-white/5 text-slate-400 border border-white/5'
            : 'bg-slate-50 text-slate-500 border border-slate-100';
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Loading Logs...</p>
        </div>
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-20 px-4 md:px-0">
            {/* Header section with Neural aesthetic */}
            <div className={`relative group overflow-hidden p-6 md:p-8 rounded-3xl transition-all duration-700 ${theme === 'dark' ? 'bg-secondary-darker text-white shadow-2xl shadow-black/40' : 'bg-white text-slate-900 border-2 border-slate-200 shadow-2xl shadow-slate-900/10'}`}>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">System Logs</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-4">
                            System <span className="text-gradient uppercase">Audit Logs</span>
                        </h1>
                        <p className={`max-w-md font-bold text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            A chronological record of all system events.
                        </p>
                    </div>
                    <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xl shadow-emerald-500/5'}`}>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">System Live</span>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l pointer-events-none ${theme === 'dark' ? 'from-primary/10 to-transparent' : 'from-primary/5 to-transparent'}`} />
                <Terminal size={250} className="absolute -right-24 -bottom-24 opacity-[0.02] rotate-6 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
            </div>

            {/* Audit Table */}
            <Card className="p-0 overflow-hidden relative border-none">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50/50'} border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Timestamp</th>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">User</th>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Reference ID</th>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Action</th>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Details</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {paginatedLogs.map((log) => (
                                <tr key={log.id} className={`group transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-primary/5'}`}>
                                    <td className="p-5">
                                        <div className={`flex items-center gap-3 font-black text-xs tracking-tight ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                                                <Clock size={12} className="text-primary" />
                                            </div>
                                            <span>
                                                {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })}
                                                <span className="opacity-40 mx-2">|</span>
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 shadow-inner' : 'bg-slate-100 text-slate-500 shadow-inner'}`}>
                                                <Fingerprint size={16} />
                                            </div>
                                            <div>
                                                <p className={`font-black text-xs tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'} group-hover:text-primary transition-colors`}>
                                                    {log.actor_name || 'System'}
                                                </p>
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Verified User</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                            <span className={`font-black text-[10px] font-mono tracking-wider ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                                REF-{log.order_ref || 'INTERNAL'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest inline-flex items-center gap-2 transition-all duration-500 shadow-sm ${getActionStyle(log.action)}`}>
                                            <div className="w-1 h-1 rounded-full bg-current opacity-60" />
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <p className={`text-[10px] font-bold leading-relaxed max-w-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'} group-hover:text-slate-400 transition-colors italic`}>
                                            {log.details || 'Event recorded successfully.'}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {logs.length === 0 && (
                    <div className="p-32 text-center">
                        <Database size={80} className="mx-auto text-slate-200 dark:text-white/5 mb-8" />
                        <h4 className="text-3xl font-black text-slate-300 uppercase tracking-[0.3em]">No Logs</h4>
                        <p className="text-slate-400 font-bold mt-3">No logs found.</p>
                    </div>
                )}
                {logs.length > itemsPerPage && (
                    <div className={`p-8 border-t ${theme === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-slate-50 bg-slate-50/30'}`}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(logs.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={logs.length}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}
