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
        try {
            const res = await fetch(`${API_BASE}/admin/users/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                fetchUsers();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openVault = async (user) => {
        setVaultUser(user);
        setIsVaultOpen(true);
        setLoadingVault(true);
        try {
            const res = await fetch(`${API_BASE}/admin/documents?user_id=${user.id}`);
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-7xl mx-auto pb-20 px-4 md:px-0">
            {/* Header section with Neural aesthetic */}
            <div className={`relative group overflow-hidden p-6 md:p-8 rounded-3xl transition-all duration-700 ${theme === 'dark' ? 'bg-secondary-darker text-white shadow-2xl shadow-black/40' : 'bg-white text-slate-900 border-2 border-slate-200 shadow-2xl shadow-slate-900/10'}`}>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                                <Users size={14} className="text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">User Management</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-4">
                            USER <span className="text-gradient uppercase">Registry</span>
                        </h1>
                        <p className={`max-w-md font-bold text-lg leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            Manage user accounts and their roles here.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-96 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                className={`w-full h-14 pl-16 pr-6 rounded-2xl border-none focus:ring-4 focus:ring-primary/10 outline-none font-bold text-sm transition-all ${theme === 'dark' ? 'bg-white/5 text-white focus:bg-white/10' : 'bg-slate-50 text-slate-900 focus:bg-white'}`}
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => setShowAddForm(!showAddForm)} variant={showAddForm ? 'danger' : 'primary'} className="rounded-2xl px-8 h-14 shadow-2xl hover:shadow-primary/20">
                            {showAddForm ? 'Cancel' : <><Plus size={20} className="mr-3" /> Add New User</>}
                        </Button>
                    </div>
                </div>
                {/* Background Decoration */}
                <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l pointer-events-none ${theme === 'dark' ? 'from-primary/10 to-transparent' : 'from-primary/5 to-transparent'}`} />
                <Users size={250} className="absolute -right-24 -bottom-24 opacity-[0.02] rotate-6 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
            </div>

            {/* Tab System */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className={`flex gap-2 p-2 rounded-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5' : 'bg-white border border-slate-100 shadow-xl shadow-primary/5'}`}>
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
                        label="Staff Members"
                        count={counts.staff}
                    />
                    <TabButton
                        active={activeTab === 'b2b'}
                        onClick={() => setActiveTab('b2b')}
                        icon={Briefcase}
                        label="Business B2B"
                        count={counts.b2b}
                    />
                </div>

                <div className={`px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 text-slate-400' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Database Active</span>
                </div>
            </div>

            {editingUser && (
                <Card className={`p-6 border-none rounded-3xl animate-in slide-in-from-top-6 duration-500 ${theme === 'dark' ? 'bg-secondary-darker shadow-black/40' : 'bg-white shadow-2xl shadow-blue-200/50'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-600 text-white rounded-2xl">
                            <User size={20} />
                        </div>
                        <h3 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Edit User Profile</h3>
                    </div>
                    <form onSubmit={handleEditUser} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Role</label>
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
                <Card className={`p-6 border-none rounded-3xl animate-in slide-in-from-top-6 duration-500 ${theme === 'dark' ? 'bg-secondary-darker shadow-black/40' : 'bg-white shadow-2xl shadow-indigo-200/50'}`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                            <Plus size={20} />
                        </div>
                        <h3 className={`text-xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Create New User</h3>
                    </div>
                    <form onSubmit={handleAddUser} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 ml-1">Role</label>
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
                                label="Password"
                                type="password"
                                placeholder="Set secure password"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" className="px-12 bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200">
                                Create User
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Main User Grid/Table */}
            <Card className="p-0 overflow-hidden relative border-none">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50/50'} border-b ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">User Details</th>
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Role</th>
                                {activeTab === 'customer' && <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Location</th>}
                                <th className="p-5 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme === 'dark' ? 'divide-white/5' : 'divide-slate-50'}`}>
                            {paginatedUsers.map(user => (
                                <tr key={user.id} className={`group transition-all duration-300 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-primary/5'}`}>
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/10 to-neural-indigo/10 flex items-center justify-center font-black text-primary text-base shadow-inner group-hover:scale-110 transition-transform">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className={`text-base font-black tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'} group-hover:text-primary transition-colors`}>{user.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: #{user.id.toString().padStart(6, '0')}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 w-fit ${user.role === 'admin' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : (user.role === 'staff' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20')}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.role === 'admin' ? 'bg-red-500' : (user.role === 'staff' ? 'bg-primary' : 'bg-emerald-500')}`} />
                                                {user.role}
                                            </span>
                                            <p className={`text-[9px] font-black tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{user.phone}</p>
                                        </div>
                                    </td>
                                    {activeTab === 'customer' && (
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                                <MapPin size={10} className="text-primary" /> {user.village || 'Undefined'}
                                            </div>
                                        </td>
                                    )}
                                    <td className="p-5">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                            <button onClick={() => openVault(user)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:bg-primary/20 hover:text-primary' : 'bg-slate-100 text-slate-600 hover:bg-primary hover:text-white shadow-lg shadow-primary/20'}`}>
                                                <FolderLock size={18} />
                                            </button>
                                            <button onClick={() => setEditingUser({ ...user, password: '' })} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-500' : 'bg-slate-100 text-slate-600 hover:bg-emerald-500 hover:text-white shadow-lg shadow-emerald-500/20'}`}>
                                                <Eye size={18} />
                                            </button>
                                            <button onClick={() => deleteUser(user.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-500' : 'bg-slate-100 text-slate-600 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/20'}`}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {paginatedUsers.length === 0 && (
                    <div className="p-20 text-center">
                        <Users size={80} className="mx-auto text-slate-200 dark:text-white/5 mb-6" />
                        <h4 className="text-2xl font-black text-slate-300 uppercase tracking-[0.2em]">No Users Found</h4>
                        <p className="text-slate-400 font-bold mt-2">No users found matching your search.</p>
                    </div>
                )}
                {filteredUsers.length > itemsPerPage && (
                    <div className={`p-8 border-t ${theme === 'dark' ? 'border-white/5 bg-white/[0.02]' : 'border-slate-50 bg-slate-50/30'}`}>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredUsers.length}
                        />
                    </div>
                )}
            </Card>

            {/* Identity Vault Drawer */}
            <Drawer
                isOpen={isVaultOpen}
                onClose={() => setIsVaultOpen(false)}
                title={`Documents: ${vaultUser?.name}`}
            >
                <div className="space-y-6 p-4">
                    <div className={`p-6 rounded-2xl relative overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-900 text-white'}`}>
                        <div className="relative z-10">
                            <h4 className="font-black text-xl mb-1 tracking-tighter uppercase">{vaultUser?.name}</h4>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{vaultUser?.role} STATUS: ACTIVE</p>
                        </div>
                        <FolderLock className="absolute -right-8 -bottom-8 opacity-10 text-primary" size={120} />
                    </div>

                    {loadingVault ? (
                        <div className="py-24 text-center">
                            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Loading Documents...</p>
                        </div>
                    ) : vaultDocs.length > 0 ? (
                        <div className="grid grid-cols-1 gap-5">
                            {vaultDocs.map(doc => (
                                <div key={doc.id} className={`p-6 border rounded-[2rem] flex items-center justify-between group transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary/5'}`}>
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <p className={`font-black text-sm uppercase tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{doc.type.replace('_', ' ')}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{doc.original_name || 'FILE'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <a
                                            href={`${API_BASE.replace('/api', '')}${doc.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-primary' : 'bg-white text-slate-400 hover:text-primary shadow-lg shadow-primary/10'}`}
                                        >
                                            <Eye size={20} />
                                        </a>
                                        <a
                                            href={`${API_BASE.replace('/api', '')}${doc.file_path}`}
                                            download
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${theme === 'dark' ? 'bg-white/5 text-slate-400 hover:text-emerald-500' : 'bg-white text-slate-400 hover:text-emerald-500 shadow-lg shadow-emerald-500/10'}`}
                                        >
                                            <Download size={20} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-white/5 shadow-inner">
                                <FolderLock size={36} className="text-slate-200 dark:text-white/10" />
                            </div>
                            <h4 className="text-xl font-black text-slate-300 uppercase tracking-widest">No Documents</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">No documents found for this user.</p>
                        </div>
                    )}
                </div>
            </Drawer>
        </div>
    );
}

const TabButton = ({ active, onClick, icon: Icon, label, count }) => {
    const { theme } = useTheme();
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black transition-all duration-500 select-none ${active
                ? (theme === 'dark' ? 'bg-white/10 text-white shadow-xl scale-105' : 'bg-slate-900 text-white shadow-xl scale-105')
                : (theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50')
                }`}
        >
            <Icon size={18} className={active ? 'text-primary' : ''} />
            <span className="text-[10px] uppercase tracking-[0.2em]">{label}</span>
            <span className={`text-[9px] px-2 py-0.5 rounded-full ${active ? 'bg-primary/20 text-primary-light' : 'bg-slate-200 dark:bg-white/5 text-slate-500'}`}>
                {count}
            </span>
        </button>
    );
};
