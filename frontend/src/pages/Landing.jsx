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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s', transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)` }} />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className={`relative z-10 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ImpactInvest</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => navigate('/dashboard')} className="text-slate-300 hover:text-white transition-colors">Explore</button>
              <button onClick={() => navigate('/auth')} className="text-slate-300 hover:text-white transition-colors">About</button>
              <button onClick={() => navigate('/auth')} className="text-slate-300 hover:text-white transition-colors">Contact</button>
            </div>
            <button onClick={() => navigate('/auth')} className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all hover:scale-105">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Groww-style Hero Section */}
      <section className={`relative overflow-hidden pt-16 pb-20 transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 px-4 py-2 text-sm text-cyan-400 animate-fade-in">
              <Zap className="w-4 h-4" />
              <span>India's 1st Social Stock Exchange Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
              Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Change</span>.<br />
              Earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Impact</span>.
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Discover a revolutionary investing experience for ZCZP bonds, verified NGOs, and green funds. Track your impact, enjoy tax benefits, and be part of India's social finance revolution.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button onClick={() => navigate('/kyc')} className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-white text-base font-semibold shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-105">
                <span>Start Investing</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/dashboard')} className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 px-8 py-4 text-sm font-semibold text-white hover:bg-slate-700/50 transition-all hover:border-slate-500">
                View Demo
              </button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs text-white font-semibold">
                    {String.fromCharCode(64+i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold">50,000+ Investors</p>
                <p className="text-slate-400 text-sm">Trusting our platform</p>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Floating cards animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[2rem] blur-[60px] opacity-30 animate-pulse" />
            <div className="relative rounded-[2rem] bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-1 shadow-2xl border border-slate-700/50 backdrop-blur-xl">
              <div className="rounded-[1.75rem] bg-slate-900/90 p-8 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-slate-400">Featured Opportunity</p>
                    <h2 className="text-2xl font-bold text-white mt-1">ZCZP Bond</h2>
                  </div>
                  <span className="inline-flex rounded-full bg-cyan-500/20 text-cyan-400 px-3 py-1 text-xs font-semibold border border-cyan-500/30">Verified</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  <div className="rounded-[1.75rem] bg-slate-800/50 p-5 border border-slate-700/50">
                    <p className="text-xs text-slate-400">Annual Returns</p>
                    <p className="text-2xl font-bold text-cyan-400">18.5%</p>
                  </div>
                  <div className="rounded-[1.75rem] bg-slate-800/50 p-5 border border-slate-700/50">
                    <p className="text-xs text-slate-400">Min. Investment</p>
                    <p className="text-2xl font-bold text-white">₹ 1,000</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-slate-800/50 p-5 border border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-3">Why choose this</p>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cyan-400" /> 100% verified projects</li>
                    <li className="flex items-center gap-2"><Award className="w-4 h-4 text-emerald-400" /> 80G tax benefits</li>
                    <li className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-400" /> Real-time impact tracking</li>
                  </ul>
                </div>

                <button onClick={() => navigate('/kyc')} className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all">
                  Invest Now →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Categories */}
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
            <h2 className="text-3xl font-bold text-white">Popular on SSE</h2>
            <p className="text-sm text-slate-400 mt-2">Top choices from our impact-focused investors.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
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
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Social ROI</p>
                    <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-emerald-400"><TrendingUp className="h-4 w-4" />{inv.roi}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:text-cyan-400" />
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

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ImpactInvest</span>
              </div>
              <p className="text-sm text-slate-400">India's first Social Stock Exchange platform for verified impact investing.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-cyan-400 transition-colors">Explore</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-cyan-400 transition-colors">About Us</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-cyan-400 transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-cyan-400 transition-colors cursor-pointer">Disclaimer</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <p className="text-sm text-slate-400 mb-2">support@impactinvest.in</p>
              <p className="text-sm text-slate-400">+91 98765 43210</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">© 2026 ImpactInvest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
