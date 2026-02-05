import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Upload, FileText, Check, ArrowRight, Search, UserPlus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';

export default function ServiceApply({ serviceId: propId, onComplete }) {
    const { id: routeId } = useParams();
    const id = propId || routeId;
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    // Form State
    const [formData, setFormData] = useState({});
    const [step, setStep] = useState(1); // 1: Form, 2: Documents, 3: Review/Payment

    // Document State
    const [userDocs, setUserDocs] = useState([]);
    const [selectedDocs, setSelectedDocs] = useState({}); // { "aadhaar": { type: "vault", id: 123 } } OR { "aadhaar": { type: "upload", file: FileObj } }

    // Assisted Workflow (Staff/Admin)
    const [targetUserId, setTargetUserId] = useState(null);
    const [targetUser, setTargetUser] = useState(null);
    const [custSearch, setCustSearch] = useState('');
    const [custResults, setCustResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [newCust, setNewCust] = useState({ name: '', phone: '', village: '', father_name: '', dob: '', password: 'user123' });
    const [regLoading, setRegLoading] = useState(false);

    useEffect(() => {
        if (!custSearch) {
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
                });
        }, 300);
        return () => clearTimeout(timer);
    }, [custSearch]);

    useEffect(() => {
        if (!id || !user) return;
        setLoading(true);
        // 1. Fetch Service Details
        fetch(`${API_BASE}/services`, {
            headers: { 'Authorization': `mock_token_${user.id}` }
        })
            .then(res => res.json())
            .then(data => {
                const svc = data.find(s => s.id == id);
                setService(svc);

                // Initialize form data
                if (svc && svc.form_schema) {
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
            // Mapping logic: if field name or label matches user property
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

        // Determine whose documents to fetch
        const uidToFetch = targetUserId || user.id;

        fetch(`${API_BASE}/documents`, {
            headers: { 'Authorization': `mock_token_${uidToFetch}` }
        })
            .then(res => res.json())
            .then(data => setUserDocs(Array.isArray(data) ? data : []))
            .catch(console.error);
    }, [user, targetUserId]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDocSelection = (docType, value) => {
        setSelectedDocs(prev => ({ ...prev, [docType]: value }));
    };

    const handleFileUpload = async (docType, file) => {
        handleDocSelection(docType, { type: 'upload', file: file });
    };

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
        setError('');

        try {
            // 1. Upload new files first and get their IDs
            const finalDocs = {}; // docType -> document_id

            for (const [docType, data] of Object.entries(selectedDocs)) {
                if (data.type === 'upload') {
                    const formDataObj = new FormData();
                    formDataObj.append('file', data.file);
                    formDataObj.append('type', docType);
                    if (targetUserId) formDataObj.append('target_user_id', targetUserId);

                    const uploadRes = await fetch(`${API_BASE}/documents/upload`, {
                        method: 'POST',
                        headers: { 'Authorization': `mock_token_${user.id}` },
                        body: formDataObj
                    });

                    if (!uploadRes.ok) throw new Error(`Failed to upload ${docType}`);
                    const uploadData = await uploadRes.json();
                    finalDocs[docType] = uploadData.id;
                } else {
                    finalDocs[docType] = data.doc.id;
                }
            }

            // 2. Create Order
            const payload = {
                service_id: service.id,
                form_data: JSON.stringify(formData),
                document_ids: finalDocs,
                target_user_id: targetUserId // Will be null for regular customers, ID for assisted
            };

            const res = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (res.ok) {
                if (onComplete) {
                    onComplete();
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert(data.error || 'Failed to create order');
            }
        } catch (err) {
            console.error(err);
            alert(err.message || 'An error occurred during submission');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !service) return (
        <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading application form...
        </div>
    );

    const requiredDocs = service.documents_required_json ? JSON.parse(service.documents_required_json) : [];

    return (
        <div className="space-y-6">
            {!propId && (
                <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>
            )}

            <Card className="p-0 overflow-hidden border-slate-100 shadow-sm rounded-2xl">
                <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
                    <div className="relative z-10 text-center sm:text-left">
                        <h1 className="text-2xl font-bold">{service.name}</h1>
                        <p className="opacity-70 text-sm mt-1">{service.description}</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Customer Selection for Staff/Admin */}
                    {(user?.role === 'staff' || user?.role === 'admin') && (
                        <div className="mb-8 p-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] animate-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-600 text-white rounded-xl">
                                    <FileText size={18} />
                                </div>
                                <h3 className="font-black text-slate-900 tracking-tight">Assisted Workflow: Customer Selection</h3>
                            </div>

                            {!targetUserId ? (
                                <>
                                    {!showRegister ? (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <Input
                                                    placeholder="Search by Name, Phone, or Village..."
                                                    className="pl-12"
                                                    value={custSearch}
                                                    onChange={(e) => setCustSearch(e.target.value)}
                                                />
                                                <Search className="absolute left-4 top-[15px] text-slate-400" size={18} />
                                            </div>

                                            {custResults.length > 0 && (
                                                <div className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl max-h-48 overflow-y-auto divide-y divide-slate-50 relative z-30">
                                                    {custResults.map(c => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => {
                                                                setTargetUserId(c.id);
                                                                setTargetUser(c);
                                                                setCustSearch('');
                                                                setCustResults([]);
                                                            }}
                                                            className="w-full p-4 flex items-center justify-between hover:bg-blue-50 transition-colors text-left"
                                                        >
                                                            <div>
                                                                <p className="font-black text-slate-900 text-sm">{c.name}</p>
                                                                <p className="text-xs text-slate-500 font-bold">{c.phone} • {c.village || 'No Village recorded'}</p>
                                                            </div>
                                                            <ArrowRight size={16} className="text-blue-600" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {searching && <div className="text-center py-2 text-xs text-slate-400 animate-pulse font-bold">Scanning database...</div>}

                                            {!searching && custSearch.length > 2 && custResults.length === 0 && (
                                                <Button
                                                    onClick={() => setShowRegister(true)}
                                                    variant="primary"
                                                    size="lg"
                                                    className="w-full !bg-indigo-600 !hover:bg-indigo-700"
                                                >
                                                    <UserPlus size={18} className="mr-2" /> Register "{custSearch}" as New Customer
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <form onSubmit={handleQuickRegister} className="space-y-4 bg-white p-6 rounded-3xl border border-indigo-100 shadow-sm animate-in zoom-in-95 duration-300">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-black text-indigo-900 flex items-center gap-2">
                                                    <UserPlus size={18} /> New Customer Registration
                                                </h4>
                                                <button type="button" onClick={() => setShowRegister(false)} className="text-slate-400 hover:text-red-500 p-1">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    placeholder="Full Name"
                                                    value={newCust.name}
                                                    onChange={e => setNewCust({ ...newCust, name: e.target.value })}
                                                    className="rounded-xl"
                                                    required
                                                />
                                                <Input
                                                    placeholder="Phone Number"
                                                    value={newCust.phone}
                                                    onChange={e => setNewCust({ ...newCust, phone: e.target.value })}
                                                    className="rounded-xl"
                                                    required
                                                />
                                                <Input
                                                    placeholder="Father's Name"
                                                    value={newCust.father_name}
                                                    onChange={e => setNewCust({ ...newCust, father_name: e.target.value })}
                                                    className="rounded-xl"
                                                />
                                                <Input
                                                    type="date"
                                                    placeholder="Date of Birth"
                                                    value={newCust.dob}
                                                    onChange={e => setNewCust({ ...newCust, dob: e.target.value })}
                                                    className="rounded-xl"
                                                />
                                                <div className="md:col-span-2">
                                                    <Input
                                                        placeholder="Village / Address"
                                                        value={newCust.village}
                                                        onChange={e => setNewCust({ ...newCust, village: e.target.value })}
                                                        className="rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-bold italic">* Default password 'user123' will be assigned.</p>
                                            <Button
                                                type="submit"
                                                disabled={regLoading}
                                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-black"
                                            >
                                                {regLoading ? 'Registering...' : 'Register and Select Customer'}
                                            </Button>
                                        </form>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-blue-200 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-200">
                                            {targetUser?.name?.[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900">{targetUser?.name}</p>
                                            <p className="text-xs text-slate-500 font-bold">{targetUser?.phone} • Wallet: ₹{targetUser?.wallet_balance}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-black"
                                        onClick={() => { setTargetUserId(null); setTargetUser(null); }}
                                    >
                                        Change Customer
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Steps Indicator */}
                    <div className="flex items-center justify-between mb-10 px-4">
                        {[
                            { step: 1, label: 'Details' },
                            { step: 2, label: 'Documents' },
                            { step: 3, label: 'Review' }
                        ].map((s, idx) => (
                            <React.Fragment key={s.step}>
                                <div className="flex flex-col items-center relative gap-2">
                                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${step >= s.step ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-400'}`}>
                                        {step > s.step ? <Check size={20} /> : s.step}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.step ? 'text-blue-600' : 'text-slate-400'}`}>{s.label}</span>
                                </div>
                                {idx < 2 && <div className={`flex-1 h-0.5 mx-2 -mt-6 transition-colors duration-500 ${step > s.step ? 'bg-blue-600' : 'bg-slate-100'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Step 1: Dynamic Form */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            {service.form_schema && JSON.parse(service.form_schema).map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            name={field.name}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                            rows={3}
                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                            value={formData[field.name] || ''}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <Input
                                            name={field.name}
                                            type={field.type}
                                            className="h-12 bg-slate-50 border-slate-200 rounded-xl px-4 font-medium"
                                            placeholder={`Enter ${field.label.toLowerCase()}`}
                                            value={formData[field.name] || ''}
                                            onChange={handleInputChange}
                                        />
                                    )}
                                </div>
                            ))}
                            <Button
                                onClick={() => setStep(2)}
                                disabled={(user?.role === 'staff' || user?.role === 'admin') && !targetUserId}
                                className="w-full h-12 rounded-xl mt-6 shadow-lg shadow-blue-100 font-bold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Upload Documents <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Document Selection */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {requiredDocs.map(docType => {
                                const existingDocs = userDocs.filter(d => d.type === docType);
                                const isSelected = selectedDocs[docType];

                                return (
                                    <div key={docType} className="space-y-3">
                                        <h3 className="font-bold text-slate-800 capitalize flex items-center gap-2">
                                            {docType.replace('_', ' ')}
                                            {isSelected && <Check size={16} className="text-green-500" />}
                                        </h3>

                                        <div className="grid grid-cols-1 gap-3">
                                            {/* Vault Options */}
                                            {existingDocs.length > 0 && existingDocs.map(doc => (
                                                <div
                                                    key={doc.id}
                                                    onClick={() => handleDocSelection(docType, { type: 'vault', doc })}
                                                    className={`group flex items-center p-4 border rounded-xl cursor-pointer transition-all ${isSelected?.doc?.id === doc.id ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/5' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors ${isSelected?.doc?.id === doc.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                        <FileText size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{doc.original_name}</p>
                                                        <p className="text-xs text-slate-400 font-medium">Found in your vault</p>
                                                    </div>
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected?.doc?.id === doc.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200'}`}>
                                                        {isSelected?.doc?.id === doc.id && <Check size={14} />}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Upload Option */}
                                            <label className={`group flex items-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${isSelected?.type === 'upload' ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-500/5' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(docType, e.target.files[0])} />
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors ${isSelected?.type === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                                    <Upload size={20} />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-bold text-slate-900">{isSelected?.type === 'upload' ? isSelected.file.name : "Upload New File"}</p>
                                                    <p className="text-xs text-slate-400 font-medium font-mono">PDF, JPG or PNG</p>
                                                </div>
                                                {isSelected?.type === 'upload' && (
                                                    <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-600 text-white flex items-center justify-center">
                                                        <Check size={14} />
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex gap-4 mt-8">
                                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl font-bold">Back</Button>
                                <Button onClick={() => setStep(3)} className="flex-1 h-12 rounded-xl shadow-lg shadow-blue-100 font-bold active:scale-95 transition-transform">
                                    Next: Review <ArrowRight size={18} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-4 bg-blue-600 rounded-full"></div>
                                    Review Details
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(formData).map(([key, val]) => (
                                        <div key={key} className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 font-medium capitalize">{key.replace('_', ' ')}:</span>
                                            <span className="text-slate-900 font-bold">{val}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-slate-200">
                                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <div className="w-2 h-4 bg-green-500 rounded-full"></div>
                                        Attached Documents
                                    </h3>
                                    <ul className="space-y-2">
                                        {Object.entries(selectedDocs).map(([key, val]) => (
                                            <li key={key} className="flex items-center text-sm bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-3">
                                                    <Check size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-slate-700 capitalize text-xs">{key}</p>
                                                    <p className="text-[11px] text-slate-500 truncate">{val.type === 'vault' ? val.doc.original_name : val.file.name}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl font-bold">Back</Button>
                                <Button onClick={handleSubmit} className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 shadow-lg shadow-green-100 font-bold active:scale-95 transition-all">
                                    Confirm & Submit Application
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </Card >
        </div >
    );
}
