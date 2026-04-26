import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Leaf } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role: 'patient',
      specialization: '',
      license_no: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axiosClient.post('accounts/register/', formData);
      navigate('/login');
    } catch (err) {
      const backendError = err.response?.data;
      if (backendError) {
        // Flatten error messages from DRF
        const message = Object.values(backendError).flat().join(' ');
        setError(message);
      } else {
        setError('Failed to register. Please check your network connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
      
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] z-10 transition">
        <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group">
               <Leaf className="w-8 h-8 text-primary group-hover:scale-110 transition-transform"/>
               <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">AyurSutra</h2>
            </Link>
            <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                <input type="text" name="first_name" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 outline-none" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                <input type="text" name="last_name" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 outline-none" onChange={handleChange} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" name="email" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 outline-none" onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <input type="password" name="password" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 outline-none" onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 outline-none bg-white">
                  <option value="patient">Patient</option>
                  <option value="doctor">Medical Practitioner (Doctor)</option>
              </select>
            </div>

            {formData.role === 'doctor' && (
                <div className="grid grid-cols-2 gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
                    <input type="text" name="specialization" placeholder="e.g. Panchakarma" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 outline-none" onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">License No.</label>
                    <input type="text" name="license_no" placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 outline-none" onChange={handleChange} />
                  </div>
                </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] mt-4">
               {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
        </form>
        <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
