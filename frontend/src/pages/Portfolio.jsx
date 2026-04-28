import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Download, PackageOpen, TrendingUp, Leaf, FileText, Loader2 } from 'lucide-react';
import generate80GPDF from '../utils/generate80GPDF';
import axios from 'axios';

export default function Portfolio({ user }) {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchPortfolio = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/api/portfolio/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInvestments(res.data);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold text-secondary mb-2">My Portfolio</h2>
          <p className="text-gray-600 mb-8">Track your social investments and 80G certificates.</p>
          <div className="card text-center py-20 flex flex-col items-center justify-center">
            <PackageOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">No Investments Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm">Start your impact journey by investing in verified NGOs and generating real-world social return.</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary px-6 py-2">Explore Marketplace</button>
          </div>
        </div>
      </div>
    );
  }

  const totalInvested = investments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-secondary mb-2">My Portfolio</h2>
        <p className="text-gray-600 mb-8">Track your social investments and download 80G certificates.</p>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="card p-6 bg-gradient-to-br from-sky-50 to-white">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <p className="text-gray-600 font-semibold text-sm">Total Impact Investment</p>
            </div>
            <h3 className="text-4xl font-bold text-primary">₹{totalInvested.toLocaleString()}</h3>
          </div>
          <div className="card p-6 bg-gradient-to-br from-green-50 to-white">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <p className="text-gray-600 font-semibold text-sm">Est. Tax Benefit (30%)</p>
            </div>
            <h3 className="text-4xl font-bold text-green-600">₹{(totalInvested * 0.3).toLocaleString()}</h3>
          </div>
          <div className="card p-6 bg-gradient-to-br from-purple-50 to-white">
            <div className="flex items-center gap-3 mb-2">
              <Leaf className="w-5 h-5 text-purple-600" />
              <p className="text-gray-600 font-semibold text-sm">NGOs Supported</p>
            </div>
            <h3 className="text-4xl font-bold text-purple-600">{investments.length}</h3>
          </div>
        </div>

        <h3 className="text-xl font-bold text-secondary mb-4">Investment History</h3>
        <div className="space-y-4">
          {investments.map((item, index) => (
            <div key={item.id || index} className="card p-5 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
              <img src={item.ngo?.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80'} alt={item.ngo?.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-lg font-bold text-secondary">{item.ngo?.name || 'NGO'}</h4>
                <p className="text-gray-500 text-sm">
                  Bond ID: ZCZP-{(item.transactionId || 'TXN-' + (index + 1001)).replace('ZCZP-', '')} &nbsp;•&nbsp; {new Date(item.investmentDate).toLocaleDateString('en-IN')}
                </p>
                <span className="inline-block mt-1 text-xs bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200">
                  Impact Active
                </span>
              </div>
              <div className="text-center sm:text-right px-4">
                <div className="text-2xl font-bold text-secondary">₹{item.amount.toLocaleString()}</div>
                <div className="text-green-600 text-xs font-semibold mt-0.5">
                  Tax benefit: ₹{(item.amount * 0.3).toLocaleString()}
                </div>
              </div>
              <button
                className="btn btn-outline flex items-center gap-2 text-sm px-4 py-2 w-full sm:w-auto shrink-0"
                onClick={() => generate80GPDF({
                  user,
                  ngo: item.ngo,
                  amount: item.amount,
                  txnId: item.transactionId || 'TXN-' + (index + 100000),
                  date: item.investmentDate
                })}
              >
                <Download className="w-4 h-4" /> 80G Certificate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
