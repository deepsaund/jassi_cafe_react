import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Database, File, Upload, Trash2, Search, Filter, MoreVertical, Download, Eye, Plus, Lock, Send, UserSearch, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../config';

const Card = ({ children, className = "" }) => {
    const { theme } = useTheme();
    return (
        <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 shadow-xl ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-slate-200/50'} ${className}`}>
            {children}
        </div>
    );
};

export default function DocumentVault() {
    const { theme } = useTheme();
    const { user: currentUser } = useAuth();
    const [search, setSearch] = useState('');
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Admin/Staff States
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchingUsers, setSearchingUsers] = useState(false);

    // Fetch documents for a specific user (Admin context) or self (Customer context)
    const fetchDocuments = (userId = null) => {
        setLoading(true);
        setError(null);
        // Ensure we absolute path if possible or at least standard
        const url = userId
            ? `${API_BASE}/admin/documents?user_id=${userId}`
            : `${API_BASE}/documents`;

        fetch(url, {
            headers: {
                'Authorization': `mock_token_${currentUser.id}`,
                'Accept': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data && data.error) throw new Error(data.error);
                setDocuments(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Vault Fetch Error:", err);
                setError(err.message);
                setDocuments([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Customer Initialization
    useEffect(() => {
        if (currentUser && (currentUser.role === 'customer' || currentUser.role === 'b2b')) {
            fetchDocuments();
        }
    }, [currentUser]);

    // Admin/Staff User Search
    useEffect(() => {
        if (!userSearchQuery || userSearchQuery.length < 2) {
            setUserSearchResults([]);
            return;
        }
        setSearchingUsers(true);
        const timeout = setTimeout(() => {
            fetch(`${API_BASE}/admin/users?search=${encodeURIComponent(userSearchQuery)}`, {
                headers: { 'Authorization': `mock_token_${currentUser.id}` }
            })
                .then(res => res.json())
                .then(data => {
                    setUserSearchResults(Array.isArray(data) ? data : []);
                })
                .catch(err => console.error(err))
                .finally(() => setSearchingUsers(false));
        }, 400);
        return () => clearTimeout(timeout);
    }, [userSearchQuery]);

    const handleUserSelect = (targetUser) => {
        setSelectedUser(targetUser);
        setUserSearchQuery('');
        setUserSearchResults([]);
        fetchDocuments(targetUser.id);
    };

    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'staff';
    const filteredDocs = documents.filter(doc =>
        doc.original_name?.toLowerCase().includes(search.toLowerCase()) ||
        doc.type?.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Pending...';
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 px-4 md:px-0">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 shadow-2xl shadow-blue-500/10 border border-blue-500/20">
                        <Database size={32} />
                    </div>
                    <div>
                        <h1 className={`text-4xl font-black tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            IDENTITY <span className="text-blue-500">VAULT</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-2 leading-none">
                            {isAdmin ? 'Global Document Sector Audit' : 'Secure personal asset management'}
                        </p>
                    </div>
                </div>

                {!isAdmin && (
                    <button className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-900/20 active:scale-95`}>
                        <Upload size={18} /> Upload Identity Asset
                    </button>
                )}
            </div>

            {isAdmin && (
                <div className="space-y-6">
                    {/* User Selection Hub */}
                    <Card className="p-8">
                        <div className="max-w-xl">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-3">
                                <Search size={22} className="text-blue-500" /> Identity Search
                            </h3>
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by Name or Phone Number..."
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    className={`w-full h-16 pl-14 pr-6 rounded-2xl text-sm font-bold border-none transition-all outline-none focus:ring-4 focus:ring-blue-500/10 ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-50 text-slate-900'}`}
                                />
                                {searchingUsers && <div className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}

                                {/* Dropdown Results */}
                                {userSearchResults.length > 0 && (
                                    <div className={`absolute top-full left-0 right-0 mt-3 p-2 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border z-50 animate-in fade-in slide-in-from-top-2 duration-300 ${theme === 'dark' ? 'bg-[#0f172a] border-white/10' : 'bg-white border-slate-100'}`}>
                                        <div className="max-h-[300px] overflow-auto custom-scrollbar">
                                            {userSearchResults.map(u => (
                                                <button
                                                    key={u.id}
                                                    onClick={() => handleUserSelect(u)}
                                                    className={`w-full p-4 flex items-center gap-4 rounded-2xl text-left transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-blue-50'}`}
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-black text-xs">
                                                        {u.name[0]}
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-black uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{u.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{u.phone}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedUser && (
                            <div className="mt-8 flex items-center gap-6 p-6 rounded-[2rem] bg-blue-600/5 border border-blue-500/10 animate-in zoom-in duration-300">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                                    {selectedUser.name[0]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-black uppercase tracking-tight">{selectedUser.name}</h4>
                                    <div className="flex items-center gap-4 mt-1">
                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">REF ID: #{selectedUser.id}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{selectedUser.phone}</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedUser(null)} className="p-3 rounded-xl hover:bg-slate-500/10 text-slate-500 transition-all"><Trash2 size={20} /></button>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {(!isAdmin || selectedUser) && (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className={`flex-1 flex items-center gap-4 p-5 px-8 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
                            <Search size={22} className="text-slate-500" />
                            <input
                                placeholder="Search decentralized files..."
                                className="bg-transparent border-none outline-none w-full text-xs font-bold placeholder:uppercase placeholder:tracking-widest"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500">
                            <AlertCircle size={24} />
                            <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    {/* Document List */}
                    <Card className="p-0 overflow-hidden border-none shadow-none bg-transparent">
                        <div className={`overflow-x-auto rounded-[3rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}>
                            {loading ? (
                                <div className="p-32 text-center">
                                    <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-8 shadow-xl shadow-blue-500/20"></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Decrypting Sector...</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className={`border-b ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50/80 border-slate-100'}`}>
                                        <tr>
                                            <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">File Description</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Category</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Status</th>
                                            <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Archive Date</th>
                                            <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                                        {filteredDocs.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-32 text-center">
                                                    <Database size={64} className="mx-auto mb-8 opacity-5 text-blue-500" />
                                                    <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No records found within this identity sector.</p>
                                                </td>
                                            </tr>
                                        ) : filteredDocs.map((doc) => (
                                            <tr key={doc.id} className={`group transition-all duration-500 ${theme === 'dark' ? 'hover:bg-blue-600/5' : 'hover:bg-blue-50/50'}`}>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-blue-500 bg-blue-600/10 shadow-lg shadow-blue-500/5 group-hover:scale-110 transition-transform duration-500`}>
                                                            <File size={24} />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900 group-hover:text-blue-600 transition-colors'}`}>{doc.original_name}</p>
                                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Verified Sector Hash</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-white/5 text-blue-400 border border-white/5 shadow-xl shadow-black/20' : 'bg-blue-50 text-blue-600'}`}>
                                                        {doc.type?.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em]">
                                                    <div className="flex items-center gap-2 text-emerald-500">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                        Secure
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                                                    {formatDate(doc.upload_date)}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform duration-500">
                                                        <a
                                                            href={`${API_BASE.replace('/api', '')}${doc.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:bg-blue-500/20 hover:text-blue-400' : 'bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white shadow-xl shadow-slate-200/50'}`}
                                                        >
                                                            <Eye size={18} />
                                                        </a>
                                                        <a
                                                            href={`${API_BASE.replace('/api', '')}${doc.file_path}`}
                                                            download
                                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400' : 'bg-slate-100 text-slate-500 hover:bg-emerald-600 hover:text-white shadow-xl shadow-slate-200/50'}`}
                                                        >
                                                            <Download size={18} />
                                                        </a>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {isAdmin && !selectedUser && !loading && (
                <div className="py-20 text-center animate-in fade-in duration-1000">
                    <div className="w-24 h-24 bg-slate-500/5 rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-slate-500/10 grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        <UserSearch size={40} />
                    </div>
                    <h3 className="text-2xl font-black uppercase text-slate-300 tracking-tight">Identity Vault Access</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] max-w-sm mx-auto mt-4 leading-relaxed">
                        Authorized personnel must initiate localized identity lookup to access document sectors.
                    </p>
                </div>
            )}
        </div>
    );
}
