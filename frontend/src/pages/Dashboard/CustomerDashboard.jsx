import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
    >
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white shadow-lg`}>
            <Icon size={24} />
        </div>
    </motion.div>
);

export default function CustomerDashboard() {
    const navigate = useNavigate();

    // Mock Data
    const activeOrders = [
        { id: 1201, service: "PAN Card Update", status: "Processing", date: "2024-02-01", progress: 60 },
        { id: 1205, service: "Passport Seva", status: "Action Required", date: "2024-02-02", progress: 30 },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome back, User!</h1>
                    <p className="text-slate-500 mt-1">Here is what's happening with your services.</p>
                </div>
                <button
                    onClick={() => navigate('/services')}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 flex items-center gap-2"
                >
                    New Service <ArrowRight size={16} />
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Orders" value="2" icon={Package} color="bg-blue-500" />
                <StatCard title="Pending Action" value="1" icon={AlertTriangle} color="bg-orange-500" />
                <StatCard title="Completed" value="14" icon={CheckCircle} color="bg-green-500" />
                <StatCard title="Wallet Balance" value="₹450" icon={Clock} color="bg-purple-500" />
            </div>

            {/* Active Services List */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Active Applications</h3>
                </div>
                <div className="divide-y divide-slate-50">
                    {activeOrders.map(order => (
                        <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                    {order.service.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{order.service}</h4>
                                    <p className="text-sm text-slate-500">Order #{order.id} • Applied on {order.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-32">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-slate-600">{order.status}</span>
                                        <span className="text-slate-400">{order.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${order.status === 'Action Required' ? 'bg-orange-500' : 'bg-blue-500'}`}
                                            style={{ width: `${order.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
