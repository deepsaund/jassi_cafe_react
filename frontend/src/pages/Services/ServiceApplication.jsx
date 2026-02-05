import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import Modal from '../../components/UI/Modal';

export default function ServiceApplication() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isVaultOpen, setIsVaultOpen] = useState(false);

    // Mock Vault Items
    const [vaultDocs, setVaultDocs] = useState([
        { id: 101, name: "My Aadhaar Card", type: "aadhaar", date: "2024-01-15" },
        { id: 102, name: "Old PAN", type: "pan", date: "2023-11-20" },
    ]);

    const handleVaultSelect = (doc) => {
        console.log("Selected from vault:", doc);
        setIsVaultOpen(false);
        // Set form data logic here
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <button onClick={() => navigate('/services')} className="text-sm text-slate-500 hover:text-blue-600 mb-2">&larr; Back to Services</button>
                <h1 className="text-3xl font-bold text-slate-900">Apply for Service #{id}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <div className={`h-2 w-20 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                    <div className={`h-2 w-20 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                    <div className={`h-2 w-20 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Step 1: Basic Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Enter your name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input type="number" className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none" placeholder="9876543210" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700">Next Step</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold">Step 2: Upload Documents</h2>

                        {/* The Magic Feature */}
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                            <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-semibold text-blue-900">Found 2 Documents in Vault</h4>
                                <p className="text-sm text-blue-700 mt-1">Check your vault before uploading new files to save time.</p>
                                <button onClick={() => setIsVaultOpen(true)} className="mt-3 text-sm font-semibold text-blue-800 underline">Open Vault</button>
                            </div>
                        </div>

                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
                            <Upload className="text-slate-400 mb-2" size={32} />
                            <p className="text-slate-600 font-medium">Click to upload Aadhaar Card</p>
                            <p className="text-slate-400 text-xs mt-1">JPG, PNG or PDF (Max 5MB)</p>
                        </div>

                        <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(1)} className="text-slate-500 font-medium">Back</button>
                            <button onClick={() => setStep(3)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700">Proceed to Payment</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center py-10">
                        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-slate-800">Application Ready!</h2>
                        <p className="text-slate-500 mt-2">Pay ₹200 to convert this application into an active order.</p>
                        <button className="mt-6 bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200">Pay via Wallet / UPI</button>
                    </div>
                )}
            </div>

            <Modal isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} title="Select from Vault">
                <div className="space-y-3">
                    {vaultDocs.map(doc => (
                        <div key={doc.id} onClick={() => handleVaultSelect(doc)} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                                <FileText className="text-blue-500" size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-800">{doc.name}</h4>
                                <p className="text-xs text-slate-500">Uploaded on {doc.date}</p>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                {/* Checkmark logic if selected */}
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}
