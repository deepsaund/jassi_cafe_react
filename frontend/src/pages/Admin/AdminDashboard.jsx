import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Users,
    Settings,
    FileText,
    CreditCard,
    Zap,
    TrendingUp,
    ShieldCheck,
    Activity,
    RefreshCw,
    Globe,
    Search,
    ArrowRight,
    Radio,
    Wallet,
    Award
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [activeTab, setActiveTab] = useState('active');
    const [loading, setLoading] = useState(true);

    // Settings States
    const [walletEnabled, setWalletEnabled] = useState(true);
    const [broadcast, setBroadcast] = useState('');
    const [broadcastStatus, setBroadcastStatus] = useState('disabled');
    const [syncingSettings, setSyncingSettings] = useState(false);
    const [savingBroadcast, setSavingBroadcast] = useState(false);

    useEffect(() => {
        if (user) {
            setLoading(true);

            // Fetch Settings
            fetch(`${API_BASE}/admin/settings`)
                .then(res => res.json())
                .then(data => {
                    setWalletEnabled(data.wallet_system_status === 'enabled');
                    setBroadcast(data.global_broadcast_message || '');
                    setBroadcastStatus(data.global_broadcast_status || 'disabled');
                });

            // Fetch Analytics
            fetch(`${API_BASE}/admin/analytics`, {
                headers: { 'Authorization': `mock_token_${user.id}` }
            })
                .then(res => res.json())
                .then(data => setAnalytics(data))
                .catch(console.error);

            // Fetch Orders
            fetch(`${API_BASE}/staff/orders`, {
                headers: { 'Authorization': `mock_token_${user.id}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setOrders(data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [user]);

    const toggleWallet = async () => {
        setSyncingSettings(true);
        const newState = walletEnabled ? 'disabled' : 'enabled';
        try {
            const res = await fetch(`${API_BASE}/admin/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `mock_token_${user.id}` },
                body: JSON.stringify({ wallet_system_status: newState })
            });
            if (res.ok) setWalletEnabled(!walletEnabled);
        } catch (err) {
            console.error(err);
        } finally {
            setSyncingSettings(false);
        }
    };

    const saveBroadcast = async () => {
        setSavingBroadcast(true);
        try {
            await fetch(`${API_BASE}/admin/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `mock_token_${user.id}` },
                body: JSON.stringify({ global_broadcast_message: broadcast, global_broadcast_status: broadcastStatus })
            });
            alert("Broadcast Protocol Updated");
        } catch (e) {
            console.error(e);
        } finally {
            setSavingBroadcast(false);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const activeOrders = orders.filter(o => o.status !== 'completed');
    const historyOrders = orders.filter(o => o.status === 'completed');
    const displayOrders = activeTab === 'active' ? activeOrders : historyOrders;

    const totalPages = Math.ceil(displayOrders.length / itemsPerPage);
    const paginatedOrders = displayOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Reset page when tab changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20 px-4 md:px-0">
            {/* 1. Futuristic Header */}
            <header className="relative group overflow-hidden bg-[#0f172a] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl">
                <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]" />
                                <span className="text-[8px] font-black uppercase tracking-[0.25em] text-blue-300">Admin Control Unit</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">
                            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">OVERVIEW</span>
                        </h1>
                        <p className="max-w-md font-bold text-sm leading-relaxed text-slate-400">
                            Manage identities, monitor synchronized service nodes, and oversee global system settlements.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <QuickStat icon={Users} label="Identities" value={analytics?.total_users || '245'} color="blue" />
                        <QuickStat icon={Zap} label="Revenue" value={`₹${analytics?.revenue_week || '0'}`} color="indigo" />
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
            </header>

            {/* 2. Navigation Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <NavCard icon={Users} title="User Management" desc="Manage access & identities" onClick={() => navigate('/dashboard/admin/users')} color="blue" />
                <NavCard icon={Settings} title="Service Management" desc="Configure rates & rules" onClick={() => navigate('/dashboard/admin/services')} color="indigo" />
                <NavCard icon={FileText} title="Audit Logs" desc="Track system-wide events" onClick={() => navigate('/dashboard/admin/logs')} color="amber" />
                <NavCard icon={CreditCard} title="Settlements" desc="Reconcile financial data" onClick={() => navigate('/dashboard/admin/settlements')} color="emerald" />
            </div>

            {/* 3. Analytics & Activity Sector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight">Activity Waveform</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-2">Daily synchronized orders</p>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics?.daily_orders || []}>
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.05)"} />
                                <XAxis dataKey="date" hide />
                                <YAxis hide />
                                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={4} fill="url(#chartGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className={`lg:col-span-4 p-8 rounded-[2.5rem] flex flex-col ${theme === 'dark' ? 'bg-[#0f172a] border-white/5' : 'bg-slate-900 border-none text-white shadow-2xl shadow-slate-900/40'}`}>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Activity size={24} className="text-blue-400" /> Live Feed
                        </h3>
                        <RefreshCw size={20} className="text-blue-400/40 animate-spin-slow" />
                    </div>
                    <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
                        {analytics?.recent_activity?.map((log, i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black uppercase text-blue-400">{log.actor_name || 'System'}</span>
                                    <span className="text-[9px] opacity-40">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-tight">{log.action}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* 4. Controls & Broadcast (Restored Section) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Radio size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight uppercase">Global Announcement</h3>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.25em] mt-1">Broadcast to all user dashboards</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setBroadcastStatus(broadcastStatus === 'enabled' ? 'disabled' : 'enabled')}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${broadcastStatus === 'enabled' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}
                            >
                                {broadcastStatus === 'enabled' ? 'ACTIVE 🟢' : 'OFFLINE 🛑'}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <textarea
                            value={broadcast}
                            onChange={(e) => setBroadcast(e.target.value)}
                            placeholder="Type an emergency or update broadcast..."
                            className={`flex-1 h-24 p-5 border-none rounded-2xl text-xs font-bold focus:ring-4 focus:ring-blue-500/5 transition-all resize-none ${theme === 'dark' ? 'bg-white/5 text-slate-200' : 'bg-slate-50 text-slate-900'}`}
                        />
                        <Button onClick={saveBroadcast} loading={savingBroadcast} className="h-24 w-24 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-2 p-0">
                            <Zap size={20} />
                            <span className="text-[10px] font-black uppercase">Send</span>
                        </Button>
                    </div>
                </Card>

                <Card className="lg:col-span-4 p-8 rounded-[2.5rem] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-black tracking-tight uppercase">System Settings</h3>
                        <ShieldCheck size={24} className="text-emerald-500" />
                    </div>
                    <div className="space-y-4">
                        <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${walletEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}><Wallet size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-tight">Wallet System</p>
                                    <p className="text-[9px] text-slate-500 font-bold">{walletEnabled ? 'Operational' : 'Restricted'}</p>
                                </div>
                            </div>
                            <button onClick={toggleWallet} disabled={syncingSettings} className={`w-12 h-6 rounded-full relative transition-all ${walletEnabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-300 dark:bg-white/10'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${walletEnabled ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* 5. Service Applications (From Reference Pic) */}
            <section className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/5">
                            <FileText size={32} />
                        </div>
                        <div>
                            <h2 className={`text-3xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                Service <span className="text-blue-500">Applications</span>
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Monitor and manage all system requests</p>
                        </div>
                    </div>

                    <div className={`flex p-1.5 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-slate-100'}`}>
                        <button onClick={() => setActiveTab('active')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}>Active ({activeOrders.length})</button>
                        <button onClick={() => setActiveTab('history')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-500'}`}>History ({historyOrders.length})</button>
                    </div>
                </div>

                <Card className={`rounded-[3rem] overflow-hidden border shadow-2xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100'}`}>
                    {loading ? (
                        <div className="p-24 text-center">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                            <p className="font-black text-[10px] uppercase tracking-widest text-slate-500">Retrieving Records...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className={`border-b ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Identity Details</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Service Node</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Staff Assigned</th>
                                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Status</th>
                                        <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                                    {paginatedOrders.map((order) => (
                                        <tr key={order.id} className="group hover:bg-blue-600/5 transition-all duration-300">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-500/10 flex items-center justify-center font-black text-slate-400">{order.customer_name?.[0]}</div>
                                                    <div>
                                                        <p className={`text-sm font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{order.customer_name}</p>
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Ref: #{order.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`text-xs font-black uppercase tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{order.service_name}</span>
                                            </td>
                                            <td className="px-6 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest">{order.staff_name || 'Unassigned'}</td>
                                            <td className="px-6 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : order.status === 'action_required' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <Button onClick={() => navigate(`/dashboard/staff/verify/${order.id}`)} className="h-10 px-6 rounded-2xl text-[9px] font-black uppercase tracking-widest">Review</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className={`p-6 border-t flex items-center justify-between ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-50 bg-slate-50/30'}`}>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        Page <span className="text-blue-500">{currentPage}</span> of {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white border border-white/10'}`}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white border border-white/10'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </section>

            {/* 6. Staff Performance Section (Restored) */}
            <Card className={`p-8 rounded-[3rem] shadow-2xl overflow-hidden relative transition-all duration-700 ${theme === 'dark' ? 'bg-[#0f172a] border-white/5' : 'bg-slate-900 border-none text-white'}`}>
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/20">
                            <Award size={36} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight uppercase">Staff Leaderboard</h3>
                            <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-[0.3em] mt-2 leading-none">Top performing authorized personnel</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
                    {analytics?.top_staff?.map((staff, idx) => (
                        <div key={idx} className="group relative bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-500 flex flex-col items-center">
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-xs border-4 border-[#0f172a] shadow-xl">
                                #{idx + 1}
                            </div>
                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center font-black text-2xl mb-4 shadow-2xl shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                                {staff.name[0]}
                            </div>
                            <h4 className="font-black text-[10px] text-center mb-1 uppercase tracking-widest">{staff.name}</h4>
                            <div className="px-4 py-1.5 bg-white/5 rounded-full text-[8px] font-black text-blue-400 uppercase">
                                {staff.count} Units
                            </div>
                        </div>
                    ))}
                </div>
                <Activity size={250} className="absolute -left-20 -bottom-20 opacity-[0.03] text-blue-500 pointer-events-none" />
            </Card>
        </div>
    );
}

const QuickStat = ({ icon: Icon, label, value, color }) => (
    <div className={`p-4 rounded-3xl border border-white/5 bg-white/5 flex flex-col items-center justify-center text-center min-w-[120px]`}>
        <Icon size={18} className="text-blue-400 mb-2" />
        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
        <span className="text-xl font-black mt-1 leading-none">{value}</span>
    </div>
);

const NavCard = ({ icon: Icon, title, desc, onClick, color }) => {
    const { theme } = useTheme();
    const colors = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    };
    return (
        <button onClick={onClick} className={`group flex items-center gap-4 p-5 rounded-[2rem] border transition-all duration-300 hover:scale-[1.02] ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-white/20 shadow-2xl shadow-black/40' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12 ${colors[color]}`}><Icon size={24} /></div>
            <div className="text-left">
                <h3 className={`text-sm font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{desc}</p>
            </div>
        </button>
    );
};
