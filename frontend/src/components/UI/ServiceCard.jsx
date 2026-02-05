import { ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServiceCard({ service, onApply }) {
    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <FileText size={24} />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                    ₹{service.price_normal}
                </span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">{service.name}</h3>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2">{service.description || "Quick and easy application process."}</p>

            <button
                onClick={() => onApply(service.id)}
                className="w-full py-3 px-4 bg-slate-50 text-slate-700 font-medium rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
            >
                Apply Now <ArrowRight size={16} />
            </button>
        </motion.div>
    );
}
