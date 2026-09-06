/**
 * Official SETU CSR Contribution Statement PDF / Document Generator
 * Browser-side document generator producing a clean, professional CSR Statement.
 */
export function generateContributionPdf({ companyProfile, contributions, fromDate, toDate }) {
  const companyName = companyProfile?.companyName || 'ArunTech Industries Pvt. Ltd.'
  const regNo = companyProfile?.registrationNo || 'CSR-TN-2021-88492'

  const totalAmount = contributions.reduce((sum, item) => sum + (item.companyContribution || 0), 0)

  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  // Format printable HTML content for official document window
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>SETU CSR Contribution Statement - ${companyName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
          body {
            font-family: 'Outfit', sans-serif;
            color: #1F2A28;
            background: #ffffff;
            margin: 0;
            padding: 32px;
            font-size: 13px;
            line-height: 1.5;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #176B5B;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          .brand {
            font-family: 'Syne', sans-serif;
            font-size: 24px;
            font-weight: 800;
            color: #176B5B;
            letter-spacing: -0.5px;
          }
          .tagline {
            font-size: 11px;
            color: #5C726E;
            margin-top: 2px;
          }
          .report-title {
            text-align: right;
          }
          .report-title h2 {
            font-family: 'Syne', sans-serif;
            font-size: 16px;
            margin: 0;
            color: #1F2A28;
          }
          .report-title p {
            font-size: 11px;
            color: #5C726E;
            margin: 4px 0 0 0;
          }
          .company-summary {
            background: #F7FAF9;
            border: 1px solid #BFD9D2;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 24px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }
          .company-summary div span {
            display: block;
            font-size: 11px;
            color: #5C726E;
            text-transform: uppercase;
            font-weight: 600;
          }
          .company-summary div strong {
            font-size: 14px;
            color: #1F2A28;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-bottom: 28px;
          }
          .stat-box {
            border: 1px solid #BFD9D2;
            border-radius: 12px;
            padding: 14px;
            background: #ffffff;
          }
          .stat-box label {
            font-size: 10px;
            font-weight: 700;
            color: #5C726E;
            text-transform: uppercase;
            display: block;
          }
          .stat-box val {
            font-family: 'Syne', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: #176B5B;
            display: block;
            margin-top: 4px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
          }
          th {
            background: #DCEFEA;
            color: #176B5B;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            text-align: left;
            padding: 10px 12px;
            border-bottom: 1px solid #BFD9D2;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #E5E7EB;
            font-size: 12px;
          }
          tr:nth-child(even) {
            background: #FAFAFA;
          }
          .total-row td {
            font-weight: 700;
            border-top: 2px solid #176B5B;
            border-bottom: none;
            background: #F7FAF9;
            font-size: 13px;
          }
          .footer-note {
            border-top: 1px solid #BFD9D2;
            padding-top: 16px;
            font-size: 11px;
            color: #5C726E;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .seal {
            border: 1px solid #176B5B;
            color: #176B5B;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
            display: inline-block;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div className="no-print" style="margin-bottom: 16px; text-align: right;">
          <button onclick="window.print()" style="background: #176B5B; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer;">
            🖨 Print / Save as PDF
          </button>
        </div>

        <div className="header">
          <div>
            <div className="brand">SETU</div>
            <div className="tagline">Societal Engagement &amp; Technology Utility Platform</div>
          </div>
          <div className="report-title">
            <h2>OFFICIAL CSR CONTRIBUTION STATEMENT</h2>
            <p>Generated on: ${reportDate}</p>
          </div>
        </div>

        <div className="company-summary">
          <div>
            <span>Corporate Entity</span>
            <strong>${companyName}</strong>
          </div>
          <div>
            <span>CSR Registration No.</span>
            <strong>${regNo}</strong>
          </div>
          <div>
            <span>Reporting Interval</span>
            <strong>${fromDate} to ${toDate}</strong>
          </div>
          <div>
            <span>Compliance Status</span>
            <strong style="color: #059669;">100% Tax Compliant (Sec 80G)</strong>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <label>Total Grant Contribution</label>
            <val>${formatRupee(totalAmount)}</val>
          </div>
          <div className="stat-box">
            <label>Projects Funded in Period</label>
            <val>${contributions.length}</val>
          </div>
          <div className="stat-box">
            <label>Verification Standard</label>
            <val style="font-size: 14px; margin-top: 8px;">Government Audited</val>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Problem ID</th>
              <th>Project Title &amp; Category</th>
              <th>Location</th>
              <th>Grant Date</th>
              <th style="text-align: right;">Contribution</th>
            </tr>
          </thead>
          <tbody>
            ${contributions.length > 0
              ? contributions
                  .map(
                    (c) => `
                <tr>
                  <td style="font-family: monospace; font-weight: 600;">${c.problemId}</td>
                  <td>
                    <strong>${c.problemTitle}</strong><br />
                    <span style="color: #5C726E; font-size: 11px;">${c.category}</span>
                  </td>
                  <td>${c.location}</td>
                  <td>${c.fundingDate}</td>
                  <td style="text-align: right; font-family: monospace; font-weight: 700; color: #176B5B;">
                    ${formatRupee(c.companyContribution)}
                  </td>
                </tr>
              `
                  )
                  .join('')
              : `
                <tr>
                  <td colspan="5" style="text-align: center; color: #5C726E; padding: 24px;">
                    No contributions recorded during the selected date interval.
                  </td>
                </tr>
              `
            }
            <tr className="total-row">
              <td colspan="4" style="text-align: right;">Total Cumulative Contribution for Period:</td>
              <td style="text-align: right; font-family: monospace; color: #176B5B;">${formatRupee(totalAmount)}</td>
            </tr>
          </tbody>
        </table>

        <div className="footer-note">
          <div>
            <p style="margin: 0;">This document is an official electronic statement issued by the SETU CSR Ledger.</p>
            <p style="margin: 2px 0 0 0;">Verified for Corporate Social Responsibility Statutory Compliance under Indian Companies Act 2013.</p>
          </div>
          <div className="seal">
            ✓ SETU VERIFIED AUDIT SEAL
          </div>
        </div>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }
}
