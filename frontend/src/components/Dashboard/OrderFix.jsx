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

    return (
        <div className="space-y-6">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 text-red-900">
                <AlertOctagon className="shrink-0 text-red-600" />
                <div>
                    <h4 className="font-black text-sm uppercase tracking-wide mb-1">Action Required</h4>
                    <p className="text-sm font-medium">{order.rejection_reason || "Please review your documents and re-upload the incorrect ones."}</p>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-bold text-slate-900">Select Document to Fix:</h4>
                {requiredDocs.map(doc => (
                    <div key={doc} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-700 capitalize text-sm">{doc.replace('_', ' ')}</p>
                                <p className="text-xs text-slate-400 font-bold">Current: {currentDocs[doc] ? `ID #${currentDocs[doc]}` : 'Missing'}</p>
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
                                <div className="px-4 py-2 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-2">
                                    <Upload size={14} /> Replace
                                </div>
                            )}
                        </label>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
        </div>
    );
}
