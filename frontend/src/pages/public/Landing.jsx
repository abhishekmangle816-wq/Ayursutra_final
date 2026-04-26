import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, HeartPulse, Activity } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <header className="sticky top-0 z-50 flex justify-between items-center p-6 lg:px-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <Link to="/" className="text-2xl font-black text-primary flex items-center gap-2 group">
            <Leaf className="w-8 h-8 group-hover:rotate-12 transition-transform"/> AyurSutra
        </Link>
        <nav className="hidden md:flex space-x-8 items-center font-bold text-sm uppercase tracking-widest">
            <a href="#about" className="text-gray-500 dark:text-gray-400 hover:text-primary transition">About</a>
            <a href="#contact" className="text-gray-500 dark:text-gray-400 hover:text-primary transition">Contact</a>
        </nav>
        <div className="flex items-center gap-6">
            <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary transition font-bold text-sm uppercase tracking-widest">Login</Link>
            <Link to="/register" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl transition shadow-lg shadow-primary/20 font-bold text-sm">Book Now</Link>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-primary text-white py-3 px-6 text-center text-sm font-bold shadow-inner relative z-40 overflow-hidden">
          <div className="flex items-center justify-center gap-3">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-tighter">New Feature</span>
              <p>AyurSutra Pharmacy is now live! Order prescribed authentic medicines directly from your dashboard. 🌿</p>
              <Link to="/login" className="underline hover:no-underline ml-2 transition-all font-black decoration-2 underline-offset-4">Order Now →</Link>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-xl"></div>
      </div>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-white dark:bg-gray-900 overflow-hidden border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 text-left">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wide uppercase mb-6">
                        Authentic Healing
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8">
                        Modern Wisdom.<br/>
                        <span className="text-primary italic">Ancient Roots.</span>
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
                        Step into a sanctuary of wellness where the 5,000-year-old art of Ayurveda meets precision hospital management.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/register" className="px-10 py-4 text-lg font-bold rounded-2xl text-white bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all transform hover:-translate-y-1">
                            Book Consultant
                        </Link>
                        <a href="#about" className="px-10 py-4 text-lg font-bold rounded-2xl text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition-all">
                            Learn More
                        </a>
                    </div>
                </div>
                <div className="lg:w-1/2 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75"></div>
                    <img 
                        src="/banners/hero.png" 
                        alt="Ayurveda Wellness" 
                        className="relative rounded-[2rem] shadow-2xl object-cover w-full h-[500px] border border-white/20" 
                    />
                </div>
            </div>
        </section>

        {/* Features/Therapies Grid */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-16">Pillars of Healing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white dark:bg-gray-700 p-8 rounded-3xl shadow-lg hover:shadow-xl transition flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
                            <Activity className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Panchakarma</h3>
                        <p className="text-gray-600 dark:text-gray-300">Detoxify and naturally cleanse your body's deep tissues to balance the tridoshas.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-8 rounded-3xl shadow-lg hover:shadow-xl transition flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
                            <Leaf className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Herbal Remedies</h3>
                        <p className="text-gray-600 dark:text-gray-300">Custom dosha-specific formulations to correct imbalances and restore vitality.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-8 rounded-3xl shadow-lg hover:shadow-xl transition flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mb-6">
                            <HeartPulse className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Wellness Therapies</h3>
                        <p className="text-gray-600 dark:text-gray-300">Rejuvenating massages, Shirodhara, and lifestyle consultations for inner peace.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                    <img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=600&h=400" alt="About AyurSutra" className="rounded-3xl shadow-xl"/>
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold dark:text-white mb-6">Our Philosophy</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                        At AyurSutra, we believe that true health is not just the absence of disease, but a state of absolute vitality and balance. Our legacy is rooted in 5,000-year-old Ayurvedic traditions, modernized to meet today’s demanding lifestyles.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Our expert Vaidyas (Doctors) craft highly personalized regimens—encompassing diet, herbal medicine, and bio-purification (Panchakarma)—to restore your natural Prakriti (constitution).
                    </p>
                </div>
            </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-20 bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-6 bg-white/10 rounded-2xl">
                        <h3 className="text-xl font-bold mb-2">Location</h3>
                        <p className="opacity-90">123 Healing Lotus Way,<br/>Navi Mumbai, Maharashtra 400703</p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-2xl">
                        <h3 className="text-xl font-bold mb-2">Call Us</h3>
                        <p className="opacity-90">+91 98765 43210<br/>Support: 1800-AYUR-CARE</p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-2xl">
                        <h3 className="text-xl font-bold mb-2">Email</h3>
                        <p className="opacity-90">wellness@ayursutra.com<br/>appointments@ayursutra.com</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12 text-center">
        <p className="opacity-70">&copy; 2026 AyurSutra Platforms. Cultivating Global Wellness.</p>
      </footer>
    </div>
  );
}
