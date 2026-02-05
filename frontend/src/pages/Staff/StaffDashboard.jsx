import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Users, ClipboardList, CheckSquare, Zap, Clock, ShieldCheck, Activity, Award, ArrowUpRight, Search, Terminal, Database, HardDrive, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';

export default function StaffDashboard() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto pb-20">
            {/* Premium Staff Header */}
            <header className="relative group overflow-hidden bg-[#0f172a] p-10 md:p-14 rounded-[3.5rem] text-white shadow-[0_35px_60px_-15px_rgba(30,58,138,0.3)]">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 italic">Agent Level 7 Authorized</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            Staff <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-400">Work Desk</span>
                        </h1>
                        <p className="text-slate-400 mt-4 text-base md:text-lg font-medium max-w-xl">
                            View and manage all customer applications. Keep the workflow smooth and fast.
                        </p>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col items-center gap-2 backdrop-blur-xl group hover:bg-white/10 transition-colors">
                            <Zap size={24} className="text-blue-400 group-hover:animate-bounce" />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Sync</p>
                                <p className="text-2xl font-black leading-none">98.4%</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 flex flex-col items-center gap-2 backdrop-blur-xl group hover:bg-white/10 transition-colors">
                            <Cpu size={24} className="text-emerald-400 group-hover:rotate-90 transition-transform duration-500" />
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Tasks</p>
                                <p className="text-2xl font-black leading-none">{myTasks.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
                <Terminal size={300} className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 transition-transform duration-[2000ms]" />
            </header>

            {/* My Active Tasks - Operational Grid */}
            <section>
                <div className="flex items-end justify-between mb-10 px-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
                            <Activity className="text-blue-600" size={28} /> Active Protocol Link
                        </h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-10">Real-time task synchronization</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myTasks.length === 0 ? (
                        <Card className="lg:col-span-3 p-20 border-2 border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center text-center rounded-[4rem] group overflow-hidden relative">
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center text-slate-300 mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    <HardDrive size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">System Idle</h3>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest max-w-xs">Zero active assignments detected in current neural space.</p>
                            </div>
                            <style jsx>{`
                                @keyframes pulse-slow {
                                    0%, 100% { opacity: 0.02; }
                                    50% { opacity: 0.1; }
                                }
                            `}</style>
                            <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 opacity-[0.02] animate-[pulse-slow_3s_infinite]" size={300} />
                        </Card>
                    ) : (
                        myTasks.map(task => (
                            <Card key={task.id} className="p-0 border-none bg-white rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] hover:shadow-[0_45px_100px_-20px_rgba(59,130,246,0.2)] transition-all duration-700 hover:-translate-y-2 group overflow-hidden">
                                <div className="p-10 flex flex-col h-full relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${task.status === 'processing' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <span className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full bg-current ${task.status === 'processing' ? 'animate-pulse' : ''}`} />
                                                {task.status}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono font-black text-slate-300 tracking-tighter uppercase italic">
                                            SEQ #{task.id}
                                        </span>
                                    </div>

                                    <h3 className="font-black text-2xl text-slate-900 group-hover:text-blue-600 transition-colors mb-4 uppercase tracking-tighter leading-none">
                                        {task.service_name}
                                    </h3>

                                    <div className="space-y-4 mb-10 mt-2">
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[1.8rem] border border-slate-100 transition-all group-hover:bg-blue-50/50 group-hover:border-blue-100">
                                            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 text-sm font-black shadow-sm group-hover:scale-110 transition-transform">
                                                {task.customer_name?.[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Initiator</p>
                                                <p className="text-sm font-black text-slate-800 tracking-tight">{task.customer_name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() => navigate(`/dashboard/staff/verify/${task.id}`)}
                                        className="mt-auto w-full"
                                    >
                                        Open Application <ArrowUpRight size={18} />
                                    </Button>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Card>
                        ))
                    )}
                </div>
            </section>

            {/* Task Pool - The Matrix Grid */}
            <section className="mt-20">
                <div className="flex items-center justify-between mb-10 px-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
                            <Users className="text-emerald-600" size={28} /> New Incoming Jobs
                        </h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 ml-10">Select a job from the queue to start working</p>
                    </div>
                </div>

                <Card className="bg-white rounded-[3.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] border border-slate-50 overflow-hidden group">
                    {pool.length === 0 ? (
                        <div className="p-32 text-center relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-6 shadow-inner animate-pulse">
                                    <ShieldCheck size={40} />
                                </div>
                                <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Matrix Clear · Zero Anomalies</p>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/80 border-b border-slate-100">
                                    <tr>
                                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Node Designation</th>
                                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Requesting Unit</th>
                                        <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Time Reference</th>
                                        <th className="p-8 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {pool.map((order, idx) => (
                                        <tr key={order.id} className="group hover:bg-blue-50/40 transition-all duration-300">
                                            <td className="p-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-1.5 h-6 bg-slate-200 rounded-full group-hover:bg-blue-600 group-hover:h-10 transition-all duration-500" />
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-900 text-lg uppercase tracking-tight">{order.service_name}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref ID: #{order.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                        👤
                                                    </div>
                                                    <span className="text-sm font-black text-slate-700 tracking-tight">{order.customer_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-xs font-mono text-slate-300 uppercase italic group-hover:text-slate-500 transition-colors">
                                                {new Date(order.created_at).toLocaleTimeString()}
                                            </td>
                                            <td className="p-8 text-right">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleClaim(order.id)}
                                                    className="shadow-emerald-500/20"
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
