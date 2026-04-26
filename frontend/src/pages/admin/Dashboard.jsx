import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';
import { LogOut, Users, Calendar, Activity, TrendingUp, ShoppingCart, UserCheck, Stethoscope } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState({ appointments: 0, revenue: 0, doctors: 0, patients: 0 });
  const [allOrders, setAllOrders] = useState([]);
  const [allAppts, setAllAppts] = useState([]);
  const [allDoctors, setAllDoctors] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
     fetchAdminData();
     const interval = setInterval(fetchAdminData, 10000); // Live-ish update every 10 seconds
     return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
      try {
          const [aptRes, ordRes, docRes, patRes] = await Promise.all([
              axiosClient.get('appointments/'),
              axiosClient.get('pharmacy/orders/'),
              axiosClient.get('doctors/'),
              axiosClient.get('patients/'),
          ]);

          const appts = aptRes.data;
          const orders = ordRes.data;
          const docs = docRes.data;
          const pats = patRes.data;

          setAllAppts([...appts].reverse()); 
          setAllOrders([...orders].reverse());
          setAllDoctors(docs);
          setAllPatients(pats);

          const totalRev = orders.filter(o => o.status === 'delivered').reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
          
          setStats({
              appointments: appts.length,
              revenue: totalRev,
              doctors: docs.length,
              patients: pats.length
          });

          const dateCounts = {};
          appts.forEach(a => {
              const dateTokens = new Date(a.date).toLocaleDateString('en-US', {weekday: 'short'});
              dateCounts[dateTokens] = (dateCounts[dateTokens] || 0) + 1;
          });
          
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const semanticChart = days.map(d => ({ name: d, count: dateCounts[d] || 0 }));
          setChartData(semanticChart);

      } catch (err) {
          console.error("Error loading admin stats", err);
      }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <Activity className="w-6 h-6 text-primary mr-2" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition ${activeTab === 'overview' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <TrendingUp className="w-5 h-5 mr-3" /> System Overview
            </button>
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <Users className="w-5 h-5 mr-3" /> User Registry
            </button>
            <button onClick={() => setActiveTab('appointments')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition ${activeTab === 'appointments' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <Calendar className="w-5 h-5 mr-3" /> Appointment History
            </button>
            <button onClick={() => setActiveTab('ops')} className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition ${activeTab === 'ops' ? 'bg-primary/10 text-primary' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <ShoppingCart className="w-5 h-5 mr-3" /> Pharmacy OPS
            </button>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={logout} className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl w-full transition">
                <LogOut className="w-5 h-5 mr-3" /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h1>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary text-white flex justify-center items-center rounded-full font-bold">
                    S
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8">
            
            {activeTab === 'overview' && (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Appointments</p>
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.appointments}</h3>
                                </div>
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Calendar className="w-6 h-6"/></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Pharmacy Revenue</p>
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">₹{stats.revenue.toFixed(2)}</h3>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600"><TrendingUp className="w-6 h-6"/></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Registered Doctors</p>
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.doctors}</h3>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600"><Stethoscope className="w-6 h-6"/></div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">Total Patients</p>
                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stats.patients}</h3>
                                </div>
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl text-orange-600"><UserCheck className="w-6 h-6"/></div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Appointment Traffic (Weekly View)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorAppt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1D9E75" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="count" stroke="#1D9E75" strokeWidth={3} fillOpacity={1} fill="url(#colorAppt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'users' && (
                <div className="space-y-8">
                    {/* Doctors Table */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                         <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><Stethoscope className="mr-2 text-primary"/> Hospital Doctors</h3>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Doctor Name</th>
                                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Email</th>
                                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Specializations</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {allDoctors.length === 0 ? <tr><td colSpan="3" className="p-4 text-center">No doctors found.</td></tr> : allDoctors.map(doc => (
                                        <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                            <td className="px-6 py-4 font-black text-gray-800 dark:text-white flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold">
                                                    {doc.user?.first_name?.charAt(0) || 'D'}
                                                </div>
                                                Dr. {doc.user?.first_name} {doc.user?.last_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{doc.user?.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                                                    {doc.specializations || "Ayurvedic Practitioner"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>

                    {/* Patients Table */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                         <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><UserCheck className="mr-2 text-primary"/> Registered Patients</h3>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Patient Name</th>
                                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Email</th>
                                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Body Prakriti</th>
                                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Blood Group</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {allPatients.length === 0 ? <tr><td colSpan="4" className="p-4 text-center">No patients found.</td></tr> : allPatients.map(pat => (
                                        <tr key={pat.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                            <td className="px-6 py-4 font-medium dark:text-white flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex justify-center items-center font-bold text-sm">
                                                    {pat.user?.first_name?.charAt(0) || 'P'}
                                                </div>
                                                {pat.user?.first_name} {pat.user?.last_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{pat.user?.email}</td>
                                            <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200 uppercase text-sm tracking-wider">{pat.prakriti || 'N/A'}</td>
                                            <td className="px-6 py-4"><span className="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded font-bold">{pat.blood_group || 'O+'}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'appointments' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Hospital Booking Ledger</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Date & Slot</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Attending Doctor</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Patient</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {allAppts.length === 0 ? <tr><td colSpan="4" className="p-4 text-center">No bookings found.</td></tr> : allAppts.map(apt => (
                                    <tr key={apt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 font-medium dark:text-white">
                                            {apt.date}
                                            <span className="block text-xs text-gray-500 font-normal">{apt.time_slot}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 dark:text-gray-300 font-bold">Dr. {apt.doctor_details?.user?.first_name || 'Assigned'}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{apt.patient_details?.user?.first_name || 'Patient'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                apt.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                                (apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700')
                                            }`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}

            {activeTab === 'ops' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Pharmacy Operations History (POS)</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Transaction Date</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Reference #</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Buyer Contact</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Status</th>
                                    <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Capital</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {allOrders.length === 0 ? <tr><td colSpan="5" className="p-4 text-center">No operations found.</td></tr> : allOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 text-xs dark:text-gray-400">
                                            {new Date(order.created_at).toLocaleDateString()}
                                            <span className="block opacity-50">{new Date(order.created_at).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">
                                            ORD-{order.id.toString().padStart(4, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold dark:text-gray-200">{order.user_name || 'Patient'}</div>
                                            <div className="text-xs text-gray-500">{order.user_email}</div>
                                            {order.delivery_address && <div className="text-[10px] mt-1 text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1 rounded truncate max-w-[150px]" title={order.delivery_address}>📍 {order.delivery_address}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                                order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                                                (order.status === 'booked' ? 'bg-yellow-100 text-yellow-700' : 
                                                (order.status === 'accepted' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'))
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-primary font-black tracking-wide">₹{order.total_amount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
