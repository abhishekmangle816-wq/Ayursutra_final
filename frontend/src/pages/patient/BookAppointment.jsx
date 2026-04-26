import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';
import { Calendar as CalendarIcon, Clock, User as UserIcon, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function BookAppointment() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [therapies, setTherapies] = useState([]);
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        doctor: '',
        therapy: '',
        date: '',
        time_slot: '',
        notes: ''
    });

    useEffect(() => {
        // Fetch available doctors and therapies
        const fetchData = async () => {
            try {
                const [docRes, therRes] = await Promise.all([
                    axiosClient.get('doctors/'),
                    axiosClient.get('therapies/')
                ]);
                setDoctors(docRes.data);
                setTherapies(therRes.data);
            } catch (error) {
                console.error("Failed to load options", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Need patient profile ID! But backend is configured to use patient automatically if patient creates it?
            // Actually, appointment requires patient=id. Let's check serializer. If we don't have patient ID, backend perform_create needs to assign it.
            // In patients, a patient's own profile ID is fetched from 'patients/'.
            const pRes = await axiosClient.get('patients/');
            if(pRes.data.length === 0) {
               alert("Please complete your patient profile first!"); return;
            }
            const patientId = pRes.data[0].id; // We get our own profile
            
            await axiosClient.post('appointments/', {
                ...formData,
                patient: patientId
            });
            alert('Appointment Scheduled successfully!');
            navigate('/patient/dashboard');
        } catch (error) {
            console.error(error);
            alert('Error booking appointment.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <header className="bg-primary shadow-lg p-6 rounded-b-[3rem] mb-12">
                <div className="max-w-3xl mx-auto flex justify-between items-center text-white">
                    <Link to="/patient/dashboard" className="font-bold hover:underline">← Back to Dashboard</Link>
                    <h1 className="text-xl font-bold">Book Appointment</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4">
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
                    <div className="flex gap-4 mb-8">
                         <div className={`flex-1 pb-4 border-b-2 ${step>=1 ? 'border-primary text-primary' : 'border-gray-200 text-gray-400'} font-bold`}>1. Specialist</div>
                         <div className={`flex-1 pb-4 border-b-2 ${step>=2 ? 'border-primary text-primary' : 'border-gray-200 text-gray-400'} font-bold`}>2. Date & Time</div>
                         <div className={`flex-1 pb-4 border-b-2 ${step>=3 ? 'border-primary text-primary' : 'border-gray-200 text-gray-400'} font-bold`}>3. Confirm</div>
                    </div>

                    <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step+1); }}>
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block font-bold mb-2 dark:text-gray-200"><UserIcon className="inline mr-2 w-5 h-5"/> Select Doctor</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {doctors.map(d => (
                                            <div key={d.id} onClick={()=> setFormData({...formData, doctor: d.id})} 
                                                 className={`p-4 rounded-xl border-2 cursor-pointer transition ${formData.doctor === d.id ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'}`}>
                                                <p className="font-bold dark:text-white">Dr. {d.user?.first_name} {d.user?.last_name}</p>
                                                <p className="text-sm text-gray-500">{d.specialization}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <label className="block font-bold mb-2 dark:text-gray-200">Select Therapy (Optional)</label>
                                    <select name="therapy" value={formData.therapy} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                        <option value="">-- General Consultation --</option>
                                        {therapies.map(t => <option key={t.id} value={t.id}>{t.name} ({t.duration_minutes} min)</option>)}
                                    </select>
                                </div>
                                <button type="submit" disabled={!formData.doctor} className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-6 disabled:opacity-50">Next Step</button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block font-bold mb-2 dark:text-gray-200"><CalendarIcon className="inline mr-2 w-5 h-5"/> Choose Date</label>
                                    <input type="date" name="date" required value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                                </div>
                                <div>
                                    <label className="block font-bold mb-2 dark:text-gray-200"><Clock className="inline mr-2 w-5 h-5"/> Choose Time Slot</label>
                                    <select name="time_slot" required value={formData.time_slot} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                                        <option value="">Select Time</option>
                                        <option value="09:00:00">09:00 AM</option>
                                        <option value="10:00:00">10:00 AM</option>
                                        <option value="11:30:00">11:30 AM</option>
                                        <option value="14:00:00">02:00 PM</option>
                                        <option value="16:00:00">04:00 PM</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold mb-2 dark:text-gray-200">Symptoms / Notes</label>
                                    <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Describe symptoms briefly..."></textarea>
                                </div>
                                <div className="flex gap-4">
                                     <button type="button" onClick={()=> setStep(1)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl">Back</button>
                                     <button type="submit" disabled={!formData.date || !formData.time_slot} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl disabled:opacity-50">Review</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                             <div className="text-center space-y-6">
                                 <div className="flex justify-center text-primary mb-4"><CheckCircle className="w-16 h-16"/></div>
                                 <h2 className="text-2xl font-bold dark:text-white">Confirm Booking</h2>
                                 <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl text-left max-w-sm mx-auto">
                                     <p className="mb-2"><span className="text-gray-500">Date:</span> <strong className="dark:text-white">{formData.date}</strong></p>
                                     <p className="mb-2"><span className="text-gray-500">Time:</span> <strong className="dark:text-white">{formData.time_slot}</strong></p>
                                     <p className="mb-2"><span className="text-gray-500">Doctor:</span> <strong className="dark:text-white">{doctors.find(d=> d.id === formData.doctor)?.user?.first_name} {doctors.find(d=> d.id === formData.doctor)?.user?.last_name}</strong></p>
                                     {formData.therapy && <p className="mb-2"><span className="text-gray-500">Therapy:</span> <strong className="dark:text-white">{therapies.find(t=> t.id == formData.therapy)?.name}</strong></p>}
                                 </div>
                                 
                                <div className="flex gap-4 pt-4">
                                     <button type="button" onClick={()=> setStep(2)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl">Back</button>
                                     <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 rounded-xl">Confirm & Book</button>
                                </div>
                             </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
