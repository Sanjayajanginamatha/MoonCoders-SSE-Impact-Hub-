/**
 * Generate and download 80G Tax Certificate PDF using HTML/CSS print.
 * Designed to match the professional format of real 80G certificates
 * with receipt number, donation receipt table, digital signature,
 * 80G badge, and watermark background.
 */

function numberToWords(num) {
  if (num === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }
  return 'Rupees ' + convert(Math.abs(Math.floor(num))) + ' Only';
}

function generateReceiptNumber() {
  const timestamp = Date.now().toString().slice(-10);
  return 'RCPT-' + timestamp;
}

export default function generate80GPDF({ user, ngo, amount, txnId, date, receiptNumber }) {
  const receiptNo = receiptNumber || generateReceiptNumber();
  const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const amountInWords = numberToWords(Number(amount));
  const financialYear = (() => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    return month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  })();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>80G Tax Certificate - SSE Impact Hub | Receipt ${receiptNo}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; }

        .page {
          max-width: 800px;
          margin: 0 auto;
          padding: 0;
          position: relative;
        }

        /* ─── Decorative top border ─── */
        .top-border {
          height: 8px;
          background: linear-gradient(90deg, #1a56db, #10b981, #f59e0b, #ef4444, #1a56db);
        }

        .content {
          padding: 32px 40px 24px;
          position: relative;
          overflow: hidden;
        }

        /* ─── Watermark ─── */
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          opacity: 0.04;
          z-index: 0;
          pointer-events: none;
        }

        .watermark svg { width: 400px; height: 400px; }

        /* ─── Header ─── */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .org-info h2 {
          font-size: 22px;
          font-weight: 900;
          color: #1a56db;
          line-height: 1.2;
        }

        .org-info h2 span {
          color: #1a2e4a;
        }

        .reg-info {
          font-size: 10px;
          color: #666;
          margin-top: 4px;
          line-height: 1.5;
        }

        .reg-info strong {
          color: #1a2e4a;
        }

        /* ─── 80G Registration banner ─── */
        .reg-banner {
          background: linear-gradient(135deg, #1e3a5f, #1a56db);
          color: white;
          text-align: center;
          padding: 10px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .reg-banner p {
          font-size: 11px;
          letter-spacing: 0.5px;
          line-height: 1.6;
        }

        .reg-banner strong {
          font-size: 12px;
        }

        /* ─── Receipt & Date row ─── */
        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 2px solid #1a56db;
          border-radius: 8px;
          padding: 10px 20px;
          margin-bottom: 16px;
          background: #f0f5ff;
          position: relative;
          z-index: 1;
        }

        .meta-row .label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .meta-row .value {
          font-size: 15px;
          font-weight: 800;
          color: #1a2e4a;
        }

        /* ─── PAN display ─── */
        .pan-row {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 20px;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .pan-row .label {
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
        }

        .pan-row .value {
          font-size: 14px;
          font-weight: 700;
          color: #1a2e4a;
          letter-spacing: 2px;
        }

        /* ─── Donor acknowledgement ─── */
        .donor-ack {
          background: #fefce8;
          border-left: 4px solid #f59e0b;
          padding: 12px 18px;
          border-radius: 0 8px 8px 0;
          margin-bottom: 16px;
          font-size: 13px;
          color: #78350f;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        .donor-ack strong {
          color: #92400e;
        }

        /* ─── Amount in words ─── */
        .amount-words {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 12px 18px;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .amount-words .label {
          font-size: 11px;
          color: #15803d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .amount-words .value {
          font-size: 16px;
          font-weight: 700;
          color: #166534;
        }

        /* ─── Payment mode ─── */
        .payment-mode {
          font-size: 13px;
          color: #1a2e4a;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .payment-mode strong { color: #1a56db; }

        /* ─── Donation Receipt Table ─── */
        .receipt-title {
          text-align: center;
          font-size: 18px;
          font-weight: 800;
          color: #1a2e4a;
          margin: 20px 0 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 3px solid #1a56db;
          padding-bottom: 8px;
          position: relative;
          z-index: 1;
        }

        .receipt-intro {
          font-size: 12px;
          color: #555;
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }

        .detail-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }

        .detail-table td {
          border: 1px solid #cbd5e1;
          padding: 10px 14px;
          font-size: 13px;
        }

        .detail-table td:first-child {
          background: #f8fafc;
          font-weight: 600;
          color: #334155;
          width: 45%;
        }

        .detail-table td:last-child {
          color: #1a2e4a;
          font-weight: 500;
        }

        /* ─── Legal disclaimer ─── */
        .disclaimer {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-radius: 8px;
          padding: 12px 16px;
          font-size: 11px;
          color: #9a3412;
          line-height: 1.7;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .disclaimer strong { color: #c2410c; }

        /* ─── Note ─── */
        .note {
          font-size: 11px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        /* ─── Footer area ─── */
        .footer-area {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 2px solid #e5e7eb;
          position: relative;
          z-index: 1;
        }

        /* 80G Badge */
        .badge-80g {
          width: 90px;
          height: 90px;
          border: 3px solid #f59e0b;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fffbeb, #fef3c7);
          position: relative;
        }

        .badge-80g .badge-title {
          font-size: 22px;
          font-weight: 900;
          color: #b45309;
          line-height: 1;
        }

        .badge-80g .badge-sub {
          font-size: 7px;
          color: #92400e;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-align: center;
          line-height: 1.3;
        }

        /* Amount display */
        .amount-display {
          text-align: center;
        }

        .amount-label-sm {
          font-size: 11px;
          color: #dc2626;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .amount-big {
          font-size: 32px;
          font-weight: 900;
          color: #dc2626;
          line-height: 1;
        }

        .amount-big .rupee {
          font-size: 24px;
        }

        /* Signature block */
        .sig-block {
          text-align: center;
        }

        .digital-sig {
          width: 140px;
          height: 50px;
          margin: 0 auto 6px;
          position: relative;
        }

        .sig-name-line {
          border-top: 2px solid #1a2e4a;
          width: 160px;
          margin: 0 auto 4px;
        }

        .sig-name {
          font-size: 12px;
          font-weight: 700;
          color: #1a2e4a;
        }

        .sig-title-text {
          font-size: 10px;
          color: #666;
        }

        /* Seal */
        .seal-circle {
          width: 80px;
          height: 80px;
          border: 3px solid #1a56db;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .seal-circle span {
          font-size: 8px;
          font-weight: 800;
          color: #1a56db;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.3;
        }

        /* Tax benefit section */
        .tax-eligible {
          font-size: 11px;
          color: #15803d;
          font-weight: 600;
          margin-bottom: 4px;
          position: relative;
          z-index: 1;
        }

        /* Computer generated note */
        .comp-generated {
          text-align: center;
          font-size: 10px;
          color: #999;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #e5e7eb;
          position: relative;
          z-index: 1;
        }

        /* Thank you banner */
        .thank-you {
          text-align: center;
          margin-top: 16px;
          padding: 14px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border-radius: 8px;
          position: relative;
          z-index: 1;
        }

        .thank-you h3 {
          font-size: 22px;
          font-weight: 900;
          color: #16a34a;
          margin: 0;
        }

        /* ─── Track Impact Banner ─── */
        .track-impact {
          background: #f0f9ff;
          border-left: 4px solid #0ea5e9;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          margin-top: 20px;
          margin-bottom: 20px;
          font-size: 12px;
          color: #0369a1;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }
        .track-impact strong {
          color: #0c4a6e;
        }

        /* Bottom border */
        .bottom-border {
          height: 6px;
          background: linear-gradient(90deg, #1a56db, #10b981, #f59e0b, #ef4444, #1a56db);
        }

        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page { max-width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="top-border"></div>
        <div class="content">

          <!-- Watermark -->
          <div class="watermark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
              <path d="M60 8L16 30v32c0 28 18.7 54.2 44 62 25.3-7.8 44-34 44-62V30L60 8z" fill="#1a56db"/>
              <path d="M60 14L22 34v28c0 24.5 16 47.5 38 54.5 22-7 38-30 38-54.5V34L60 14z" fill="#1e3a8a" opacity="0.3"/>
              <path d="M60 20L28 38v24c0 21 13.5 41 32 47 18.5-6 32-26 32-47V38L60 20z" fill="#2563eb" opacity="0.5"/>
              <path d="M60 90V55" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
              <path d="M60 55c-8-12-22-16-28-14 2 10 12 20 28 18" fill="#10b981"/>
              <path d="M60 65c6-10 18-14 24-12-1.5 8.5-10 17-24 16" fill="#34d399"/>
              <circle cx="60" cy="48" r="3" fill="#6ee7b7"/>
              <circle cx="60" cy="42" r="2" fill="#a7f3d0" opacity="0.7"/>
            </svg>
          </div>

          <!-- Header -->
          <div class="header">
            <div class="header-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" width="56" height="56">
                <path d="M60 8L16 30v32c0 28 18.7 54.2 44 62 25.3-7.8 44-34 44-62V30L60 8z" fill="#1a56db"/>
                <path d="M60 14L22 34v28c0 24.5 16 47.5 38 54.5 22-7 38-30 38-54.5V34L60 14z" fill="#1e3a8a" opacity="0.3"/>
                <path d="M60 20L28 38v24c0 21 13.5 41 32 47 18.5-6 32-26 32-47V38L60 20z" fill="#2563eb" opacity="0.5"/>
                <path d="M60 90V55" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
                <path d="M60 55c-8-12-22-16-28-14 2 10 12 20 28 18" fill="#10b981"/>
                <path d="M60 65c6-10 18-14 24-12-1.5 8.5-10 17-24 16" fill="#34d399"/>
                <circle cx="60" cy="48" r="3" fill="#6ee7b7"/>
                <circle cx="60" cy="42" r="2" fill="#a7f3d0" opacity="0.7"/>
              </svg>
              <div class="org-info">
                <h2>SSE Impact <span>Hub</span></h2>
                <div class="reg-info">
                  Social Stock Exchange Platform<br>
                  <strong>SEBI Registered</strong> | PAN: <strong>AAACS1234K</strong>
                </div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:10px;color:#666;">Reg. No.</div>
              <div style="font-size:14px;font-weight:800;color:#1a56db;">SSE-2024</div>
            </div>
          </div>

          <!-- Registration Banner -->
          <div class="reg-banner">
            <p>
              <strong>REGISTRATION NO: SSE-2024 — PAN NO: AAACS1234K</strong><br>
              Order Number Granting Approval Under Section 80G (Unique Registration Number)<br>
              <strong>AAACS1234KF20245 (DIN -AAACS1234KF2024061)</strong>
            </p>
          </div>

          <!-- Receipt No & Date -->
          <div class="meta-row">
            <div>
              <div class="label">Receipt No.</div>
              <div class="value">${receiptNo}</div>
            </div>
            <div>
              <div class="label">Reference No.</div>
              <div class="value">SSE/${financialYear}</div>
            </div>
            <div style="text-align:right;">
              <div class="label">Date</div>
              <div class="value">${formattedDate}</div>
            </div>
          </div>

          <!-- PAN Row -->
          <div class="pan-row">
            <span class="label">SSE Hub PAN No: </span>
            <span class="value">AAACS1234K</span>
          </div>

          <!-- Donor Acknowledgement -->
          <div class="donor-ack">
            Received donation with thanks from Mr./Mrs./Ms./ : <strong>${user?.name || 'Investor'}</strong>
          </div>

          <!-- Amount in Words -->
          <div class="amount-words">
            <div class="label">The Sum of Rupees (In Words)</div>
            <div class="value">${amountInWords}</div>
          </div>

          <!-- Payment Mode -->
          <div class="payment-mode">
            By Cash/Draft/Cheque No. Online / NEFT.: <strong>Online (UPI / Digital Payment)</strong>
          </div>
          <div class="payment-mode">
            Donor PAN Card No: <strong>${user?.pan || 'XXXXXXXXXX'}</strong>
          </div>

          <!-- ─── DONATION RECEIPT TABLE ─── -->
          <div class="receipt-title">Donation Receipt</div>
          <p class="receipt-intro">
            We confirm the receipt of donation from Mr/Ms/Mrs <strong>${user?.name || 'Investor'}</strong> as per details below:-
          </p>

          <table class="detail-table">
            <tr>
              <td>Donation Date</td>
              <td>${formattedDate}</td>
            </tr>
            <tr>
              <td>Transaction Reference Number</td>
              <td>${txnId}</td>
            </tr>
            <tr>
              <td>Payment Mode</td>
              <td>Digital (UPI / Online)</td>
            </tr>
            <tr>
              <td>NGO / Recipient Organization</td>
              <td>${ngo.name}</td>
            </tr>
            <tr>
              <td>Total Contribution Received (Numbers)</td>
              <td>₹ ${Number(amount).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>Total Contribution Received (Words)</td>
              <td>${amountInWords}</td>
            </tr>
            <tr>
              <td>Receipt Number</td>
              <td><strong>${receiptNo}</strong></td>
            </tr>
          </table>

          <!-- Legal Disclaimer -->
          <div class="disclaimer">
            Donations to <strong>SSE Impact Hub</strong> qualify for deduction u/s 80G(5) of Income Tax Act 1961 vide
            Unique Registration Number AAACS1234KF20245 approved on March 31, 2024 which is valid until
            AY${financialYear}. This receipt is invalid in case of non-realization of the money instrument or reversal of the
            credit/debit card charge or reversal of donation amount for any reason. IT PAN: AAACS1234K.
          </div>

          <!-- Tax eligible note -->
          <p class="tax-eligible">
            ✅ Are Eligible for 50% Tax Rebate Under Section 80G Of Income Tax Act 1961
          </p>

          <!-- Note -->
          <p class="note">
            Please note that this is an acknowledgement for the receipt of the donation. We will provide you the Form 10BE
            on which income-tax deduction can be claimed as per the Income-tax rules.
          </p>

          <!-- Footer: Badge + Signature + Seal -->
          <div class="footer-area">
            <!-- 80G Badge -->
            <div>
              <div class="badge-80g">
                <div class="badge-title">80(G)</div>
                <div class="badge-sub">50% Income Tax<br>Exemption</div>
              </div>
              <div class="amount-display" style="margin-top:10px;">
                <div class="amount-label-sm">Amount</div>
                <div class="amount-big"><span class="rupee">₹</span> ${Number(amount).toLocaleString('en-IN')}/-</div>
              </div>
            </div>

            <!-- Authorized Signature with digital signature SVG -->
            <div class="sig-block">
              <div style="font-size:11px;color:#666;margin-bottom:4px;">For SSE Impact Hub</div>
              <div class="digital-sig">
                <svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" width="140" height="50">
                  <path d="M10 45 Q20 10 40 35 Q50 50 65 25 Q75 8 90 30 Q100 45 115 20 Q125 5 140 30 Q150 45 165 15 Q175 5 190 25"
                        stroke="#1a2e4a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M30 48 Q45 42 60 48 Q75 52 90 46"
                        stroke="#1a2e4a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="sig-name-line"></div>
              <div class="sig-name">Authorised Signatory</div>
              <div class="sig-title-text">SSE Impact Hub Platform</div>
            </div>

            <!-- Verified Seal -->
            <div>
              <div class="seal-circle">
                <span>SSE</span>
                <span>Impact Hub</span>
                <span style="font-size:7px;color:#10b981;">VERIFIED</span>
                <span style="font-size:6px;">SEBI REG.</span>
              </div>
            </div>
          </div>

          <!-- Track Impact -->
          <div class="track-impact">
            <strong>📊 Track Your Impact:</strong> Want to see exactly how your money is being spent? You can view the real-time fund utilization and project progress directly on the <strong>SSE Impact Hub</strong> by visiting the NGO's page.
          </div>

          <!-- Computer Generated Note -->
          <div class="comp-generated">
            This Is A Computer Generated Receipt. In case of any discrepancy or queries please email
            <strong>support@sseimpacthub.org</strong>
          </div>

          <!-- Thank You Banner -->
          <div class="thank-you">
            <h3>🙏 Thank You For Your Donation</h3>
          </div>

        </div>
        <div class="bottom-border"></div>
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
  }, 1000);
}
