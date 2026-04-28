import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Kyc from './pages/Kyc';
import Dashboard from './pages/Dashboard';
import NgoDetail from './pages/NgoDetail';
import Portfolio from './pages/Portfolio';
import Account from './pages/Account';
import Rank from './pages/Rank';
import ForgotPassword from './pages/ForgotPassword';
import Notifications from './pages/Notifications';
import { ThemeProvider } from './components/ThemeProvider';

import Footer from './components/Footer';

function App() {
  // Restore user from sessionStorage on page load/refresh
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [portfolio, setPortfolio] = useState([]);

  // Sync user changes to sessionStorage
  const handleSetUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      sessionStorage.setItem('user', JSON.stringify(newUser));
    } else {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-secondary transition-colors duration-200">
          <Navbar user={user} setUser={handleSetUser} />

          <div className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/kyc" element={<Kyc setUser={handleSetUser} />} />
              <Route path="/auth" element={<Auth setUser={handleSetUser} />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
              <Route path="/ngo/:id" element={user ? <NgoDetail user={user} setUser={handleSetUser} portfolio={portfolio} setPortfolio={setPortfolio} /> : <Navigate to="/auth" />} />
              <Route path="/portfolio" element={user ? <Portfolio portfolio={portfolio} user={user} /> : <Navigate to="/auth" />} />
              <Route path="/rank" element={user ? <Rank user={user} /> : <Navigate to="/auth" />} />
              <Route path="/account" element={user ? <Account user={user} setUser={handleSetUser} /> : <Navigate to="/auth" />} />
              <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/auth" />} />
            </Routes>
          </div>

          <AIAssistant />
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
