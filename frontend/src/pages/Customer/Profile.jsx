import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, Mail, Phone, MapPin, Shield, Camera, Save, Key, UserCircle, X, CheckCircle } from 'lucide-react';
import { API_BASE } from '../../config';

const Card = ({ children, className = "" }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'} ${className}`}>
            {children}
        </div>
    );
};

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const { theme } = useTheme();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [updatingPassword, setUpdatingPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        village: user?.village || '',
        father_name: user?.father_name || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                village: user.village || '',
                father_name: user.father_name || '',
            });
        }
    }, [user]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch(`${API_BASE}/auth/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Identity Records Updated Successfully' });
                refreshUser(formData);
            } else {
                setMessage({ type: 'error', text: 'Failed to Sync Profile Data' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Network connection interrupted' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', 'profile_photo');

        try {
            const res = await fetch(`${API_BASE}/documents/upload`, {
                method: 'POST',
                headers: { 'Authorization': `mock_token_${user.id}` },
                body: uploadData
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: 'Authorized Portrait Uploaded' });
                // Update local user state with new image path
                refreshUser({ profile_image: data.path });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!newPassword || newPassword.length < 4) {
            alert("Security key must be at least 4 characters");
            return;
        }
        setUpdatingPassword(true);
        try {
            const res = await fetch(`${API_BASE}/auth/security`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify({ new_password: newPassword })
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Security Key Updated' });
                setShowSecurityModal(false);
                setNewPassword('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdatingPassword(false);
        }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className={`text-4xl font-black tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Identity <span className="text-blue-500">Profile</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em] mt-2 italic opacity-70">Manage your system credentials and authorized data</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${saving ? 'bg-slate-500 scale-95 opacity-50' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-500/30'}`}
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        {saving ? 'Syncing...' : 'Commit Changes'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Identity Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center relative overflow-hidden group">
                        <div className="relative z-10 py-4">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                {user?.profile_image ? (
                                    <img
                                        src={`${API_BASE.replace('/api', '')}${user.profile_image}`}
                                        alt="Profile"
                                        className="w-full h-full rounded-[2.5rem] object-cover border-4 border-blue-500/20 shadow-2xl group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                                        {formData.name[0]?.toUpperCase()}
                                    </div>
                                )}
                                <label className={`absolute -bottom-2 -right-2 p-3 rounded-2xl shadow-2xl border transition-all hover:scale-110 active:scale-90 cursor-pointer ${theme === 'dark' ? 'bg-white/10 text-white border-white/10 backdrop-blur-md' : 'bg-white text-slate-900 border-slate-100'}`}>
                                    <Camera size={18} />
                                    <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                                </label>
                            </div>
                            <h2 className={`font-black text-2xl tracking-tight mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{formData.name}</h2>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{user?.role || 'Customer'} Sector Access</span>
                            </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                    </Card>

                    <Card className="space-y-6">
                        <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Security Authentication</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <p className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Verified Identity</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Level 1 Encryption Active</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowSecurityModal(true)}
                                className={`w-full py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl border flex items-center justify-center gap-3 transition-all ${theme === 'dark' ? 'bg-orange-500/5 border-orange-500/10 text-orange-400 hover:bg-orange-500/10' : 'bg-orange-50 border-orange-100 text-orange-600 hover:bg-orange-100'}`}>
                                <Key size={16} /> Update Security Key
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Right Side: Data Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className={`font-black uppercase tracking-[0.2em] text-xs mb-8 flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <UserCircle size={20} className="text-blue-500" /> Bio-Data Records
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Registered Full Name', icon: User, key: 'name', disabled: true },
                                { label: 'Auth Communication Node', icon: Mail, key: 'email', placeholder: 'Not Linked' },
                                { label: 'Validated Contact Number', icon: Phone, key: 'phone', disabled: true },
                                { label: 'Assigned Village/Sector', icon: MapPin, key: 'village' },
                                { label: "Guardian's Identity (Father)", icon: User, key: 'father_name' },
                            ].map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 opacity-70">{field.label}</label>
                                    <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-500/5 ${theme === 'dark' ? 'bg-white/5 border-white/5 focus-within:border-blue-500/50' : 'bg-slate-50 border-slate-100 focus-within:border-blue-500/20 focus-within:bg-white focus-within:shadow-xl'} ${field.disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}>
                                        <field.icon size={18} className="text-slate-400" />
                                        <input
                                            className="bg-transparent border-none outline-none w-full text-xs font-black placeholder:text-slate-500"
                                            value={formData[field.key] || ''}
                                            placeholder={field.placeholder || ''}
                                            disabled={field.disabled}
                                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={`mt-10 p-6 rounded-3xl border border-dashed text-center ${theme === 'dark' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">System Information</p>
                            <p className="text-[11px] font-bold text-slate-500 mt-2">To update your Aadhaar or PAN records, please visit the Document Vault sector.</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Security Modal */}
            {showSecurityModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowSecurityModal(false)} />
                    <Card className="relative w-full max-w-md animate-in zoom-in-95 duration-300 overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className={`text-xl font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Security Overhaul</h2>
                            <button onClick={() => setShowSecurityModal(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest leading-relaxed">
                                    Updating your security key will change your authentication password. Ensure you remember the new sequence.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">New Security Sequence</label>
                                <div className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 focus-within:border-blue-500/50' : 'bg-slate-50 border-slate-100'}`}>
                                    <Key size={18} className="text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="Min 4 characters..."
                                        className="bg-transparent border-none outline-none w-full text-sm font-black text-white"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handlePasswordUpdate}
                                disabled={updatingPassword}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3">
                                {updatingPassword ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={18} />}
                                {updatingPassword ? 'Overhauling...' : 'Confirm Update'}
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
