import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, FileText, Settings, CreditCard, Activity, ShieldCheck, Zap, Globe, Wallet, RefreshCw, BarChart2, TrendingUp, Award, Bell } from 'lucide-react';
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
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-1000 max-w-7xl mx-auto pb-20 px-4 md:px-0">
            {/* 1. Futuristic Header (Neural Hub) */}
            <header className={`relative group overflow-hidden p-8 md:p-12 rounded-[3rem] transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none' : 'bg-white text-slate-900 border border-slate-100 shadow-2xl shadow-blue-900/10'}`}>
                <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_12px_rgba(96,165,250,0.8)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Node Status: Primary</span>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Security: Tier 5 active</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4 uppercase">
                            Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">Command</span>
                        </h1>
                        <p className={`max-w-md font-medium text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Global orchestration engine. Overseeing cross-network transactions and entity verification.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
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
                <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l pointer-events-none ${theme === 'dark' ? 'from-blue-600/10 to-transparent' : 'from-blue-50 to-transparent'}`} />
                <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-[100px] ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-blue-100/50'}`} />
                <ShieldCheck size={300} className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
            </header>

            {/* 2. Primary Analytics & Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Neural Growth (Chart) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card className={`flex-1 p-8 border-none rounded-[3rem] relative overflow-hidden group transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none' : 'bg-white text-slate-900 shadow-2xl shadow-slate-200/50'}`}>
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">System Throughput</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Transaction flow velocity - 7 day window</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-600" />
                                <span className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Live Traffic</span>
                            </div>
                        </div>

                        <div className="h-64 relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics?.daily_orders || []}>
                                    <defs>
                                        <linearGradient id="neuralGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "#1e293b" : "#f1f5f9"} />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10, fontWeight: 800, fill: '#64748b' }}
                                        tickFormatter={(v) => new Date(v).toLocaleDateString([], { weekday: 'short' })}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={10}
                                    />
                                    <YAxis hide />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '24px', backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '16px', fontWeight: '900', color: theme === 'dark' ? '#ffffff' : '#0f172a' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        fill="url(#neuralGradient)"
                                        className="drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Stats Trio */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MetricCard title="Entity Base" value="245" trend="+12%" icon={Users} color="blue" />
                        <MetricCard title="Matrix Flow" value={analytics?.daily_orders?.reduce((a, b) => a + b.count, 0) || '---'} trend="Optimal" icon={Zap} color="orange" />
                        <MetricCard title="Node Revenue" value={`₹${analytics?.revenue_week || '0'}`} trend="+₹14k" icon={Globe} color="emerald" />
                    </div>
                </div>

                {/* Live Neural Feed (Right Side) */}
                <Card className={`lg:col-span-4 p-8 border-none rounded-[3rem] transition-all duration-500 flex flex-col ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none border-white/5' : 'bg-slate-900 text-white shadow-2xl shadow-slate-900/10'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black flex items-center gap-2 uppercase">
                                <Activity size={20} className="text-blue-400" /> Neural Feed
                            </h3>
                            <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest mt-1">Live Subconscious Signals</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${theme === 'dark' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-white/10 border-white/20'}`}>
                            <RefreshCw size={16} className="text-blue-400 animate-spin-slow" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2 max-h-[500px]">
                        {analytics?.recent_activity?.map((log, i) => (
                            <div key={i} className="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black uppercase text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">{log.actor_name || 'System'}</span>
                                    <span className="text-[10px] font-mono opacity-40">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm font-bold leading-snug group-hover:text-blue-200 transition-colors uppercase tracking-tight">{log.action}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 3. Operational Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Broadcaster (Left) */}
                <Card className={`lg:col-span-8 p-8 border-none rounded-[3rem] relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none' : 'bg-white text-slate-900 shadow-2xl shadow-slate-200/50'}`}>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Bell size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">Global Broadcaster</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Push alerts to every active node</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${broadcastStatus === 'enabled' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                {broadcastStatus === 'enabled' ? 'Signal Active 🟢' : 'Signal Paused 🛑'}
                            </span>
                            <select
                                value={broadcastStatus}
                                onChange={(e) => setBroadcastStatus(e.target.value)}
                                className={`rounded-xl px-3 py-1.5 text-[10px] font-black uppercase cursor-pointer focus:ring-2 focus:ring-orange-500/20 border-none appearance-none ${theme === 'dark' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-900'}`}
                            >
                                <option value="enabled" className={theme === 'dark' ? 'bg-[#1e293b] text-white' : ''}>Enable</option>
                                <option value="disabled" className={theme === 'dark' ? 'bg-[#1e293b] text-white' : ''}>Disable</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                        <div className="flex-1">
                            <textarea
                                value={broadcast}
                                onChange={(e) => setBroadcast(e.target.value)}
                                placeholder="Write a message to flash on all user dashboards..."
                                className={`w-full h-32 p-6 border-none rounded-[2rem] text-sm font-bold placeholder:text-slate-300 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none shadow-inner ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900'}`}
                            />
                        </div>
                        <div className="flex flex-col justify-end">
                            <Button
                                onClick={saveBroadcast}
                                loading={savingBroadcast}
                                className={`h-20 w-full md:w-32 rounded-[2rem] shadow-xl hover:shadow-orange-200 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group border-none ${theme === 'dark' ? 'bg-white/10 hover:bg-orange-600 text-white' : 'bg-slate-900 hover:bg-orange-600 text-white'}`}
                            >
                                <Zap size={20} className="group-hover:animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Deploy</span>
                            </Button>
                        </div>
                    </div>

                    <Zap size={150} className="absolute -right-10 -bottom-10 opacity-[0.02] text-orange-500 pointer-events-none" />
                </Card>

                {/* System Protocols (Right) */}
                <Card className={`lg:col-span-4 p-8 border-none rounded-[3rem] transition-all duration-500 flex flex-col ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none' : 'bg-white text-slate-900 shadow-2xl shadow-slate-200/50'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black tracking-tight">System Protocols</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Module Level Control</p>
                        </div>
                        <div className={`p-2 rounded-lg ${walletEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        <ProtocolItem
                            icon={Wallet}
                            label="Transaction Clearing"
                            desc="Wallet system processing"
                            status={walletEnabled}
                            onToggle={toggleWallet}
                            syncing={syncing}
                        />
                        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                                    <Activity size={16} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Analytics Sync</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase">Synchronized</span>
                        </div>
                        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                    <Globe size={16} />
                                </div>
                                <span className={`text-xs font-black uppercase tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>CDN Propagation</span>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase">100% Active</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 4. Staff Performance - Bottom Row */}
            <Card className={`p-8 border-none shadow-2xl shadow-slate-900/10 rounded-[3rem] overflow-hidden relative transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-[#0f172a] to-slate-900 text-white' : 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white'}`}>
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                            <Award size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight uppercase">Matrix Leadership</h3>
                            <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mt-1">Top entities by synchronization rate</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
                    {analytics?.top_staff?.map((staff, idx) => (
                        <div key={idx} className="group relative bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all duration-500 cursor-default flex flex-col items-center">
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-black text-lg border-4 border-[#121b33] shadow-lg group-hover:scale-110 transition-transform">
                                #{idx + 1}
                            </div>
                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-400 to-indigo-400 flex items-center justify-center font-black text-2xl mb-4 shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                {staff.name[0]}
                            </div>
                            <h4 className="font-black text-sm text-center mb-1 group-hover:text-blue-300 transition-colors uppercase tracking-tight">{staff.name}</h4>
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono text-indigo-300">
                                {staff.count} Units
                            </div>
                        </div>
                    ))}
                    {(!analytics?.top_staff || analytics.top_staff.length === 0) && (
                        <div className="col-span-full py-16 text-center text-indigo-300/40 font-black uppercase tracking-widest">No leadership data established.</div>
                    )}
                </div>

                <BarChart2 size={300} className="absolute -left-20 -bottom-20 opacity-[0.03] text-indigo-400 pointer-events-none" />
            </Card>
        </div>
    );
}

// PREMIUM COMPONENTS
const MetricCard = ({ title, value, trend, icon: Icon, color }) => {
    const colors = {
        blue: "from-blue-600 to-indigo-600 shadow-blue-500/20",
        orange: "from-orange-500 to-red-600 shadow-orange-500/20",
        emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/20"
    };
    return (
        <div className={`bg-gradient-to-br ${colors[color]} p-6 rounded-[2.5rem] text-white shadow-2xl transform transition-all duration-500 hover:scale-[1.05] relative overflow-hidden group`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{title}</span>
                    <Icon size={18} />
                </div>
                <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
                    <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">{trend}</span>
                </div>
            </div>
            <Icon size={80} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
        </div>
    );
};

const ProtocolItem = ({ icon: Icon, label, desc, status, onToggle, syncing }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-4 rounded-3xl border flex items-center justify-between group transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-50'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${status ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h4 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{label}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
                </div>
            </div>
            <button
                onClick={onToggle}
                disabled={syncing}
                className={`w-12 h-6 rounded-full transition-all relative ${status ? 'bg-emerald-500' : 'bg-slate-300'} ${syncing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${status ? 'right-1' : 'left-1'}`} />
            </button>
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

