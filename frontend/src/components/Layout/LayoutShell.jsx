import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, FileText, Wallet, Settings, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Fixed import path
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active ? 'bg-accent/10 text-accent font-semibold shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <Icon size={20} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span>{label}</span>
        {active && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-8 bg-accent rounded-r-full" />}
    </Link>
);

export default function LayoutShell() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    // Default links (Customer)
    const links = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/services', icon: FileText, label: 'Services' },
        { to: '/wallet', icon: Wallet, label: 'Wallet' },
        { to: '/profile', icon: User, label: 'Profile' },
    ];

    if (user?.role === 'staff') { // Add staff links if needed
        // links.push(...) 
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-white shadow-xl z-20">
                <div className="p-6 border-b border-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-accent to-purple-500 rounded-lg animate-pulse"></div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Jassi Cafe</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map(link => (
                        <SidebarLink key={link.to} {...link} active={location.pathname === link.to} />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                    {user && (
                        <div className="mt-4 flex items-center gap-3 px-4">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">{user.name}</span>
                                <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-50 md:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 flex justify-between items-center border-b border-slate-800">
                                <span className="text-xl font-bold text-white">Jassi Cafe</span>
                                <button onClick={() => setIsMobileOpen(false)}><X className="text-slate-400" /></button>
                            </div>
                            <nav className="p-4 space-y-2 flex-1">
                                {links.map(link => (
                                    <SidebarLink key={link.to} {...link} active={location.pathname === link.to} />
                                ))}
                            </nav>
                            <div className="p-4 border-t border-slate-800">
                                <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400">
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center px-4 justify-between shadow-sm z-10">
                    <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"><Menu /></button>
                    <span className="font-bold text-slate-800">Jassi Cafe</span>
                    <div className="w-8"></div>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8 relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
