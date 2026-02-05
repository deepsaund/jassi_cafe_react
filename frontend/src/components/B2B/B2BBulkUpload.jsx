import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Upload, FileSpreadsheet, CheckCircle, Database, AlertCircle, Cloud, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function B2BBulkUpload() {
    const { theme } = useTheme();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, previewing, success

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Mock preview logic (In real app, Parse CSV/XLSX)
        setPreview([
            { id: 1, name: "Rahul Sharma", service: "Pan Card", father: "Sunil Sharma" },
            { id: 2, name: "Amit Kumar", service: "Aadhaar Update", father: "Ram Kumar" },
            { id: 3, name: "Sita Gupta", service: "Passport Seva", father: "Hari Gupta" }
        ]);
        setStatus('previewing');
    };

    const handleBulkSubmit = async () => {
        setIsUploading(true);
        // Simulate API call to process bulk records
        setTimeout(() => {
            setIsUploading(false);
            setStatus('success');
            setFile(null);
            setPreview([]);
        }, 2000);
    };

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-1000 max-w-7xl mx-auto pb-20 px-4 md:px-0">

            {/* 1. Neural B2B Header */}
            <header className={`relative group overflow-hidden p-10 md:p-14 rounded-[3.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-[#0f172a] text-white'}`}>
                <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300">B2B Link: Secure</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">
                            MASS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">INJECTION</span>
                        </h1>
                        <p className="max-w-md font-bold text-lg leading-relaxed text-slate-400">
                            Upload high-volume datasets directly into the neural core.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                        <Button variant="outline" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 font-black text-xs uppercase tracking-widest rounded-2xl h-12 w-full md:w-auto">
                            Download Protocol Template <ArrowRight size={14} className="ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] -ml-20 -mb-20" />
                <Database size={350} className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
            </header>

            {/* 2. Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {status === 'idle' && (
                    <Card className={`lg:col-span-12 p-16 border-2 border-dashed flex flex-col items-center justify-center text-center rounded-[3rem] group relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50/60'}`}>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-6 group-hover:rotate-12 transition-all duration-500 shadow-2xl ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400 shadow-indigo-500/10' : 'bg-white text-indigo-600 shadow-indigo-200'}`}>
                                <Cloud size={56} />
                            </div>
                            <h3 className={`text-3xl font-black tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Initiate Data Stream</h3>
                            <p className="text-slate-500 font-bold max-w-md mb-10 text-sm">Target compatible formats: .CSV or .XLSX. System will automatically validate schema integrity.</p>

                            <label className="cursor-pointer group/btn relative">
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".csv, .xlsx" />
                                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 group-hover/btn:opacity-60 transition-opacity rounded-2xl" />
                                <span className={`relative px-10 py-5 font-black text-sm rounded-2xl shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-[#0f172a] text-white border border-indigo-500/50' : 'bg-white text-indigo-700'}`}>
                                    <FileSpreadsheet size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} />
                                    SELECT DATA SOURCE
                                </span>
                            </label>
                        </div>
                    </Card>
                )}

                {status === 'previewing' && (
                    <div className="lg:col-span-12 space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
                        {/* Status Bar */}
                        <div className={`p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 border ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                            <div className="flex items-center gap-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <p className={`font-black text-lg uppercase tracking-tight ${theme === 'dark' ? 'text-amber-500' : 'text-amber-800'}`}>Integrity Check Complete</p>
                                    <p className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-amber-500/60' : 'text-amber-700/60'}`}>Found {preview.length} valid entities in {file?.name}</p>
                                </div>
                            </div>
                            <div className="flex w-full md:w-auto gap-3">
                                <Button variant="ghost" onClick={() => setStatus('idle')} className={`flex-1 md:flex-none uppercase font-black text-xs tracking-widest ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500'}`}>Cancel</Button>
                                <Button onClick={handleBulkSubmit} loading={isUploading} className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 uppercase font-black text-xs tracking-widest h-12 px-8 rounded-xl">
                                    Execute Batch <Zap size={16} className="ml-2 fill-current" />
                                </Button>
                            </div>
                        </div>

                        {/* Data Matrix */}
                        <Card className={`rounded-[2.5rem] overflow-hidden border-none shadow-2xl ${theme === 'dark' ? 'bg-[#0f172a] shadow-black/40' : 'bg-white shadow-indigo-900/5'}`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50/80'}`}>
                                        <tr>
                                            <th className="p-6 font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Matrix ID</th>
                                            <th className="p-6 font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Entity Name</th>
                                            <th className="p-6 font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Parent Node</th>
                                            <th className="p-6 font-black text-slate-400 uppercase text-[9px] tracking-[0.2em]">Service Protocol</th>
                                            <th className="p-6 font-black text-slate-400 uppercase text-[9px] tracking-[0.2em] text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                                        {preview.map((p, i) => (
                                            <tr key={i} className={`group transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-indigo-50/30'}`}>
                                                <td className="p-6 font-mono text-xs font-bold opacity-50">#{i + 1}</td>
                                                <td className={`p-6 font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{p.name}</td>
                                                <td className={`p-6 font-bold text-xs uppercase tracking-wide ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>{p.father}</td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'}`}>
                                                        {p.service}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <CheckCircle className="text-emerald-500 ml-auto" size={18} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {status === 'success' && (
                    <Card className={`lg:col-span-12 p-20 text-center animate-in zoom-in duration-500 flex flex-col items-center justify-center rounded-[3rem] relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-900/10 border-emerald-500/20' : 'bg-emerald-50/50 border-emerald-100'}`}>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-emerald-500/40 rotate-12">
                                <CheckCircle size={48} className="fill-current" />
                            </div>
                            <h3 className={`text-4xl font-black mb-4 tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Injection Successful</h3>
                            <p className="text-emerald-600/80 font-bold max-w-sm text-center mb-10 text-lg">All applications have been successfully synced to the central matrix node.</p>

                            <Button onClick={() => setStatus('idle')} className="h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest shadow-xl shadow-emerald-600/30">
                                Open New Stream
                            </Button>
                        </div>
                        <div className="absolute inset-0 bg-emerald-500/5 blur-[100px]" />
                    </Card>
                )}
            </div>
        </div>
    );
}
