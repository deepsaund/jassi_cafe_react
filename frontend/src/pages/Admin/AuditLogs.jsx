import React, { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, UserCheck, AlertTriangle, PackageSearch } from 'lucide-react';
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
        if (theme === 'dark') {
            if (a.includes('complete')) return 'bg-green-500/10 text-green-400 ring-green-500/20';
            if (a.includes('reject')) return 'bg-red-500/10 text-red-400 ring-red-500/20';
            if (a.includes('claim')) return 'bg-blue-500/10 text-blue-400 ring-blue-500/20';
            return 'bg-white/5 text-slate-400 ring-white/10';
        }
        if (a.includes('complete')) return 'bg-green-50 text-green-700 ring-green-200';
        if (a.includes('reject')) return 'bg-red-50 text-red-700 ring-red-200';
        if (a.includes('claim')) return 'bg-blue-50 text-blue-700 ring-blue-200';
        return 'bg-slate-50 text-slate-700 ring-slate-200';
    };

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Scanning system history...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className={`text-3xl font-black tracking-tight flex items-center ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        <ShieldCheck className="mr-3 text-blue-600" size={32} /> Central Registry
                    </h1>
                    <p className={`font-medium mt-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Immutable record of every action across the Jassi Cafe network.</p>
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 text-slate-400 border-white/5' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    Recording Live Feed 🟢
                </div>
            </header>

            <Card className={`p-0 border-none shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] shadow-none' : 'bg-white shadow-blue-50'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className={`border-b transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Time & Date</th>
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Authorized Actor</th>
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Reference</th>
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Evolution / Action</th>
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Extended Context</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y transition-all duration-500 ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {(() => {
                                const totalPages = Math.ceil(logs.length / itemsPerPage);
                                const startIndex = (currentPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const paginatedLogs = logs.slice(startIndex, endIndex);

                                return paginatedLogs.map(log => (
                                    <tr key={log.id} className={`transition-all group ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-blue-50/30'}`}>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold font-mono text-[11px]">
                                                <Clock size={12} />
                                                {new Date(log.timestamp).toLocaleString([], { hour12: true, dateStyle: 'short', timeStyle: 'short' })}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-500 group-hover:bg-white/10' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-md'}`}>
                                                    <UserCheck size={16} />
                                                </div>
                                                <span className={`font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{log.actor_name || 'System Auto'}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-400 opacity-20" />
                                                <span className="font-black text-blue-600">ORD-#{log.order_ref}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ring-1 inline-flex items-center gap-2 ${getActionStyle(log.action)}`}>
                                                <Activity size={10} />
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-slate-500 font-medium max-w-xs leading-relaxed italic">{log.details || 'Baseline action recorded.'}</p>
                                        </td>
                                    </tr>
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>
                {logs.length > itemsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(logs.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={logs.length}
                    />
                )}
            </Card>
        </div>
    );
}
