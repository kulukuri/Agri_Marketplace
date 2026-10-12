import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { translations } from '../translations';
import { ArrowLeft, AlertCircle, ShoppingCart, Tractor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function Auth({ lang, setUser }) {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'farmer'; 
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'register');
  const navigate = useNavigate();
  const t = translations[lang];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');           // New State
  const [commodity, setCommodity] = useState(''); // New State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isFarmer = role === 'farmer';
  const theme = {
    textColor: isFarmer ? 'text-emerald-600' : 'text-blue-600',
    hoverText: isFarmer ? 'hover:text-emerald-700' : 'hover:text-blue-700',
    bgColor: isFarmer ? 'bg-emerald-600' : 'bg-blue-600',
    hoverBg: isFarmer ? 'hover:bg-emerald-700' : 'hover:bg-blue-700',
    lightBg: isFarmer ? 'bg-emerald-100' : 'bg-blue-100',
    borderColor: isFarmer ? 'focus:border-emerald-500' : 'focus:border-blue-500',
    shadow: isFarmer ? 'shadow-emerald-600/30' : 'shadow-blue-600/30',
    Icon: isFarmer ? Tractor : ShoppingCart,
    title: isFarmer ? 'Farmer' : 'Buyer'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[0-9]{10}$/.test(phone)) return setError("Please enter a valid 10-digit phone number.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (!isLogin && isFarmer && (!city || !commodity)) return setError("City and Commodity are required for farmers.");

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const payload = isLogin 
        ? { phone_number: phone, password, role } 
        : { full_name: name, phone_number: phone, password, role, city, commodity }; // Added new fields
      
      const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
      setUser(response.data.user);
      
      if (response.data.user.role === 'buyer') navigate('/buyer-dashboard');
      else navigate('/dashboard');
      
    } catch (err) {
      setError(err.response?.data?.detail || "Network error. Please make sure the FastAPI backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans items-center justify-center p-6 relative">
      <button onClick={() => navigate('/')} className={`absolute top-8 left-8 text-slate-500 ${theme.hoverText} flex items-center font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 transition-colors`}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        
        <div className="flex justify-center mb-6">
          <div className={`${theme.lightBg} p-4 rounded-full ${theme.textColor}`}>
            <theme.Icon className="w-8 h-8" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {theme.title} {isLogin ? t.login : t.register}
          </h2>
          <p className="text-slate-500">Access your {role} portal</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-600 text-sm font-medium">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" /> <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{t.name}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} className={`w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-4 text-slate-800 ${theme.borderColor} focus:ring-0 outline-none transition-all font-medium`} placeholder="Enter your full name" />
                </div>

                {/* New Dynamic Fields only for Farmers */}
                {isFarmer && (
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">City</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required={!isLogin && isFarmer} className={`w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-4 text-slate-800 ${theme.borderColor} focus:ring-0 outline-none transition-all font-medium`} placeholder="e.g. Guntur" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Crop</label>
                      <input type="text" value={commodity} onChange={(e) => setCommodity(e.target.value)} required={!isLogin && isFarmer} className={`w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-4 text-slate-800 ${theme.borderColor} focus:ring-0 outline-none transition-all font-medium`} placeholder="e.g. Cotton" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{t.phone}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+91</span>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength="10" required className={`w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-4 pl-12 text-slate-800 ${theme.borderColor} focus:ring-0 outline-none transition-all font-medium tracking-wide`} placeholder="0000000000" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">{t.password}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={`w-full border-2 border-slate-100 bg-slate-50 rounded-xl p-4 text-slate-800 ${theme.borderColor} focus:ring-0 outline-none transition-all font-medium tracking-widest`} placeholder="••••••••" />
          </div>
          
          <button disabled={loading} type="submit" className={`w-full ${theme.bgColor} ${theme.hoverBg} disabled:opacity-70 text-white py-4 rounded-xl font-bold shadow-lg ${theme.shadow} transition-all mt-6 text-lg flex justify-center items-center`}>
            {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : t.submit}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-slate-500 font-medium">
          {isLogin ? "Don't have an account?" : "Already have an account?"} 
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className={`ml-2 ${theme.textColor} font-bold ${theme.hoverText} transition-colors`}>
            {isLogin ? t.new_user.replace('? ', '?').split('?')[1] || t.register : t.existing_user.replace('? ', '?').split('?')[1] || t.login}
          </button>
        </div>
      </motion.div>
    </div>
  );
}