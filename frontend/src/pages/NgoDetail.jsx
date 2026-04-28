import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ngos } from '../data/mockData';
import axios from 'axios';
import {
  ArrowLeft, Verified, TrendingUp, Info, CheckCircle,
  Download, X, Smartphone, Clock, Shield, AlertTriangle
} from 'lucide-react';

// Payment QR — uses static image from /public/payment-qr.jpg
// Falls back to a generated UPI QR if the image file is missing
function UpiQr({ amount, ngoName }) {
  const [imgError, setImgError] = useState(false);
  const upiId = 'ssehub@ybl';
  const displayAmount = amount || 0;
  const upiString = `upi://pay?pa=${upiId}&pn=SSE+Impact+Hub&am=${displayAmount}&cu=INR&tn=ZCZP+Bond+${encodeURIComponent(ngoName)}`;
  const fallbackQr = `https://api.qrserver.com/v1/create-qr-code/?size=208x208&data=${encodeURIComponent(upiString)}`;

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-primary bg-black p-2">
        <img
          src={imgError ? fallbackQr : "/payment-qr.jpg"}
          alt="Payment QR Code"
          className="w-52 h-52 object-contain rounded-xl"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="mt-3 flex flex-col items-center gap-1">
        <p className="text-xs text-gray-500 font-mono bg-gray-50 px-3 py-1 rounded-full border">
          {upiId} &nbsp;|&nbsp; SSE Impact Hub
        </p>
        <p className="text-xs text-amber-600 font-semibold">
          Amount: ₹{Number(displayAmount).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// Generate and download 80G PDF using HTML/CSS print
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
          <div class="info-box">
            <div class="info-label">Investor Name</div>
            <div class="info-value">${user?.name || 'Investor'}</div>
          </div>
          <div class="info-box">
            <div class="info-label">PAN Number</div>
            <div class="info-value">${user?.pan || 'XXXXXXXXXX'}</div>
          </div>
          <div class="info-box">
            <div class="info-label">NGO / Recipient</div>
            <div class="info-value">${ngo.name}</div>
          </div>
          <div class="info-box">
            <div class="info-label">Date of Investment</div>
            <div class="info-value">${new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          </div>
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
          <strong>Declaration:</strong> This certificate is issued to certify that the above-mentioned investment has been made through the SSE Impact Hub platform in Zero Coupon Zero Principal (ZCZP) bonds, which are registered under the Securities and Exchange Board of India (SEBI) and are eligible for tax deduction under Section 80G of the Income Tax Act, 1961. The NGO is registered under 12A and 80G provisions.
        </div>

        <div class="footer">
          <div class="seal">SSE<br>IMPACT<br>HUB<br>VERIFIED</div>
          <div class="signature">
            <div class="sig-line"></div>
            <div class="sig-name">Authorised Signatory</div>
            <div class="sig-title">SSE Impact Hub Platform</div>
          </div>
        </div>

        <div class="txn">Transaction ID: ${txnId} | This is a computer-generated certificate and is valid without a physical signature.</div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  setTimeout(() => {
    win.print();
    URL.revokeObjectURL(url);
  }, 800);
}

export default function NgoDetail({ user, setUser, portfolio, setPortfolio }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const ngo = ngos.find(n => n.id === parseInt(id));

  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('qr'); // 'qr' | 'success' | 'kyc-required'
  const [txnId, setTxnId] = useState('');
  const [payError, setPayError] = useState('');
  const [imgError, setImgError] = useState(false);
  const investDate = useRef(new Date().toISOString());

  if (!ngo) return <div className="p-8 text-center text-gray-500">NGO not found</div>;

  const percent = Math.min(100, Math.round((ngo.raised / ngo.target) * 100));

  // Get current user from localStorage (always fresh)
  const currentUser = user || JSON.parse(localStorage.getItem('user') || 'null');

  const handlePayment = () => {
    if (!amount || amount < 1000) {
      alert('Minimum investment is ₹1,000');
      return;
    }
    // Check KYC before even showing modal
    if (!currentUser?.kycVerified) {
      setPaymentStep('kyc-required');
      setShowModal(true);
      return;
    }
    setPayError('');
    setShowModal(true);
    setPaymentStep('qr');
  };

  const confirmPayment = async () => {
    setPayError('');
    const investAmount = Number(amount) || 0;
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:8080/api/invest',
        { ngoId: ngo.id, amount: investAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedInvestment = res.data.investment || {};
      const generatedTxnId = savedInvestment.transactionId || ('ZCZP-' + Math.random().toString(36).substr(2, 8).toUpperCase());
      setTxnId(generatedTxnId);
      setPaymentStep('success');

      // Update local portfolio state
      setPortfolio([...portfolio, {
        ngo,
        amount: investAmount,
        date: investDate.current,
        txnId: generatedTxnId
      }]);

      // Mutate in-memory NGO raised amount so UI updates
      ngo.raised += investAmount;

      // Award impact points
      const pointsEarned = Math.floor(investAmount / 10);
      if (setUser) {
        setUser(prev => {
          const updated = { ...prev, impactPoints: (prev?.impactPoints || 0) + pointsEarned };
          localStorage.setItem('user', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.action === 'COMPLETE_KYC') {
        setPaymentStep('kyc-required');
      } else if (err.code === 'ERR_NETWORK') {
        setPayError('Cannot connect to server. Please ensure the backend is running.');
      } else {
        setPayError(errData?.error || errData?.message || 'Payment failed. Please try again.');
      }
    }
  };

  const handleDownload80G = () => {
    generate80GPDF({ user, ngo, amount, txnId, date: investDate.current });
  };

  const closeModal = () => {
    setShowModal(false);
    if (paymentStep === 'success') navigate('/portfolio');
  };

  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex-1 p-8">
        <button onClick={() => navigate('/dashboard')} className="btn btn-outline mb-6 px-3 py-1.5 text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </button>

        <div className="card p-0 overflow-hidden flex flex-col xl:flex-row">
          <div className="xl:w-2/5 h-64 xl:h-auto relative bg-gray-100">
            <img
              src={imgError ? 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80' : ngo.image}
              alt={ngo.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="xl:w-3/5 p-8">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl font-bold text-secondary">{ngo.name}</h2>
              <div className="border border-primary text-primary px-3 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
                <Verified className="w-4 h-4" /> Eligible for 80G
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {ngo.sdgs.map(tag => (
                <span key={tag} className="bg-sky-50 text-primary px-3 py-1 rounded-full text-sm">{tag}</span>
              ))}
            </div>

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{ngo.description}</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-border">
              <h3 className="font-semibold text-secondary flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Measurable Impact (SROI)
              </h3>
              <p className="text-gray-700">{ngo.impact}</p>
              <p className="text-gray-500 text-sm mt-2">* For every ₹1000 invested, an estimated social return of ₹3500 is generated.</p>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-lg mb-2">
                <span className="font-bold text-secondary">₹{ngo.raised.toLocaleString()} raised</span>
                <span className="text-gray-500">Target: ₹{ngo.target.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-white">
              <h3 className="font-semibold text-secondary mb-4 text-lg">Invest in ZCZP Bond</h3>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">₹</span>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setAmount(val === '' ? '' : parseInt(val) || '');
                    }}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary font-bold text-lg"
                    placeholder="Enter amount"
                  />
                </div>
                <button onClick={handlePayment} className="btn btn-primary py-3 px-8 text-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed" disabled={!amount || amount < 1000}>
                  Proceed to Pay
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-3 flex items-start gap-1">
                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                By proceeding, you agree that this is a zero principal bond. Your capital will be used entirely for social impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
            {paymentStep === 'qr' ? (
              <>
                {/* QR Payment Step */}
                <div className="bg-gradient-to-br from-primary to-blue-700 text-white px-6 py-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Scan & Pay via UPI</h2>
                    <p className="text-blue-100 text-sm mt-0.5">Investment in {ngo.name}</p>
                  </div>
                  <button onClick={closeModal} className="bg-white/20 hover:bg-white/30 rounded-full p-1.5">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="text-center mb-5">
                    <p className="text-sm text-gray-500">Amount to Pay</p>
                    <p className="text-4xl font-black text-secondary mt-1">₹{Number(amount || 0).toLocaleString()}</p>
                  </div>

                  <UpiQr amount={amount} ngoName={ngo.name} />

                  <div className="mt-5 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary shrink-0" />
                      <span>Open any UPI app (GPay, PhonePe, Paytm, BHIM) and scan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span>QR valid for 10 minutes. Do not refresh.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      <span>End-to-end encrypted. 100% secure via NPCI.</span>
                    </div>
                  </div>

                  <button
                    onClick={confirmPayment}
                    className="w-full btn btn-primary py-3 mt-5 text-base"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    I've Completed the Payment
                  </button>
                </div>
              </>
            ) : paymentStep === 'kyc-required' ? (
              <>
                {/* KYC Blocking Step — PAN & Demat verification required */}
                <div className="bg-gradient-to-br from-amber-500 to-red-500 text-white px-6 py-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">⚠️ Verification Required</h2>
                    <p className="text-amber-100 text-sm mt-0.5">Complete KYC to invest in ZCZP bonds</p>
                  </div>
                  <button onClick={closeModal} className="bg-white/20 hover:bg-white/30 rounded-full p-1.5">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="text-center mb-5">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">PAN & Demat Verification Pending</h3>
                    <p className="text-gray-600 text-sm">
                      As per SEBI regulations, you must verify your <strong>PAN Card</strong> and link your <strong>Demat Account</strong> before investing in Zero Coupon Zero Principal (ZCZP) bonds.
                    </p>
                  </div>

                  {/* Checklist of what's needed */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-border mb-5 space-y-3">
                    <div className="flex items-center gap-3">
                      {currentUser?.panVerified ? (
                        <div className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 bg-red-100 text-red-500 rounded-full flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <p className={`font-semibold text-sm ${currentUser?.panVerified ? 'text-green-700' : 'text-red-600'}`}>
                          {currentUser?.panVerified ? 'PAN Card Verified ✅' : 'PAN Card — Not Verified'}
                        </p>
                        <p className="text-xs text-gray-500">Required for 80G tax deduction & SEBI compliance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {currentUser?.dematAccountNumber ? (
                        <div className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 bg-red-100 text-red-500 rounded-full flex items-center justify-center shrink-0">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <p className={`font-semibold text-sm ${currentUser?.dematAccountNumber ? 'text-green-700' : 'text-red-600'}`}>
                          {currentUser?.dematAccountNumber ? 'Demat Account Linked ✅' : 'Demat Account — Not Linked'}
                        </p>
                        <p className="text-xs text-gray-500">SEBI mandates Demat to hold ZCZP bonds electronically</p>
                      </div>
                    </div>
                  </div>

                  {/* Help for users without Demat */}
                  {!currentUser?.dematAccountNumber && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
                      <p className="text-xs font-bold text-blue-800 mb-1">💡 Don't have a Demat account?</p>
                      <p className="text-xs text-blue-700 mb-2">Open a free Demat account in minutes with any of these SEBI-registered brokers:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-white border border-blue-200 px-2 py-1 rounded-full text-blue-700 font-medium">Zerodha</span>
                        <span className="text-xs bg-white border border-blue-200 px-2 py-1 rounded-full text-blue-700 font-medium">Groww</span>
                        <span className="text-xs bg-white border border-blue-200 px-2 py-1 rounded-full text-blue-700 font-medium">Upstox</span>
                        <span className="text-xs bg-white border border-blue-200 px-2 py-1 rounded-full text-blue-700 font-medium">Angel One</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => { closeModal(); navigate('/account'); }}
                      className="w-full btn btn-primary py-3 flex items-center justify-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Go to Account & Complete Verification
                    </button>
                    <button
                      onClick={closeModal}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Success Step */}
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary mb-2">Investment Successful!</h2>
                  <p className="text-gray-600 mb-5 text-sm">You invested <strong>₹{Number(amount || 0).toLocaleString()}</strong> in <strong>{ngo.name}</strong> via ZCZP bonds.</p>

                  <div className="bg-gray-50 rounded-xl p-4 text-left border border-border mb-5 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Bond ID</span>
                      <span className="font-mono font-semibold text-secondary">{txnId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Date</span>
                      <span className="font-semibold text-secondary">{new Date().toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">80G Deduction</span>
                      <span className="font-semibold text-green-600">₹{Number(amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Held in Demat</span>
                      <span className="font-mono font-semibold text-secondary text-xs">{currentUser?.dematAccountNumber}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleDownload80G}
                      className="w-full btn btn-outline py-2.5 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download 80G Certificate
                    </button>
                    <button
                      onClick={closeModal}
                      className="w-full btn btn-primary py-2.5"
                    >
                      View My Portfolio
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
