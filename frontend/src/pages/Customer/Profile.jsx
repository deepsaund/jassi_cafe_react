import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, Mail, Phone, MapPin, Shield, Camera, Save, Key } from 'lucide-react';

const Card = ({ children, className = "" }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'} ${className}`}>
            {children}
        </div>
    );
};

export default function Profile() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '99999-99999',
        address: user?.address || 'Main Street, Jassi Cafe Area',
    });

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1500);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className={`text-3xl font-black tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Account <span className="text-blue-500">Settings</span>
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Manage your personal information and security</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Side: Avatar & Quick Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <div className="w-full h-full rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-black shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                                    {formData.name[0]?.toUpperCase()}
                                </div>
                                <button className="absolute -bottom-2 -right-2 p-2 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-100 hover:scale-110 transition-transform">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h2 className={`font-black text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formData.name}</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mt-1">{user?.role || 'Customer'}</p>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                    </Card>

                    <Card className="space-y-4">
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Security Status</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <Shield size={16} />
                            </div>
                            <div>
                                <p className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Verified Account</p>
                                <p className="text-[9px] font-bold text-slate-500">Tier 1 Identity Active</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Side: Form */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className={`font-black uppercase tracking-widest text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Personal Information</h3>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${saving ? 'bg-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20'}`}
                            >
                                {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                                {saving ? 'Syncing...' : 'Save Changes'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                                <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 focus-within:border-blue-500' : 'bg-slate-50 border-slate-100 focus-within:border-blue-500'}`}>
                                    <User size={16} className="text-slate-400" />
                                    <input
                                        className="bg-transparent border-none outline-none w-full text-xs font-bold"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                                <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 focus-within:border-blue-500' : 'bg-slate-50 border-slate-100 focus-within:border-blue-500'}`}>
                                    <Mail size={16} className="text-slate-400" />
                                    <input
                                        className="bg-transparent border-none outline-none w-full text-xs font-bold"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number</label>
                                <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 focus-within:border-blue-500' : 'bg-slate-50 border-slate-100 focus-within:border-blue-500'}`}>
                                    <Phone size={16} className="text-slate-400" />
                                    <input
                                        className="bg-transparent border-none outline-none w-full text-xs font-bold"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Location</label>
                                <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 focus-within:border-blue-500' : 'bg-slate-50 border-slate-100 focus-within:border-blue-500'}`}>
                                    <MapPin size={16} className="text-slate-400" />
                                    <input
                                        className="bg-transparent border-none outline-none w-full text-xs font-bold"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                    <Key size={20} />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Change Password</h4>
                                    <p className="text-[9px] font-bold text-slate-500 mt-0.5">Protect your account with a stronger key</p>
                                </div>
                            </div>
                            <button className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'}`}>
                                Update Key
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
