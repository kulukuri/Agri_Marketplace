import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Phone, User, ShoppingCart, LogOut, Package, Loader2 } from 'lucide-react';
import { translations } from '../translations';

export default function BuyerDashboard({ lang, user, setUser }) {
  const navigate = useNavigate();
  const t = translations[lang];
  
  const [city, setCity] = useState('');
  const [commodity, setCommodity] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [matchedFarmers, setMatchedFarmers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch real farmers from MySQL Database
  const fetchFarmers = useCallback(async (searchCity = '', searchCommodity = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/farmers', {
        params: { city: searchCity, commodity: searchCommodity }
      });
      setMatchedFarmers(response.data.data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
    setLoading(false);
  }, []);

  // Run once on load to show all available farmers
  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigate('/');
      return;
    }
    fetchFarmers();
  }, [user, navigate, fetchFarmers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFarmers(city, commodity);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Buyer Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg"><ShoppingCart className="text-white w-6 h-6" /></div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{t.app_name} - {t.buyer_portal}</h1>
          </div>
          
          <div className="relative">
            <div onClick={() => setShowProfile(!showProfile)} className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 cursor-pointer border border-blue-200 hover:ring-2 hover:ring-blue-400 transition-all">
              <User className="w-5 h-5" />
            </div>
            {showProfile && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in slide-in-from-top-2">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-bold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{t.registered_buyer}</p>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">{t.find_farmers}</h2>
          <p className="text-slate-500 mt-1">{t.find_farmers_sub}</p>
        </div>

        {/* Real-time DB Search Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{t.city_district}</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border-0 bg-slate-50 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Vizianagaram" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">{t.commodity}</label>
              <input type="text" value={commodity} onChange={(e) => setCommodity(e.target.value)} className="w-full border-0 bg-slate-50 rounded-xl p-4 text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Tomato" />
            </div>
            <div className="flex items-end pb-1">
              <button disabled={loading} type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-500/30">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><Search size={18} className="mr-2" /> {t.search_farmers}</>}
              </button>
            </div>
          </form>
        </div>

        {/* Real Database Results */}
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Package className="mr-2 text-blue-600" /> {t.matches}
        </h3>
        
        {matchedFarmers.length === 0 && !loading ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-slate-200 text-slate-500">
            No registered farmers found for this specific search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchedFarmers.map((farmer) => (
              <div key={farmer.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 capitalize">{farmer.full_name}</h4>
                    <div className="flex items-center text-sm text-slate-500 mt-1 capitalize">
                      <MapPin className="w-4 h-4 mr-1 text-slate-400" /> {farmer.city || "Location not set"}
                    </div>
                  </div>
                  {farmer.commodity && (
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold capitalize border border-blue-100">
                      {farmer.commodity}
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center">
                    <span className="text-sm text-slate-500">Verification:</span>
                    <span className="font-bold text-emerald-600 flex items-center">Registered</span>
                  </div>
                </div>

                <a 
                  href={`tel:${farmer.phone_number}`} 
                  className="w-full bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white py-3 rounded-xl font-bold flex items-center justify-center transition-all border border-blue-100 shadow-sm"
                >
                  <Phone className="w-4 h-4 mr-2" /> {farmer.phone_number}
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}