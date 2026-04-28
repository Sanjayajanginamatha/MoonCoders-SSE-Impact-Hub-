import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Download, PackageOpen, TrendingUp, Leaf, FileText } from 'lucide-react';

function generate80GPDF({ user, ngo, amount, txnId, date }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>80G Tax Certificate - SSE Impact Hub</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; color: #1a1a2e; background: #fff; }
        .page { max-width: 750px; margin: 0 auto; padding: 40px; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #1a56db; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 22px; font-weight: 900; color: #1a56db; }
        .logo span { color: #1a2e4a; }
        .cert-badge { background: #e8f0fe; color: #1a56db; border: 2px solid #1a56db; border-radius: 8px; padding: 8px 18px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
        h1 { font-size: 24px; font-weight: 800; color: #1a2e4a; margin-bottom: 4px; }
        .subtitle { color: #666; font-size: 13px; margin-bottom: 28px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .info-box { background: #f8faff; border: 1px solid #dce8ff; border-radius: 10px; padding: 14px 18px; }
        .info-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .info-value { font-size: 15px; font-weight: 700; color: #1a2e4a; }
        .amount-box { background: linear-gradient(135deg, #1a56db, #2563eb); color: white; border-radius: 12px; padding: 20px 24px; text-align: center; margin: 20px 0; }
        .amount-label { font-size: 12px; opacity: 0.8; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px; }
        .amount-value { font-size: 36px; font-weight: 900; }
        .tax-benefit { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; margin: 16px 0; }
        .tax-label { font-size: 12px; color: #15803d; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .tax-row { display: flex; justify-content: space-between; font-size: 13px; color: #166534; margin-bottom: 4px; }
        .declaration { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; font-size: 12px; color: #78350f; line-height: 1.6; margin: 16px 0; }
        .footer { border-top: 1px solid #e5e7eb; margin-top: 28px; padding-top: 18px; display: flex; justify-content: space-between; align-items: flex-end; }
        .seal { width: 90px; height: 90px; border-radius: 50%; border: 3px solid #1a56db; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 9px; color: #1a56db; font-weight: 700; text-align: center; padding: 8px; }
        .signature { text-align: right; }
        .sig-line { border-top: 2px solid #1a2e4a; margin-bottom: 4px; width: 180px; }
        .sig-name { font-size: 13px; font-weight: 700; color: #1a2e4a; }
        .sig-title { font-size: 11px; color: #666; }
        .txn { font-size: 10px; color: #999; margin-top: 10px; text-align: center; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div style="display:flex;align-items:center;gap:12px;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" width="48" height="48">
              <path d="M60 8L16 30v32c0 28 18.7 54.2 44 62 25.3-7.8 44-34 44-62V30L60 8z" fill="#1a56db"/>
              <path d="M60 14L22 34v28c0 24.5 16 47.5 38 54.5 22-7 38-30 38-54.5V34L60 14z" fill="#1e3a8a" opacity="0.3"/>
              <path d="M60 20L28 38v24c0 21 13.5 41 32 47 18.5-6 32-26 32-47V38L60 20z" fill="#2563eb" opacity="0.5"/>
              <path d="M60 90V55" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
              <path d="M60 55c-8-12-22-16-28-14 2 10 12 20 28 18" fill="#10b981"/>
              <path d="M60 65c6-10 18-14 24-12-1.5 8.5-10 17-24 16" fill="#34d399"/>
              <circle cx="60" cy="48" r="3" fill="#6ee7b7"/>
              <circle cx="60" cy="42" r="2" fill="#a7f3d0" opacity="0.7"/>
            </svg>
            <div class="logo">SSE Impact <span>Hub</span></div>
          </div>
          <div class="cert-badge">80G Certificate</div>
        </div>
        <h1>Donation / Investment Certificate</h1>
        <p class="subtitle">Under Section 80G of the Income Tax Act, 1961 — Financial Year 2024-25</p>
        <div class="info-grid">
          <div class="info-box"><div class="info-label">Investor Name</div><div class="info-value">${user?.name || 'Investor'}</div></div>
          <div class="info-box"><div class="info-label">PAN Number</div><div class="info-value">${user?.pan || 'XXXXXXXXXX'}</div></div>
          <div class="info-box"><div class="info-label">NGO / Recipient</div><div class="info-value">${ngo.name}</div></div>
          <div class="info-box"><div class="info-label">Date of Investment</div><div class="info-value">${new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div></div>
        </div>
        <div class="amount-box">
          <div class="amount-label">Total Investment Amount (INR)</div>
          <div class="amount-value">₹${Number(amount).toLocaleString('en-IN')}</div>
        </div>
        <div class="tax-benefit">
          <div class="tax-label">📊 Estimated 80G Tax Benefit Breakdown</div>
          <div class="tax-row"><span>Eligible Deduction Amount:</span><span>₹${Number(amount).toLocaleString('en-IN')}</span></div>
          <div class="tax-row"><span>Tax Benefit @ 30% Bracket:</span><span>₹${(amount * 0.3).toLocaleString('en-IN')}</span></div>
          <div class="tax-row"><span>Tax Benefit @ 20% Bracket:</span><span>₹${(amount * 0.2).toLocaleString('en-IN')}</span></div>
        </div>
        <div class="declaration">
          <strong>Declaration:</strong> This certificate is issued to certify that the above-mentioned investment has been made through the SSE Impact Hub platform in Zero Coupon Zero Principal (ZCZP) bonds, registered under SEBI and eligible for tax deduction under Section 80G of the Income Tax Act, 1961.
        </div>
        <div class="footer">
          <div class="seal">SSE<br>IMPACT<br>HUB<br>VERIFIED</div>
          <div class="signature">
            <div class="sig-line"></div>
            <div class="sig-name">Authorised Signatory</div>
            <div class="sig-title">SSE Impact Hub Platform</div>
          </div>
        </div>
        <div class="txn">Transaction ID: ${txnId} | Computer-generated certificate, valid without physical signature.</div>
      </div>
    </body>
    </html>
  `;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  setTimeout(() => { win.print(); URL.revokeObjectURL(url); }, 800);
}

export default function Portfolio({ portfolio, user }) {
  const navigate = useNavigate();

  if (portfolio.length === 0) {
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

  const totalInvested = portfolio.reduce((sum, item) => sum + item.amount, 0);

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
            <h3 className="text-4xl font-bold text-purple-600">{portfolio.length}</h3>
          </div>
        </div>

        <h3 className="text-xl font-bold text-secondary mb-4">Investment History</h3>
        <div className="space-y-4">
          {portfolio.map((item, index) => (
            <div key={index} className="card p-5 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
              <img src={item.ngo.image} alt={item.ngo.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-lg font-bold text-secondary">{item.ngo.name}</h4>
                <p className="text-gray-500 text-sm">
                  Bond ID: ZCZP-{(item.txnId || 'TXN-' + (index + 1001)).replace('TXN-', '')} &nbsp;•&nbsp; {new Date(item.date).toLocaleDateString('en-IN')}
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
                  txnId: item.txnId || 'TXN-' + (index + 100000),
                  date: item.date
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
