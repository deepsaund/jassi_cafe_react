import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Clock, CheckCircle, AlertCircle, Plus, Wallet, ArrowRight, MessageSquare, Settings, FileText, Zap, ShieldCheck, Activity, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, color, bg, gradient, label }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-[2.5rem] text-white bg-gradient-to-br ${gradient} shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 ${theme === 'dark' ? 'shadow-none' : 'shadow-slate-200/50'}`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between opacity-80 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
                    <Icon size={20} />
                </div>
                <h3 className="text-4xl font-black tracking-tighter mb-1">{value}</h3>
                <p className="text-xs font-bold opacity-60">{label}</p>
            </div>
            <Icon size={120} className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
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
        <div className="mt-4 relative">
            <div className="flex justify-between relative z-10">
                {states.map((s, i) => {
                    const isActive = i <= currentIdx;
                    const isCurrent = i === currentIdx;
                    const Icon = s.icon;

                    return (
                        <div key={s.key} className="flex flex-col items-center gap-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isActionNeeded && isCurrent ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' :
                                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' :
                                    theme === 'dark' ? 'bg-white/10 text-slate-500' : 'bg-slate-100 text-slate-400'
                                }`}>
                                <Icon size={14} className={isCurrent ? 'scale-110' : ''} />
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? (theme === 'dark' ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Background Line */}
            <div className={`absolute top-4 left-4 right-4 h-[2px] -z-0 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <div
                    className={`h-full transition-all duration-700 ${isActionNeeded ? 'bg-red-400' : 'bg-blue-600'}`}
                    style={{ width: `${(currentIdx / (states.length - 1)) * 100}%` }}
                />
            </div>
        </div>
    );
};

import { OrderFix } from '../../components/Dashboard/OrderFix';

const ServiceCard = ({ id, service_name, status, created_at, onChatOpen, onFixOpen }) => {
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
        <div className={`group p-6 border-b last:border-0 transition-all cursor-pointer ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`} onClick={() => onChatOpen(id)}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform text-xl ${StatusStyles}`}>
                        {service_name[0]}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h4 className={`font-black text-lg leading-tight group-hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{service_name}</h4>
                            <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${StatusStyles}`}>
                                <div className={`w-1.5 h-1.5 rounded-full bg-current ${status === 'action_required' ? 'animate-pulse' : ''}`} />
                                {currentStatus.label}
                            </span>
                        </div>
                        <p className={`text-xs font-bold uppercase tracking-widest leading-none mb-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Sequence #{id} • Applied {new Date(created_at).toLocaleDateString()}</p>
                        <div className="max-w-xs">
                            <OrderStatusTracker status={status} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                    {status === 'action_required' && (
                        <Button
                            size="sm"
                            variant="danger"
                            className="h-10 px-6 text-[10px] uppercase font-black rounded-xl shadow-lg"
                            onClick={(e) => { e.stopPropagation(); onFixOpen(id); }}
                        >
                            <AlertCircle size={14} className="mr-2" /> Fix Issue
                        </Button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onChatOpen(id); }}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all hover:scale-110 ${theme === 'dark' ? 'text-slate-500 hover:text-blue-400 hover:bg-white/5' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                    >
                        <MessageSquare size={20} />
                    </button>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group-hover:translate-x-1 ${theme === 'dark' ? 'text-slate-600 group-hover:text-blue-400 group-hover:bg-white/5' : 'text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50'}`}>
                        <ArrowRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const { theme } = useTheme();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatOrderId, setChatOrderId] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

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
    }, [user]);

    const openChat = (id) => {
        setChatOrderId(id);
        setIsChatOpen(true);
    };

    const openFix = (id) => {
        setFixOrderId(id);
        setIsFixOpen(true);
    };

    const handleAddFunds = async () => {
        const amount = prompt("Enter amount to add (₹):", "500");
        if (!amount || isNaN(amount) || amount <= 0) return;

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
                alert("Funds added successfully!");
            } else {
                alert(data.error || "Failed to add funds");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const stats = {
        active: orders.filter(o => o.status === 'received' || o.status === 'processing').length,
        action: orders.filter(o => o.status === 'action_required').length,
        completed: orders.filter(o => o.status === 'completed').length
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Dark Premium Header */}
            <header className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none' : 'bg-white text-slate-900 border border-slate-100 shadow-2xl shadow-blue-900/10'}`}>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-glow shadow-blue-500/50" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Identity Verified</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Monitoring your active network and service requests.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-10 w-full md:w-auto">
                    {/* Glassmorphic Wallet */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center gap-4 backdrop-blur-md">
                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                            <Wallet size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Balance</p>
                            <p className="text-lg font-black leading-none">₹{parseFloat(user?.wallet_balance || 0).toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleAddFunds}
                            className="ml-2 bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all hover:scale-110 active:scale-95"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <Button
                        onClick={() => navigate('/dashboard/services')}
                        className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 border-none group"
                    >
                        <Zap size={18} className="mr-2 group-hover:animate-pulse" /> New Request
                    </Button>
                </div>

                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl opacity-50" />
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Active Services"
                    value={stats.active}
                    icon={Clock}
                    gradient="from-blue-600 to-indigo-600"
                    label="Units Processing"
                />
                <StatCard
                    title="Action Required"
                    value={stats.action}
                    icon={AlertCircle}
                    gradient="from-orange-500 to-red-600"
                    label="Awaiting Input"
                />
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    icon={CheckCircle}
                    gradient="from-emerald-600 to-teal-600"
                    label="Verified Sequence"
                />
            </div>

            {/* Recent Activity */}
            {/* Recent Activity */}
            <section>
                <div className="flex items-end justify-between mb-8 px-2">
                    <div>
                        <h2 className={`text-2xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <Activity className="text-blue-600" size={28} /> Neural Pipeline
                        </h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 ml-10">Real-time application status</p>
                    </div>
                </div>
                <Card className={`p-0 overflow-hidden border-none shadow-xl ${theme === 'dark' ? 'shadow-slate-900/40' : 'shadow-slate-200/40'}`}>
                    {loading ? (
                        <div className="p-20 text-center text-slate-400">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                            <p className="font-black text-xs uppercase tracking-widest">Synchronizing Network...</p>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {orders.slice(0, 5).map(order => (
                                <ServiceCard key={order.id} {...order} onChatOpen={openChat} onFixOpen={openFix} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border shadow-inner ${theme === 'dark' ? 'bg-white/5 text-slate-700 border-white/5' : 'bg-slate-50 text-slate-200 border-slate-100'}`}>
                                <FileText size={40} />
                            </div>
                            <h3 className={`text-xl font-black mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>No active signals</h3>
                            <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto mb-8">Your neural pipeline is currently empty. Initiate a new service request to begin.</p>
                            <Button variant="primary" className="h-12 px-8 rounded-xl font-black" onClick={() => navigate('/dashboard/services')}>
                                Browse Catalog
                            </Button>
                        </div>
                    )}
                </Card>
            </section>

            {/* Chat Drawer */}
            <Drawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                title={`Order Chat: #${chatOrderId}`}
            >
                {chatOrderId && <OrderChat orderId={chatOrderId} />}
            </Drawer>

            {/* Fix Drawer */}
            <Drawer
                isOpen={isFixOpen}
                onClose={() => setIsFixOpen(false)}
                title="Resolve Application Issue"
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
