import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Upload, FileText, Check, ArrowRight, Search, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

export default function ServiceApply({ serviceId: propId, onComplete }) {
    const { id: routeId } = useParams();
    const id = propId || routeId;
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { user } = useAuth();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({});
    const [step, setStep] = useState(1);
    const [userDocs, setUserDocs] = useState([]);
    const [selectedDocs, setSelectedDocs] = useState({});

    // Assisted Workflow
    const [targetUserId, setTargetUserId] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [custSearch, setCustSearch] = useState('');
    const [custResults, setCustResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [newCust, setNewCust] = useState({ name: '', phone: '', village: '', father_name: '', dob: '', password: 'user123' });
    const [regLoading, setRegLoading] = useState(false);

    useEffect(() => {
        if (!custSearch || custSearch.length < 2) {
            setCustResults([]);
            return;
        }
        const timer = setTimeout(() => {
            setSearching(true);
            fetch(`${API_BASE}/admin/users?search=${custSearch}`)
                .then(res => res.json())
                .then(data => {
                    setCustResults(Array.isArray(data) ? data : []);
                    setSearching(false);
                })
                .catch(() => setSearching(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [custSearch]);

    useEffect(() => {
        if (!id || !user) return;
        setLoading(true);
        fetch(`${API_BASE}/services`)
            .then(res => res.json())
            .then(data => {
                const svc = data.find(s => s.id == id);
                setService(svc);
                if (svc?.form_schema) {
                    const schema = JSON.parse(svc.form_schema);
                    const initial = {};
                    schema.forEach(field => initial[field.name] = "");
                    setFormData(initial);
                }
                setLoading(false);
            });
    }, [id, user]);

    useEffect(() => {
        if (!service) return;
        const currentUserData = targetUser || user;
        if (!currentUserData) return;
        const schema = service.form_schema ? JSON.parse(service.form_schema) : [];
        const updatedData = { ...formData };
        schema.forEach(field => {
            const fieldKey = field.name.toLowerCase();
            const fieldLabel = field.label.toLowerCase();
            if ((fieldKey.includes('name') && !fieldKey.includes('father')) || fieldLabel.includes('full name') || fieldLabel === 'name') {
                if (!updatedData[field.name]) updatedData[field.name] = currentUserData.name || '';
            }
            if (fieldKey.includes('phone') || fieldKey.includes('mobile') || fieldLabel.includes('phone')) {
                if (!updatedData[field.name]) updatedData[field.name] = currentUserData.phone || '';
            }
            if (fieldKey.includes('father') || fieldLabel.includes('father')) {
                if (!updatedData[field.name]) updatedData[field.name] = currentUserData.father_name || '';
            }
            if (fieldKey.includes('village') || fieldLabel.includes('village')) {
                if (!updatedData[field.name]) updatedData[field.name] = currentUserData.village || '';
            }
            if (fieldKey.includes('dob') || fieldLabel.includes('birth') || fieldLabel.includes('date of birth')) {
                if (!updatedData[field.name]) updatedData[field.name] = currentUserData.dob || '';
            }
        });
        setFormData(updatedData);
    }, [service, targetUser, user]);

    useEffect(() => {
        if (!user) return;
        const uidToFetch = targetUserId || user.id;
        fetch(`${API_BASE}/documents`, {
            headers: { 'Authorization': `mock_token_${uidToFetch}` }
        })
            .then(res => res.json())
            .then(data => setUserDocs(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, [user, targetUserId]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleDocSelection = (docType, value) => setSelectedDocs(prev => ({ ...prev, [docType]: value }));
    const handleFileUpload = (docType, file) => handleDocSelection(docType, { type: 'upload', file });

    const handleQuickRegister = async (e) => {
        e.preventDefault();
        setRegLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newCust, role: 'customer' })
            });
            const data = await res.json();
            if (res.ok) {
                setTargetUserId(data.user.id);
                setTargetUser(data.user);
                setShowRegister(false);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Registration failed");
        } finally {
            setRegLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const finalDocs = {};
            for (const [docType, data] of Object.entries(selectedDocs)) {
                if (data.type === 'upload') {
                    const fd = new FormData();
                    fd.append('file', data.file);
                    fd.append('type', docType);
                    if (targetUserId) fd.append('target_user_id', targetUserId);
                    const upRes = await fetch(`${API_BASE}/documents/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `mock_token_${user.id}` },
                        body: fd
                    });
                    const upData = await upRes.json();
                    finalDocs[docType] = upData.id;
                } else {
                    finalDocs[docType] = data.doc.id;
                }
            }
            const res = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `mock_token_${user.id}` },
                body: JSON.stringify({ service_id: service.id, form_data: JSON.stringify(formData), document_ids: finalDocs, target_user_id: targetUserId })
            });
            if (res.ok) {
                onComplete ? onComplete() : navigate('/dashboard');
            } else {
                const d = await res.json();
                alert(d.error || 'Failed');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !service) return (
        <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            Synchronizing Neural Matrix...
        </div>
    );

    const requiredDocs = service.documents_required_json ? JSON.parse(service.documents_required_json) : [];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {!propId && (
                <button onClick={() => navigate(-1)} className={`mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                    <ArrowLeft size={16} /> Connection Backhaul
                </button>
            )}

            <Card className="p-0 overflow-hidden border-none shadow-2xl">
                <div className={`p-8 relative overflow-hidden ${theme === 'dark' ? 'bg-white/5 border-b border-white/5' : 'bg-slate-900 text-white'}`}>
                    <div className="relative z-10">
                        <h1 className={`text-2xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-white'}`}>{service.name}</h1>
                        <p className={`text-xs mt-1 font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-300'}`}>{service.description}</p>
                    </div>
                    <FileText className="absolute -right-4 -bottom-4 opacity-10 text-blue-500" size={120} />
                </div>

                <div className="p-8">
                    {/* Customer Selection */}
                    {(user?.role === 'staff' || user?.role === 'admin') && (
                        <div className={`mb-10 p-6 border rounded-[2rem] transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-blue-50/50 border-blue-100'}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Search size={20} />
                                </div>
                                <h3 className={`font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Target Identity</h3>
                            </div>

                            {!targetUserId ? (
                                <>
                                    {!showRegister ? (
                                        <div className="space-y-4">
                                            <div className="relative group">
                                                <Input
                                                    placeholder="Scan by Name, Phone, or Village..."
                                                    className="pl-14"
                                                    value={custSearch}
                                                    onChange={(e) => setCustSearch(e.target.value)}
                                                />
                                                <Search className="absolute left-5 top-[14px] text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                                            </div>

                                            {custResults.length > 0 && (
                                                <div className={`border rounded-[2rem] shadow-2xl max-h-60 overflow-y-auto divide-y z-30 relative custom-scrollbar animate-in slide-in-from-top-2 duration-300 ${theme === 'dark' ? 'bg-[#0f172a] border-white/10 divide-white/5' : 'bg-white border-slate-200 divide-slate-50'}`}>
                                                    {custResults.map(c => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => { setTargetUserId(c.id); setTargetUser(c); setCustSearch(''); setCustResults([]); }}
                                                            className={`w-full p-5 flex items-center justify-between transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-blue-50'}`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center font-black text-sm">
                                                                    {c.name[0]}
                                                                </div>
                                                                <div>
                                                                    <p className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{c.name}</p>
                                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{c.phone} • {c.village || 'No Sector'}</p>
                                                                </div>
                                                            </div>
                                                            <ArrowRight size={18} className="text-blue-500" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {searching && <div className="text-center py-4 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] animate-pulse">Accessing Mainframe...</div>}

                                            {!searching && custSearch.length > 2 && custResults.length === 0 && (
                                                <Button
                                                    onClick={() => setShowRegister(true)}
                                                    className="w-full h-14 !bg-indigo-600 !hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-500/20"
                                                >
                                                    <UserPlus size={18} className="mr-3" /> Initialize "{custSearch}" in System
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleQuickRegister} className={`p-8 rounded-[2.5rem] border animate-in zoom-in-95 duration-300 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-indigo-100 shadow-xl'}`}>
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className={`font-black uppercase tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-indigo-900'}`}>
                                                    <UserPlus size={20} className="text-indigo-500" /> New Identity Registration
                                                </h4>
                                                <button type="button" onClick={() => setShowRegister(false)} className="text-slate-500 hover:text-red-500 transition-colors">
                                                    <X size={24} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <Input label="Full Name" value={newCust.name} onChange={e => setNewCust({ ...newCust, name: e.target.value })} required />
                                                <Input label="Contact Node" value={newCust.phone} onChange={e => setNewCust({ ...newCust, phone: e.target.value })} required />
                                                <Input label="Father's Name" value={newCust.father_name} onChange={e => setNewCust({ ...newCust, father_name: e.target.value })} />
                                                <Input label="Birth Date" type="date" value={newCust.dob} onChange={e => setNewCust({ ...newCust, dob: e.target.value })} />
                                                <div className="md:col-span-2">
                                                    <Input label="Sector / Village" value={newCust.village} onChange={e => setNewCust({ ...newCust, village: e.target.value })} />
                                                </div>
                                            </div>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-4 italic opacity-50">* Access key 'user123' will be auto-generated.</p>
                                            <Button type="submit" disabled={regLoading} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 mt-6 rounded-2xl font-black">
                                                {regLoading ? 'Processing...' : 'Authorize Registration'}
                                            </Button>
                                        </form>
                                    )}
                                </>
                            ) : (
                                <div className={`flex items-center justify-between p-6 rounded-3xl border animate-in fade-in duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-white border-blue-200 shadow-xl shadow-blue-500/5'}`}>
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-blue-500/30">
                                            {targetUser?.name?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{targetUser?.name}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-full">{targetUser?.phone}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-400" />
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{targetUser?.village || 'Sector 0'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setTargetUserId(null); setTargetUser(null); }}
                                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${theme === 'dark' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                    >
                                        Switch Target
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Progress Monitor */}
                    <div className="flex items-center justify-between mb-12 px-6">
                        {[
                            { s: 1, l: 'IDENTITY' },
                            { s: 2, l: 'ASSETS' },
                            { s: 3, l: 'VERIFY' }
                        ].map((x, i) => (
                            <React.Fragment key={x.s}>
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${step >= x.s ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30' : theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                        {step > x.s ? <Check size={24} /> : x.s}
                                    </div>
                                    <span className={`text-[10px] font-black tracking-[0.2em] uppercase ${step >= x.s ? 'text-blue-500' : 'text-slate-500 opacity-50'}`}>{x.l}</span>
                                </div>
                                {i < 2 && <div className={`flex-1 h-0.5 mx-4 -mt-8 transition-colors duration-1000 ${step > x.s ? 'bg-blue-600' : theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Dynamic Viewport */}
                    <div className="mt-8">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {service.form_schema && JSON.parse(service.form_schema).map((field, idx) => (
                                        <div key={idx} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            {field.type === 'textarea' ? (
                                                <div className="space-y-2">
                                                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{field.label}</label>
                                                    <textarea
                                                        name={field.name}
                                                        className={`w-full px-5 py-4 rounded-2xl focus:outline-none border-2 transition-all font-bold text-sm ${theme === 'dark' ? 'bg-white/5 border-transparent text-white focus:bg-white/10 focus:border-blue-500/30 placeholder:text-slate-600' : 'bg-slate-50 border-slate-100 text-slate-900 focus:bg-white focus:border-blue-500/20'}`}
                                                        rows={4}
                                                        placeholder={`Enter ${field.label}...`}
                                                        value={formData[field.name] || ''}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            ) : (
                                                <Input label={field.label} name={field.name} type={field.type} value={formData[field.name] || ''} onChange={handleInputChange} placeholder={`Enter ${field.label}...`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={() => setStep(2)} disabled={(user?.role === 'staff' || user?.role === 'admin') && !targetUserId} className="w-full h-14 mt-8 shadow-2xl shadow-blue-500/20 rounded-2xl font-black uppercase tracking-widest">
                                    Upload Credentials <ArrowRight size={20} className="ml-3" />
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                {requiredDocs.map(docType => {
                                    const exist = userDocs.filter(d => d.type === docType);
                                    const sel = selectedDocs[docType];
                                    return (
                                        <div key={docType} className="space-y-4">
                                            <h3 className={`font-black uppercase tracking-widest text-xs flex items-center gap-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
                                                {docType.replace('_', ' ')}
                                                {sel && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {exist.map(d => (
                                                    <button key={d.id} onClick={() => handleDocSelection(docType, { type: 'vault', doc: d })} className={`p-5 border rounded-3xl flex items-center gap-4 transition-all text-left ${sel?.doc?.id === d.id ? 'border-blue-600 bg-blue-600/10 shadow-lg shadow-blue-500/5' : 'border-slate-500/10 hover:border-slate-500/30'}`}>
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sel?.doc?.id === d.id ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-500/5 text-slate-500'}`}><FileText size={24} /></div>
                                                        <div className="flex-1 overflow-hidden">
                                                            <p className={`text-xs font-black truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{d.original_name}</p>
                                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">From Vault</p>
                                                        </div>
                                                    </button>
                                                ))}
                                                <label className={`p-5 border-2 border-dashed rounded-3xl flex items-center gap-4 cursor-pointer transition-all ${sel?.type === 'upload' ? 'border-blue-600 bg-blue-600/10' : 'border-slate-500/20 hover:border-slate-500/40 hover:bg-slate-500/5'}`}>
                                                    <input type="file" className="hidden" onChange={e => handleFileUpload(docType, e.target.files[0])} />
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sel?.type === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-500/5 text-slate-500'}`}><Upload size={24} /></div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className={`text-xs font-black truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{sel?.type === 'upload' ? sel.file.name : 'Upload New'}</p>
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">{sel?.type === 'upload' ? 'Ready for Sync' : 'PDF / JPG / PNG'}</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="flex gap-4 pt-4">
                                    <button onClick={() => setStep(1)} className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'}`}>Backlog</button>
                                    <button onClick={() => setStep(3)} className="flex-[2] h-14 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 active:scale-95 transition-all">Proceed to Sync <ArrowRight size={20} className="ml-3 inline-block" /></button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className={`p-8 rounded-[2.5rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-slate-50 border-slate-100 shadow-xl shadow-blue-500/5'}`}>
                                    <h3 className={`font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-3 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}><div className="w-1.5 h-6 bg-blue-600 rounded-full" /> Final Verification Scan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            {Object.entries(formData).map(([k, v]) => (
                                                <div key={k} className="flex flex-col border-b border-white/5 pb-2">
                                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{k.replace('_', ' ')}</span>
                                                    <span className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{v || <span className="text-red-500 italic">Undefined</span>}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Attached Secure Assets</p>
                                            {Object.entries(selectedDocs).map(([k, v]) => (
                                                <div key={k} className={`p-4 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><Check size={20} /></div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{k.replace('_', ' ')}</p>
                                                        <p className={`text-xs font-bold truncate max-w-[150px] ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{v.type === 'vault' ? v.doc.original_name : v.file.name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'}`}>Edit Payload</button>
                                    <button onClick={handleSubmit} className="flex-[2] h-14 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">Confirm & Submit Matrix <Check size={20} className="ml-3 inline-block" /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
