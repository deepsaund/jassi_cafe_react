import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Wallet as WalletIcon,
    Plus,
    TrendingUp,
    TrendingDown,
    Clock,
    History,
    CreditCard,
    ArrowUpRight,
    Activity,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

export default function Wallet() {
    const { user, refreshUser, settings } = useAuth();
    const { theme } = useTheme();

    if (settings?.wallet_system_status !== 'enabled') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="relative">
                    <div className="w-32 h-32 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center text-red-500 border border-red-500/20 shadow-2xl shadow-red-500/10">
                        <Zap size={60} className="animate-pulse" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Service <span className="text-red-500">Offline</span></h2>
                    <p className="max-w-md mx-auto text-slate-500 font-bold uppercase tracking-widest text-xs leading-relaxed">
                        The neural wallet system is currently undergoing synchronization or is disabled by the administrator. Please check back later.
                    </p>
                </div>
            </div>
        );
    }
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingFunds, setAddingFunds] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchTransactions();
    }, [user]);

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`${API_BASE}/wallet/transactions`, {
                headers: { 'Authorization': `mock_token_${user.id}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setTransactions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFunds = async (presetAmount = null) => {
        const amount = presetAmount || prompt("Enter amount to add (₹):", "500");
        if (!amount || isNaN(amount) || amount <= 0) return;

        setAddingFunds(true);
        try {
            const res = await fetch(`${API_BASE}/wallet/add-funds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify({ amount: parseFloat(amount) })
            });
            const data = await res.json();
            if (res.ok) {
                refreshUser({ wallet_balance: data.new_balance });
                fetchTransactions();
                alert(`₹${amount} added to your neural wallet.`);
            } else {
                alert(data.error || "Transaction Failed");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAddingFunds(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            {/* 1. Futuristic Wallet Header */}
            <header className={`relative group overflow-hidden p-8 md:p-12 rounded-[2.5rem] transition-all duration-700 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-2xl shadow-blue-900/10' : 'bg-white text-slate-900 border border-slate-100 shadow-2xl shadow-blue-900/5'}`}>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">Secured Node</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                            CENTRAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500">WALLET</span>
                        </h1>
                        <p className="max-w-md font-bold text-sm leading-relaxed text-slate-400">
                            Monitor your synchronized credits and transaction history across the service network.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Current Credits</p>
                        <div className="flex items-center gap-4">
                            <span className="text-5xl md:text-6xl font-black tracking-tighter text-emerald-500">
                                ₹{parseFloat(user?.wallet_balance || 0).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 opacity-60">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Network Synchronized</span>
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]" />
                <WalletIcon size={300} className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Quick Refill Sector */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className={`p-8 rounded-[2.5rem] border-none shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 shadow-black/40' : 'bg-slate-900 text-white'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Plus size={24} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">Quick Refill</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {[500, 1000, 2000, 5000].map(amt => (
                                <button
                                    key={amt}
                                    onClick={() => handleAddFunds(amt)}
                                    className={`p-4 rounded-2xl font-black text-sm border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-emerald-500/40 text-slate-300 hover:text-white' : 'bg-white/10 border-white/10 hover:border-emerald-500/50 text-white hover:bg-emerald-500/10'}`}
                                >
                                    +₹{amt}
                                </button>
                            ))}
                        </div>

                        <Button
                            className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-2xl shadow-xl shadow-emerald-500/20 font-black uppercase tracking-widest text-xs group"
                            onClick={() => handleAddFunds()}
                            loading={addingFunds}
                        >
                            Custom Deposit <ArrowUpRight size={16} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>

                        <div className="mt-8 p-5 bg-white/5 rounded-2xl flex items-center gap-4 border border-white/5">
                            <CreditCard size={20} className="text-slate-500" />
                            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
                                Secure end-to-end encrypted transactions only.
                            </p>
                        </div>
                    </Card>

                    <Card className="p-8 rounded-[2.5rem] border-none shadow-xl">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2">
                                <Activity size={28} />
                            </div>
                            <h4 className="text-lg font-black uppercase tracking-tight">Need Large Credits?</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                Contact our enterprise support for bulk credit deposits and B2B settlements.
                            </p>
                            <Button variant="outline" className="w-full rounded-xl mt-4 opacity-50 cursor-not-allowed">Enterprise Portal</Button>
                        </div>
                    </Card>
                </div>

                {/* 3. Neural Transaction History */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h2 className={`text-2xl font-black tracking-tight flex items-center gap-3 uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                <History className="text-blue-500" size={28} /> Transaction Stream
                            </h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 ml-10">Neural log of all credit movements</p>
                        </div>
                    </div>

                    <Card className={`p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem] ${theme === 'dark' ? 'bg-white/5 shadow-black/20' : 'bg-white'}`}>
                        {loading ? (
                            <div className="p-24 text-center">
                                <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                                <p className="font-black text-[10px] uppercase tracking-widest text-slate-500">fetching logs...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="p-24 text-center">
                                <div className="w-20 h-20 rounded-3xl bg-slate-500/10 flex items-center justify-center mx-auto mb-6">
                                    <Clock size={40} className="text-slate-300" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2">No Transactions Detected</h3>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Start filling your wallet to see credits here.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {transactions.map((tx, idx) => {
                                    const amount = parseFloat(tx.amount);
                                    const isCredit = amount > 0;
                                    return (
                                        <div
                                            key={tx.id}
                                            className={`p-6 flex items-center justify-between transition-all group ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                                            style={{ animationDelay: `${idx * 100}ms` }}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6 ${isCredit ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {isCredit ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-black tracking-tight mb-1 uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'}`}>{tx.description}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`text-xl font-black font-mono tracking-tighter ${isCredit ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {isCredit ? '+' : ''}{amount.toFixed(2)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
