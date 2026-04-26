import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import axiosClient from '../../api/axiosClient';
import { Users, Plus, Edit, Trash2, X, Activity, UserPlus, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PatientManagement() {
  const { user } = useAuthStore();
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      prakriti: 'vata',
      blood_group: '',
      date_of_birth: ''
  });

  const fetchPatients = async () => {
      try {
          // Doctors can read all their patients or all patients
          const res = await axiosClient.get('patients/');
          setPatients(res.data);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      fetchPatients();
  }, []);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          if (editingPatientId) {
             const { first_name, last_name, email, ...updateData } = formData;
             // Ensure first_name and email are passed for update correctly, but patient update endpoint might fail on readonly.
             // We'll pass all data and let serializer handle
             await axiosClient.put(`patients/${editingPatientId}/`, formData);
          } else {
             await axiosClient.post('patients/', formData);
          }
          setIsModalOpen(false);
          setEditingPatientId(null);
          setFormData({first_name: '', last_name: '', email: '', prakriti: 'vata', blood_group: '', date_of_birth: ''});
          fetchPatients(); // Reload list
      } catch (err) {
          alert('Error saving patient. Ensure email is unique if creating new.');
      }
  };

  const handleEditClick = (p) => {
      setEditingPatientId(p.id);
      setFormData({
          first_name: p.user?.first_name || '',
          last_name: p.user?.last_name || '',
          email: p.user?.email || '',
          prakriti: p.prakriti || 'vata',
          blood_group: p.blood_group || '',
          date_of_birth: p.date_of_birth || ''
      });
      setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
      if(window.confirm('Delete this patient profile?')) {
          try {
              await axiosClient.delete(`patients/${id}/`);
              fetchPatients();
          } catch(e) {
              alert('Error deleting patient.');
          }
      }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
       {/* Sidebar */}
       <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold text-gray-800 dark:text-white">Dr. Workspace</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            <Link to="/doctor/dashboard" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition">
                Dashboard
            </Link>
            <Link to="/doctor/patients" className="flex items-center px-4 py-3 bg-primary/10 text-primary rounded-xl font-medium">
                My Patients
            </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto p-8 relative">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center"><Users className="mr-3 text-primary"/> Patient Management</h1>
            <button onClick={() => {
                setEditingPatientId(null);
                setFormData({first_name: '', last_name: '', email: '', prakriti: 'vata', blood_group: '', date_of_birth: ''});
                setIsModalOpen(true);
            }} className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg transition">
                <Plus className="w-5 h-5 mr-2" /> Add Patient
            </button>
        </div>

        {/* Patient Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Name</th>
                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Prakriti</th>
                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">Blood G.</th>
                        <th className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {patients.length === 0 ? (
                         <tr><td colSpan="4" className="text-center py-8 text-gray-500">No patients found.</td></tr>
                    ) : patients.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                            <td className="px-6 py-4">
                                <p className="font-bold text-gray-800 dark:text-white">{p.user?.first_name} {p.user?.last_name}</p>
                                <p className="text-sm text-gray-500">{p.user?.email}</p>
                            </td>
                            <td className="px-6 py-4"><span className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-sm font-medium uppercase">{p.prakriti || 'N/A'}</span></td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{p.blood_group || '-'}</td>
                            <td className="px-6 py-4 flex justify-end gap-3">
                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition" title="Consult"><FileText className="w-5 h-5"/></button>
                                <button onClick={()=> handleEditClick(p)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit"><Edit className="w-5 h-5"/></button>
                                <button onClick={()=> handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition" title="Delete"><Trash2 className="w-5 h-5"/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Add Modal */}
        {isModalOpen && (
            <div className="absolute inset-0 bg-black/50 z-50 flex justify-center items-center backdrop-blur-sm p-4">
                <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold dark:text-white flex items-center"><UserPlus className="mr-2 text-primary" /> {editingPatientId ? 'Edit Patient' : 'New Patient'}</h2>
                        <button onClick={() => { setIsModalOpen(false); setEditingPatientId(null); }} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full"><X/></button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">First Name *</label>
                                <input type="text" name="first_name" required className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 outline-none" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Last Name</label>
                                <input type="text" name="last_name" className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 outline-none" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email * (for login)</label>
                            <input type="email" name="email" required className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 outline-none" onChange={handleChange} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Prakriti</label>
                                <select name="prakriti" value={formData.prakriti} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 outline-none">
                                    <option value="vata">Vata</option>
                                    <option value="pitta">Pitta</option>
                                    <option value="kapha">Kapha</option>
                                    <option value="tridosha">Tridosha</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Blood Group</label>
                                <input type="text" name="blood_group" placeholder="e.g. O+" className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 outline-none" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">DOB</label>
                            <input type="date" name="date_of_birth" className="w-full px-4 py-2 rounded-xl border dark:bg-gray-700 outline-none" onChange={handleChange} />
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl mt-4">Save Patient</button>
                    </form>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
