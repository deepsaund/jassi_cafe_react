import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Clock, CheckCircle, AlertCircle, Plus, Wallet, ArrowRight, MessageSquare, Settings, FileText, Zap, ShieldCheck, Activity, Award, CreditCard, Fingerprint, Globe, Briefcase, RefreshCw, ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, color, bg, gradient, label }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-5 rounded-2xl text-white bg-gradient-to-br ${gradient} shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 ${theme === 'dark' ? 'shadow-none' : 'shadow-slate-200/50'}`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between opacity-80 mb-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{title}</span>
                    <Icon size={18} />
                </div>
                <h3 className="text-3xl font-black tracking-tighter mb-1">{value}</h3>
                <p className="text-[10px] font-bold opacity-60">{label}</p>
            </div>
            <Icon size={100} className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
        </div>
    );
};

import { Drawer } from '../../components/ui/Drawer';
import { OrderChat } from '../../components/Dashboard/OrderChat';

const OrderStatusTracker = ({ status }) => {
    const { theme } = useTheme();
    const states = [
        { key: 'received', label: 'Received', icon: Clock },
        { key: 'processing', label: 'Processing', icon: Settings },
        { key: 'completed', label: 'Finished', icon: CheckCircle }
    ];

    const currentIdx = status === 'completed' ? 2 : (status === 'received' ? 0 : 1);
    const isActionNeeded = status === 'action_required';

    return (
        <div className="mt-3 relative">
            <div className="flex justify-between relative z-10">
                {states.map((s, i) => {
                    const isActive = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    const Icon = s.icon;

                    return (
                        <div key={s.key} className="flex flex-col items-center gap-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ${isActionNeeded && isCurrent ? 'bg-red-500 text-white animate-pulse' :
                                isActive ? 'bg-blue-600 text-white' :
                                    theme === 'dark' ? 'bg-white/10 text-slate-500' : 'bg-slate-100 text-slate-400'
                                }`}>
                                <Icon size={12} className={isCurrent ? 'scale-110' : ''} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? (theme === 'dark' ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Background Line */}
            <div className={`absolute top-3.5 left-4 right-4 h-[1px] -z-0 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <div
                    className={`h-full transition-all duration-700 ${isActionNeeded ? 'bg-red-400' : 'bg-blue-600'}`}
                    style={{ width: `${(currentIdx / (states.length - 1)) * 100}%` }}
                />
            </div>
        </div>
    );
};

import { OrderFix } from '../../components/Dashboard/OrderFix';

const ServiceCard = ({ id, service_name, status, created_at, output_document_ids, user, onChatOpen, onFixOpen }) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const statusText = {
        received: { label: "Received", color: "text-blue-600", bg: "bg-blue-50", icon: Clock },
        processing: { label: "Processing", color: "text-amber-600", bg: "bg-amber-50", icon: Settings },
        completed: { label: "Completed", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
        action_required: { label: "Action Needed", color: "text-red-600", bg: "bg-red-50", icon: AlertCircle }
    };

    const currentStatus = statusText[status] || { label: status, color: "text-slate-600", bg: "bg-slate-50", icon: Clock };

    // Custom colors for dark mode status badges
    const darkStatusColors = {
        received: "bg-blue-500/10 text-blue-400",
        processing: "bg-amber-500/10 text-amber-400",
        completed: "bg-emerald-500/10 text-emerald-400",
        action_required: "bg-red-500/10 text-red-500"
    };

    const StatusStyles = theme === 'dark' ? darkStatusColors[status] || "bg-white/5 text-slate-400" : `${currentStatus.bg} ${currentStatus.color}`;

    return (
        <div className={`group p-4 border-b last:border-0 transition-all cursor-pointer ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`} onClick={() => onChatOpen(id)}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform text-lg ${StatusStyles}`}>
                        {service_name[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h4 className={`font-black text-base leading-tight group-hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{service_name}</h4>
                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${StatusStyles}`}>
                                <div className={`w-1 h-1 rounded-full bg-current ${status === 'action_required' ? 'animate-pulse' : ''}`} />
                                {currentStatus.label}
                            </span>
                        </div>
                        <p className={`text-[9px] font-bold uppercase tracking-widest leading-none mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Sequence #{id} • Applied {new Date(created_at).toLocaleDateString()}</p>
                        <div className="max-w-[200px]">
                            <OrderStatusTracker status={status} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                    {status === 'completed' && output_document_ids && (
                        <Button
                            size="sm"
                            variant="secondary"
                            className={`h-9 px-4 text-[9px] uppercase font-black rounded-lg shadow-lg border-emerald-500/30 ${theme === 'dark' ? 'text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                            onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                    const outDocs = typeof output_document_ids === 'string' ? JSON.parse(output_document_ids) : output_document_ids;
                                    const firstId = Object.values(outDocs)[0];
                                    if (!firstId) return;

                                    const res = await fetch(`${API_BASE}/documents/batch?ids=${firstId}`, {
                                        headers: { 'Authorization': `mock_token_${user.id}` }
                                    });
                                    const docs = await res.json();
                                    if (docs.length > 0) {
                                        const url = docs[0].file_path.startsWith('http') ? docs[0].file_path : `${API_BASE.replace('/api', '')}${docs[0].file_path}`;
                                        window.open(url, '_blank');
                                    }
                                } catch (err) { console.error(err); }
                            }}
                        >
                            <CheckCircle size={12} className="mr-2" /> Download Result
                        </Button>
                    )}
                    {status === 'action_required' && (
                        <Button
                            size="sm"
                            variant="danger"
                            className="h-9 px-4 text-[9px] uppercase font-black rounded-lg shadow-lg"
                            onClick={(e) => { e.stopPropagation(); onFixOpen(id); }}
                        >
                            <AlertCircle size={12} className="mr-2" /> Fix Issue
                        </Button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onChatOpen(id); }}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:scale-110 ${theme === 'dark' ? 'text-slate-500 hover:text-blue-400 hover:bg-white/5' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                        <MessageSquare size={18} />
                    </button>
                    <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all group-hover:translate-x-1 ${theme === 'dark' ? 'text-slate-600 group-hover:text-blue-400 group-hover:bg-white/5' : 'text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50'}`}>
                        <ArrowRight size={18} />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function CustomerDashboard() {
    const navigate = useNavigate();
    const { user, refreshUser, settings } = useAuth();
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
    const [chatOrderId, setChatOrderId] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Fix State
    const [fixOrderId, setFixOrderId] = useState(null);
    const [isFixOpen, setIsFixOpen] = useState(false);

    const fetchOrders = () => {
        if (!user) return;
        setLoading(true);
        fetch(`${API_BASE}/orders`, {
            headers: { 'Authorization': `mock_token_${user.id}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
        // Point 3: Pseudo Real-time polling every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        setCurrentPage(1); // Reset page when tab changes
    }, [activeTab]);

    const openChat = (id) => {
        setChatOrderId(id);
        setIsChatOpen(true);
    };

    const openFix = (id) => {
        setFixOrderId(id);
        setIsFixOpen(true);
    };


    const stats = {
        active: orders.filter(o => o.status === 'received' || o.status === 'processing').length,
        action: orders.filter(o => o.status === 'action_required').length,
        completed: orders.filter(o => o.status === 'completed').length
    };

    const filteredOrders = orders
        .filter(o => activeTab === 'active' ? o.status !== 'completed' : o.status === 'completed')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const totalPages = Math.ceil(filteredOrders.length / 5);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32">

            {/* 1. Compact Unified Header */}
            <header className={`flex flex-col lg:flex-row justify-between items-center gap-8 p-10 rounded-[3rem] relative overflow-hidden transition-all duration-700 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-2xl shadow-blue-900/10' : 'bg-white text-slate-900 border border-slate-100 shadow-xl shadow-blue-900/5'}`}>
                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 italic">Member Online</span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-3">
                        Greetings, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 uppercase">{user?.name?.split(' ')[0] || 'Member'}</span>
                    </h1>
                    <p className="max-w-md font-bold text-sm leading-relaxed text-slate-400">
                        {orders.filter(o => o.status !== 'completed').length > 0
                            ? `You have ${orders.filter(o => o.status !== 'completed').length} active applications currently in progress.`
                            : 'All systems clear. We are ready for your new service requests.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    {settings?.wallet_system_status === 'enabled' && (
                        <div className={`p-1.5 pl-6 rounded-3xl flex items-center gap-6 border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-0.5">Account Balance</span>
                                <span className="text-2xl font-black tracking-tighter">₹{parseFloat(user?.wallet_balance || 0).toLocaleString()}</span>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard/wallet')}
                                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-blue-600/30"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    )}

                    <Button
                        onClick={() => navigate('/dashboard/services')}
                        className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl shadow-2xl shadow-indigo-600/20 border-none group text-sm uppercase tracking-widest"
                    >
                        <Zap size={20} className="mr-3 group-hover:animate-pulse" /> New Request
                    </Button>
                </div>

                {/* Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] -ml-20 -mb-20" />
            </header>
            {/* 1.5 Quick Action Grid (Main Kaam First) */}
            <section className="animate-in slide-in-from-top-4 duration-700 delay-100">
                <div className="flex items-center justify-between px-2 mb-6">
                    <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Primary Gateways</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: 'Pan Card', icon: CreditCard, color: 'from-blue-500 to-indigo-600', desc: 'New / Correction' },
                        { name: 'Aadhar Update', icon: Fingerprint, color: 'from-emerald-500 to-teal-600', desc: 'Address / Phone' },
                        { name: 'Passport', icon: Globe, color: 'from-purple-500 to-pink-600', desc: 'Fresh / Re-issue' },
                        { name: 'B2B Services', icon: Briefcase, color: 'from-amber-500 to-orange-600', desc: 'Bulk Processing' }
                    ].map((svc, i) => (
                        <div
                            key={svc.name}
                            onClick={() => navigate('/dashboard/services')}
                            className={`group cursor-pointer p-6 rounded-[2rem] border transition-all duration-500 hover:-translate-y-2 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 shadow-xl shadow-blue-900/5 hover:shadow-blue-900/10'}`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                <svc.icon size={24} />
                            </div>
                            <h4 className={`font-black text-sm uppercase tracking-tighter mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{svc.name}</h4>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{svc.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 2. Urgent Action Center */}
            {stats.action > 0 && (
                <div
                    className={`p-8 rounded-[2.5rem] border-2 border-dashed transition-all duration-700 flex flex-col lg:flex-row items-center justify-between gap-8 cursor-pointer group hover:scale-[1.01] ${theme === 'dark' ? 'bg-red-500/10 border-red-500/20 shadow-2xl shadow-red-950/20' : 'bg-red-50 border-red-100 hover:border-red-200 shadow-xl shadow-red-500/5'}`}
                    onClick={() => {
                        const firstActionOrder = orders.find(o => o.status === 'action_required');
                        if (firstActionOrder) openFix(firstActionOrder.id);
                    }}
                >
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-3xl bg-red-600 text-white flex items-center justify-center shadow-2xl shadow-red-600/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                            <AlertCircle size={40} className="animate-pulse" />
                        </div>
                        <div>
                            <h3 className={`text-2xl font-black uppercase tracking-tight mb-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>Correction Needed</h3>
                            <p className={`text-sm font-bold max-w-md ${theme === 'dark' ? 'text-red-400/60' : 'text-red-600/60'}`}>Action required on {stats.action} {stats.action === 1 ? 'application' : 'applications'}. Please review to continue processing.</p>
                        </div>
                    </div>
                    <Button
                        variant="danger"
                        className="bg-red-600 hover:bg-red-700 text-white border-none rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-xs shadow-xl shadow-red-600/20"
                    >
                        Resolve Issues <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            )}

            {/* 3. Primary Streams (Landings Page Central Content) */}
            <section className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-6">
                    <div>
                        <h2 className={`text-3xl font-black tracking-tighter flex items-center gap-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <Activity className="text-blue-600" size={32} /> RECENT UPDATES
                        </h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 ml-12 italic underline decoration-blue-500/30">Live Application Status</p>
                    </div>

                    <div className={`flex p-1.5 rounded-2xl shadow-inner ${theme === 'dark' ? 'bg-white/5 border border-white/5' : 'bg-slate-100'}`}>
                        {[
                            { key: 'active', label: 'Processing' },
                            { key: 'history', label: 'Archived' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeTab === tab.key
                                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-900/40'
                                    : 'text-slate-500 hover:text-slate-400 hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <Card className={`p-0 rounded-[3rem] overflow-hidden border-none shadow-2xl transition-all duration-700 ${theme === 'dark' ? 'bg-white/5 shadow-black/40' : 'bg-white shadow-blue-900/5'}`}>
                    {loading ? (
                        <div className="p-32 text-center text-slate-400">
                            <RefreshCw className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-8" />
                            <p className="font-black text-xs uppercase tracking-[0.3em]">Loading Your Content...</p>
                        </div>
                    ) : (filteredOrders.length > 0) ? (
                        <>
                            <div className={`divide-y transition-all duration-500 ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                                {filteredOrders
                                    .slice((currentPage - 1) * 5, currentPage * 5)
                                    .map((order, i) => (
                                        <div key={order.id} className="group p-6 md:p-8 hover:bg-blue-600/5 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                    {order.service_name?.[0]}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h4 className={`font-black text-lg tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{order.service_name}</h4>
                                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : order.status === 'action_required' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                            {order.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applied on {new Date(order.created_at).toLocaleDateString()} • Ref: #{order.id}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => { setChatOrderId(order.id); setIsChatOpen(true); }}
                                                    className="h-12 w-12 p-0 rounded-2x flex items-center justify-center group/btn hover:scale-110 transition-all border-none"
                                                >
                                                    <MessageSquare size={18} className="text-slate-500 group-hover/btn:text-blue-500 transition-colors" />
                                                </Button>

                                                {order.status === 'action_required' ? (
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => { setFixOrderId(order.id); setIsFixOpen(true); }}
                                                        className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-red-600/10 hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        Fix Issues
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="secondary"
                                                        className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:scale-105 active:scale-95 transition-all"
                                                    >
                                                        View Status
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Pagination */}
                            <div className={`p-6 flex items-center justify-between border-t ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : (theme === 'dark' ? 'hover:bg-white/5 border border-white/5 text-white' : 'hover:bg-blue-600 hover:text-white border border-slate-100 text-slate-500')}`}
                                    >
                                        Prev
                                    </button>
                                    <button
                                        disabled={currentPage >= totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${currentPage >= totalPages ? 'opacity-30 cursor-not-allowed' : (theme === 'dark' ? 'hover:bg-white/5 border border-white/5 text-white' : 'hover:bg-blue-600 hover:text-white border border-slate-100 text-slate-500')}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-32 text-center group cursor-pointer" onClick={() => navigate('/dashboard/services')}>
                            <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 ${theme === 'dark' ? 'bg-white/5 text-slate-700 border border-white/5' : 'bg-slate-50 text-slate-200 border border-slate-100'}`}>
                                <FileText size={48} />
                            </div>
                            <h3 className={`text-2xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900 uppercase'}`}>Ready to Start</h3>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-xs mx-auto mb-10 leading-relaxed">You haven't applied for any services yet. Browse our catalog to get started.</p>
                            <Button variant="primary" className="h-14 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20">
                                Browse Catalog <ArrowRight size={16} className="ml-3" />
                            </Button>
                        </div>
                    )}
                </Card>
            </section>

            {/* 4. Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard title="Active Jobs" value={stats.active} icon={Activity} gradient="from-blue-600 to-indigo-700" label="In Progress" />
                <StatCard title="Action Needed" value={stats.action} icon={AlertCircle} gradient="from-orange-500 to-red-600" label="Immediate Attention" />
                <StatCard title="Completed" value={stats.completed} icon={Award} gradient="from-emerald-600 to-teal-700" label="Successfully Finished" />
            </div>

            {/* Support Drawers */}
            <Drawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                title={`Support Chat: #${chatOrderId}`}
            >
                {chatOrderId && <OrderChat orderId={chatOrderId} />}
            </Drawer>

            {/* Fix Drawer */}
            <Drawer
                isOpen={isFixOpen}
                onClose={() => setIsFixOpen(false)}
                title="Service Correction"
            >
                {fixOrderId && orders.find(o => o.id === fixOrderId) && (
                    <OrderFix
                        order={orders.find(o => o.id === fixOrderId)}
                        onClose={() => setIsFixOpen(false)}
                        onUpdate={fetchOrders}
                    />
                )}
            </Drawer>
        </div>
    );
}
