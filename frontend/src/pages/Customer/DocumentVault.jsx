import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Database, File, Upload, Trash2, Search, Filter, MoreVertical, Download, Eye, Plus } from 'lucide-react';

const Card = ({ children, className = "" }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-3xl border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'} ${className}`}>
            {children}
        </div>
    );
};

export default function DocumentVault() {
    const { theme } = useTheme();
    const [search, setSearch] = useState('');

    const [documents, setDocuments] = useState([
        { id: 1, name: 'Aadhaar Card Front.jpg', type: 'Identification', date: '2026-02-01', size: '1.2 MB' },
        { id: 2, name: 'PAN Card.pdf', type: 'Tax Document', date: '2026-02-03', size: '850 KB' },
        { id: 3, name: 'Ration Card Copy.pdf', type: 'Address Proof', date: '2026-01-15', size: '2.4 MB' },
        { id: 4, name: 'Passport Photo.jpg', type: 'Photo', date: '2026-02-04', size: '450 KB' },
    ]);

    const filteredDocs = documents.filter(doc => doc.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className={`text-3xl font-black tracking-tight uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Document <span className="text-blue-500">Vault</span>
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Access and manage your reusable identity files</p>
                </div>

                <div className="flex gap-3">
                    <button className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20 active:scale-95`}>
                        <Upload size={16} /> Upload New File
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Storage', value: '4.9 MB', icon: Database, color: 'text-blue-500' },
                    { label: 'Stored Files', value: filteredDocs.length, icon: File, color: 'text-indigo-500' },
                    { label: 'ID Documents', value: '2', icon: Filter, color: 'text-emerald-500' },
                    { label: 'Recent Uploads', value: '2', icon: Plus, color: 'text-orange-500' },
                ].map((stat, idx) => (
                    <Card key={idx} className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-slate-500/5 flex items-center justify-center ${stat.color}`}>
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                            <p className={`text-lg font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className={`flex-1 flex items-center gap-3 p-3 px-5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/40'}`}>
                    <Search size={18} className="text-slate-400" />
                    <input
                        placeholder="Search for a file..."
                        className="bg-transparent border-none outline-none w-full text-xs font-bold"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-400 shadow-lg shadow-slate-200/40'}`}>
                    <Filter size={18} />
                </button>
            </div>

            {/* Document List */}
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className={`border-b ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50/80 border-slate-100'}`}>
                            <tr>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">File Description</th>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Category</th>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Size</th>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Sync Date</th>
                                <th className="p-5 text-right text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Control</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {filteredDocs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-20 text-center">
                                        <Database size={48} className="mx-auto mb-4 opacity-10" />
                                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Your Vault is currently empty.</p>
                                    </td>
                                </tr>
                            ) : filteredDocs.map((doc) => (
                                <tr key={doc.id} className={`group transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-blue-50/40'}`}>
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-blue-500 bg-blue-500/10 group-hover:scale-110 transition-transform`}>
                                                <File size={20} />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-black tracking-tight ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>{doc.name}</p>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Static Asset</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-slate-400 border border-white/5' : 'bg-slate-100 text-slate-500'}`}>
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-[10px] font-bold text-slate-400">{doc.size}</span>
                                    </td>
                                    <td className="p-5 text-[10px] font-mono text-slate-400 italic">
                                        {doc.date}
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button title="View" className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-50 text-blue-600'}`}><Eye size={16} /></button>
                                            <button title="Download" className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-emerald-500/20 text-emerald-400' : 'hover:bg-emerald-50 text-emerald-600'}`}><Download size={16} /></button>
                                            <button title="Delete" className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
