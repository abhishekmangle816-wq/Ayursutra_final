import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Leaf, Stethoscope, User, Store, Shield, ArrowRight, Activity, Droplets } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      const currentUser = useAuthStore.getState().user;

      // Role based redirect
      if (currentUser?.role === 'admin') navigate('/admin/dashboard');
      else if (currentUser?.role === 'doctor') navigate('/doctor/dashboard');
      else if (currentUser?.role === 'pharmacy') navigate('/pharmacy/dashboard');
      else navigate('/patient/dashboard');

    } catch (err) {
      setError('Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  const DemoButton = ({ icon: Icon, title, subtitle, emailValue, passValue }) => (
    <button 
      type="button" 
      onClick={() => { setEmail(emailValue); setPassword(passValue); }}
      className="group relative flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 border-2 border-transparent hover:border-primary/30 dark:hover:border-primary/50 shadow-sm hover:shadow-xl rounded-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="w-10 h-10 mb-2 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
      </div>
      <div className="font-bold text-[11px] uppercase tracking-wider text-gray-500 group-hover:text-primary transition-colors z-10">{title}</div>
      <div className="text-xs font-medium text-gray-800 dark:text-gray-200 mt-0.5 z-10">{subtitle}</div>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-500 overflow-hidden">
      
      {/* Left Plate - Branding & Aesthetics */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden items-center justify-center">
        {/* Dynamic Orbs background */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
        
        {/* Branding Content */}
        <div className="relative z-10 text-white p-12 max-w-lg">
            <Link to="/" className="flex items-center gap-4 mb-8 group">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 group-hover:bg-white/20 transition-all">
                    <Leaf className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <span className="text-3xl font-black tracking-tight text-white drop-shadow-md">AyurSutra</span>
            </Link>
            <h1 className="text-5xl font-black mb-6 leading-tight">
                Modern <br />Ayurvedic <br /><span className="text-accent underline decoration-4 underline-offset-8">Excellence.</span>
            </h1>
            <p className="text-lg text-primary-100 mb-12 opacity-90 leading-relaxed">
                Experience the seamless fusion of ancient holistic wellness and cutting-edge hospital management. Log in to transform the patient journey.
            </p>
            
            <div className="flex items-center gap-6 text-sm font-medium opacity-80">
                <div className="flex items-center gap-2"><Activity className="w-5 h-5 text-accent"/> Live Monitoring</div>
                <div className="flex items-center gap-2"><Droplets className="w-5 h-5 text-secondary"/> Prakriti Profiling</div>
            </div>
        </div>
      </div>

      {/* Right Plate - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
          
        {/* Mobile Background Orbs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl lg:hidden"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl lg:hidden"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10 lg:hidden">
              <Link to="/" className="flex justify-center items-center gap-3 mb-2 group">
                  <Leaf className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-black text-gray-900 dark:text-white">AyurSutra</span>
              </Link>
          </div>
          <div className="text-center lg:text-left mb-10">
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Access Portal</h2>
              <p className="text-gray-500 font-medium mt-2">Sign in to securely access your workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-medium border border-red-100 dark:border-red-800 animate-slideUp">
                  {error}
              </div>
            )}

            <div className="space-y-4">
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Email Address</label>
                    <input 
                    type="email" 
                    required 
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-0 outline-none transition-all duration-300 shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    />
                </div>
                <div className="group">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Password</label>
                    <input 
                    type="password" 
                    required 
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-0 outline-none transition-all duration-300 shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    />
                </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-black dark:bg-primary dark:hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] disabled:opacity-70 flex justify-center items-center gap-2 group mt-2"
            >
              {isLoading ? 'Authenticating...' : 'Sign In To Workspace'}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Quick Access Grid */}
          <div className="mt-12 w-full pt-10 border-t border-gray-200 dark:border-gray-800 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 dark:bg-gray-900 px-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Quick Access
              </div>
              <div className="grid grid-cols-2 gap-3">
                  <DemoButton 
                    icon={Stethoscope} 
                    title="Healing" 
                    subtitle="Dr. Acharya" 
                    emailValue="dr_acharya@ayursutra.com" 
                    passValue="ayursutra123" 
                  />
                  <DemoButton 
                    icon={User} 
                    title="Wellness" 
                    subtitle="Demo Patient" 
                    emailValue="priya@ayursutra.com" 
                    passValue="patient123" 
                  />
                  <DemoButton 
                    icon={Store} 
                    title="Retail" 
                    subtitle="Pharmacy POS" 
                    emailValue="pharmacy@ayursutra.com" 
                    passValue="pharmacy123" 
                  />
                  <DemoButton 
                    icon={Shield} 
                    title="Sys-Ops" 
                    subtitle="Super Admin" 
                    emailValue="admin@ayursutra.com" 
                    passValue="admin123" 
                  />
              </div>
          </div>

          <p className="text-center mt-10 text-sm font-medium text-gray-500">
              New to AyurSutra? <Link to="/register" className="text-primary hover:text-primary-dark transition-colors border-b border-primary/30 hover:border-primary">Register your profile</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
