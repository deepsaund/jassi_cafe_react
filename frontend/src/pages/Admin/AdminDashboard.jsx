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
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [syncing, setSyncing] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(true);

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

            // Fetch Orders
            setLoadingOrders(true);
            fetch(`${API_BASE}/staff/orders`, {
                headers: { 'Authorization': `mock_token_${user.id}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setOrders(data);
                    setLoadingOrders(false);
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
            {/* 1. Futuristic Header (Admin Dashboard) */}
            <header className="relative group overflow-hidden bg-[#0f172a] p-6 md:p-8 rounded-2xl text-white shadow-[0_20px_40px_-15px_rgba(30,58,138,0.3)]">
                <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-blue-300">System Status: Online</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-3">
                            ADMIN <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">PANEL</span>
                        </h1>
                        <p className="max-w-md font-bold text-base leading-relaxed text-slate-400">
                            Manage all users, services, audits, and system settings from one central dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                        <QuickAction
                            icon={Users}
                            label="Identities"
                            count="245"
                            onClick={() => navigate('/dashboard/admin/users')}
                            color="blue"
                            forceDark={true}
                        />
                        <QuickAction
                            icon={Settings}
                            label="Services"
                            count="12"
                            onClick={() => navigate('/dashboard/admin/services')}
                            color="indigo"
                            forceDark={true}
                        />
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
                <ShieldCheck size={250} className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
            </header>

            {/* 1.5. Navigation Grid (Restored as per user request) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <NavCard
                    icon={Users}
                    title="User Management"
                    desc="Manage access & identities"
                    onClick={() => navigate('/dashboard/admin/users')}
                    color="blue"
                />
                <NavCard
                    icon={Settings}
                    title="Service Management"
                    desc="Configure services & rates"
                    onClick={() => navigate('/dashboard/admin/services')}
                    color="indigo"
                />
                <NavCard
                    icon={FileText}
                    title="Audit Logs"
                    desc="System wide event tracking"
                    onClick={() => navigate('/dashboard/admin/logs')}
                    color="amber"
                />
                <NavCard
                    icon={CreditCard}
                    title="Settlements"
                    desc="Financial reconciliation"
                    onClick={() => navigate('/dashboard/admin/settlements')}
                    color="emerald"
                />
            </div>

            {/* 2. Primary Analytics & Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Neural Growth (Chart) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card className="flex-1 p-6 relative overflow-hidden group rounded-2xl">
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight uppercase">Daily Activity</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Transactions - 7 day window</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                                <span className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Live Status</span>
                            </div>
                        </div>

                        <div className="h-64 relative z-10">
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
                        <MetricCard title="Total Users" value="245" trend="Growing" icon={Users} color="blue" />
                        <MetricCard title="Total Orders" value={analytics?.daily_orders?.reduce((a, b) => a + b.count, 0) || '---'} trend="Optimal" icon={Zap} color="orange" />
                        <MetricCard title="Revenue" value={`₹${analytics?.revenue_week || '0'}`} trend="+₹14k" icon={Globe} color="emerald" />
                    </div>
                </div>

                {/* Live Neural Feed (Right Side) */}
                <Card className={`lg:col-span-4 p-6 transition-all duration-700 flex flex-col rounded-2xl ${theme === 'dark' ? 'bg-secondary-darker border-white/5' : 'bg-slate-900 border-none text-white'}`}>
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tight">
                                <Activity size={24} className="text-primary-light" /> Live Activity Feed
                            </h3>
                            <p className="text-[10px] font-bold text-primary-light/60 uppercase tracking-[0.3em] mt-2 leading-none">Recent system events</p>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${theme === 'dark' ? 'bg-primary/10 border-primary/20' : 'bg-white/10 border-white/20'}`}>
                            <RefreshCw size={20} className="text-primary-light animate-spin-slow" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-3 max-h-[400px]">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Broadcaster (Left) */}
                <Card className="lg:col-span-8 p-6 relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Radio size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight uppercase">System Announcement</h3>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-1">Message for all users</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border ${broadcastStatus === 'enabled' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                {broadcastStatus === 'enabled' ? 'Live 🟢' : 'Off 🛑'}
                            </div>
                            <button
                                onClick={() => setBroadcastStatus(broadcastStatus === 'enabled' ? 'disabled' : 'enabled')}
                                className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${broadcastStatus === 'enabled' ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'}`}
                            >
                                {broadcastStatus === 'enabled' ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <textarea
                            value={broadcast}
                            onChange={(e) => setBroadcast(e.target.value)}
                            placeholder="Type a message to show on user dashboards..."
                            className={`flex-1 h-32 p-5 border-none rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-primary/5 transition-all resize-none ${theme === 'dark' ? 'bg-white/5 text-slate-200' : 'bg-slate-50 text-slate-900'}`}
                        />
                        <Button
                            onClick={saveBroadcast}
                            loading={savingBroadcast}
                            className="h-32 w-32 rounded-2xl shadow-xl hover:shadow-primary/20 transition-all active:scale-95 flex flex-col items-center justify-center gap-2 group p-0"
                        >
                            <Zap size={20} className="group-hover:animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-wider">Send</span>
                        </Button>
                    </div>

                    <Globe size={140} className="absolute -right-12 -bottom-12 opacity-[0.02] text-primary pointer-events-none group-hover:rotate-45 transition-transform duration-[4000ms]" />
                </Card>

                {/* System Protocols (Right) */}
                <Card className="lg:col-span-4 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black tracking-tight uppercase">System Settings</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-1">Core Controls</p>
                        </div>
                        <div className={`p-2 rounded-xl ${walletEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            <ShieldCheck size={20} />
                        </div>
                    </div>

                    <div className="space-y-3 flex-1">
                        <ProtocolItem
                            icon={Wallet}
                            label="Wallet System"
                            desc="Enable/Disable Wallets"
                            status={walletEnabled}
                            onToggle={toggleWallet}
                            syncing={syncing}
                        />
                        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Activity size={16} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Analytics</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full">Active</span>
                        </div>
                        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200/60'}`}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-neural-violet/10 text-neural-violet">
                                    <Globe size={16} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Identity System</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full">100% Sync</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 4. Service Applications Management (NEW) */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between px-4 gap-4">
                    <div>
                        <h2 className={`text-2xl font-black tracking-tight flex items-center gap-3 uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <FileText className="text-primary" size={28} /> Service Applications
                        </h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-10">Monitor and manage all system requests</p>
                    </div>

                    <div className={`flex p-1 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-500 hover:text-slate-400'
                                }`}
                        >
                            Active ({orders.filter(o => o.status !== 'completed').length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-500 hover:text-slate-400'
                                }`}
                        >
                            History ({orders.filter(o => o.status === 'completed').length})
                        </button>
                    </div>
                </div>

                <Card className={`rounded-3xl shadow-xl overflow-hidden border ${theme === 'dark' ? 'bg-white/5 border-white/10 shadow-black/40' : 'bg-white border-slate-50 shadow-slate-200/40'}`}>
                    {loadingOrders ? (
                        <div className="p-20 text-center">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                            <p className="font-black text-[10px] uppercase tracking-widest text-slate-500">Scanning Network...</p>
                        </div>
                    ) : (orders.filter(o => activeTab === 'active' ? o.status !== 'completed' : o.status === 'completed').length === 0) ? (
                        <div className="p-20 text-center">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border shadow-inner ${theme === 'dark' ? 'bg-white/5 text-slate-700 border-white/5' : 'bg-slate-50 text-slate-200 border-slate-100'}`}>
                                <Zap size={32} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No synchronized records found for this sector.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className={`border-b ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50/80 border-slate-100'}`}>
                                    <tr>
                                        <th className="p-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Identity Details</th>
                                        <th className="p-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Service Node</th>
                                        <th className="p-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Staff Assigned</th>
                                        <th className="p-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Status</th>
                                        <th className="p-3 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                                    {orders
                                        .filter(o => activeTab === 'active' ? o.status !== 'completed' : o.status === 'completed')
                                        .slice(0, 10).map((order) => (
                                            <tr key={order.id} className={`group transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-blue-50/40'}`}>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black ${theme === 'dark' ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                                                            {order.customer_name?.[0]}
                                                        </div>
                                                        <div>
                                                            <p className={`text-xs font-black tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{order.customer_name}</p>
                                                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ref: #{order.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <span className={`text-xs font-black uppercase tracking-tight ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{order.service_name}</span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        {order.staff_name ? (
                                                            <>
                                                                <div className="w-3.5 h-3.5 rounded-full bg-blue-500/20 flex items-center justify-center text-[7px] text-blue-400 font-bold">
                                                                    {order.staff_name[0]}
                                                                </div>
                                                                <span className="text-[9px] font-bold text-slate-400">{order.staff_name}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-[8px] font-black uppercase text-slate-400/50">Unassigned</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${order.status === 'completed'
                                                        ? (theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600')
                                                        : order.status === 'action_required'
                                                            ? (theme === 'dark' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-600')
                                                            : (theme === 'dark' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600')
                                                        }`}>
                                                        <div className={`w-1 h-1 rounded-full bg-current ${order.status === 'processing' ? 'animate-pulse' : ''}`} />
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/dashboard/staff/verify/${order.id}`)}
                                                        className="h-7 rounded-lg text-[8px] px-3 font-black"
                                                    >
                                                        Review
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </section>

            {/* 5. Staff Performance - Bottom Row */}
            <Card className={`p-6 shadow-2xl overflow-hidden relative transition-all duration-700 rounded-2xl ${theme === 'dark' ? 'bg-secondary-darker border-white/5' : 'bg-slate-900 border-none text-white'}`}>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
                            <Award size={36} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight uppercase">Staff Performance</h3>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mt-2 ${theme === 'dark' ? 'text-primary-light/60' : 'text-slate-400'}`}>Top performing staff members</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
                    {analytics?.top_staff?.map((staff, idx) => (
                        <div key={idx} className="group relative bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 cursor-default flex flex-col items-center">
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black text-xs border-4 border-background-dark shadow-xl group-hover:scale-125 transition-transform z-20">
                                #{idx + 1}
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-neural-indigo flex items-center justify-center font-black text-2xl mb-4 shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-transform">
                                {staff.name[0]}
                            </div>
                            <h4 className="font-black text-[11px] text-center mb-1 group-hover:text-primary-light transition-colors uppercase tracking-widest">{staff.name}</h4>
                            <div className="px-4 py-1.5 bg-white/5 rounded-full text-[9px] font-black text-primary-light uppercase tracking-tighter">
                                {staff.count} Units Completed
                            </div>
                        </div>
                    ))}
                    {(!analytics?.top_staff || analytics.top_staff.length === 0) && (
                        <div className="col-span-full py-20 text-center text-slate-500/40 font-black uppercase tracking-[0.5em]">No leadership data established.</div>
                    )}
                </div>

                <Activity size={250} className="absolute -left-20 -bottom-20 opacity-[0.03] text-primary pointer-events-none" />
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
        <div className={`bg-gradient-to-br ${colors[color]} p-4 rounded-xl text-white shadow-lg transition-all duration-700 hover:scale-[1.05] hover:shadow-primary/30 relative overflow-hidden group border-none`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80">{title}</span>
                    <Icon size={16} className="opacity-80 group-hover:scale-125 transition-transform" />
                </div>
                <div className="flex items-end justify-between">
                    <h3 className="text-2xl font-black tracking-tighter drop-shadow-lg">{value}</h3>
                    <div className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                        <TrendingUp size={8} /> {trend}
                    </div>
                </div>
            </div>
            <Icon size={100} className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000" />
        </div>
    );
};

const ProtocolItem = ({ icon: Icon, label, desc, status, onToggle, syncing, danger }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-4 rounded-2xl border flex items-center justify-between group transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-primary/5'}`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${danger ? 'bg-red-500/10 text-red-500' : (status ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary')}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className={`font-black text-xs uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{label}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{desc}</p>
                </div>
            </div>
            {onToggle && (
                <button
                    onClick={onToggle}
                    disabled={syncing}
                    className={`w-12 h-6 rounded-full transition-all relative shadow-inner ${status ? 'bg-emerald-500 shadow-emerald-900/20' : 'bg-slate-300 dark:bg-white/10 shadow-black/20'} ${syncing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-90'}`}
                >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-md ${status ? 'right-0.5' : 'left-0.5'}`} />
                </button>
            )}
        </div>
    );
};

const QuickAction = ({ icon: Icon, label, count, onClick, color, forceDark }) => {
    const { theme } = useTheme();
    const isDark = forceDark || theme === 'dark';

    const themes = isDark ? {
        blue: "text-blue-400 bg-blue-400/10 border-blue-400/20 hover:bg-blue-400/20",
        indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20 hover:bg-indigo-400/20"
    } : {
        blue: "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100"
    };

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-95 ${themes[color]} group`}
        >
            <Icon size={18} className="mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
            <span className="text-lg font-black mt-1 leading-none">{count}</span>
        </button>
    );
};

const NavCard = ({ icon: Icon, title, desc, onClick, color }) => {
    const { theme } = useTheme();

    // Color variants
    const colorStyles = {
        blue: theme === 'dark' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20' : 'text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-100',
        indigo: theme === 'dark' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20' : 'text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-100',
        amber: theme === 'dark' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 group-hover:bg-amber-500/20' : 'text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-100',
        emerald: theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-100',
    };

    const activeColor = colorStyles[color] || colorStyles.blue;

    return (
        <button
            onClick={onClick}
            className={`group flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeColor}`}>
                <Icon size={20} />
            </div>
            <div className="text-left">
                <h3 className={`text-sm font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500 group-hover:text-slate-400' : 'text-slate-400 group-hover:text-slate-500'}`}>{desc}</p>
            </div>
        </button>
    );
};

