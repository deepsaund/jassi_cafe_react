import { useState, useEffect } from 'react';
import { Search, Filter, UserPlus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_TASKS = [
    { id: 1210, customer: "Rahul Kumar", service: "Aadhaar Update", time: "10 mins ago", status: "received" },
    { id: 1211, customer: "Sita Devi", service: "PAN Card (New)", time: "25 mins ago", status: "received" },
    { id: 1212, customer: "Amit Singh", service: "Passport Seva", time: "1 hour ago", status: "received" },
];

export default function TaskPool() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPool = () => {
        fetch('/api/staff/orders')
            .then(res => res.json())
            .then(data => {
                setTasks(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPool();
        const interval = setInterval(fetchPool, 10000); // Refresh pool every 10s
        return () => clearInterval(interval);
    }, []);

    const handleClaim = async (taskId) => {
        try {
            const res = await fetch('/api/staff/orders/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: taskId, action: 'claim' })
            });
            const data = await res.json();
            if (res.ok) {
                // Navigate to verification page
                navigate(`/dashboard/staff/verify/${taskId}`);
            } else {
                alert(data.error || "Failed to claim task");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Open Task Pool</h1>
                    <p className="text-slate-500 mt-2 font-medium">Claims new orders and start processing them.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID or Name..."
                            className="pl-12 pr-4 py-3 w-72 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium bg-white shadow-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="p-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Order Details</th>
                            <th className="p-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Service Type</th>
                            <th className="p-6 font-bold text-slate-400 text-xs uppercase tracking-widest">Time Received</th>
                            <th className="p-6 font-bold text-slate-400 text-xs uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            <tr><td colSpan="4" className="p-20 text-center text-slate-400">Loading tasks...</td></tr>
                        ) : tasks.length > 0 ? tasks.map(task => (
                            <tr key={task.id} className="hover:bg-blue-50/30 transition-all group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">#{task.id}</div>
                                        <div>
                                            <p className="font-bold text-slate-800">{task.customer_name}</p>
                                            <p className="text-xs text-slate-400 font-medium">{task.customer_phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black ring-1 ring-blue-100 shadow-sm">
                                        {task.service_name}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                                        <Clock size={16} className="text-slate-300" />
                                        {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <button
                                        onClick={() => handleClaim(task.id)}
                                        className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 flex items-center gap-2 ml-auto"
                                    >
                                        <UserPlus size={16} /> Claim Task
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="p-20 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                                        <Search size={40} />
                                    </div>
                                    <h3 className="text-slate-900 font-bold text-lg">Empty Queue</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">Sit back! All customer requests have been claimed.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
