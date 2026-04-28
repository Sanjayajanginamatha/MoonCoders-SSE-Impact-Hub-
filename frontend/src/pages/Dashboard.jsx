import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ngos } from '../data/mockData';
import { Search, TrendingUp, ShieldCheck, HeartPulse, BookOpen, Leaf, Users } from 'lucide-react';

const SECTORS = [
  { id: 'all', label: 'All Bonds', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'education', label: 'Education', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'health', label: 'Healthcare', icon: <HeartPulse className="w-4 h-4" /> },
  { id: 'environment', label: 'Environment', icon: <Leaf className="w-4 h-4" /> },
  { id: 'poverty', label: 'Poverty & Hunger', icon: <Users className="w-4 h-4" /> },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSector, setActiveSector] = useState('all');

  // Filter NGOs based on search query and sector
  const filteredNgos = useMemo(() => {
    return ngos.filter(ngo => {
      const matchesSearch = 
        ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ngo.sdgs.some(sdg => sdg.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;
      if (activeSector === 'all') return true;

      const sdgString = ngo.sdgs.join(' ').toLowerCase();
      if (activeSector === 'education' && sdgString.includes('education')) return true;
      if (activeSector === 'health' && sdgString.includes('health')) return true;
      if (activeSector === 'environment' && (sdgString.includes('climate') || sdgString.includes('land') || sdgString.includes('water'))) return true;
      if (activeSector === 'poverty' && (sdgString.includes('poverty') || sdgString.includes('hunger') || sdgString.includes('inequalities'))) return true;
      
      return false;
    });
  }, [searchQuery, activeSector]);

  return (
    <div className="flex flex-1 bg-gray-50/30">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto">
        
        {/* Header / Hero Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-2 tracking-tight">Impact Marketplace</h2>
              <p className="text-gray-500">Invest in zero-coupon zero-principal bonds and claim 80G tax benefits.</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border-0 rounded-2xl bg-white shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm transition-all"
                placeholder="Search NGOs or Causes..."
              />
            </div>
          </div>

          {/* Market Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Verified NGOs</p>
                <p className="text-lg font-bold text-secondary">24</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Capital Raised</p>
                <p className="text-lg font-bold text-secondary">₹12.4 Cr</p>
              </div>
            </div>
          </div>

          {/* Sector Quick Filters */}
          <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
            {SECTORS.map(sector => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeSector === sector.id 
                    ? 'bg-secondary text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {sector.icon}
                {sector.label}
              </button>
            ))}
          </div>
        </div>
        
        {filteredNgos.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-secondary">No matching bonds found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or sector filter.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveSector('all'); }}
              className="mt-6 btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNgos.map(ngo => {
              const percent = Math.min(100, Math.round((ngo.raised / ngo.target) * 100));
              return (
                <div 
                  key={ngo.id} 
                  onClick={() => navigate(`/ngo/${ngo.id}`)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={ngo.image}
                      alt={ngo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80'; }}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3.5 h-3.5" /> 80G Benefit
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {ngo.sdgs.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-bold text-secondary mb-1 line-clamp-1">{ngo.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-5 flex-1">{ngo.description}</p>
                    
                    <div className="mt-auto">
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                      </div>
                      
                      <div className="flex items-end justify-between mt-1">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Raised</p>
                          <p className="font-bold text-secondary text-base">₹{(ngo.raised/100000).toFixed(1)}L</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-0.5">{percent}%</p>
                          <p className="text-sm font-medium text-gray-500">of ₹{(ngo.target/100000).toFixed(1)}L</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
