import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Register() {
    const { theme, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({ name: '', phone: '', password: '', father_name: '', village: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        // ... previous logic ...
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                alert("Account created! Please login.");
                navigate('/login');
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (err) {
            setError("Server error. Try again later.");
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

            <Card className="w-full max-w-md p-8 relative overflow-hidden group">
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-all duration-1000 ${theme === 'dark' ? 'bg-indigo-600/20 group-hover:bg-indigo-600/30' : 'bg-blue-100/50 group-hover:bg-blue-100'}`} />

                <div className="text-center mb-10 relative z-10">
                    <h1 className={`text-4xl font-black tracking-tighter uppercase ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        JASSI<span className="text-blue-600">PORTAL</span>
                    </h1>
                    <p className={`mt-2 font-bold uppercase text-[10px] tracking-[0.2em] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>Create authorized node identity</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-xs font-black uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Father Name"
                            placeholder="S/O ..."
                            value={formData.father_name}
                            onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                        />
                        <Input
                            label="Village/Area"
                            placeholder="Location"
                            value={formData.village}
                            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="1234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <Button type="submit" className="w-full h-12 shadow-lg shadow-blue-100" variant="primary">
                        Sign Up
                    </Button>
                </form>

                <div className={`mt-8 text-center text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Already have an account? <a href="/login" className="text-blue-500 hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4 transition-colors">SignIn to Node</a>
                </div>
            </Card>
        </div>
    );
}
