import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { Send, User, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';

export const OrderChat = ({ orderId }) => {
    const { user } = useAuth();
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

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        <div className="flex flex-col h-[500px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, idx) => {
                    const isMe = m.sender_id === user?.id;
                    return (
                        <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                                <p className="text-sm font-medium">{m.message}</p>
                                <span className={`text-[10px] mt-1 block opacity-60 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                {messages.length === 0 && !loading && (
                    <div className="text-center py-10 opacity-40">
                        <Bot size={40} className="mx-auto mb-2" />
                        <p className="text-sm">No messages yet. Send one to start the conversation!</p>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-medium"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};
