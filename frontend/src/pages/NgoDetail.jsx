import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ngos } from '../data/mockData';
import axios from 'axios';
import generate80GPDF from '../utils/generate80GPDF';
import {
  ArrowLeft, Verified, TrendingUp, Info, CheckCircle,
  Download, X, Smartphone, Clock, Shield, AlertTriangle, Loader2
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



export default function NgoDetail({ user, setUser, portfolio, setPortfolio }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const ngo = ngos.find(n => n.id === parseInt(id));

  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('qr'); // 'qr' | 'loading' | 'success' | 'kyc-required'
  const [txnId, setTxnId] = useState('');
  const [receiptNo, setReceiptNo] = useState('');
  const [payError, setPayError] = useState('');
  const [imgError, setImgError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    setIsProcessing(true);
    setPaymentStep('loading');
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
      const generatedReceiptNo = 'RCPT-' + Date.now().toString().slice(-10);
      setTxnId(generatedTxnId);
      setReceiptNo(generatedReceiptNo);

      // Show loading for at least 2.5 seconds for smooth UX
      await new Promise(resolve => setTimeout(resolve, 2500));
      setPaymentStep('success');
      setIsProcessing(false);

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
      setIsProcessing(false);
      const errData = err.response?.data;
      if (errData?.action === 'COMPLETE_KYC') {
        setPaymentStep('kyc-required');
      } else if (err.code === 'ERR_NETWORK') {
        setPaymentStep('qr');
        setPayError('Cannot connect to server. Please ensure the backend is running.');
      } else {
        setPaymentStep('qr');
        setPayError(errData?.error || errData?.message || 'Payment failed. Please try again.');
      }
    }
  };

  const handleDownload80G = () => {
    generate80GPDF({ user, ngo, amount, txnId, date: investDate.current, receiptNumber: receiptNo });
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
            ) : paymentStep === 'loading' ? (
              <>
                {/* Loading Animation Step */}
                <div className="p-10 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    {/* Spinning outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div
                      className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                      style={{
                        animation: 'spin 1s linear infinite'
                      }}
                    ></div>
                    {/* Inner pulsing icon */}
                    <div
                      className="absolute inset-3 bg-gradient-to-br from-blue-50 to-sky-100 rounded-full flex items-center justify-center"
                      style={{
                        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                      }}
                    >
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-secondary mb-2">Processing Your Investment</h2>
                  <p className="text-gray-500 text-sm mb-6">Please wait while we verify and record your transaction...</p>

                  {/* Animated progress steps */}
                  <div className="space-y-3 text-left max-w-xs mx-auto">
                    <div className="flex items-center gap-3" style={{ animation: 'fadeIn 0.5s ease-in' }}>
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-green-700 font-medium">Payment received via UPI</span>
                    </div>
                    <div className="flex items-center gap-3" style={{ animation: 'fadeIn 1s ease-in' }}>
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4" style={{ animation: 'spin 1s linear infinite' }} />
                      </div>
                      <span className="text-sm text-blue-700 font-medium">Verifying transaction details...</span>
                    </div>
                    <div className="flex items-center gap-3" style={{ animation: 'fadeIn 1.5s ease-in' }}>
                      <div className="w-6 h-6 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center shrink-0">
                        <Download className="w-3 h-3" />
                      </div>
                      <span className="text-sm text-gray-400 font-medium">Generating 80G Certificate...</span>
                    </div>
                  </div>

                  <div className="mt-6 text-xs text-gray-400">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Secured by SEBI {"&"} NPCI protocols
                  </div>
                </div>

                {/* Inline keyframes for the loading animation */}
                <style>{`
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(0.95); }
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
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
                      <span className="text-gray-500">Receipt No.</span>
                      <span className="font-mono font-semibold text-primary">{receiptNo}</span>
                    </div>
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
