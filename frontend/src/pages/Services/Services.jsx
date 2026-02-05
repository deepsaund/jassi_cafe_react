import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ServiceCard from '../../components/UI/ServiceCard';
import axios from 'axios';

// Mock Data for fallback
const MOCK_SERVICES = [
    { id: 1, name: "PAN Card (New)", price_normal: 200, description: "Apply for a new Permanent Account Number." },
    { id: 2, name: "Aadhaar Update", price_normal: 100, description: "Update your address or demographics." },
    { id: 3, name: "Passport Seva", price_normal: 1500, description: "Fresh or Re-issue passport application." },
    { id: 4, name: "Driving License", price_normal: 500, description: "Learner or Permanent license application." },
    { id: 5, name: "Voter ID", price_normal: 50, description: "New voter registration or correction." },
    { id: 6, name: "Income Certificate", price_normal: 150, description: "State government income proof." },
];

export default function Services() {
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch services from API
        const fetchServices = async () => {
            try {
                // const res = await axios.get('/api/services');
                // setServices(res.data);

                // Simulating API delay and fallback
                setTimeout(() => {
                    setServices(MOCK_SERVICES);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Failed to fetch services", error);
                setServices(MOCK_SERVICES); // Fallback
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApply = (id) => {
        console.log("Apply for service", id);
        // Navigate to Application Form
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Our Services</h1>
                    <p className="text-slate-500 mt-1">Select a service to get started immediately.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for services..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map(service => (
                        <ServiceCard key={service.id} service={service} onApply={handleApply} />
                    ))}
                </div>
            )}
        </div>
    );
}
