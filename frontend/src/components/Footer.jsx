import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, TrendingUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto w-full z-10 relative">
      {/* Official Partners / Trust Banner */}
      <div className="bg-slate-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">
            Official Regulatory & Exchange Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {/* SEBI Logo (CSS constructed) */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-800 rounded-sm flex items-center justify-center text-white font-black text-xl">S</div>
              <span className="font-black text-2xl tracking-tighter text-blue-900">SEBI</span>
            </div>
            
            {/* NSE Logo (CSS constructed) */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-gray-800">NSE</span>
            </div>

            {/* BSE Logo (CSS constructed) */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 border-4 border-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>
              <span className="font-black text-2xl tracking-tighter text-blue-900">BSE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-secondary">SSE Impact Hub</span>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              India's first Social Stock Exchange platform. Invest in verified Zero-Coupon Zero-Principal (ZCZP) bonds, track your impact, and claim 80G tax benefits.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Impact Marketplace</Link></li>
              <li><Link to="/portfolio" className="hover:text-primary transition-colors">My Portfolio</Link></li>
              <li><Link to="/account" className="hover:text-primary transition-colors">KYC & Account</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Legal & Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">SEBI Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                support@ssehub.in
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                1800-SSE-1234
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>Brigade Road, Bangalore,<br/>Karnataka 560001</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} SSE Impact Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <ShieldCheck className="w-4 h-4" /> SECURED BY 256-BIT ENCRYPTION
          </div>
        </div>
      </div>
    </footer>
  );
}
