import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { Plus, Edit, X, Trash2, ListTree, FileCheck, Info, Activity, Layers, Zap, Hexagon } from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ServiceManagement() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [services, setServices] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newService, setNewService] = useState({
        name: '', description: '', price_normal: '', price_b2b: ''
    });

    // Visual builders state
    const [docs, setDocs] = useState(['aadhaar', 'photo']);
    const [newDoc, setNewDoc] = useState('');

    const [fields, setFields] = useState([
        { name: 'fullname', label: 'Full Name', type: 'text' }
    ]);
    const [newField, setNewField] = useState({ name: '', label: '', type: 'text' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = () => {
        fetch(`${API_BASE}/services`)
            .then(res => res.json())
            .then(data => setServices(Object.values(data)));
    };

    const addDoc = () => {
        if (newDoc && !docs.includes(newDoc)) {
            setDocs([...docs, newDoc.toLowerCase().replace(/\s+/g, '_')]);
            setNewDoc('');
        }
    };

    const removeDoc = (tag) => {
        setDocs(docs.filter(d => d !== tag));
    };

    const addField = () => {
        if (newField.name && newField.label) {
            setFields([...fields, { ...newField, name: newField.name.toLowerCase().replace(/\s+/g, '_') }]);
            setNewField({ name: '', label: '', type: 'text' });
        }
    };

    const removeField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newService,
                documents_required_json: docs,
                form_schema: fields
            };

            const res = await fetch(`${API_BASE}/admin/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user?.id}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowAddForm(false);
                fetchServices();
                // Reset
                setNewService({ name: '', description: '', price_normal: '', price_b2b: '' });
                setDocs(['aadhaar', 'photo']);
                setFields([{ name: 'fullname', label: 'Full Name', type: 'text' }]);
            } else {
                alert("Error creating service");
            }
        } catch (err) {
            alert("Something went wrong");
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-20 px-4 md:px-0">
            {/* Header section with Neural aesthetic */}
            <div className="relative group overflow-hidden bg-[#0f172a] p-6 md:p-8 rounded-3xl text-white shadow-[0_35px_60px_-15px_rgba(30,58,138,0.3)]">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center gap-2">
                                <Layers size={14} className="text-indigo-300" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300">Service Management</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-none mb-4">
                            SERVICE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">CATALOG</span>
                        </h1>
                        <p className="max-w-md font-bold text-lg leading-relaxed text-slate-400">
                            Create and manage services offered on the platform.
                        </p>
                    </div>
                    <div>
                        <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? 'danger' : 'primary'} className="rounded-2xl px-6 h-14 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300">
                            {showAddForm ? 'Close Designer' : <><Plus size={20} className="mr-3" /> Create New Service</>}
                        </Button>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
                <Hexagon size={250} className="absolute -right-24 -bottom-24 opacity-[0.02] rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
            </div>

            {showAddForm && (
                <Card className={`p-6 border-none rounded-3xl animate-in slide-in-from-top-6 duration-700 ${theme === 'dark' ? 'bg-secondary-darker shadow-black/40' : 'bg-white shadow-2xl shadow-primary/5'}`}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                            <Layers size={24} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Add New Service</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Configure service details & requirements</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddService} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <Input
                                    label="Service Name"
                                    placeholder="e.g. Passport Application"
                                    value={newService.name}
                                    onChange={e => setNewService({ ...newService, name: e.target.value })}
                                    required
                                />
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 ml-1">Description</label>
                                    <textarea
                                        className={`w-full px-4 py-3 border-none rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 min-h-[100px] ${theme === 'dark' ? 'bg-white/5 text-white focus:bg-white/10' : 'bg-slate-50 text-slate-900 focus:bg-white'}`}
                                        placeholder="Describe the service..."
                                        value={newService.description}
                                        onChange={e => setNewService({ ...newService, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    label="Standard Exchange Rate (₹)"
                                    type="number"
                                    placeholder="0"
                                    value={newService.price_normal}
                                    onChange={e => setNewService({ ...newService, price_normal: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Commercial B2B Rate (₹)"
                                    type="number"
                                    placeholder="0"
                                    value={newService.price_b2b}
                                    onChange={e => setNewService({ ...newService, price_b2b: e.target.value })}
                                    required
                                />
                                <div className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                                    <Info size={18} className="text-primary flex-shrink-0" />
                                    <p className="text-[10px] font-bold leading-relaxed">Rates are synchronized instantly across the user dashboard upon publication.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Document Builder */}
                            <div className={`p-6 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <FileCheck size={18} />
                                    </div>
                                    <h4 className={`font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Documents Required</h4>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {docs.map(tag => (
                                        <span key={tag} className={`px-3 py-1.5 border text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-secondary-dark border-white/5 text-slate-200' : 'bg-white border-slate-100 text-slate-700 shadow-primary/5'}`}>
                                            {tag.replace('_', ' ')}
                                            <button type="button" onClick={() => removeDoc(tag)} className="p-0.5 hover:bg-red-500 hover:text-white rounded transition-all">
                                                <X size={10} />
                                            </button>
                                        </span>
                                    ))}
                                    {docs.length === 0 && <p className="text-[10px] text-slate-400 font-bold italic py-2">No documents required.</p>}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        placeholder="Add document name (e.g. PAN Card)"
                                        value={newDoc}
                                        onChange={e => setNewDoc(e.target.value)}
                                        className={`flex-1 h-10 px-4 rounded-xl border-none outline-none font-bold text-xs transition-all ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-white text-slate-900 shadow-sm'}`}
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addDoc())}
                                    />
                                    <Button type="button" variant="secondary" onClick={addDoc} className="h-10 px-4 rounded-xl text-xs">Add</Button>
                                </div>
                            </div>

                            {/* Form Field Builder */}
                            <div className={`p-6 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                        <ListTree size={18} />
                                    </div>
                                    <h4 className={`font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Form Fields</h4>
                                </div>

                                <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {fields.map((field, idx) => (
                                        <div key={idx} className={`p-3 rounded-xl flex items-center justify-between border shadow-sm group transition-all duration-500 ${theme === 'dark' ? 'bg-secondary-dark border-white/5' : 'bg-white border-slate-100'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[8px] font-black uppercase text-slate-500 dark:text-slate-400">
                                                    {field.type.slice(0, 3)}
                                                </div>
                                                <div>
                                                    <p className={`text-xs font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{field.label}</p>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{field.name}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeField(idx)} className="p-1 text-slate-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {fields.length === 0 && <p className="text-[10px] text-slate-400 font-bold italic text-center py-4">Initialize fields to collect user information.</p>}
                                </div>

                                <div className={`p-4 rounded-2xl border transition-all duration-500 ${theme === 'dark' ? 'bg-secondary-dark border-white/5 shadow-inner' : 'bg-white border-slate-100 shadow-inner'} space-y-3`}>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            placeholder="Label (e.g. Phone)"
                                            className={`h-10 px-4 rounded-xl border-none outline-none font-bold text-xs transition-all ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 shadow-inner'}`}
                                            value={newField.label}
                                            onChange={e => setNewField({ ...newField, label: e.target.value, name: e.target.value })}
                                        />
                                        <select
                                            className={`h-10 px-4 rounded-xl border-none outline-none font-bold text-xs transition-all ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900 shadow-inner'}`}
                                            value={newField.type}
                                            onChange={e => setNewField({ ...newField, type: e.target.value })}
                                        >
                                            <option value="text">Short Text</option>
                                            <option value="textarea">Paragraph</option>
                                            <option value="date">Date Picker</option>
                                            <option value="number">Numeric Only</option>
                                        </select>
                                    </div>
                                    <Button type="button" variant="outline" onClick={addField} className="w-full h-10 rounded-xl group text-xs">
                                        <Plus size={14} className="mr-2 group-hover:rotate-90 transition-transform" /> Add Selection Field
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                                <Info size={16} className="text-primary" />
                                <span>Deployment status: <span className="text-emerald-500 uppercase tracking-widest text-[9px] font-black">Ready to Publish</span></span>
                            </div>
                            <Button type="submit" size="lg" className="w-full md:w-auto px-10 h-12 rounded-2xl shadow-xl shadow-primary/20">Save Service</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(() => {
                    const totalPages = Math.ceil(services.length / itemsPerPage);
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedServices = services.slice(startIndex, endIndex);

                    return paginatedServices.map(svc => (
                        <Card key={svc.id} className={`group hover:-translate-y-2 transition-all duration-500 border-none p-6 rounded-2xl relative overflow-hidden ${theme === 'dark' ? 'bg-secondary-darker shadow-black/40 hover:bg-secondary-dark' : 'bg-white shadow-2xl shadow-primary/5 hover:shadow-primary/10'}`}>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 text-primary' : 'bg-primary/10 text-primary shadow-lg shadow-primary/10'} group-hover:scale-110 group-hover:bg-primary group-hover:text-white`}>
                                        <Activity size={24} />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-primary hover:bg-white/10' : 'bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:shadow-lg'}`}>
                                            <Edit size={16} />
                                        </button>
                                        <button className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-red-500 hover:bg-white/10' : 'bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg'}`}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className={`font-black text-lg tracking-tighter mb-2 leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'} group-hover:text-primary transition-colors`}>{svc.name}</h3>
                                <p className={`text-xs font-bold mb-6 h-8 overflow-hidden line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{svc.description}</p>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`p-3 rounded-xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Standard</p>
                                        <p className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{svc.price_normal}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl transition-all duration-500 ${theme === 'dark' ? 'bg-primary/5' : 'bg-primary/5 border border-primary/10'}`}>
                                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">B2B Partner</p>
                                        <p className="text-base font-black text-primary">₹{svc.price_b2b}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -right-8 -bottom-8 opacity-10 text-primary transform rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                                <Hexagon size={100} />
                            </div>
                        </Card>
                    ));
                })()}
            </div>

            {services.length > itemsPerPage && (
                <div className={`p-8 rounded-[2.5rem] transition-all duration-500 ${theme === 'dark' ? 'bg-secondary-darker shadow-black/40' : 'bg-white shadow-2xl shadow-primary/5'}`}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(services.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={services.length}
                    />
                </div>
            )}
        </div>
    );
}
