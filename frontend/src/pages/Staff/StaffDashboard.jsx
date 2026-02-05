import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, ClipboardList, CheckSquare, Zap, Clock, ShieldCheck, Activity, Award, ArrowUpRight, Search, Terminal, Database, HardDrive, Cpu } from 'lucide-react';
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

    useEffect(() => {
        if (!user) return;
        fetch(`${API_BASE}/staff/orders`, {
            headers: { 'Authorization': `mock_token_${user.id}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setOrders(data);
                setLoading(false);
            });
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
                setOrders(prev => prev.map(o =>
                    o.id === orderId ? { ...o, assigned_staff_id: user.id, status: 'processing' } : o
                ));
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto pb-20">
            {/* Premium Staff Header */}
            <header className="relative group overflow-hidden bg-[#0f172a] p-5 md:p-6 rounded-2xl text-white shadow-[0_20px_40px_-15px_rgba(30,58,138,0.3)]">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                            <div className="px-2 py-0.5 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-emerald-300 italic">Authorized Staff Access</span>
                            </div>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                            Staff <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400">Dashboard</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-xs md:text-sm font-medium max-w-lg">
                            View and manage all customer applications. Keep the workflow smooth and fast.
                        </p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1 backdrop-blur-xl group hover:bg-white/10 transition-colors">
                            <Zap size={16} className="text-blue-400 group-hover:animate-bounce" />
                            <div className="text-center">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">System Health</p>
                                <p className="text-lg font-black leading-none">98.4%</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1 backdrop-blur-xl group hover:bg-white/10 transition-colors">
                            <Cpu size={16} className="text-emerald-400 group-hover:rotate-90 transition-transform duration-500" />
                            <div className="text-center">
                                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">My Tasks</p>
                                <p className="text-lg font-black leading-none">{myTasks.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
                <Terminal size={250} className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 transition-transform duration-[2000ms]" />
            </header>

            <section>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 px-4 gap-4">
                    <div>
                        <h2 className={`text-2xl font-black tracking-tight flex items-center gap-3 uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <Activity className="text-blue-600" size={28} /> {activeTab === 'active' ? 'My Active Tasks' : 'My History'}
                        </h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-10">
                            {activeTab === 'active' ? 'Applications you are currently working on' : 'Applications you have completed'}
                        </p>
                    </div>

                    <div className={`flex p-1 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <button
                            onClick={() => setActiveTab('active')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-500 hover:text-slate-400'
                                }`}
                        >
                            Active ({activeTasks.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                : 'text-slate-500 hover:text-slate-400'
                                }`}
                        >
                            History ({historyTasks.length})
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedTasks.length === 0 ? (
                        <Card className={`lg:col-span-3 p-12 border-2 border-dashed flex flex-col items-center justify-center text-center rounded-3xl group overflow-hidden relative ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50/30'}`}>
                            <div className="relative z-10">
                                <div className={`w-20 h-20 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 text-slate-600' : 'bg-white text-slate-300'}`}>
                                    <HardDrive size={40} />
                                </div>
                                <h3 className={`text-xl font-black mb-2 tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                    {activeTab === 'active' ? 'No Active Tasks' : 'History is Empty'}
                                </h3>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest max-w-xs">
                                    {activeTab === 'active' ? "You don't have any ongoing applications assigned." : "You haven't completed any applications yet."}
                                </p>
                            </div>
                            <style jsx>{`
                                @keyframes pulse-slow {
                                    0%, 100% { opacity: 0.02; }
                                    50% { opacity: 0.1; }
                                }
                            `}</style>
                            <Database className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] animate-[pulse-slow_3s_infinite] ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} size={300} />
                        </Card>
                    ) : (
                        displayedTasks.map(task => (
                            <Card key={task.id} className={`p-0 rounded-2xl transition-all duration-700 hover:-translate-y-2 group overflow-hidden relative ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_45px_100px_-20px_rgba(59,130,246,0.3)] hover:border-blue-500/30' : 'bg-white border-none shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_45px_100px_-20px_rgba(59,130,246,0.2)}'}`}>
                                <div className="p-6 flex flex-col h-full relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${task.status === 'completed' ? (theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600') : task.status === 'processing' ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-50 text-amber-600') : (theme === 'dark' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-600')}`}>
                                            <span className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-current ${task.status === 'processing' ? 'animate-pulse' : ''}`} />
                                                {task.status}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] font-mono font-black tracking-tighter uppercase italic ${theme === 'dark' ? 'text-slate-500' : 'text-slate-300'}`}>
                                            ID #{task.id}
                                        </span>
                                    </div>

                                    <h3 className={`font-black text-lg transition-colors mb-3 uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                                        {task.service_name}
                                    </h3>

                                    <div className="space-y-3 mb-4">
                                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/50 group-hover:bg-slate-700/50 group-hover:border-blue-500/30' : 'bg-slate-50 border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100'}`}>
                                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-[10px] font-black shadow-lg group-hover:scale-110 transition-transform ${theme === 'dark' ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400' : 'bg-white border-slate-100 text-blue-600'}`}>
                                                {task.customer_name?.[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className={`text-[8px] font-black uppercase tracking-widest leading-none mb-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Customer</p>
                                                <p className={`text-xs font-black tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{task.customer_name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => navigate(`/dashboard/staff/verify/${task.id}`)}
                                        className="mt-auto w-full h-10 text-[10px]"
                                    >
                                        Open Application <ArrowUpRight size={14} />
                                    </Button>
                                </div>
                                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-500/5'}`} />
                                <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 blur-xl opacity-0 group-hover:opacity-100 transition-opacity ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-500/5'}`} />
                            </Card>
                        ))
                    )}
                </div>
            </section>

            {/* Task Pool - The Matrix Grid */}
            <section className="mt-20">
                <div className="flex items-center justify-between mb-10 px-4">
                    <div>
                        <h2 className={`text-2xl font-black tracking-tight flex items-center gap-3 uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <Users className="text-emerald-600" size={28} /> New Incoming Requests
                        </h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-10">Select a request from the queue to start working</p>
                    </div>
                </div>

                <Card className={`rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] border overflow-hidden group ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-50'}`}>
                    {pool.length === 0 ? (
                        <div className="p-20 text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <div className={`w-16 h-16 border rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-200'}`}>
                                    <ShieldCheck size={32} />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">All Caught Up · Queue Empty</p>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px]" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className={`border-b ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50/80 border-slate-100'}`}>
                                    <tr>
                                        <th className="p-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Service Name</th>
                                        <th className="p-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Customer Name</th>
                                        <th className="p-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Time Received</th>
                                        <th className="p-3 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                                    {pool.map((order, idx) => (
                                        <tr key={order.id} className={`group transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-blue-50/40'}`}>
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1 h-4 rounded-full group-hover:h-6 transition-all duration-500 ${theme === 'dark' ? 'bg-white/20 group-hover:bg-blue-500' : 'bg-slate-200 group-hover:bg-blue-600'}`} />
                                                    <div className="flex flex-col">
                                                        <span className={`font-black text-xs uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{order.service_name}</span>
                                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Ref ID: #{order.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black group-hover:shadow-sm transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-500 group-hover:bg-white/10' : 'bg-slate-100 text-slate-400 group-hover:bg-white'}`}>
                                                        👤
                                                    </div>
                                                    <span className={`text-xs font-black tracking-tight ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{order.customer_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-[10px] font-mono text-slate-300 uppercase italic group-hover:text-slate-500 transition-colors">
                                                {new Date(order.created_at).toLocaleTimeString()}
                                            </td>
                                            <td className="p-3 text-right">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleClaim(order.id)}
                                                    className="h-8 text-[9px] shadow-emerald-500/20"
                                                >
                                                    Accept Job <ArrowUpRight size={14} />
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
        </div>
    );
}
