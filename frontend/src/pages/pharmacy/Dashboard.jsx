import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';
import { ShoppingBag, CheckCircle, XCircle, Truck, Package, User, Calendar, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PharmacyDashboard() {
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('pharmacy/orders/');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (orderId, action) => {
    try {
      await axiosClient.post(`pharmacy/orders/${orderId}/${action}/`);
      fetchOrders();
    } catch (err) {
      alert(`Failed to ${action} order: ` + (err.response?.data?.error || err.message));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      booked: "bg-yellow-100 text-yellow-700",
      accepted: "bg-blue-100 text-blue-700",
      rejected: "bg-red-100 text-red-700",
      delivered: "bg-green-100 text-green-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 fixed h-full hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <ShoppingBag className="w-6 h-6 text-primary mr-2" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">Retailer Hub</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <Link to="/pharmacy/dashboard" className="flex items-center px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
                 Orders Management
            </Link>
            <Link to="/pharmacy-store" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                Inventory Store
            </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button onClick={logout} className="flex items-center px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl w-full transition">
                <LogOut className="w-5 h-5 mr-3" /> Logout
            </button>
        </div>
      </aside>

      <main className="md:ml-64 flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Welcome, Pharmacy Admin</h1>
            <div className="flex gap-4">
                <button onClick={fetchOrders} className="text-sm bg-gray-100 dark:bg-gray-700 px-4 py-1.5 rounded-full font-bold dark:text-gray-200 hover:bg-gray-200 transition">⟳ Refresh</button>
            </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 transition">
              <p className="text-gray-500 text-sm font-medium">Active Orders</p>
              <h3 className="text-3xl font-bold dark:text-white mt-1">{orders.filter(o => o.status !== 'delivered' && o.status !== 'rejected').length}</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 transition">
              <p className="text-gray-500 text-sm font-medium">Booked (Waiting Approval)</p>
              <h3 className="text-3xl font-bold text-yellow-600 mt-1">{orders.filter(o => o.status === 'booked').length}</h3>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 transition">
              <p className="text-gray-500 text-sm font-medium">Delivered (Total)</p>
              <h3 className="text-3xl font-bold text-green-600 mt-1">{orders.filter(o => o.status === 'delivered').length}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Incoming Medicine Orders</h3>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-12 text-center text-gray-500">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-gray-500 underline decoration-primary/30">No orders found in the system.</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Order ID</th>
                      <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Patient Details</th>
                      <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Medicine & Qty</th>
                      <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Total</th>
                      <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Status</th>
                      <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">#{order.id.toString().padStart(4, '0')}</td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                             <span className="font-bold text-gray-800 dark:text-gray-200">{order.user_name || 'Patient'}</span>
                             <span className="text-xs text-gray-500 mb-1">{order.user_email}</span>
                             {order.delivery_address && (
                               <span className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-1.5 rounded-lg border border-blue-100 dark:border-blue-800 leading-tight">
                                 📍 {order.delivery_address}
                               </span>
                             )}
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           {order.items?.map((item, idx) => (
                             <div key={idx} className="text-sm dark:text-gray-300">
                               {item.item_details?.name} (x{item.quantity})
                             </div>
                           ))}
                        </td>
                        <td className="px-6 py-4 font-black text-primary">₹{order.total_amount}</td>
                        <td className="px-6 py-4">
                           <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                             {order.status.replace('_', ' ')}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                             {order.status === 'booked' && (
                               <>
                                 <button onClick={() => updateStatus(order.id, 'accept')} title="Accept" className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition">
                                   <CheckCircle className="w-5 h-5"/>
                                 </button>
                                 <button onClick={() => updateStatus(order.id, 'reject')} title="Reject" className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                                   <XCircle className="w-5 h-5"/>
                                 </button>
                               </>
                             )}
                             {order.status === 'accepted' && (
                               <button onClick={() => updateStatus(order.id, 'mark_delivered')} className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-dark shadow-md transition">
                                 <Truck className="w-4 h-4"/> Ship & Deliver
                               </button>
                             )}
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
