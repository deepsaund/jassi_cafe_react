import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, FileText, Zap, Sparkles, Filter, ArrowRight, ShieldCheck, Clock, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

import { Drawer } from '../../components/ui/Drawer';
import ServiceApply from './ServiceApply';

export default function ServiceCatalog() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE}/services`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setServices(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const openApplyDrawer = (service) => {
        setSelectedService(service);
        setIsDrawerOpen(true);
    };

    const handleApplyComplete = () => {
        setIsDrawerOpen(false);
        // Success animation or toast could be added here
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
            {/* Futuristic Header */}
            <header className={`relative group overflow-hidden p-6 md:p-8 rounded-3xl transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none' : 'bg-white text-slate-900 shadow-[0_35px_60px_-15px_rgba(30,58,138,0.15)] border border-slate-100'}`}>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30 flex items-center gap-2">
                                <Zap size={14} className="text-blue-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">System Online</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                            Service <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Catalog</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm md:text-base font-medium max-w-xl">
                            Select any service below to begin your online application. We make the process simple and fast for you.
                        </p>
                    </div>

                    <div className="w-full md:w-[400px] space-y-4">
                        <div className="relative group/search">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-blue-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search services..."
                                className={`w-full pl-16 pr-6 py-3 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white/10 focus:border-blue-500/50 transition-all font-bold backdrop-blur-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-black/20'}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -ml-20 -mb-20" />
                <Layers size={250} className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 group-hover:rotate-6 transition-transform duration-[2000ms]" />
            </header>

            {/* Service Grid Section */}
            <section className="relative">
                <div className="flex items-center justify-between mb-10 px-4">
                    <h2 className={`text-2xl font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        <Sparkles className="text-blue-600" size={28} /> Available Services
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{filteredServices.length} Services Found</span>
                        <div className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`} />
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={`h-80 border rounded-[3rem] animate-pulse overflow-hidden relative ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] animate-[shimmer_2s_infinite]" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service, idx) => (
                            <Card
                                key={service.id}
                                className={`group p-1 border-none shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(30,58,138,0.15)] transition-all duration-700 hover:-translate-y-2 relative overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}
                            >
                                <div className={`rounded-[2.9rem] p-8 h-full flex flex-col relative z-10 border transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-50'}`}>
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 shadow-inner group-hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] group-hover:scale-110 ${theme === 'dark' ? 'bg-white/5 text-slate-500 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                            <FileText size={32} />
                                        </div>
                                        <div className="text-right">
                                            {user?.role === 'b2b' ? (
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-slate-500 line-through uppercase tracking-widest opacity-60">₹{service.price_normal}</p>
                                                    <div className="bg-gradient-to-br from-amber-400 to-orange-600 text-white px-4 py-1.5 rounded-2xl text-sm font-black shadow-lg shadow-orange-500/20 scale-105">
                                                        ₹{service.price_b2b}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-2xl text-base font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                                    ₹{service.price_normal}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className={`text-2xl font-black group-hover:text-blue-600 transition-colors mb-3 leading-tight uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                        {service.name}
                                    </h3>

                                    <p className={`text-sm font-medium leading-relaxed mb-6 line-clamp-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {service.description}
                                    </p>

                                    {service.documents_required_json && (
                                        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                                            {JSON.parse(service.documents_required_json).slice(0, 3).map(doc => (
                                                <span key={doc} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm ${theme === 'dark' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-blue-500 bg-blue-50 border-blue-100'}`}>
                                                    {doc}
                                                </span>
                                            ))}
                                            {JSON.parse(service.documents_required_json).length > 3 && (
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${theme === 'dark' ? 'text-slate-500 bg-white/5 border-white/10' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                                                    +{JSON.parse(service.documents_required_json).length - 3} More
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        className="w-full"
                                        variant="primary"
                                        size="lg"
                                        onClick={() => openApplyDrawer(service)}
                                    >
                                        Start Online Application
                                        <ArrowRight size={16} />
                                    </Button>
                                </div>

                                {/* Hover Pattern */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 rounded-full -ml-12 -mb-12 blur-2xl" />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredServices.length === 0 && (
                    <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50/50 border-slate-200'}`}>
                        <div className={`w-20 h-20 rounded-2xl shadow-2xl flex items-center justify-center mx-auto mb-6 relative ${theme === 'dark' ? 'bg-[#0f172a] text-slate-700 border border-white/5' : 'bg-white text-slate-200'}`}>
                            <Search size={40} />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping" />
                        </div>
                        <h3 className={`font-extrabold text-2xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>No Services Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-4 font-bold uppercase text-xs tracking-widest">No matching services found.</p>
                        <Button
                            variant="glass"
                            className={`mt-8 font-black uppercase tracking-widest text-[10px] ${theme === 'dark' ? '' : 'text-slate-900 border-slate-200'}`}
                            onClick={() => setSearchTerm("")}
                        >
                            Clear Search
                        </Button>
                    </div>
                )}
            </section>

            {/* Application Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={`Application For: ${selectedService?.name}`}
            >
                {selectedService && (
                    <ServiceApply
                        serviceId={selectedService.id}
                        onComplete={handleApplyComplete}
                    />
                )}
            </Drawer>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
}
