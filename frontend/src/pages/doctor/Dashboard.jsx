import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';
import { Calendar as CalendarIcon, Users, Clock, LogOut, CheckCircle, UserCheck, ShoppingBag, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLocalDateString } from '../../utils/dateUtils';

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ todayAppts: 0, totalPatients: 0 });
  const [pharmacyItems, setPharmacyItems] = useState([]);
  
  // Prescribe Modal State
  const [prescribeModalApt, setPrescribeModalApt] = useState(null);
  const [selectedHerb, setSelectedHerb] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
     const fetchData = async () => {
         try {
             const [apptsRes, patientsRes, itemsRes] = await Promise.all([
                 axiosClient.get('appointments/'),
                 axiosClient.get('patients/'),
                 axiosClient.get('pharmacy/items/')
             ]);
             setAppointments(apptsRes.data);
             setPharmacyItems(itemsRes.data);
             
             const today = getLocalDateString();
             // Include all statuses for today except 'cancelled' for the KPI count
             const todays = apptsRes.data.filter(a => a.date === today && a.status !== 'cancelled');
             setStats({
                 todayAppts: todays.length,
                 totalPatients: patientsRes.data.length
             });
         } catch (e) {
             console.error(e);
         }
     }
     fetchData();
  }, []);

  const handleComplete = async (id) => {
      try {
          await axiosClient.patch(`appointments/${id}/`, { status: 'completed' });
          const res = await axiosClient.get('appointments/');
          setAppointments(res.data);
          const todays = res.data.filter(a => a.date === getLocalDateString() && a.status !== 'cancelled');
          setStats(prev => ({...prev, todayAppts: todays.length}));
      } catch (err) {
          alert('Failed to complete visit. ' + err);
      }
  };

  const submitPrescription = async () => {
      if (!selectedHerb) return alert("Please select a medicine/herb");
      try {
          const payload = {
              appointment: prescribeModalApt.id,
              herbs: [parseInt(selectedHerb)],
              notes: notes
          };
          await axiosClient.post('pharmacy/prescriptions/', payload);
          alert("Prescription added successfully!");
          setPrescribeModalApt(null);
          setSelectedHerb('');
          setNotes('');
      } catch(err) {
          alert("Failed to add prescription.");
      }
  };

  const upcoming = appointments.filter(a => a.status !== 'completed');
  const pastHistory = appointments.filter(a => a.status === 'completed');
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
       {/* Sidebar */}
       <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold text-gray-800 dark:text-white">Dr. Workspace</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <Link to="/doctor/dashboard" className="flex items-center px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
                 Dashboard
            </Link>
            <Link to="/doctor/patients" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                My Patients
            </Link>
            <Link to="/pharmacy-store" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                <ShoppingBag className="w-4 h-4 mr-2"/> Pharmacy Store
            </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={logout} className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl w-full transition">
                <LogOut className="w-5 h-5 mr-3" /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Welcome, Dr. {user?.last_name || 'Vaidya'}</h1>
            <div className="flex gap-4">
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> Available</span>
            </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center"><CalendarIcon /></div>
                        <h3 className="text-3xl font-bold dark:text-white">{stats.todayAppts}</h3>
                    </div>
                    <p className="text-gray-500 font-medium">Today's Appointments</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Users /></div>
                        <h3 className="text-3xl font-bold dark:text-white">{stats.totalPatients}</h3>
                    </div>
                    <p className="text-gray-500 font-medium">Total Patients</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Clock /></div>
                        <h3 className="text-3xl font-bold dark:text-white">30m</h3>
                    </div>
                    <p className="text-gray-500 font-medium">Avg Consultation time</p>
                </div>
             </div>

             {/* Schedule list */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold dark:text-white mb-6">Upcoming Appointments</h3>
                <div className="space-y-4">
                    {upcoming.length === 0 ? <p className="text-gray-500">No appointments scheduled.</p> : upcoming.map((apt) => (
                        <div key={apt.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition gap-4">
                            <div className="flex items-center gap-6 border-l-4 border-primary pl-4">
                                <div className="text-lg font-bold text-primary">{apt.time_slot.substring(0,5)}<br/><span className="text-xs text-gray-400">{apt.date}</span></div>
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-white">{apt.patient_details?.user?.first_name} {apt.patient_details?.user?.last_name}</h4>
                                    <div className="text-sm text-gray-500 flex gap-2 mt-1 items-center">
                                        <span className="bg-gray-200 dark:bg-gray-600 px-2 rounded-md uppercase text-xs">{apt.patient_details?.prakriti || 'VATA'}</span>
                                        <span>• {apt.therapy_details?.name || 'General Consult'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setPrescribeModalApt(apt)} className="bg-primary text-white border border-transparent hover:bg-primary-dark px-4 py-2 rounded-xl font-medium transition shadow-sm flex flex-center gap-2 items-center">
                                    <FileText className="w-4 h-4"/> Write Prescription
                                </button>
                                <button onClick={() => handleComplete(apt.id)} className="bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 hover:bg-green-500 hover:text-white px-4 py-2 rounded-xl font-medium transition shadow-sm flex flex-center gap-2 items-center">
                                    <CheckCircle className="w-4 h-4"/> Complete Process
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Patient History */}
             <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-8 overflow-hidden">
                <h3 className="text-xl font-bold dark:text-white mb-6">Patient Visit History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-300">Date</th>
                                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-300">Patient</th>
                                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-300">Reason / Therapy</th>
                                <th className="px-4 py-3 font-bold text-gray-600 dark:text-gray-300">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {pastHistory.map(hist => (
                                <tr key={hist.id}>
                                    <td className="px-4 py-3 text-sm dark:text-gray-300">{hist.date}</td>
                                    <td className="px-4 py-3 font-bold dark:text-white">{hist.patient_details?.user?.first_name} {hist.patient_details?.user?.last_name}</td>
                                    <td className="px-4 py-3 text-sm dark:text-gray-300">{hist.therapy_details?.name || 'General Query'}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-2.5 py-1 rounded-md text-xs font-bold uppercase">Completed</span>
                                    </td>
                                </tr>
                            ))}
                            {pastHistory.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">No past history found.</td></tr>}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
      </main>

      {/* Prescription Modal */}
      {prescribeModalApt && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
                  <button onClick={() => setPrescribeModalApt(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                      <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl font-bold dark:text-white mb-2">Write Prescription</h2>
                  <p className="text-gray-500 mb-6 text-sm">For: {prescribeModalApt.patient_details?.user?.first_name} {prescribeModalApt.patient_details?.user?.last_name}</p>

                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Medicine</label>
                          <select 
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            value={selectedHerb}
                            onChange={(e) => setSelectedHerb(e.target.value)}
                          >
                              <option value="">-- Choose Medicine --</option>
                              {pharmacyItems.map(item => (
                                  <option key={item.id} value={item.id}>{item.name}</option>
                              ))}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Dosage Instructions</label>
                          <textarea 
                            rows="3"
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                            placeholder="e.g. 1 capsule daily after meals"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          ></textarea>
                      </div>
                      <button onClick={submitPrescription} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg mt-4 transition">
                          Submit Prescription
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
