import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';
import { Calendar, Droplets, LeafyGreen, LogOut, FileText, ShoppingBag, ShoppingCart, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const { user, logout } = useAuthStore();
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
     fetchPrescriptions();
     fetchOrders();
  }, []);

  const fetchPrescriptions = async () => {
      try {
          const res = await axiosClient.get('pharmacy/prescriptions/');
          setPrescriptions(res.data);
      } catch (err) { console.error('Error fetching prescriptions', err); }
  };

  const fetchOrders = async () => {
      try {
          const res = await axiosClient.get('pharmacy/orders/');
          setOrders(res.data);
      } catch (err) { console.error('Error fetching orders', err); }
  };

  const isItemBooked = (itemId) => {
      return orders.some(order => 
          order.status !== 'rejected' && 
          order.items?.some(orderItem => orderItem.item === itemId)
      );
  };

  const openOrderModal = (item) => {
      setSelectedItem(item);
      setIsModalOpen(true);
  };

  const handleOrder = async () => {
      if (!address.trim()) {
          alert('Please enter a delivery address.');
          return;
      }

      setIsSubmitting(true);
      try {
          const payload = {
              order_items: [{ item: selectedItem.id, quantity: 1 }],
              delivery_address: address
          };
          await axiosClient.post('pharmacy/orders/', payload);
          alert(`Order placed successfully for ${selectedItem.name}!`);
          setIsModalOpen(false);
          setAddress('');
          fetchOrders(); // Refresh order status to update buttons
      } catch (err) {
          alert('Failed to place order: ' + (err.response?.data?.detail || err.message));
      } finally {
          setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors">
      {/* Address Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 transform animate-slideUp">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <ShoppingBag className="text-primary" /> Confirm Order
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              You are ordering <span className="font-bold text-primary">{selectedItem?.name}</span>. Please provide your delivery address.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 ml-1">Delivery Address</label>
                <textarea 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-primary outline-none transition-all dark:text-white h-32 resize-none"
                  placeholder="Enter your full street address, city, and pincode..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleOrder}
                  disabled={isSubmitting}
                  className="flex-[2] bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Order...' : 'Confirm & Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-primary shadow-lg p-6 pb-24 rounded-b-[3rem]">
        <div className="max-w-5xl mx-auto flex justify-between items-center text-white">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><LeafyGreen /> AyurSutra</h1>
          </div>
          <button onClick={logout} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition font-medium flex items-center">
             <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 -mt-16">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl mb-8 flex items-center gap-6 transition-colors">
            <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center text-3xl font-bold shadow-inner">
                {user?.first_name?.charAt(0) || 'P'}
            </div>
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Hello, {user?.first_name || 'Patient'}</h2>
                <div className="flex gap-3 mt-3">
                    <span className="px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm font-bold flex items-center gap-1">
                        <Droplets className="w-4 h-4"/> Vata-Pitta Prakriti
                    </span>
                    <span className="px-4 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-bold">
                        Blood: O+
                    </span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-125 duration-500"></div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center"><Calendar className="mr-2 text-primary"/> Next Appointment</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-2xl border-l-4 border-primary">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Tomorrow, 10:00 AM</p>
                    <p className="font-bold text-lg dark:text-white">Dr. Acharya Vaidyanath</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Panchakarma Consultation</p>
                </div>
                <Link to="/patient/book" className="w-full mt-6 bg-primary/10 text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition flex items-center justify-center">
                    Book New Appointment
                </Link>
            </div>

            <div className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 shadow-lg text-white">
                <h3 className="text-xl font-bold mb-4">Daily Ayur-Tip</h3>
                <p className="text-lg leading-relaxed opacity-90 mb-6">
                    "Start your morning with a glass of warm water and a slice of lemon to ignite your Agni (digestive fire) and flush out toxins accumulated overnight."
                </p>
                <div className="flex justify-end">
                    <LeafyGreen className="w-12 h-12 opacity-50" />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 md:col-span-2 transition-colors">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center"><FileText className="mr-2 text-primary"/> Active Prescriptions</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {prescriptions.length === 0 ? <p className="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">No active prescriptions found.</p> : prescriptions.map(presc => (
                        <div key={presc.id} className="border border-gray-100 dark:border-gray-700 p-6 rounded-3xl hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                            <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <span className="p-2 bg-primary/10 rounded-lg"><Calendar className="w-4 h-4 text-primary" /></span>
                                Issued on {new Date(presc.created_at).toLocaleDateString()}
                            </h4>
                            <div className="space-y-3 mb-4">
                                {(presc.herbs_details || []).length > 0 ? presc.herbs_details.map(herb => (
                                    <div key={herb.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl group transition-all hover:bg-white dark:hover:bg-gray-700 hover:shadow-md border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform">
                                                <LeafyGreen className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{herb.name}</div>
                                                <div className="text-xs text-gray-500">₹{herb.price_per_unit} per unit</div>
                                            </div>
                                        </div>
                                        {isItemBooked(herb.id) ? (
                                            <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs font-bold px-5 py-2.5 rounded-xl border border-yellow-100 dark:border-yellow-800 shadow-sm">
                                                <CheckCircle className="w-4 h-4"/> Booked
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => openOrderModal(herb)}
                                                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                                            >
                                                <ShoppingBag className="w-4 h-4"/> Buy Now
                                            </button>
                                        )}
                                    </div>
                                )) : <p className="text-sm text-gray-400 italic py-2">No medicines listed in this prescription.</p>}
                            </div>
                            {presc.notes && (
                                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border-l-4 border-orange-400">
                                    <p className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-widest mb-1">Doctor's Notes</p>
                                    <p className="text-sm text-orange-700 dark:text-orange-200 italic">{presc.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
