import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, XCircle, CheckCircle, ExternalLink, MessageSquare, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { OrderChat } from '../../components/Dashboard/OrderChat';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

export default function VerificationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [order, setOrder] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [currentDoc, setCurrentDoc] = useState(null);
    const [internalNote, setInternalNote] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (!user) return;
        // Fetch Order Details include user docs
        fetch(`${API_BASE}/staff/orders`, {
            headers: { 'Authorization': `mock_token_${user.id}` }
        })
            .then(res => res.json())
            .then(async data => {
                const ord = data.find(o => o.id == id);
                setOrder(ord);

                if (ord && ord.document_ids) {
                    try {
                        const docObj = JSON.parse(ord.document_ids);
                        const ids = Object.values(docObj).join(',');

                        const docRes = await fetch(`${API_BASE}/documents/batch?ids=${ids}`, {
                            headers: { 'Authorization': `mock_token_${user.id}` }
                        });
                        const docs = await docRes.json();

                        // Map them back to the format the UI expects
                        const formattedDocs = docs.map(d => ({
                            id: d.id,
                            type: d.type,
                            name: d.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                            url: d.file_path.startsWith('http') ? d.file_path : `http://localhost/WEBSITE${d.file_path}`
                        }));

                        setDocuments(formattedDocs);
                        if (formattedDocs.length > 0) setCurrentDoc(formattedDocs[0]);
                    } catch (e) {
                        console.error("Error parsing/fetching docs", e);
                    }
                }
            });
    }, [id, user]);

    const handleAction = async (action, reason = '', docType = null) => {
        setIsProcessing(true);
        try {
            await fetch(`${API_BASE}/staff/orders/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user.id}`
                },
                body: JSON.stringify({ action, order_id: order.id, reason, doc_type: docType, internal_note: internalNote })
            });
            if (action !== 'reject_doc') navigate('/dashboard/staff');
            else {
                // Update local state for doc rejection if needed
                alert("Document rejected. Customer will be notified.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!order) return (
        <div className="p-20 text-center animate-pulse">
            <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-4"></div>
            <p className="text-slate-500 font-bold">Loading Verification Workspace...</p>
        </div>
    );

    const formData = order.form_data ? (typeof order.form_data === 'string' ? JSON.parse(order.form_data) : order.form_data) : {};

    return (
        <div className={`h-[calc(100vh-80px)] -m-6 flex flex-col overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-[#070b14]' : 'bg-slate-100'}`}>
            {/* Header / Toolbar */}
            <div className={`border-b px-6 py-4 flex items-center justify-between shadow-sm z-10 ${theme === 'dark' ? 'bg-[#0f172a] border-white/5 shadow-2xl shadow-blue-900/10' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard/staff')} className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'hover:bg-white/5 text-slate-400 font-black' : 'hover:bg-slate-100 text-slate-600'}`}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className={`text-lg font-black tracking-tight flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            Verifying Order #{order.id}
                            <span className={`px-2 py-0.5 text-[10px] rounded-lg uppercase font-black tracking-[0.2em] ${theme === 'dark' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-700'}`}>{order.service_name}</span>
                        </h1>
                        <p className={`text-xs font-bold ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{order.customer_name} • {order.customer_phone}</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-3 rounded-2xl transition-all ${theme === 'dark' ? 'bg-white/5 text-blue-400 hover:bg-white/10' : 'bg-slate-50 text-blue-600 hover:bg-blue-50'}`}
                        title={isSidebarOpen ? "Close Information Panel" : "Open Information Panel"}
                    >
                        {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
                    </button>

                    <div className="w-[1px] h-8 bg-white/10 mx-2" />

                    <Button
                        variant="secondary"
                        size="sm"
                        className={`rounded-xl px-6 border border-red-500/30 ${theme === 'dark' ? 'text-red-400 hover:bg-red-500 hover:text-white' : 'text-red-600 hover:bg-red-600 hover:text-white'}`}
                        loading={isProcessing}
                        onClick={() => {
                            const r = prompt("Rejection Reason:");
                            if (r) handleAction('reject', r);
                        }}
                    >
                        <XCircle size={16} className="mr-2" /> Reject
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 rounded-xl px-8 border-none text-white"
                        loading={isProcessing}
                        onClick={() => handleAction('complete')}
                    >
                        <CheckCircle size={16} className="mr-2" /> Approve & Complete
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Document Viewer */}
                <div className="flex-1 flex flex-col bg-slate-900 relative">
                    <div className="bg-black/40 backdrop-blur-md p-4 flex gap-3 overflow-x-auto border-b border-white/5 no-scrollbar min-h-[70px] items-center">
                        {documents.length > 0 ? (
                            documents.map(doc => {
                                const active = currentDoc?.id === doc.id;
                                return (
                                    <Button
                                        key={doc.id}
                                        variant={active ? (theme === 'dark' ? 'neural' : 'white') : 'glass'}
                                        size="sm"
                                        onClick={() => setCurrentDoc(doc)}
                                        className={`whitespace-nowrap transition-all ${!active ? 'border-transparent opacity-60 hover:opacity-100' : 'scale-105'}`}
                                    >
                                        <Eye size={14} /> {doc.name}
                                    </Button>
                                );
                            })
                        ) : (
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-black uppercase tracking-widest px-4">
                                <XCircle size={16} />
                                No documents attached
                            </div>
                        )}
                    </div>
                    <div className={`flex-1 p-8 flex items-center justify-center overflow-auto transition-colors duration-700 ${theme === 'dark' ? 'bg-[#0a0f1d]' : 'bg-slate-950/40'}`}>
                        {currentDoc ? (
                            <div className="relative group max-w-full">
                                <img src={currentDoc.url} alt="Doc" className={`rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] max-h-[75vh] object-contain transition-all duration-500 group-hover:scale-[1.01] ${theme === 'dark' ? 'bg-[#1e293b] border border-white/5' : 'bg-white'}`} />
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <a href={currentDoc.url} target="_blank" className="w-12 h-12 flex items-center justify-center bg-slate-900/90 text-white rounded-2xl backdrop-blur-md hover:bg-blue-600 shadow-xl">
                                        <ExternalLink size={20} />
                                    </a>
                                </div>
                                <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="h-12 px-6 rounded-2xl backdrop-blur-md border-none shadow-xl"
                                        onClick={() => {
                                            const r = prompt(`Why reject ${currentDoc.name}?`);
                                            if (r) handleAction('reject_doc', r, currentDoc.type);
                                        }}
                                    >
                                        <XCircle size={18} className="mr-2" /> Reject This Doc
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-slate-700 text-center">
                                <Eye size={80} className="mx-auto mb-6 opacity-10" />
                                <p className="font-black uppercase tracking-widest text-xs">{documents.length > 0 ? 'Select a document to preview' : 'No document selected'}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Data & Chat */}
                <div className={`transition-all duration-500 ease-in-out flex flex-col shadow-2xl z-20 overflow-hidden ${isSidebarOpen ? 'w-[480px] border-l' : 'w-0 border-none'} ${theme === 'dark' ? 'bg-[#0f172a] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex-1 overflow-y-auto custom-scrollbar min-w-[480px]">
                        {/* Section: Application Data */}
                        <div className={`p-8 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                            <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-6">Application Details</h3>
                            <div className={`space-y-4 p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                {Object.entries(formData).map(([k, v]) => (
                                    <div key={k} className="group">
                                        <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 transition-colors ${theme === 'dark' ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`}>{k.replace(/_/g, ' ')}</span>
                                        <p className={`text-sm font-bold break-all ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{v || "Not provided"}</p>
                                    </div>
                                ))}
                                {Object.keys(formData).length === 0 && <p className="text-sm italic text-slate-500">No form data provided.</p>}
                            </div>
                        </div>

                        {/* Section: Internal Notes */}
                        <div className={`p-8 border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                            <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-6">Internal Notes</h3>
                            <textarea
                                className={`w-full rounded-[1.5rem] p-5 text-sm font-bold outline-none transition-all ${theme === 'dark'
                                    ? 'bg-amber-500/5 border border-amber-500/10 text-amber-200 placeholder:text-amber-500/30 focus:border-amber-500/30 ring-amber-500/5 focus:ring-4'
                                    : 'bg-amber-50/50 border border-amber-100 text-slate-800 placeholder:text-amber-200 focus:ring-amber-500/20 focus:ring-4'
                                    }`}
                                rows={4}
                                placeholder="Type internal notes..."
                                value={internalNote}
                                onChange={(e) => setInternalNote(e.target.value)}
                            />
                        </div>

                        {/* Section: Chat Integration */}
                        <div className="p-8 pb-12">
                            <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-6">Neural Messages</h3>
                            <div className="rounded-[2.5rem] overflow-hidden border border-transparent shadow-2xl">
                                <OrderChat orderId={order.id} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
