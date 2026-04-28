import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ngos } from '../data/mockData';
import { Verified, Search } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter NGOs based on search query
  const filteredNgos = ngos.filter(ngo => {
    const query = searchQuery.toLowerCase();
    return (
      ngo.name.toLowerCase().includes(query) ||
      ngo.description.toLowerCase().includes(query) ||
      ngo.sdgs.some(sdg => sdg.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-2">Impact Marketplace</h2>
            <p className="text-gray-600">Invest in verified ZCZP bonds and create measurable social impact.</p>
          </div>
          
          {/* Search Engine */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all sm:text-sm shadow-sm"
              placeholder="Search NGOs, causes, or SDGs..."
            />
          </div>
        </div>
        
        {filteredNgos.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-secondary">No matching NGOs found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search terms to find what you're looking for.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-primary hover:text-primary-hover font-medium"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNgos.map(ngo => {
              const percent = Math.min(100, Math.round((ngo.raised / ngo.target) * 100));
              return (
                <div key={ngo.id} className="card p-0 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-semibold text-primary flex items-center gap-1 shadow-sm">
                      <Verified className="w-3 h-3" /> 80G Tax Benefit
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-secondary mb-2 line-clamp-1">{ngo.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ngo.sdgs.map(tag => (
                        <span key={tag} className="bg-sky-50 text-primary text-xs px-2 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-secondary">₹{(ngo.raised/100000).toFixed(1)}L raised</span>
                        <span className="text-gray-500">Target: ₹{(ngo.target/100000).toFixed(1)}L</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                      </div>
                      <div className="text-right text-xs text-gray-500 mb-4">{percent}% Funded</div>
                      
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/ngo/${ngo.id}`)} className="btn btn-outline flex-1">Details</button>
                        <button onClick={() => navigate(`/ngo/${ngo.id}`)} className="btn btn-primary flex-1">Buy Bond</button>
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
