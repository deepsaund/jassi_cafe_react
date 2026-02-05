import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';
import { useTheme } from '../../context/ThemeContext';

export const OrderChat = ({ orderId }) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    const fetchMessages = () => {
        fetch(`${API_BASE}/orders/messages?order_id=${orderId}`, {
            headers: { 'Authorization': `mock_token_${user?.id}` }
        })
            .then(res => res.json())
            .then(data => {
                setMessages(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [orderId]);

    // Removed auto-scroll on message updates to allow user to read history without jumping

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = newMessage;
        setNewMessage('');

        try {
            const res = await fetch(`${API_BASE}/orders/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `mock_token_${user?.id}`
                },
                body: JSON.stringify({ order_id: orderId, message: msg })
            });
            if (res.ok) fetchMessages();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={`flex flex-col h-[600px] rounded-[2rem] overflow-hidden border transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 border-white/5 shadow-inner' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                {messages.map((m, idx) => {
                    const isMe = m.sender_id === user?.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl shadow-xl transition-all hover:scale-[1.02] ${isMe
                                ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/10'
                                : (theme === 'dark' ? 'bg-white/10 text-slate-200 border border-white/5 rounded-tl-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none')
                                }`}>
                                <p className="text-xs font-bold leading-relaxed">{m.message}</p>
                                <span className={`text-[9px] mt-2 block font-black uppercase tracking-widest opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {messages.length === 0 && !loading && (
                    <div className="text-center py-20 opacity-20">
                        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed ${theme === 'dark' ? 'border-white/10' : 'border-slate-300'}`}>
                            <Bot size={32} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Neural Link Empty</p>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className={`p-4 flex gap-3 border-t ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100'}`}>
                <input
                    type="text"
                    placeholder="Dispatch message..."
                    className={`flex-1 rounded-xl px-5 py-3 text-xs font-bold outline-none transition-all ${theme === 'dark'
                        ? 'bg-white/5 border border-white/5 text-white focus:border-blue-500/50'
                        : 'bg-slate-50 border border-slate-100 text-slate-900 focus:border-blue-300'}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};
