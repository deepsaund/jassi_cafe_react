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
    ArrowRight
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

    useEffect(() => {
        if (user) {
            setLoading(true);
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

    const activeOrders = orders.filter(o => o.status !== 'completed');
    const historyOrders = orders.filter(o => o.status === 'completed');
    const displayOrders = activeTab === 'active' ? activeOrders : historyOrders;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
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
                        <QuickStat icon={Users} label="Identities" value="245" color="blue" />
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

            {/* 4. Service Applications (From Reference Pic) */}
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
                                    {displayOrders.slice(0, 10).map((order) => (
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
                        </div>
                    )}
                </Card>
            </section>
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
