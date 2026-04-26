import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';
import { ShoppingBag, Search, PlusCircle, ShoppingCart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PharmacyStore() {
  const { user, logout } = useAuthStore();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [billModal, setBillModal] = useState(null);
  
  // Doctor states
  const [appointments, setAppointments] = useState([]);
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [itemToPrescribe, setItemToPrescribe] = useState(null);
  const [selectedAptId, setSelectedAptId] = useState('');
  const [prescriptionNotes, setNotes] = useState('');

  useEffect(() => {
    fetchItems();
    if (user?.role === 'doctor') {
        fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
        const res = await axiosClient.get('appointments/');
        setAppointments(res.data);
    } catch(e) { console.error(e) }
  };

  const fetchItems = async () => {
    try {
      const response = await axiosClient.get('pharmacy/items/');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching pharmacy items:', error);
    }
  };

  const handleAction = async (item) => {
    if (user?.role === 'doctor') {
        setItemToPrescribe(item);
        setShowPrescribeModal(true);
        return;
    }

    try {
      const isPharmacy = user?.role === 'pharmacy';
      const orderPayload = { order_items: [{ item: item.id, quantity: 1 }] };
      const response = await axiosClient.post('pharmacy/orders/', orderPayload);
      
      setBillModal(response.data);
      if (isPharmacy) {
          // Instantly fulfill it if pharmacy admin sells it at POS
          await axiosClient.post(`pharmacy/orders/${response.data.id}/fulfill/`);
          alert('POS Sale Completed! Stock Deducted.');
      } else {
          alert('Order Placed! Waiting for Pharmacy to Fulfill.');
      }
      fetchItems(); // refresh stock
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error connecting to backend.');
    }
  };

  const handlePrescribeSubmit = async () => {
      if (!selectedAptId) return alert('Select a patient appointment');
      try {
          await axiosClient.post('pharmacy/prescriptions/', {
              appointment: selectedAptId,
              herbs: [itemToPrescribe.id],
              notes: prescriptionNotes
          });
          alert(`Prescribed ${itemToPrescribe.name} successfully!`);
          setShowPrescribeModal(false);
          setNotes('');
      } catch (err) {
          alert('Failed to prescribe. Ensure appointment does not already have a prescription or check backend.');
      }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <header className="bg-primary shadow-lg p-6 rounded-b-[3rem] mb-12">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-white">
          {user?.role !== 'pharmacy' ? (
              <Link to={user?.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} className="font-bold hover:underline">
                ← Back to Dashboard
              </Link>
          ) : (
              <button onClick={logout} className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-xl transition font-medium flex items-center text-sm">
                 <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
          )}
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag /> AyurSutra Pharmacy
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold dark:text-white">Medicines & Wellness</h2>
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
             <input 
               type="text" 
               placeholder="Search products..." 
               className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full transition hover:shadow-md">
              <div className="flex-1">
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-3 inline-block">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.quantity} {item.unit} available</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="font-extrabold text-lg dark:text-white">₹{item.price_per_unit}</span>
                <button 
                  onClick={() => handleAction(item)}
                  className="bg-primary hover:bg-primary-dark text-white rounded-xl p-2 transition flex items-center gap-1 text-sm font-bold shadow-md"
                >
                  {user?.role === 'doctor' ? <><PlusCircle className="w-4 h-4"/> Prescribe</> : (user?.role === 'pharmacy' ? <><ShoppingBag className="w-4 h-4"/> POS Sell</> : <><ShoppingCart className="w-4 h-4"/> Buy</>)}
                </button>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products found matching your search.
            </div>
          )}
        </div>
      </main>

      {/* Bill / Receipt Modal */}
      {billModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl">
                <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                    <h2 className="text-2xl font-bold dark:text-white">AyurSutra Pharmacy</h2>
                    <p className="text-gray-500">Official Receipt</p>
                </div>
                
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Order ID:</span> <span className="font-bold dark:text-gray-200">#{billModal.id}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Date:</span> <span className="font-bold dark:text-gray-200">{new Date(billModal.created_at).toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500">Patient:</span> <span className="font-bold dark:text-gray-200">{user?.first_name} ({user?.email})</span></div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-6">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-gray-600 dark:text-gray-300">Item</th>
                                <th className="px-4 py-2 text-gray-600 dark:text-gray-300 text-right">Qty</th>
                                <th className="px-4 py-2 text-gray-600 dark:text-gray-300 text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {billModal.items?.map((orderItem, idx) => (
                                <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                                    <td className="px-4 py-3 dark:text-gray-200">{orderItem.item_details?.name}</td>
                                    <td className="px-4 py-3 text-right dark:text-gray-200">{orderItem.quantity}</td>
                                    <td className="px-4 py-3 text-right dark:text-gray-200">₹{orderItem.price_at_purchase}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center text-lg font-bold dark:text-white border-t-2 border-gray-200 dark:border-gray-700 pt-4 mb-8">
                    <span>Total Amount</span>
                    <span className="text-primary text-2xl">₹{billModal.total_amount}</span>
                </div>

                <button onClick={() => setBillModal(null)} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg transition">
                    Close Receipt
                </button>
            </div>
        </div>
      )}

      {/* Doctor Prescribe Modal */}
      {showPrescribeModal && itemToPrescribe && (
        <div className="absolute inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md p-8 shadow-2xl">
                <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <h2 className="text-2xl font-bold dark:text-white">Prescribe Item</h2>
                    <p className="text-primary font-bold mt-1">{itemToPrescribe.name}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Patient Appointment</label>
                        <select 
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            value={selectedAptId}
                            onChange={e => setSelectedAptId(e.target.value)}
                        >
                            <option value="">-- Choose Appointment --</option>
                            {appointments.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.patient_details?.user?.first_name || 'Patient'} - {a.date} ({a.time_slot})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Instructions / Dosage</label>
                        <textarea 
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            rows="3"
                            placeholder="e.g. 1 spoon daily with warm water"
                            value={prescriptionNotes}
                            onChange={e => setNotes(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setShowPrescribeModal(false)} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold py-3 rounded-xl transition">Cancel</button>
                    <button onClick={handlePrescribeSubmit} className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl shadow-lg transition">Confirm</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
