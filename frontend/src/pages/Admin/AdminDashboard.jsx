import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, FileText, Settings, CreditCard, Activity, ShieldCheck, Zap, Globe, Wallet, RefreshCw, BarChart2, TrendingUp, Award, Bell, Radio } from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 });
    const [analytics, setAnalytics] = useState(null);
    const [walletEnabled, setWalletEnabled] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Broadcast State
    const [broadcast, setBroadcast] = useState('');
    const [broadcastStatus, setBroadcastStatus] = useState('disabled');
    const [savingBroadcast, setSavingBroadcast] = useState(false);

    useEffect(() => {
        // Fetch Settings
        fetch(`${API_BASE}/admin/settings`)
            .then(res => res.json())
            .then(data => {
                setWalletEnabled(data.wallet_system_status === 'enabled');
                setBroadcast(data.global_broadcast_message || '');
                setBroadcastStatus(data.global_broadcast_status || 'disabled');
            });

        // Fetch Analytics
        if (user) {
            fetch(`${API_BASE}/admin/analytics`, {
                headers: { 'Authorization': `mock_token_${user.id}` }
            })
                .then(res => res.json())
                .then(data => {
                    setAnalytics(data);
                    // Update header stats purely for show or use real data if available
                    if (data.revenue_week) {
                        setStats(prev => ({ ...prev, revenue: data.revenue_week }));
                    }
                });
        }
    }, [user]);

    const toggleWallet = async () => {
        setSyncing(true);
        const newState = walletEnabled ? 'disabled' : 'enabled';
        try {
            const res = await fetch(`${API_BASE}/admin/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify({ wallet_system_status: newState })
            });

            if (res.ok) {
                setWalletEnabled(!walletEnabled);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to update settings. Restricted access.");
            }
        } catch (err) {
            alert("Could not reach server.");
        } finally {
            setSyncing(false);
        }
    };

    const saveBroadcast = async () => {
        setSavingBroadcast(true);
        try {
            const res = await fetch(`${API_BASE}/admin/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify({
                    global_broadcast_message: broadcast,
                    global_broadcast_status: broadcastStatus
                })
            });

            if (res.ok) {
                alert("Broadcast System Updated!");
            }
        } catch (e) {
            alert("Error updating broadcast");
        } finally {
            setSavingBroadcast(false);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-1000 max-w-7xl mx-auto pb-20 px-4 md:px-0">
            {/* 1. Futuristic Header (Neural Hub) */}
            <header className="relative group overflow-hidden bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] text-white shadow-[0_35px_60px_-15px_rgba(30,58,138,0.3)]">
                <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-300">Core Node: Active</span>
                            </div>
                            <div className="px-4 py-1.5 rounded-full bg-neural-cyan/20 border border-neural-cyan/30 flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-300">Security: Level 5</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                            NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">COMMAND</span>
                        </h1>
                        <p className="max-w-md font-bold text-xl leading-relaxed text-slate-400">
                            Global orchestration engine. Overseeing cross-network transactions and entity verification.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                        <QuickAction
                            icon={Users}
                            label="Identities"
                            count="245"
                            onClick={() => navigate('/dashboard/admin/users')}
                            color="blue"
                        />
                        <QuickAction
                            icon={Settings}
                            label="Matrix"
                            count="12"
                            onClick={() => navigate('/dashboard/admin/services')}
                            color="indigo"
                        />
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
                <ShieldCheck size={350} className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
            </header>

            {/* 2. Primary Analytics & Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Neural Growth (Chart) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <Card className="flex-1 p-10 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black tracking-tight uppercase">System Throughput</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Transaction flow velocity - 7 day window</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                                <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Real-time Node</span>
                            </div>
                        </div>

                        <div className="h-72 relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.daily_orders || []}>
                                    <defs>
                                        <linearGradient id="neuralGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }}
                                        tickFormatter={(v) => new Date(v).toLocaleDateString([], { weekday: 'short' })}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={15}
                                    />
                                    <YAxis hide />
                                    <RechartsTooltip
                                        contentStyle={{
                                            borderRadius: '24px',
                                            backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                                            border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(15,23,42,0.1)',
                                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                            padding: '20px',
                                            fontWeight: '900',
                                            color: theme === 'dark' ? '#ffffff' : '#0f172a'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#2563eb"
                                        strokeWidth={5}
                                        fill="url(#neuralGradient)"
                                        className="drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Stats Trio */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <MetricCard title="Entity Base" value="245" trend="Syncing" icon={Users} color="blue" />
                        <MetricCard title="Matrix Flow" value={analytics?.daily_orders?.reduce((a, b) => a + b.count, 0) || '---'} trend="Optimal" icon={Zap} color="orange" />
                        <MetricCard title="Node Revenue" value={`₹${analytics?.revenue_week || '0'}`} trend="+₹14k" icon={Globe} color="emerald" />
                    </div>
                </div>

                {/* Live Neural Feed (Right Side) */}
                <Card className={`lg:col-span-4 p-10 transition-all duration-700 flex flex-col ${theme === 'dark' ? 'bg-secondary-darker border-white/5' : 'bg-slate-900 border-none text-white'}`}>
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
                                <Activity size={24} className="text-primary-light" /> Neural Feed
                            </h3>
                            <p className="text-[10px] font-bold text-primary-light/60 uppercase tracking-[0.3em] mt-2 leading-none">Subconscious Signals</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${theme === 'dark' ? 'bg-primary/10 border-primary/20' : 'bg-white/10 border-white/20'}`}>
                            <RefreshCw size={20} className="text-primary-light animate-spin-slow" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-3 max-h-[550px]">
                        {analytics?.recent_activity?.map((log, i) => (
                            <div key={i} className="group p-5 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[10px] font-black uppercase text-primary-light bg-primary/10 px-3 py-1 rounded-full tracking-widest">{log.actor_name || 'System'}</span>
                                    <span className="text-[10px] font-mono opacity-40 font-bold">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm font-black leading-snug group-hover:text-primary-light transition-colors uppercase tracking-tight">{log.action}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 3. Operational Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Broadcaster (Left) */}
                <Card className="lg:col-span-8 p-10 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[2rem] bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/10">
                                <Radio size={32} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black tracking-tight uppercase">Neural Broadcast</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2 leading-none">Global Node Interception</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${broadcastStatus === 'enabled' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                {broadcastStatus === 'enabled' ? 'Signal Live 🟢' : 'Signal Halted 🛑'}
                            </div>
                            <select
                                value={broadcastStatus}
                                onChange={(e) => setBroadcastStatus(e.target.value)}
                                className={`rounded-2xl px-4 py-2 text-[10px] font-black uppercase cursor-pointer focus:ring-4 focus:ring-primary/10 border-none appearance-none transition-all ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}
                            >
                                <option value="enabled" className="text-white">Enable</option>
                                <option value="disabled" className="text-white">Disable</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        <div className="flex-1">
                            <textarea
                                value={broadcast}
                                onChange={(e) => setBroadcast(e.target.value)}
                                placeholder="Syncing global directives..."
                                className={`w-full h-40 p-8 border-none rounded-[2.5rem] text-sm font-bold placeholder:text-slate-400 focus:ring-8 focus:ring-primary/5 transition-all resize-none shadow-inner ${theme === 'dark' ? 'bg-white/5 text-slate-200' : 'bg-slate-50 text-slate-900'}`}
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <Button
                                onClick={saveBroadcast}
                                loading={savingBroadcast}
                                className="h-24 w-full md:w-40 rounded-[2.5rem] shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group p-0"
                            >
                                <Zap size={24} className="group-hover:animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Execute</span>
                            </Button>
                        </div>
                    </div>

                    <Globe size={180} className="absolute -right-16 -bottom-16 opacity-[0.02] text-primary pointer-events-none group-hover:rotate-45 transition-transform duration-[4000ms]" />
                </Card>

                {/* System Protocols (Right) */}
                <Card className="lg:col-span-4 p-10 flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black tracking-tight uppercase whitespace-nowrap">Core Directives</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Node Level Access</p>
                        </div>
                        <div className={`p-3 rounded-2xl ${walletEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            <ShieldCheck size={24} />
                        </div>
                    </div>

                    <div className="space-y-5 flex-1 pr-1 overflow-y-auto custom-scrollbar">
                        <ProtocolItem
                            icon={Wallet}
                            label="Fin-Network"
                            desc="Real-time wealth sync"
                            status={walletEnabled}
                            onToggle={toggleWallet}
                            syncing={syncing}
                        />
                        <div className={`p-5 rounded-3xl border flex items-center justify-between transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                    <Activity size={20} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Analytics</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-3 py-1 rounded-full">Active</span>
                        </div>
                        <div className={`p-5 rounded-3xl border flex items-center justify-between transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-neural-violet/10 text-neural-violet">
                                    <Globe size={20} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Identity CDN</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-3 py-1 rounded-full">100% Sync</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 4. Staff Performance - Bottom Row */}
            <Card className={`p-10 shadow-2xl overflow-hidden relative transition-all duration-700 ${theme === 'dark' ? 'bg-secondary-darker border-white/5' : 'bg-slate-900 border-none text-white'}`}>
                <div className="flex items-center justify-between mb-12 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                            <Award size={36} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black tracking-tight uppercase">Matrix Leadership</h3>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-2 ${theme === 'dark' ? 'text-primary-light/60' : 'text-slate-400'}`}>Top entities by synchronization rate</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
                    {analytics?.top_staff?.map((staff, idx) => (
                        <div key={idx} className="group relative bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 cursor-default flex flex-col items-center">
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black text-xs border-4 border-background-dark shadow-xl group-hover:scale-125 transition-transform z-20">
                                #{idx + 1}
                            </div>
                            <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-primary to-neural-indigo flex items-center justify-center font-black text-3xl mb-5 shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-transform">
                                {staff.name[0]}
                            </div>
                            <h4 className="font-black text-[11px] text-center mb-1 group-hover:text-primary-light transition-colors uppercase tracking-widest">{staff.name}</h4>
                            <div className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-primary-light uppercase tracking-tighter">
                                {staff.count} Units SYNCED
                            </div>
                        </div>
                    ))}
                    {(!analytics?.top_staff || analytics.top_staff.length === 0) && (
                        <div className="col-span-full py-20 text-center text-slate-500/40 font-black uppercase tracking-[0.5em]">No leadership data established.</div>
                    )}
                </div>

                <Activity size={350} className="absolute -left-20 -bottom-20 opacity-[0.03] text-primary pointer-events-none" />
            </Card>
        </div>
    );
}

// PREMIUM COMPONENTS
const MetricCard = ({ title, value, trend, icon: Icon, color }) => {
    const colors = {
        blue: "from-primary to-neural-indigo shadow-primary/20",
        orange: "from-orange-500 to-red-600 shadow-orange-500/20",
        emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/20"
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} p-8 rounded-[2.5rem] text-white shadow-2xl transition-all duration-700 hover:scale-[1.05] hover:shadow-primary/30 relative overflow-hidden group border-none`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80">{title}</span>
                    <Icon size={20} className="opacity-80 group-hover:scale-125 transition-transform" />
                </div>
                <div className="flex items-end justify-between">
                    <h3 className="text-4xl font-black tracking-tighter drop-shadow-lg">{value}</h3>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <TrendingUp size={10} /> {trend}
                    </div>
                </div>
            </div>
            <Icon size={120} className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000" />
        </div>
    );
};

const ProtocolItem = ({ icon: Icon, label, desc, status, onToggle, syncing, danger }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-[2rem] border flex items-center justify-between group transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary/5'}`}>
            <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${danger ? 'bg-red-500/10 text-red-500 shadow-red-500/10' : (status ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10' : 'bg-primary/10 text-primary shadow-primary/10')}`}>
                    <Icon size={28} />
                </div>
                <div>
                    <h4 className={`font-black text-sm uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{label}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{desc}</p>
                </div>
            </div>
            {onToggle && (
                <button
                    onClick={onToggle}
                    disabled={syncing}
                    className={`w-14 h-7 rounded-full transition-all relative shadow-inner ${status ? 'bg-emerald-500 shadow-emerald-900/20' : 'bg-slate-300 dark:bg-white/10 shadow-black/20'} ${syncing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-90'}`}
                >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${status ? 'right-1' : 'left-1'}`} />
                </button>
            )}
        </div>
    );
};

const QuickAction = ({ icon: Icon, label, count, onClick, color }) => {
    const { theme } = useTheme();
    const themes = theme === 'dark' ? {
        blue: "text-blue-400 bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20",
        indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20 hover:bg-indigo-400/20"
    } : {
        blue: "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100"
    };

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-3xl border transition-all active:scale-95 ${themes[color]} group`}
        >
            <Icon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            <span className="text-xl font-black mt-1 leading-none">{count}</span>
        </button>
    );
};

