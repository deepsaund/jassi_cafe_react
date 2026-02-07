import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Users,
    ClipboardList,
    CheckSquare,
    Zap,
    Clock,
    ShieldCheck,
    Activity,
    Award,
    ArrowUpRight,
    Search,
    Terminal,
    Database,
    HardDrive,
    Cpu,
    Briefcase,
    LayoutGrid,
    CheckCircle2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { API_BASE } from '../../config';

export default function StaffDashboard() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

    const fetchOrders = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${API_BASE}/staff/orders`, {
                headers: { 'Authorization': `mock_token_${user.id}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Polling every 15 seconds for new requests in queue
        const interval = setInterval(fetchOrders, 15000);
        return () => clearInterval(interval);
    }, [user]);

    const handleClaim = async (orderId) => {
        try {
            const res = await fetch(`${API_BASE}/staff/orders/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify({ action: 'claim', order_id: orderId })
            });
            if (res.ok) {
                fetchOrders();
                alert("Task locked to your system.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const pool = orders.filter(o => !o.assigned_staff_id);
    const myTasks = orders.filter(o => o.assigned_staff_id == user?.id);
    const activeTasks = myTasks.filter(o => o.status !== 'completed');
    const historyTasks = myTasks.filter(o => o.status === 'completed');
    const displayedTasks = activeTab === 'active' ? activeTasks : historyTasks;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-[1600px] mx-auto pb-32">
            {/* 1. Command Center Header */}
            <header className={`relative group overflow-hidden p-8 md:p-12 rounded-[2.5rem] transition-all duration-700 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-2xl shadow-blue-900/10' : 'bg-white text-slate-900 border border-slate-100 shadow-2xl shadow-blue-900/5'}`}>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 italic">Work Portal Active</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                            STAFF <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 uppercase">Dashboard</span>
                        </h1>
                        <p className="max-w-xl font-bold text-sm leading-relaxed text-slate-400">
                            Monitor new customer requests and manage your assigned tasks with ease.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
                        <StatBox icon={Zap} label="System Status" val="Online" color="text-blue-500" theme={theme} />
                        <StatBox icon={Users} label="Pending Jobs" val={pool.length} color="text-indigo-500" theme={theme} />
                        <StatBox icon={Activity} label="My Active Tasks" val={activeTasks.length} color="text-emerald-500" theme={theme} />
                        <StatBox icon={CheckCircle2} label="Finished" val={historyTasks.length} color="text-blue-400" theme={theme} />
                    </div>
                </div>

                {/* Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-40 -mt-40" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] -ml-20 -mb-20" />
                <Terminal size={400} className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-6 group-hover:rotate-0 transition-transform duration-[3000ms] pointer-events-none" />
            </header>

            {/* 2. MAIN PRIORITY: Incoming Signal Pool (New Requests) */}
            <section className="space-y-8 animate-in slide-in-from-top-10 duration-1000">
                <div className="flex items-center justify-between px-2">
                    <div>
                        <h2 className={`text-4xl font-black tracking-tighter flex items-center gap-4 uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <Zap className="text-emerald-500 animate-pulse" size={40} /> Available Jobs
                        </h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 ml-14 italic underline decoration-emerald-500/30">New requests waiting to be claimed</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {pool.length === 0 ? (
                        <div className={`col-span-full py-20 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                            <ShieldCheck size={64} className="text-emerald-500/20 mb-6" />
                            <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 animate-pulse">Queue Clear - No Pending Jobs</p>
                        </div>
                    ) : (
                        pool.map((order, idx) => (
                            <Card
                                key={order.id}
                                className={`p-8 rounded-[2.5rem] border-none transition-all duration-700 group relative overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-[#0f172a] shadow-2xl shadow-black/40 hover:bg-[#1e293b]' : 'bg-white shadow-xl shadow-blue-900/5 hover:shadow-blue-900/10'}`}
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                                        <Briefcase size={20} />
                                    </div>
                                    <span className="text-[10px] font-mono font-black text-slate-500">JOB ID: #{order.id}</span>
                                </div>

                                <h3 className={`text-xl font-black uppercase tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{order.service_name}</h3>
                                <div className="flex items-center gap-2 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{order.customer_name}</span>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="flex items-center gap-3 opacity-60">
                                        <Clock size={14} className="text-slate-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase">Received {new Date(order.created_at).toLocaleTimeString()}</span>
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 text-[10px] uppercase font-black tracking-widest"
                                        onClick={() => handleClaim(order.id)}
                                    >
                                        Claim this Job <ArrowUpRight size={16} className="ml-2" />
                                    </Button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            </Card>
                        ))
                    )}
                </div>
            </section>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-500/10 to-transparent" />

            {/* 3. SECONDARY PRIORITY: My Active Workspace */}
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
                    <div>
                        <h2 className={`text-3xl font-black tracking-tighter flex items-center gap-4 uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <LayoutGrid className="text-blue-600" size={32} /> {activeTab === 'active' ? 'My Active Tasks' : 'Work History'}
                        </h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 ml-12 italic underline decoration-blue-500/30">Your personal work area</p>
                    </div>

                    <div className={`flex p-1.5 rounded-2xl shadow-inner ${theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-slate-100'}`}>
                        {[
                            { key: 'active', label: 'Processing', count: activeTasks.length },
                            { key: 'history', label: 'Solved', count: historyTasks.length }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-700 ${activeTab === tab.key
                                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40'
                                    : 'text-slate-500 hover:text-slate-400 hover:bg-white/5'
                                    }`}
                            >
                                {tab.label} <span className="opacity-50 ml-2">[{tab.count}]</span>
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-80 rounded-[3rem] animate-pulse ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`} />
                        ))}
                    </div>
                ) : displayedTasks.length === 0 ? (
                    <Card className={`p-32 border-none flex flex-col items-center justify-center text-center rounded-[4rem] relative overflow-hidden ${theme === 'dark' ? 'bg-white/5 shadow-inner' : 'bg-slate-50/50'}`}>
                        <Database size={80} className="text-slate-700/10 mb-8" />
                        <h3 className="text-2xl font-black uppercase tracking-tight text-slate-500">Everything Clear</h3>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-3">No active tasks in your list</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {displayedTasks.map(task => (
                            <TaskCard key={task.id} task={task} theme={theme} onClick={() => navigate(`/dashboard/staff/verify/${task.id}`)} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatBox({ icon: Icon, label, val, color, theme }) {
    return (
        <div className={`p-5 rounded-2xl border transition-all duration-500 hover:scale-105 ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3 opacity-60">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                <Icon size={14} className={color} />
            </div>
            <p className={`text-xl font-black leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{val}</p>
        </div>
    );
}

function TaskCard({ task, theme, onClick }) {
    const isCompleted = task.status === 'completed';
    return (
        <Card
            onClick={onClick}
            className={`p-0 rounded-[2.5rem] transition-all duration-700 group cursor-pointer overflow-hidden border-none relative ${theme === 'dark' ? 'bg-white/5 shadow-2xl shadow-black/40 hover:bg-white/10' : 'bg-white shadow-xl shadow-blue-900/5 border border-slate-50 hover:shadow-blue-900/10'}`}
        >
            <div className="p-8 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        task.status === 'action_required' ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                            'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current ${task.status === 'processing' ? 'animate-pulse' : ''}`} />
                        {task.status}
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">#{task.id}</span>
                </div>

                <h3 className={`text-xl font-black mb-4 uppercase tracking-tighter transition-colors ${theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                    {task.service_name}
                </h3>

                <div className={`mt-auto p-4 rounded-2xl flex items-center gap-4 transition-all ${theme === 'dark' ? 'bg-white/5 border border-white/5 group-hover:bg-white/10' : 'bg-slate-50 border border-slate-100 group-hover:bg-blue-50'}`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20">
                        {task.customer_name?.[0].toUpperCase()}
                    </div>
                    <div className="min-w-0 overflow-hidden">
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-0.5 opacity-60">Identity Agent</p>
                        <p className={`text-sm font-black truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{task.customer_name}</p>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 opacity-50">
                        <Clock size={12} className="text-slate-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all group-hover:gap-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                        Details <ArrowUpRight size={14} />
                    </div>
                </div>
            </div>

            {/* Visual Flair */}
            <div className={`absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
            <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
        </Card>
    );
}

