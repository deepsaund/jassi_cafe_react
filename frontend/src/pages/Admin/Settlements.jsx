import React, { useState, useEffect } from 'react';
import { CreditCard, Clock, User, DollarSign, TrendingUp, TrendingDown, Building } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { API_BASE } from '../../config';
import { useAuth } from '../../context/AuthContext';

export default function Settlements() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    useEffect(() => {
        if (!user) return;
        fetch(`${API_BASE}/wallet/transactions`, { // Using the admin route I just made? No, I named it /api/admin/wallet/transactions
            headers: { 'Authorization': `mock_token_${user.id}` }
        })
        // Wait, I created /api/admin/wallet/transactions but need to be sure the fetch URL matches.

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

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading financial ledger...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                        <CreditCard className="mr-3 text-emerald-600" size={32} /> B2B Settlements
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Financial overview of all wallet transactions and settlements.</p>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100">
                    Ledger Live 🟢
                </div>
            </header>

            <Card className="p-0 border-none shadow-2xl shadow-emerald-50 bg-white rounded-[2rem] overflow-hidden border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Time & Date</th>
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Entity / User</th>
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Net Amount</th>
                                <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Context / Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {(() => {
                                const totalPages = Math.ceil(transactions.length / itemsPerPage);
                                const startIndex = (currentPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const paginatedData = transactions.slice(startIndex, endIndex);

                                return paginatedData.map(tx => {
                                    const amount = parseFloat(tx.amount);
                                    const isCredit = amount > 0;

                                    return (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-2 text-slate-400 font-bold font-mono text-[11px]">
                                                    <Clock size={12} />
                                                    {new Date(tx.created_at).toLocaleString([], { hour12: true, dateStyle: 'short', timeStyle: 'short' })}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2 font-black text-slate-800">
                                                        <User size={14} className="text-slate-400" />
                                                        {tx.user_name}
                                                    </div>
                                                    {tx.company_name && (
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                                                            <Building size={10} />
                                                            {tx.company_name}
                                                        </div>
                                                    )}
                                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tx.email}</div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl font-black font-mono tracking-tight ${isCredit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                    {isCredit ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                    {isCredit ? '+' : ''}{amount.toFixed(2)}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-slate-600 font-bold text-xs">{tx.description}</p>
                                            </td>
                                        </tr>
                                    );
                                });
                            })()}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-400 font-bold">No transactions found in ledger.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {transactions.length > itemsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(transactions.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={transactions.length}
                    />
                )}
            </Card>
        </div>
    );
}
