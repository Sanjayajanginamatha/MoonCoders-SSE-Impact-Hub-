import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, TrendingUp, ShieldCheck, HeartHandshake, Leaf, ArrowRight, Sparkles, Zap, Globe, Award } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Bonds');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const categories = ['Bonds', 'NGOs', 'Education', 'Green Funds', 'Healthcare'];
  
  const popularInvestments = [
    { name: "Akshaya Patra ZCZP", category: "Education", roi: "18.5%", risk: "Low Risk", verified: true },
    { name: "Green Earth Initiative", category: "Environment", roi: "14.2%", risk: "Medium Risk", verified: true },
    { name: "Rural Healthcare Fund", category: "Healthcare", roi: "16.8%", risk: "Low Risk", verified: true },
    { name: "Women Empowerment Bond", category: "Social", roi: "12.0%", risk: "Low Risk", verified: true }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 text-slate-900">
      {/* Global Navbar handles top navigation */}

      {/* Clean Professional Hero Section */}
      <section className={`relative overflow-hidden pt-20 pb-24 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-16 lg:grid-cols-2 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-4 py-2 text-sm text-blue-700 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>SEBI Regulated Social Stock Exchange</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Invest with <span className="text-blue-600">Purpose.</span><br />
              Grow with <span className="text-blue-500">Impact.</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
              India's premier platform for Zero-Coupon Zero-Principal (ZCZP) bonds. Support verified NGOs, track your social return on investment, and claim instant 80G tax benefits.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center pt-4">
              <button onClick={() => navigate('/auth')} className="group inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-white text-lg font-semibold shadow-xl shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 transition-all">
                Start Investing
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/dashboard')} className="inline-flex items-center justify-center rounded-full bg-white border border-slate-300 px-8 py-4 text-lg font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all">
                View Marketplace
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 flex items-center gap-12">
              <div>
                <p className="text-3xl font-black text-slate-900">₹12.4 Cr</p>
                <p className="text-slate-500 font-medium mt-1">Capital Mobilized</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">24</p>
                <p className="text-slate-500 font-medium mt-1">Verified NGOs</p>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900">50k+</p>
                <p className="text-slate-500 font-medium mt-1">Active Investors</p>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-10">
            {/* Professional Image instead of Abstract Blur */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/50 border border-slate-200 aspect-[4/3] group">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" 
                alt="Professional Investment Office" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-5 shadow-lg border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Market Status</p>
                  <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> ZCZP Trading Active
                  </p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">A</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">R</div>
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">S</div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Search + Categories - Light Mode */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-[2rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 shadow-2xl shadow-slate-900/50 border border-slate-700/50 backdrop-blur-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Search verified impact options</h2>
              <p className="text-sm text-slate-400">Locate NGOs, ZCZP bonds, and green funds in one place.</p>
            </div>
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-600 bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-base text-white placeholder-slate-400 shadow-xl shadow-slate-900/30"
                placeholder="Search NGOs, bonds, impact themes..."
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  activeTab === cat 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Impact Themes */}
      <section className="bg-slate-900/50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-400 font-semibold">Impact themes</p>
              <h2 className="text-3xl font-bold text-white mt-3">Grow with social impact categories</h2>
            </div>
            <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
              View all categories <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 shadow-2xl shadow-cyan-900/20 border border-slate-700/50 transition-all hover:scale-[1.02] hover:shadow-cyan-500/20">
              <div className="absolute -right-8 top-8 h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-3xl bg-slate-800 p-4 mb-5 text-cyan-400 border border-slate-700">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">ZCZP Bonds</h3>
                <p className="text-sm text-slate-400">Sustainable bonds funding education, healthcare, and environment initiatives.</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 shadow-2xl shadow-emerald-900/20 border border-slate-700/50 transition-all hover:scale-[1.02] hover:shadow-emerald-500/20">
              <div className="absolute -left-8 bottom-8 h-24 w-24 rounded-full bg-emerald-500/20 blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-3xl bg-slate-800 p-4 mb-5 text-emerald-400 border border-slate-700">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Verified NGOs</h3>
                <p className="text-sm text-slate-400">Partner with registered organizations chosen for impact and compliance.</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 shadow-2xl shadow-purple-900/20 border border-slate-700/50 transition-all hover:scale-[1.02] hover:shadow-purple-500/20">
              <div className="absolute -right-8 bottom-8 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center justify-center rounded-3xl bg-slate-800 p-4 mb-5 text-purple-400 border border-slate-700">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Green Funds</h3>
                <p className="text-sm text-slate-400">Invest in climate-positive projects that deliver both social and financial returns.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular on SSE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Popular on SSE</h2>
            <p className="text-sm text-slate-600 mt-2">Top choices from our impact-focused investors.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-hover transition-colors">
            Explore all investments <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularInvestments.map((inv, idx) => (
            <div key={idx} onClick={() => navigate('/auth')} className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 border border-slate-700/50 shadow-2xl shadow-slate-900/30 transition-all hover:-translate-y-1 hover:shadow-cyan-500/20 cursor-pointer">
              <div className="absolute -right-8 top-6 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl" />
              <div className="absolute -left-8 bottom-6 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex justify-between items-start mb-4">
                  <span className="rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">{inv.category}</span>
                  {inv.verified && <ShieldCheck className="h-5 w-5 text-emerald-400" />}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">{inv.name}</h3>
                <p className="text-sm text-slate-400 mb-5">{inv.risk}</p>
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Social ROI</p>
                    <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-emerald-400"><TrendingUp className="h-4 w-4" />{inv.roi}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:text-cyan-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Features */}
      <section className="bg-slate-900/50 py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400 font-semibold">Why SSE Impact Hub?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">Designed to make impact investing simple and secure.</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-[2rem] bg-slate-800/50 p-10 text-center border border-slate-700/50 transition-all hover:scale-105 hover:shadow-cyan-500/20">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-cyan-400 border border-slate-600">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Zero Commission</h3>
              <p className="text-sm text-slate-400">Invest without platform fees so your money goes fully toward the causes you care about.</p>
            </div>
            <div className="rounded-[2rem] bg-slate-800/50 p-10 text-center border border-slate-700/50 transition-all hover:scale-105 hover:shadow-emerald-500/20">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-emerald-400 border border-slate-600">
                <HeartHandshake className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Verified NGOs</h3>
              <p className="text-sm text-slate-400">Only registered Social Stock Exchange organizations with verified impact reporting.</p>
            </div>
            <div className="rounded-[2rem] bg-slate-800/50 p-10 text-center border border-slate-700/50 transition-all hover:scale-105 hover:shadow-purple-500/20">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-purple-400 border border-slate-600">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant 80G Receipts</h3>
              <p className="text-sm text-slate-400">Get tax-ready receipts instantly for eligible social investments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer removed to avoid duplication with global footer */}
    </div>
  );
}
