import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { Plus, Edit, X, Trash2, ListTree, FileCheck, Info } from 'lucide-react';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

export default function ServiceManagement() {
    const { theme } = useTheme();
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
                headers: { 'Content-Type': 'application/json' },
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`flex justify-between items-center p-8 rounded-[2rem] overflow-hidden relative transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none' : 'bg-white text-slate-900 border border-slate-100 shadow-2xl shadow-blue-900/10'}`}>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black tracking-tight">Service Matrix</h1>
                    <p className="text-slate-400 font-medium">Design and deploy digital service protocols.</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? "danger" : "white"} className="relative z-10">
                    {showAddForm ? 'Close Editor' : <><Plus size={20} className="mr-2" /> Design New Service</>}
                </Button>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20" />
            </div>

            {showAddForm && (
                <Card className="p-10 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl">
                            <Plus size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Service Designer</h3>
                    </div>

                    <form onSubmit={handleAddService} className="space-y-10">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <Input
                                    label="Service Name"
                                    placeholder="e.g. Passport Application"
                                    value={newService.name}
                                    onChange={e => setNewService({ ...newService, name: e.target.value })}
                                    required
                                />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Description</label>
                                    <textarea
                                        className={`w-full px-5 py-3 border-2 border-transparent rounded-2xl text-sm font-bold placeholder:text-slate-400 focus:outline-none transition-all duration-300 min-h-[120px] ${theme === 'dark' ? 'bg-[#1e293b] text-white focus:bg-[#1e293b] focus:border-blue-500/20' : 'bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500/20'}`}
                                        placeholder="Explain what this service provides..."
                                        value={newService.description}
                                        onChange={e => setNewService({ ...newService, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <Input
                                    label="Normal Price (₹)"
                                    type="number"
                                    placeholder="0"
                                    value={newService.price_normal}
                                    onChange={e => setNewService({ ...newService, price_normal: e.target.value })}
                                    required
                                />
                                <Input
                                    label="B2B Price (₹)"
                                    type="number"
                                    placeholder="0"
                                    value={newService.price_b2b}
                                    onChange={e => setNewService({ ...newService, price_b2b: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Document Builder */}
                            <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3 mb-6 font-black tracking-tight">
                                    <FileCheck className="text-blue-600" size={20} />
                                    <h4 className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Mandatory Documents</h4>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {docs.map(tag => (
                                        <span key={tag} className={`px-4 py-2 border text-xs font-black rounded-xl flex items-center gap-2 shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-[#1e293b] border-white/5 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}>
                                            {tag}
                                            <button type="button" onClick={() => removeDoc(tag)} className="p-1 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors">
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                    {docs.length === 0 && <p className="text-xs text-slate-400 font-bold italic">No documents selected.</p>}
                                </div>

                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add doc type (e.g. PAN)"
                                        value={newDoc}
                                        onChange={e => setNewDoc(e.target.value)}
                                        className="!bg-white"
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addDoc())}
                                    />
                                    <Button type="button" variant="secondary" onClick={addDoc} size="sm" className="mt-2">Add</Button>
                                </div>
                            </div>

                            {/* Form Field Builder */}
                            <div className={`p-8 rounded-[2rem] border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3 mb-6 font-black tracking-tight">
                                    <ListTree className="text-blue-600" size={20} />
                                    <h4 className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Application Form Fields</h4>
                                </div>

                                <div className="space-y-3 mb-6 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                                    {fields.map((field, idx) => (
                                        <div key={idx} className={`p-4 rounded-2xl flex items-center justify-between border shadow-sm group transition-all duration-500 ${theme === 'dark' ? 'bg-[#1e293b] border-white/5' : 'bg-white border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase text-slate-500">
                                                    {field.type}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{field.label}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{field.name}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeField(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {fields.length === 0 && <p className="text-xs text-slate-400 font-bold italic text-center py-4">Add your first custom form field.</p>}
                                </div>

                                <div className={`p-6 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-[#1e293b] border-white/5' : 'bg-white border-slate-200 space-y-4'}`}>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <Input
                                            placeholder="Label (e.g. Phone)"
                                            size="sm"
                                            value={newField.label}
                                            onChange={e => setNewField({ ...newField, label: e.target.value, name: e.target.value })}
                                        />
                                        <select
                                            className={`px-4 py-2 border-2 border-transparent rounded-xl text-xs font-bold focus:outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-white/5 text-white focus:bg-[#1e293b] focus:border-blue-500/20' : 'bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500/20'}`}
                                            value={newField.type}
                                            onChange={e => setNewField({ ...newField, type: e.target.value })}
                                        >
                                            <option value="text" className={theme === 'dark' ? 'bg-[#1e293b] text-white' : ''}>Short Text</option>
                                            <option value="textarea" className={theme === 'dark' ? 'bg-[#1e293b] text-white' : ''}>Paragraph</option>
                                            <option value="date" className={theme === 'dark' ? 'bg-[#1e293b] text-white' : ''}>Date Picker</option>
                                            <option value="number" className={theme === 'dark' ? 'bg-[#1e293b] text-white' : ''}>Numeric Only</option>
                                        </select>
                                    </div>
                                    <Button type="button" variant="outline" size="sm" className="w-full" onClick={addField}>
                                        <Plus size={14} className="mr-2" /> Add Selection Field
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                            <Button type="submit" size="lg" className="w-full md:w-auto px-12">Publish Protocol</Button>
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs">
                                <Info size={14} />
                                Service will be live instantly across all kiosks.
                            </div>
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
                        <Card key={svc.id} className="group hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-500 border-none bg-white p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-50 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                    <Activity size={24} />
                                </div>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Edit size={16} />
                                </Button>
                            </div>
                            <h3 className={`font-black text-xl tracking-tight mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{svc.name}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-8 h-10 overflow-hidden line-clamp-2">{svc.description}</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-3 rounded-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Normal</p>
                                    <p className={`font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>₹{svc.price_normal}</p>
                                </div>
                                <div className={`p-3 rounded-2xl font-black transition-all duration-500 ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50/50'}`}>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">B2B</p>
                                    <p className="text-indigo-600">₹{svc.price_b2b}</p>
                                </div>
                            </div>
                        </Card>
                    ));
                })()}
            </div>

            {services.length > itemsPerPage && (
                <div className="mt-8 bg-white rounded-[2rem] overflow-hidden shadow-sm">
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

// Subcomponent for better icon usage
const Activity = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);
