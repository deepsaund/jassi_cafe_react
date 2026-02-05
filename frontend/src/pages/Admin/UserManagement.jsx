import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { Plus, Trash2, User, Search, MapPin, Users, ShieldCheck, Briefcase, Building2, FolderLock, Download, Eye, FileText } from 'lucide-react';
import { Drawer } from '../../components/ui/Drawer';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

export default function UserManagement() {
    const { theme } = useTheme();
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('customer'); // 'customer', 'staff', 'b2b'
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', phone: '', password: '', role: 'customer', father_name: '', village: '' });
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Vault State
    const [vaultUser, setVaultUser] = useState(null);
    const [vaultDocs, setVaultDocs] = useState([]);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [loadingVault, setLoadingVault] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const fetchUsers = () => {
        fetch(`${API_BASE}/admin/users?search=${searchTerm}`)
            .then(res => res.json())
            .then(data => setUsers(Array.isArray(data) ? data : []));
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/admin/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                setShowAddForm(false);
                setNewUser({ name: '', phone: '', password: '', role: 'customer', father_name: '', village: '' });
                fetchUsers();
            } else {
                alert("Failed to create user");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingUser)
            });
            if (res.ok) {
                setEditingUser(null);
                fetchUsers();
            } else {
                alert("Failed to update user");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure? This will revoke all access for this user.")) return;
    };

    const openVault = async (user) => {
        setVaultUser(user);
        setIsVaultOpen(true);
        setLoadingVault(true);
        try {
            const res = await fetch(`${API_BASE}/admin/documents?user_id=${user.id}`, {
                headers: { 'Authorization': `mock_token_${user.id}` } // Admin usually has their own token but for now using this pattern
            });
            const data = await res.json();
            setVaultDocs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingVault(false);
        }
    };

    // Filter users based on active tab
    const filteredUsers = users.filter(u => {
        if (activeTab === 'customer') return u.role === 'customer';
        if (activeTab === 'staff') return u.role === 'staff' || u.role === 'admin';
        if (activeTab === 'b2b') return u.role === 'b2b';
        return true;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset to page 1 when tab changes or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    const counts = {
        customer: users.filter(u => u.role === 'customer').length,
        staff: users.filter(u => u.role === 'staff' || u.role === 'admin').length,
        b2b: users.filter(u => u.role === 'b2b').length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
            <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-8 rounded-[2rem] relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] text-white shadow-none' : 'bg-white text-slate-900 border border-slate-100 shadow-2xl shadow-blue-900/10'}`}>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Users className="text-blue-400" size={32} />
                        Identity Manager
                    </h1>
                    <p className="text-slate-400 mt-1 font-medium italic">Directory of all registered entities and operational personnel.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:bg-white focus:text-slate-900 outline-none font-bold text-sm transition-all"
                            placeholder="Global Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? 'danger' : 'white'} size="lg">
                        {showAddForm ? 'Cancel' : <><Plus size={20} className="mr-2" /> Provision New Identity</>}
                    </Button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32" />
            </div>

            {/* Tab System */}
            <div className={`flex gap-2 p-1.5 rounded-[1.5rem] w-fit transition-all duration-500 ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <TabButton
                    active={activeTab === 'customer'}
                    onClick={() => setActiveTab('customer')}
                    icon={User}
                    label="Customers"
                    count={counts.customer}
                />
                <TabButton
                    active={activeTab === 'staff'}
                    onClick={() => setActiveTab('staff')}
                    icon={ShieldCheck}
                    label="Staff Team"
                    count={counts.staff}
                />
                <TabButton
                    active={activeTab === 'b2b'}
                    onClick={() => setActiveTab('b2b')}
                    icon={Building2}
                    label="B2B Partners"
                    count={counts.b2b}
                />
            </div>

            {editingUser && (
                <Card className="p-10 border-none shadow-2xl shadow-blue-200/50 bg-white rounded-[2.5rem] animate-in slide-in-from-top-6 duration-500">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl">
                            <User size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Edit User Profile</h3>
                    </div>
                    <form onSubmit={handleEditUser} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Input
                                label="Full Legal Name"
                                placeholder="Enter name"
                                value={editingUser.name}
                                onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Official Phone Number"
                                type="tel"
                                placeholder="Mobile number"
                                value={editingUser.phone}
                                onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                                required
                            />
                            <div className="flex flex-col space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Access Protocol (Role)</label>
                                <select
                                    className={`w-full px-5 py-3 border-2 border-transparent rounded-2xl text-sm font-bold focus:outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-[#1e293b] text-white focus:bg-[#1e293b] focus:border-blue-500/20' : 'bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-500/20'}`}
                                    value={editingUser.role}
                                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                                >
                                    <option value="customer">Citizen / Customer</option>
                                    <option value="b2b">B2B Commercial Partner</option>
                                    <option value="staff">Operations Staff</option>
                                    <option value="admin">System Administrator</option>
                                </select>
                            </div>
                            <Input
                                label="Father Name"
                                placeholder="Father's name"
                                value={editingUser.father_name || ''}
                                onChange={e => setEditingUser({ ...editingUser, father_name: e.target.value })}
                            />
                            <Input
                                label="Village / Operational Area"
                                placeholder="Location"
                                value={editingUser.village || ''}
                                onChange={e => setEditingUser({ ...editingUser, village: e.target.value })}
                            />
                            <Input
                                label="New Password (Optional)"
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={editingUser.password || ''}
                                onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-between pt-4">
                            <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="lg" className="px-12 bg-blue-600 hover:bg-blue-700 shadow-blue-200">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {showAddForm && (
                <Card className="p-10 border-none shadow-2xl shadow-indigo-200/50 bg-white rounded-[2.5rem] animate-in slide-in-from-top-6 duration-500">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                            <Plus size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Access Provisioning</h3>
                    </div>
                    <form onSubmit={handleAddUser} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <Input
                                label="Full Legal Name"
                                placeholder="Enter name"
                                value={newUser.name}
                                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Official Phone Number"
                                type="tel"
                                placeholder="Mobile number"
                                value={newUser.phone}
                                onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                required
                            />
                            <div className="flex flex-col space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Access Protocol (Role)</label>
                                <select
                                    className={`w-full px-5 py-3 border-2 border-transparent rounded-2xl text-sm font-bold focus:outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-[#1e293b] text-white focus:bg-[#1e293b] focus:border-indigo-500/20' : 'bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-500/20'}`}
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="customer">Citizen / Customer</option>
                                    <option value="b2b">B2B Commercial Partner</option>
                                    <option value="staff">Operations Staff</option>
                                    <option value="admin">System Administrator</option>
                                </select>
                            </div>
                            <Input
                                label="Father Name"
                                placeholder="Father's name"
                                value={newUser.father_name}
                                onChange={e => setNewUser({ ...newUser, father_name: e.target.value })}
                            />
                            <Input
                                label="Village / Operational Area"
                                placeholder="Location"
                                value={newUser.village}
                                onChange={e => setNewUser({ ...newUser, village: e.target.value })}
                            />
                            <Input
                                label="Access Key (Password)"
                                type="password"
                                placeholder="Set secure password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" className="px-12 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200">
                                Confirm & Provision Access
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className={`rounded-[2.5rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-[#0f172a] border-white/5 shadow-none' : 'bg-white border-slate-100'}`}>
                <table className="w-full text-left">
                    <thead>
                        <tr className={`border-b transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50/80 border-slate-100'}`}>
                            <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest bg-white/50">Details</th>
                            <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-center">Protocol Role</th>
                            {activeTab === 'customer' && <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Village/Area</th>}
                            {activeTab === 'staff' && <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Security Access</th>}
                            <th className="p-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y transition-all duration-500 ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                        {paginatedUsers.map(user => (
                            <tr key={user.id} className={`transition-all group ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                                <td className="p-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className={`font-black text-base leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                                            <p className="text-sm text-slate-400 font-bold mt-0.5">{user.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ring-1 ring-inset ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-100' :
                                        user.role === 'staff' ? 'bg-blue-50 text-blue-700 ring-blue-100' :
                                            user.role === 'b2b' ? 'bg-amber-50 text-amber-700 ring-amber-100' :
                                                'bg-slate-50 text-slate-600 ring-slate-100'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                {activeTab === 'customer' && (
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                            <MapPin size={16} className="text-blue-500" />
                                            {user.village || 'Undefined'}
                                        </div>
                                    </td>
                                )}
                                {activeTab === 'staff' && (
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-wider">
                                            <ShieldCheck size={16} /> Fully Authorized
                                        </div>
                                    </td>
                                )}
                                <td className="p-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openVault(user)}
                                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group/vault"
                                            title="View Document Vault"
                                        >
                                            <FolderLock size={20} className="group-hover/vault:scale-110 transition-transform" />
                                        </button>
                                        <button
                                            onClick={() => setEditingUser({ ...user, password: '' })}
                                            className="p-2.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {paginatedUsers.length === 0 && filteredUsers.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={32} className="text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold">No registered profiles found in this category.</p>
                    </div>
                )}
                {filteredUsers.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredUsers.length}
                    />
                )}
            </div>
            {/* User Vault Drawer */}
            <Drawer
                isOpen={isVaultOpen}
                onClose={() => setIsVaultOpen(false)}
                title={`Identity Vault: ${vaultUser?.name}`}
            >
                <div className="space-y-6">
                    <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-black text-xl mb-1">{vaultUser?.name}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{vaultUser?.phone} • {vaultUser?.role}</p>
                        </div>
                        <FolderLock className="absolute -right-4 -bottom-4 opacity-10 text-white" size={100} />
                    </div>

                    {loadingVault ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Searching Vault...</p>
                        </div>
                    ) : vaultDocs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {vaultDocs.map(doc => (
                                <div key={doc.id} className="p-5 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 text-sm uppercase">{doc.type.replace('_', ' ')}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{doc.original_name || 'unnamed_file'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`${API_BASE.replace('/api', '')}${doc.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                        >
                                            <Eye size={18} />
                                        </a>
                                        <a
                                            href={`${API_BASE.replace('/api', '')}${doc.file_path}`}
                                            download
                                            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                        >
                                            <Download size={18} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <FolderLock size={32} className="text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold">Vault is empty.</p>
                            <p className="text-[10px] text-slate-400 uppercase mt-1">No documents uploaded by this user yet.</p>
                        </div>
                    )}
                </div>
            </Drawer>
        </div>
    );
}

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${active
            ? 'bg-white text-slate-900 shadow-xl shadow-slate-200/50 scale-105'
            : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
            }`}
    >
        <Icon size={18} className={active ? 'text-blue-600' : 'text-slate-400'} />
        {label}
        <span className={`text-[10px] px-2 py-0.5 rounded-lg ${active ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
            {count}
        </span>
    </button>
);
