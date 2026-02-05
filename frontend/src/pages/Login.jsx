import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Login() {
    const { theme, toggleTheme } = useTheme();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(phone, password);
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#070b14]' : 'bg-slate-50'}`}>
            <div className="absolute top-8 right-8">
                <button
                    onClick={toggleTheme}
                    className={`p-3 rounded-2xl transition-all shadow-lg ${theme === 'dark' ? 'bg-white/10 text-yellow-400 hover:bg-white/20' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <Card className="w-full max-w-md p-6 relative overflow-hidden group">
                {/* Background Decoration */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-all duration-1000 ${theme === 'dark' ? 'bg-blue-600/20 group-hover:bg-blue-600/30' : 'bg-blue-100/50 group-hover:bg-blue-100'}`} />

                <div className="text-center mb-8 relative z-10">
                    <h1 className={`text-3xl font-black tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        JASSI<span className="text-blue-600">PORTAL</span>
                    </h1>
                    <p className={`mt-2 font-bold uppercase text-[10px] tracking-[0.2em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Sign in to authorized node</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Phone Number"
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                    />

                    <Button type="submit" className="w-full" variant="primary">
                        Sign In
                    </Button>
                </form>

                <div className={`mt-8 text-center text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Don't have an account? <a href="/register" className="text-blue-500 hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4 transition-colors">Apply for node access</a>
                </div>
            </Card>
        </div>
    );
}
