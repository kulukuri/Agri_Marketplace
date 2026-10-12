import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Tractor, ShoppingCart, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations } from '../translations';

export default function Landing({ lang, setLang }) {
  const navigate = useNavigate();
  const t = translations[lang];

  return (
    // Forces the page to perfectly fit the screen height on desktop
    <div className="min-h-screen lg:h-screen bg-slate-50 font-sans flex flex-col lg:overflow-hidden">
      
      {/* Navbar (Slightly tighter padding) */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 z-50 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-1.5 md:p-2 rounded-lg shadow-md shadow-emerald-500/20">
              <Leaf className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
              {t.app_name}
            </h1>
          </div>
          
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs md:text-sm font-bold rounded-md transition-all ${lang === 'en' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              EN
            </button>
            <button onClick={() => setLang('te')} className={`px-3 py-1 text-xs md:text-sm font-bold rounded-md transition-all ${lang === 'te' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              తెలుగు
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-4 md:py-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full h-full">
        
        {/* Left Side: Animated Text and Role Cards */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="flex-1 text-center lg:text-left z-10 w-full flex flex-col justify-center"
        >
          <div className="inline-flex items-center bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold mb-4 md:mb-6 border border-emerald-200 shadow-sm mx-auto lg:mx-0 w-max">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
            Live Market Network
          </div>
          
          {/* Optimized font sizing and natural line-height for both languages */}
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 leading-tight lg:leading-snug mb-3 md:mb-4">
            {t.landing_title} <br className="hidden lg:block" />
            <span className="text-emerald-600 inline-block mt-1">
              {t.landing_title_highlight}
            </span>
          </h2>
          
          <p className="text-sm md:text-base lg:text-lg text-slate-500 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t.tagline} {t.landing_sub}
          </p>

          {/* Compact Dual Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 w-full max-w-2xl mx-auto lg:mx-0">
            
            {/* Farmer Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center cursor-pointer relative overflow-hidden"
              onClick={() => navigate('/auth?role=farmer&mode=register')}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="bg-emerald-50 p-3 rounded-xl mb-3 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Tractor className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{t.farmer_role}</h3>
              <p className="text-slate-500 text-xs text-center mb-5 leading-relaxed">{t.farmer_desc}</p>
              
              <button className="w-full mt-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center transition-colors shadow-md shadow-emerald-600/20">
                {t.join_farmer} <ArrowRight className="ml-1.5 w-4 h-4" />
              </button>
            </motion.div>

            {/* Buyer Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col items-center cursor-pointer relative overflow-hidden"
              onClick={() => navigate('/auth?role=buyer&mode=register')}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              <div className="bg-blue-50 p-3 rounded-xl mb-3 text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{t.buyer_role}</h3>
              <p className="text-slate-500 text-xs text-center mb-5 leading-relaxed">{t.buyer_desc}</p>
              
              <button className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center transition-colors shadow-md shadow-blue-600/20">
                {t.join_buyer} <ArrowRight className="ml-1.5 w-4 h-4" />
              </button>
            </motion.div>
            
          </div>
        </motion.div>

        {/* Right Side: Adaptive Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="flex-1 relative w-full max-w-lg lg:max-w-none hidden md:block"
        >
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[70px] opacity-20 transform -translate-x-10 translate-y-10"></div>
          
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white group">
            {/* Height scales intelligently to prevent scrolling (max 450px) */}
            <img 
              src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=1000" 
              alt="Indian Farmer in field" 
              className="w-full h-[350px] lg:h-[50vh] max-h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
              className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/50 flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Tomato • Vizianagaram</p>
                <p className="text-xl font-extrabold text-slate-900">₹2800 <span className="text-xs font-medium text-slate-500">/ quintal</span></p>
              </div>
              <div className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center shadow-inner">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> Top Grade
              </div>
            </motion.div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}