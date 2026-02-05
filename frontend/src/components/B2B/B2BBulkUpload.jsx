import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Upload, FileSpreadsheet, CheckCircle, Database, AlertCircle } from 'lucide-react';

export default function B2BBulkUpload() {
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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bulk Application Portal</h2>
                    <p className="text-sm text-slate-500 font-medium">Upload Excel/CSV to process multiple orders at once.</p>
                </div>
                <Button variant="outline" className="border-2 border-blue-100 text-blue-600 font-black text-xs">
                    Download Template 📥
                </Button>
            </div>

            {status === 'idle' && (
                <Card className="p-12 border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 mb-6 rotate-3">
                        <Upload size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">Drop your file here</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mt-2">Upload your customer database in .xlsx or .csv format. System will auto-validate fields.</p>
                    <label className="cursor-pointer">
                        <input type="file" className="hidden" onChange={handleFileChange} accept=".csv, .xlsx" />
                        <span className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2">
                            Select Excel File <FileSpreadsheet size={20} />
                        </span>
                    </label>
                </Card>
            )}

            {status === 'previewing' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <Card className="p-6 bg-amber-50 border-amber-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Database className="text-amber-500" />
                            <div>
                                <p className="font-black text-amber-900 leading-tight">Validation Complete</p>
                                <p className="text-xs text-amber-700 font-bold">Found {preview.length} valid entries in {file?.name}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStatus('idle')} className="h-10 text-xs font-black">Cancel</Button>
                            <Button onClick={handleBulkSubmit} loading={isUploading} className="h-10 text-xs font-black bg-slate-900">Push to Queue 🚀</Button>
                        </div>
                    </Card>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Entry</th>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Customer Name</th>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Father Name</th>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest">Service</th>
                                    <th className="p-4 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {preview.map((p, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-slate-400">#{i + 1}</td>
                                        <td className="p-4 font-black text-slate-800">{p.name}</td>
                                        <td className="p-4 font-medium text-slate-500">{p.father}</td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase ring-1 ring-blue-100">
                                                {p.service}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <CheckCircle className="text-green-500 ml-auto" size={16} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <Card className="p-20 text-center animate-in zoom-in duration-500 bg-green-50/50 border-green-100 ring-4 ring-green-500/5">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8 shadow-2xl shadow-green-200 border-4 border-white">
                        <CheckCircle size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Orders Pushed Successfully</h3>
                    <p className="text-slate-500 mt-4 max-w-sm mx-auto font-medium">All applications have been added to the staff queue and deducted from your B2B wallet.</p>
                    <Button onClick={() => setStatus('idle')} className="mt-10 h-14 px-12 rounded-2xl bg-slate-900 shadow-2xl shadow-slate-200">
                        Process More Files
                    </Button>
                </Card>
            )}
        </div>
    );
}
