import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, User, DollarSign, TrendingUp, TrendingDown, Building, Wallet, Activity, Briefcase } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { API_BASE } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Settlements() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        if (!user) return;
        fetch(`${API_BASE}/admin/wallet/transactions`, {
            headers: { 'Authorization': `mock_token_${user.id}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTransactions(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [user]);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Calculating Ledger Balances...</p>
        </div>
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = transactions.slice(startIndex, endIndex);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-20 px-4 md:px-0">
            {/* Header section with Neural aesthetic */}
            <div className={`relative group overflow-hidden p-10 md:p-14 rounded-[3.5rem] transition-all duration-700 ${theme === 'dark' ? 'bg-secondary-darker text-white shadow-2xl shadow-black/40' : 'bg-white text-slate-900 border border-slate-100 shadow-2xl shadow-primary/5'}`}>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                <Wallet size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500">Financial Hub</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                            B2B <span className="text-gradient uppercase">Settlements</span>
                        </h1>
                        <p className={`max-w-md font-bold text-xl leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Comprehensive reconciliation of commercial transactions and neural wallet cycles.
                        </p>
                    </div>
                    <div className={`px-8 py-4 rounded-[2rem] flex items-center gap-4 transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-xl shadow-emerald-500/5'}`}>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                        <span className="text-xs font-black uppercase tracking-[0.3em]">Ledger Synchronized</span>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l pointer-events-none ${theme === 'dark' ? 'from-emerald-500/10 to-transparent' : 'from-emerald-500/5 to-transparent'}`} />
                <CreditCard size={400} className="absolute -right-24 -bottom-24 opacity-[0.02] rotate-6 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
            </div>

            {/* Settlements Table */}
            <Card className="p-0 overflow-hidden relative border-none">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50/50'} border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Timestamp</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">B2B Entity / Operator</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Settlement Volume</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Operational Context</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {paginatedData.map((tx) => {
                                const amount = parseFloat(tx.amount);
                                const isCredit = amount > 0;

                                return (
                                    <tr key={tx.id} className={`group transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-primary/5'}`}>
                                        <td className="p-8">
                                            <div className={`flex items-center gap-3 font-black text-xs tracking-tight ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                                    <Clock size={14} className="text-primary" />
                                                </div>
                                                <span>
                                                    {new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' })}
                                                    <span className="opacity-40 mx-2">|</span>
                                                    {new Date(tx.created_at).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 shadow-inner' : 'bg-slate-100 text-slate-500 shadow-inner'}`}>
                                                    {tx.company_name ? <Briefcase size={18} /> : <User size={18} />}
                                                </div>
                                                <div>
                                                    <p className={`font-black text-sm tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'} group-hover:text-primary transition-colors`}>
                                                        {tx.company_name || tx.user_name}
                                                    </p>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                        {tx.company_name ? 'B2B PARTNER' : 'OPERATOR'} • {tx.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-[1.25rem] font-black font-mono tracking-tighter text-lg transition-all duration-500 shadow-sm ${isCredit
                                                ? (theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-emerald-500/5')
                                                : (theme === 'dark' ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-red-500/10' : 'bg-red-50 text-red-600 border border-red-100 shadow-red-500/5')}`}>
                                                {isCredit ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                {isCredit ? '+' : ''}{amount.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-3 italic">
                                                <div className={`p-1.5 rounded-full ${isCredit ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                                    <Activity size={10} />
                                                </div>
                                                <p className={`text-xs font-bold leading-relaxed max-w-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-600'} group-hover:text-slate-400 transition-colors`}>
                                                    {tx.description || 'Verified reconciliation entry.'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {transactions.length === 0 && (
                    <div className="p-32 text-center">
                        <DollarSign size={80} className="mx-auto text-slate-200 dark:text-white/5 mb-8" />
                        <h4 className="text-3xl font-black text-slate-300 uppercase tracking-[0.3em]">Ledger Void</h4>
                        <p className="text-slate-400 font-bold mt-3">No financial movements detected in the current cycle.</p>
                    </div>
                )}
                {transactions.length > itemsPerPage && (
                    <div className={`p-8 border-t ${theme === 'dark' ? 'border-white/5 bg-white/[0.01]' : 'border-slate-50 bg-slate-50/30'}`}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(transactions.length / itemsPerPage)}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={transactions.length}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}
