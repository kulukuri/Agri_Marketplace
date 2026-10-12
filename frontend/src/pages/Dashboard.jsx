import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { translations } from '../translations';
import { TrendingUp, TrendingDown, MapPin, Search, Bell, User, Leaf, ChevronRight, Activity, LogOut, Camera } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ lang, user, setUser }) {
  const navigate = useNavigate();
  const t = translations[lang];
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  
  const [filters, setFilters] = useState({
    state: 'Andhra Pradesh', district: 'Vizianagaram', commodity: 'Tomato'
  });

  useEffect(() => {
    if (!user) navigate('/');
    fetchPrices();
  }, [user]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/prices', { params: filters });
      setPrices(response.data.data);
    } catch (error) { console.error("Error fetching data:", error); }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPrices();
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Top Navigation Bar with Profile Dropdown */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t.app_name}</h1>
          </div>
          
          <div className="flex items-center space-x-4 relative">
            <button className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            {/* User Profile Avatar */}
            <div 
              onClick={() => setShowProfile(!showProfile)}
              className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 cursor-pointer border border-emerald-200 hover:ring-2 hover:ring-emerald-400 transition-all"
            >
              <User className="w-5 h-5" />
            </div>

            {/* Profile Dropdown Menu */}
            {showProfile && (
              <div className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden py-2 animate-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.phone}</p>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center font-medium transition-colors">
                  <LogOut className="w-4 h-4 mr-2" /> {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* Header with New AI Quality Check Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">{t.dashboard_title}</h2>
            <p className="text-slate-500 mt-1">{t.dashboard_sub}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* New AI Quality Check Button */}
            <button 
              onClick={() => navigate('/quality-check')} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-emerald-600/30 transition-all"
            >
              <Camera className="w-5 h-5 mr-2" />
              AI Quality Check
            </button>

            {/* Existing Live Badge */}
            <div className="hidden sm:flex items-center bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-emerald-700">Live</span>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">State</label>
              <input type="text" value={filters.state} onChange={(e) => setFilters({...filters, state: e.target.value})} className="w-full border-0 bg-slate-50 rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="flex-1 relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">District</label>
              <input type="text" value={filters.district} onChange={(e) => setFilters({...filters, district: e.target.value})} className="w-full border-0 bg-slate-50 rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="flex-1 relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Commodity</label>
              <input type="text" value={filters.commodity} onChange={(e) => setFilters({...filters, commodity: e.target.value})} className="w-full border-0 bg-slate-50 rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div className="flex items-end pb-[2px]">
              <button type="submit" className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium flex items-center justify-center transition-all shadow-lg shadow-emerald-500/30">
                <Search size={18} className="mr-2" />
                Search
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex space-x-6 animate-pulse">
            <div className="flex-1 h-40 bg-slate-200 rounded-2xl"></div>
            <div className="flex-1 h-40 bg-slate-200 rounded-2xl"></div>
            <div className="flex-1 h-40 bg-slate-200 rounded-2xl"></div>
          </div>
        ) : prices.length > 0 ? (
          <>
            {/* Hero Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-emerald-500/20 text-white relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-white/10"><Activity w={120} h={120} /></div>
                <h3 className="text-emerald-50 font-medium mb-2 relative z-10">Modal Price (Average)</h3>
                <div className="flex items-end space-x-2 relative z-10">
                  <span className="text-4xl font-extrabold">₹{prices[0].modal_price}</span>
                  <span className="text-emerald-100 mb-1">/ quintal</span>
                </div>
                <div className="mt-5 flex items-center text-sm bg-white/20 w-max px-3 py-1.5 rounded-lg backdrop-blur-sm relative z-10">
                  <TrendingUp size={16} className="mr-2" />
                  <span>Recommended Selling Price</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 font-medium mb-2">Maximum Traded Price</h3>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold text-slate-800">₹{prices[0].max_price}</span>
                </div>
                <div className="mt-5 flex items-center text-sm text-slate-500">
                  <div className="bg-slate-100 p-1.5 rounded-md mr-2"><MapPin size={14} className="text-slate-600" /></div>
                  Top quality grade at {prices[0].market}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-slate-500 font-medium mb-2">Minimum Traded Price</h3>
                <div className="flex items-end space-x-2">
                  <span className="text-3xl font-bold text-slate-800">₹{prices[0].min_price}</span>
                </div>
                <div className="mt-5 flex items-center text-sm text-red-600">
                  <div className="bg-red-50 p-1.5 rounded-md mr-2"><TrendingDown size={14} /></div>
                  Lowest recorded trade today
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">7-Day Price Trend ({filters.commodity})</h3>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center">
                  View Full History <ChevronRight size={16} className="ml-1"/>
                </button>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={prices.slice().reverse()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="arrival_date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#0f172a', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="modal_price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No Market Data Found</h3>
            <p className="text-slate-500">Try adjusting your location or commodity filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}