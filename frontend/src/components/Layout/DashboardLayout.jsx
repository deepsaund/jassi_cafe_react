import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    FileText,
    User,
    LogOut,
    Settings,
    Bell,
    ClipboardList,
    Package,
    FileSpreadsheet,
    Menu,
    X,
    Zap,
    Cpu,
    LayoutGrid,
    ShieldCheck,
    Moon,
    Sun,
    Database,
    PhoneCall,
    MessageCircle
} from 'lucide-react';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

const SidebarItem = ({ icon: Icon, label, onClick, active }) => {
    const { theme } = useTheme();
    return (
        <button
            onClick={onClick}
            className={`w-[90%] mx-auto flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${active
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                : theme === 'dark'
                    ? 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
        >
            {/* Active Indicator Bar */}
            {active && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            )}

            <Icon size={20} className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`} />
            <span className={`font-bold text-xs uppercase tracking-[0.15em] transition-all duration-500 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 group-hover:tracking-[0.2em]'}`}>
                {label}
            </span>

            {/* Subtle Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>
    );
};

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [broadcast, setBroadcast] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/admin/settings`)
            .then(res => res.json())
            .then(data => {
                if (data.global_broadcast_status === 'enabled' && data.global_broadcast_message) {
                    setBroadcast(data.global_broadcast_message);
                }
            })
            .catch(err => console.error("Broadcast fetch error:", err));
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navContent = (
        <div className={`flex flex-col h-full border-r ${theme === 'dark' ? 'bg-[#0a0f1c] border-white/5' : 'bg-white border-slate-100'} relative overflow-hidden`}>
            {/* Background Neural Grid (Visual Only) */}
            <div className={`absolute inset-0 opacity-[0.02] pointer-events-none ${theme === 'dark' ? 'bg-[radial-gradient(#3b82f6_1px,transparent_1px)]' : 'bg-[radial-gradient(#2563eb_1px,transparent_1px)]'} [background-size:20px_20px]`} />

            <div className="p-8 relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:rotate-12 transition-transform duration-500">
                        <Cpu size={22} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className={`text-xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'} tracking-tighter leading-none`}>JASSI<span className="text-blue-500 font-black">PORTAL</span></h2>
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-1 opacity-60">Customer Hub</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar relative z-10 pt-4">
                <div className="px-8 mb-4">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em]">Main Menu</p>
                </div>

                <SidebarItem icon={LayoutGrid} label="Home" active={isActive('/dashboard')} onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} />
                <SidebarItem icon={FileText} label="Services" active={isActive('/dashboard/services')} onClick={() => { navigate('/dashboard/services'); setMobileMenuOpen(false); }} />
                <SidebarItem icon={Database} label="Document Vault" active={isActive('/dashboard/vault')} onClick={() => { navigate('/dashboard/vault'); setMobileMenuOpen(false); }} />
                <SidebarItem icon={Bell} label="Notifications" active={isActive('/dashboard/notifications')} onClick={() => { navigate('/dashboard/notifications'); setMobileMenuOpen(false); }} />

                {user?.role === 'b2b' && (
                    <SidebarItem icon={FileSpreadsheet} label="Bulk Portal" active={isActive('/dashboard/bulk')} onClick={() => { navigate('/dashboard/bulk'); setMobileMenuOpen(false); }} />
                )}

                <div className="pt-6 pb-2 space-y-2">
                    <div className="px-8 mb-4">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em]">Account</p>
                    </div>
                    <SidebarItem icon={User} label="Profile" active={isActive('/dashboard/profile')} onClick={() => { navigate('/dashboard/profile'); setMobileMenuOpen(false); }} />
                </div>

                {(user?.role === 'staff' || user?.role === 'admin') && (
                    <div className="pt-6 pb-2 space-y-2">
                        <div className="px-8 mb-4">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em]">Work Area</p>
                        </div>
                        <SidebarItem icon={ShieldCheck} label="Staff Hub" active={location.pathname.includes('/staff')} onClick={() => { navigate('/dashboard/staff'); setMobileMenuOpen(false); }} />
                    </div>
                )}

                {user?.role === 'admin' && (
                    <div className="pt-6 pb-2 space-y-2">
                        <div className="px-8 mb-4">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em]">Admin Area</p>
                        </div>
                        <SidebarItem icon={Settings} label="Admin Console" active={location.pathname.includes('/admin')} onClick={() => { navigate('/dashboard/admin'); setMobileMenuOpen(false); }} />
                    </div>
                )}

                <div className="pt-6 pb-2 space-y-2">
                    <div className="px-8 mb-4">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.25em]">Help & Support</p>
                    </div>
                    <SidebarItem icon={PhoneCall} label="Get Help" active={false} onClick={() => window.open('https://wa.me/91999999999', '_blank')} />
                </div>
            </nav>

            {/* User Agent Card */}
            <div className="p-6 relative z-10">
                <div className={`backdrop-blur-md rounded-3xl p-5 border group transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 hover:border-blue-500/20' : 'bg-slate-50 border-slate-200 hover:border-blue-500/10'}`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 flex items-center justify-center text-white font-black shadow-lg">
                                {user?.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0a0f1c] rounded-full animate-pulse" title="Online" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className={`text-sm font-black truncate tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user?.name || 'User'}</p>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest leading-none">{user?.role || 'Guest'}</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`w-full py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 group/logout ${theme === 'dark'
                            ? 'bg-red-500/5 hover:bg-red-500/10 text-red-400 border-red-500/10 hover:border-red-500/30'
                            : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-100 hover:border-red-200'
                            }`}
                    >
                        <LogOut size={14} className="group-hover/logout:translate-x-0.5 group-hover/logout:-translate-y-0.5 transition-transform" />
                        Terminate Session
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`flex h-screen font-sans selection:bg-primary/30 transition-colors duration-500 ${theme === 'dark' ? 'bg-background-dark text-slate-300' : 'bg-background-light text-slate-900'}`}>
            {/* Desktop Sidebar */}
            <aside className="w-80 hidden md:flex flex-col z-30">
                {navContent}
            </aside>

            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
                <div className={`absolute inset-0 transition-opacity duration-500 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0'} ${theme === 'dark' ? 'bg-slate-950/80 backdrop-blur-md' : 'bg-slate-900/40 backdrop-blur-sm'}`} onClick={() => setMobileMenuOpen(false)} />
                <aside className={`relative w-80 h-full shadow-2xl flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {navContent}
                </aside>
            </div>

            {/* Main Content Pane */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Mobile Header Overlay */}
                <header className={`px-6 py-4 flex md:hidden items-center justify-between border-b backdrop-blur-xl z-20 ${theme === 'dark' ? 'border-white/5 bg-secondary-darker/80 text-white' : 'border-slate-200 bg-white/80 text-slate-900'}`}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileMenuOpen(true)} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-900'}`}>
                            <Menu size={20} />
                        </button>
                        <span className="font-black text-lg tracking-tighter uppercase whitespace-nowrap">JASSI<span className="text-primary">PORTAL</span></span>
                    </div>
                </header>

                <div className="flex-1 overflow-auto custom-scrollbar relative px-4 md:px-0">
                    {/* Floating Broadcast - Only if exists */}
                    {broadcast && (
                        <div className="sticky top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 animate-in fade-in zoom-in duration-500">
                            <div className={`backdrop-blur-2xl border p-4 rounded-[2.5rem] shadow-2xl flex items-center gap-4 group ${theme === 'dark' ? 'bg-gradient-to-r from-primary/20 via-neural-indigo/20 to-neural-cyan/20 border-white/10 text-white' : 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-100 text-blue-900'}`}>
                                <div className={`p-3 rounded-2xl border ${theme === 'dark' ? 'bg-primary/20 border-primary/20' : 'bg-primary/10 border-blue-200'}`}>
                                    <Bell size={18} className={`${theme === 'dark' ? 'text-primary-light' : 'text-primary'} animate-[bounce_2s_infinite]`} />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-0.5 ${theme === 'dark' ? 'text-primary-light drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-primary'}`}>System Notification</p>
                                    <p className={`text-sm font-bold tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{broadcast}</p>
                                </div>
                                <button className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/5'}`} onClick={() => setBroadcast(null)}>
                                    <X size={18} className="opacity-50 hover:opacity-100" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Floating WhatsApp Support Button */}
                    <button
                        onClick={() => window.open('https://wa.me/91999999999', '_blank')}
                        className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden ${theme === 'dark' ? 'bg-[#25D366] text-white shadow-[#25D366]/20' : 'bg-[#25D366] text-white shadow-[#25D366]/40'}`}
                    >
                        <div className="relative z-10 flex items-center gap-2">
                            <MessageCircle size={24} />
                            <span className="font-black text-xs uppercase tracking-widest max-w-0 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">Chat with Us</span>
                        </div>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>

                    {/* The Page Content Slot */}
                    <div className="p-4 md:p-8 lg:p-10 min-h-screen">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
