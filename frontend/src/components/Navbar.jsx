import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CreditCard, MapPin, Briefcase, ChevronDown, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { getTierInfo } from '../utils/gamification';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowProfileMenu(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer gap-2" onClick={() => navigate(user ? '/dashboard' : '/')}>
            <img src="/sse-logo.svg" alt="SSE Impact Hub" className="h-9 w-9" />
            <span className="text-xl font-bold text-secondary">
              SSE Impact <span className="text-primary">Hub</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {!user ? (
              <>
                <Link to="/" className="text-secondary hover:text-primary font-medium">Home</Link>
                <Link to="/dashboard" className="text-secondary hover:text-primary font-medium">Explore NGOs</Link>
                <Link to="/auth" className="btn btn-primary ml-4">Login / Join</Link>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <span className="font-semibold text-secondary hidden sm:block">
                    {user.name}
                  </span>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="bg-gradient-to-r from-sky-50 to-indigo-50 p-5 border-b border-gray-100 flex items-center gap-4">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="w-14 h-14 rounded-full object-cover shadow-sm border-2 border-white" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-primary border-2 border-primary/20">
                          <User className="w-7 h-7" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-secondary text-lg leading-tight flex items-center gap-2">
                          {user.name} 
                          <span className="text-xl" title={getTierInfo(user.impactPoints).currentTier.name}>
                            {getTierInfo(user.impactPoints).currentTier.icon}
                          </span>
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{user.occupation || 'Investor'}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getTierInfo(user.impactPoints).currentTier.bg} ${getTierInfo(user.impactPoints).currentTier.color}`}>
                            {getTierInfo(user.impactPoints).currentTier.name}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="space-y-1 mb-2 border-b border-gray-100 pb-2">
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{user.email || 'investor@example.com'}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        {user.pan && (
                          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className="font-mono">{user.pan}</span>
                          </div>
                        )}
                        {(user.city || user.state) && (
                          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{[user.city, user.state].filter(Boolean).join(', ')}</span>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => { setShowProfileMenu(false); navigate('/account'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-secondary hover:bg-gray-100 dark:hover:bg-slate-700 dark:hover:text-white rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        Manage Profile
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-900/20 dark:hover:bg-red-900/30 rounded-lg transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
