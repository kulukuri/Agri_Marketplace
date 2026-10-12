import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import QualityCheck from './pages/QualityCheck'; // Add this import

function App() {
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing lang={lang} setLang={setLang} />} />
        <Route path="/auth" element={<Auth lang={lang} setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard lang={lang} user={user} setUser={setUser} />} />
        <Route path="/buyer-dashboard" element={<BuyerDashboard lang={lang} user={user} setUser={setUser} />} />
        
        {/* Add the new Quality Check Route */}
        <Route path="/quality-check" element={<QualityCheck lang={lang} user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;