import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Upload, X, AlertOctagon, Check, FileText, Loader2 } from 'lucide-react';
import { API_BASE } from '../../config';
import { useAuth } from '../../context/AuthContext';

export function OrderFix({ order, onClose, onUpdate }) {
    const { user } = useAuth();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(null); // 'aadhaar' etc.

    useEffect(() => {
        if (!order) return;
        fetch(`${API_BASE}/services`)
            .then(res => res.json())
            .then(data => {
                const svc = data.find(s => s.id == order.service_id);
                setService(svc);
                setLoading(false);
            });
    }, [order]);

    const handleFileChange = async (docType, file) => {
        if (!file) return;
        setUploading(docType);

        try {
            // 1. Upload File
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', docType);

            const uploadRes = await fetch(`${API_BASE}/documents/upload`, {
                method: 'POST',
                headers: { 'Authorization': `mock_token_${user.id}` },
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Upload failed');
            const uploadData = await uploadRes.json();

            // 2. Link to Order (Re-upload)
            const reRes = await fetch(`${API_BASE}/orders/reupload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify({
                    order_id: order.id,
                    doc_type: docType,
                    document_id: uploadData.id
                })
            });

            if (!reRes.ok) throw new Error('Update failed');

            // Success
            onUpdate(); // Refresh dashboard
            onClose(); // Close modal

        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(null);
        }
    };

    if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></div>;

    const requiredDocs = service?.documents_required_json ? JSON.parse(service.documents_required_json) : [];
    const currentDocs = order.document_ids ? JSON.parse(order.document_ids) : {};
    const rejectedDocs = order.rejected_docs ? (typeof order.rejected_docs === 'string' ? JSON.parse(order.rejected_docs) : order.rejected_docs) : [];

    return (
        <div className="space-y-6">
            <div className={`p-4 rounded-xl flex gap-3 ${rejectedDocs.length > 0 ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'}`}>
                <AlertOctagon className="shrink-0" />
                <div>
                    <h4 className="font-black text-xs uppercase tracking-widest mb-1">Status Report</h4>
                    <p className="text-[11px] font-bold uppercase tracking-tight leading-relaxed">{order.rejection_reason || "Please review your documents and update the flagged ones."}</p>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 px-2">Document Audit Queue</h4>
                {requiredDocs.map(doc => {
                    const isRejected = rejectedDocs.includes(doc);
                    return (
                        <div key={doc} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isRejected ? 'bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/5' : 'bg-slate-500/5 border-white/5 opacity-60'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isRejected ? 'bg-red-500/20 text-red-500 rotate-3' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    {isRejected ? <X size={20} /> : <Check size={20} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className={`font-black uppercase tracking-tight text-xs ${isRejected ? 'text-red-500' : 'text-slate-400'}`}>{doc.replace(/_/g, ' ')}</p>
                                        {isRejected && <span className="px-2 py-0.5 rounded-full bg-red-500 text-[8px] font-black text-white uppercase tracking-widest animate-pulse">Needs Re-upload</span>}
                                        {!isRejected && currentDocs[doc] && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Verified Signal</span>}
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">Hash ID: {currentDocs[doc] ? `#${currentDocs[doc]}` : 'Missing'}</p>
                                </div>
                            </div>

                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    className="hidden"
                                    disabled={uploading !== null}
                                    onChange={(e) => handleFileChange(doc, e.target.files[0])}
                                />
                                {uploading === doc ? (
                                    <Button size="sm" disabled className="px-4"><Loader2 className="animate-spin" size={16} /></Button>
                                ) : (
                                    <div className={`px-4 py-2 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isRejected ? 'bg-red-500 text-white border-red-500 shadow-xl shadow-red-500/20 hover:scale-105 hover:rotate-2' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-blue-500/30'}`}>
                                        <Upload size={14} /> {isRejected ? 'Correct Image' : 'Replace'}
                                    </div>
                                )}
                            </label>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}
