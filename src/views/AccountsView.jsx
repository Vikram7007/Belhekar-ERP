import { useState } from 'react';
import { IconPrint } from '../components/Icons';
import logoImg from '../assets/belhekar-logo.jpeg';
import dnyLogo from '../assets/dnyaneshwar-logo.png';

function dateStamp() {
  const now = new Date();
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') +
    ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
}

export default function AccountsView({ db, setDb, currentRole }) {
  const [yearFilter, setYearFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedEnroll, setSelectedEnroll] = useState('');
  const [feeType, setFeeType] = useState('Tuition Fees');
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash');
  const [lastReceipt, setLastReceipt] = useState(null); // { tx, student }

  const canManage = currentRole === 'admin' || currentRole === 'accountant';
  const selectedStudent = db.students.find((s) => s.enrollid === selectedEnroll);

  function handleSelectStudent(enrollid) {
    setSelectedEnroll(enrollid);
    const s = db.students.find((x) => x.enrollid === enrollid);
    setAmount(s ? String(s.outstanding) : '');
  }

  const filteredStudents = db.students.filter((s) => {
    const matchYear = !yearFilter || s.yearClass === yearFilter;
    const matchDept = !deptFilter || s.dept === deptFilter;
    const query = studentSearch.trim().toLowerCase();
    const matchStudent = !query || s.name.toLowerCase().includes(query) || s.enrollid.toLowerCase().includes(query);
    return matchYear && matchDept && matchStudent;
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!canManage) {
      alert('Access Blocked: Fee desk requires Accountant role.');
      return;
    }
    if (!selectedEnroll || !selectedStudent) return;

    const amt = parseFloat(amount) || 0;
    if (amt > selectedStudent.outstanding) {
      alert('Payment exceeds outstanding balance!');
      return;
    }

    const newOutstanding = Math.max(0, selectedStudent.outstanding - amt);
    const txId = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    const txnObj = {
      txId, enrollid: selectedEnroll, name: selectedStudent.name,
      type: feeType, amount: amt, mode, date: dateStamp()
    };

    const updatedStudent = { ...selectedStudent, outstanding: newOutstanding };

    setDb((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.enrollid === selectedEnroll ? updatedStudent : s)),
      transactions: [...prev.transactions, txnObj]
    }));

    setLastReceipt({ tx: txnObj, student: updatedStudent });
    setAmount(String(newOutstanding));
    alert('Transaction Posted Successfully!');
  }

  function printReceipt() {
    if (!lastReceipt) {
      alert('No printable invoice exists. Record a fee transaction first!');
      return;
    }
    const target = document.getElementById('receipt-print-section');
    target.classList.add('printable-document-container');
    window.print();
    target.classList.remove('printable-document-container');
  }

  return (
    <section className="module-view active" id="view-accounts">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Financial Ledger &amp; Fee Desk</h2>
          <p>Track student payments, outstanding balances, generate PDF invoices and print payment receipts.</p>
        </div>
      </div>

      <div className="fee-payment-container">
        <div className="panel-card">
          <div className="panel-title">Record Student Fee Payment</div>
          <form id="fee-payment-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fee-year-filter">Filter by Class Year</label>
                <select id="fee-year-filter" className="form-input" value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setSelectedEnroll('');
                    setAmount('');
                  }}>
                  <option value="">All Years</option>
                  <option value="FE">First Year (FE)</option>
                  <option value="SE">Second Year (SE)</option>
                  <option value="TE">Third Year (TE)</option>
                  <option value="BE">Final Year (BE)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fee-dept-filter">Filter by Branch</label>
                <select id="fee-dept-filter" className="form-input" value={deptFilter}
                  onChange={(e) => {
                    setDeptFilter(e.target.value);
                    setSelectedEnroll('');
                    setAmount('');
                  }}>
                  <option value="">All Branches</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="fee-student-search">Search Student</label>
                <input
                  id="fee-student-search"
                  type="search"
                  className="form-input"
                  placeholder="Search by student name or enrollment ID"
                  value={studentSearch}
                  onChange={(e) => {
                    setStudentSearch(e.target.value);
                    setSelectedEnroll('');
                    setAmount('');
                  }}
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="fee-student-select">Select Student (Active Registry)</label>
                <select id="fee-student-select" className="form-input" value={selectedEnroll}
                  onChange={(e) => handleSelectStudent(e.target.value)} required>
                  <option value="">-- Choose Student --</option>
                  {filteredStudents.map((s) => (
                    <option value={s.enrollid} key={s.enrollid}>{s.name} ({s.enrollid})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Department</label>
                <input type="text" className="form-input" disabled value={selectedStudent?.dept || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Admission Category</label>
                <input type="text" className="form-input" disabled value={selectedStudent?.category || ''} readOnly />
              </div>

              <div className="form-group">
                <label>Scholarship Eligible</label>
                <input type="text" className="form-input" disabled value={selectedStudent?.scholarshipEligible || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Outstanding Balance</label>
                <input type="text" className="form-input" disabled style={{ fontWeight: 700, color: 'var(--danger)' }}
                  value={selectedStudent ? '₹ ' + selectedStudent.outstanding.toLocaleString('en-IN') : ''} readOnly />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="fee-type-select">Payment Head Category</label>
                <select id="fee-type-select" className="form-input" value={feeType} onChange={(e) => setFeeType(e.target.value)} required>
                  <option value="Tuition Fees">Tuition Fees</option>
                  <option value="Development Fees">Development Fees</option>
                  <option value="Exam Fees">Exam Fees</option>
                  <option value="Bonafide Fees">Bonafide Fees</option>
                  <option value="15A Fees">15A Fees</option>
                  <option value="LC Fees">LC Fees</option>
                  <option value="Other Fees">Other Fees</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fee-amount-input">Amount to Pay (₹)</label>
                <input type="number" id="fee-amount-input" className="form-input" placeholder="e.g. 15000" min="1" required
                  max={selectedStudent && selectedStudent.outstanding > 0 ? selectedStudent.outstanding : ""} 
                  value={amount} onChange={(e) => setAmount(e.target.value)} 
                  disabled={selectedStudent && selectedStudent.outstanding === 0} 
                />
                {selectedStudent && selectedStudent.outstanding === 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>
                    Student has no outstanding fees.
                  </span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="fee-mode-select">Transaction Mode</label>
                <select id="fee-mode-select" className="form-input" value={mode} onChange={(e) => setMode(e.target.value)} required>
                  <option value="Cash">Cash</option>
                  <option value="UPI / Online">UPI / Online</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Scholarship Disbursement">Scholarship Adjustment</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-full">Post Payment &amp; Generate Receipt</button>
          </form>
        </div>

        <div className="panel-card">
          <div className="panel-title">
            <span>Dynamic Invoice Receipt Preview</span>
            <button className="btn btn-secondary" onClick={printReceipt} type="button">
              <IconPrint />
              Print Receipt
            </button>
          </div>

          <div className="printable-document-container">
            <div className="receipt-preview-card" id="receipt-print-section">
              {!lastReceipt ? (
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h3>NO RECEIPT GENERATED</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Please post a payment transaction first.</p>
                </div>
              ) : (
                <ReceiptPreview tx={lastReceipt.tx} student={lastReceipt.student} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReceiptPreview({ tx, student }) {
  return (
    <div className="receipt-premium-container">
      <div className="dnyaneshwar-header">
        <div className="dny-logo-left">
          <img src={dnyLogo} alt="Dnyaneshwar Logo" className="receipt-logo" style={{ width: '100px', height: 'auto', border: 'none', boxShadow: 'none' }} />
        </div>
        <div className="dny-header-text">
          <div className="dny-badge">Used for Scholarship only</div>
          <div className="dny-line-1">Sulochana Belhekar Samajik Va Bahu Uddeshiya Shikshan Sanstha</div>
          <div className="dny-line-2">DNYANESHWAR POLYTECHNIC</div>
          <div className="dny-line-3">AICTE. DTE Approved and MSBTE Mumbai Affiliated DTE 5248, MSBTE-1174</div>
          <div className="dny-line-4">
            Email- <a href="mailto:1174principal@msbte.ac.in">1174principal@msbte.ac.in</a>; Web <a href="https://belhekargroupofinstitute.in/">https://belhekargroupofinstitute.in/</a>
          </div>
          <div className="dny-line-5">Bhanashivre, Tal: Newasa, Dist: Ahmednagar (Maharshtra) 414609 Phone/Fax- (02427)</div>
          <div className="dny-line-6">297099; 8830443056</div>
        </div>
        <div className="dny-logo-right">
          <img src={logoImg} alt="Belhekar Logo" className="receipt-logo" style={{ width: '100px', height: 'auto', border: 'none', boxShadow: 'none' }} />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '2px solid black', margin: '0 0 1.5rem 0' }} />

      <div className="receipt-meta-grid">
        <div className="meta-box">
          <span className="meta-label">Receipt No:</span>
          <span className="meta-value"><strong>{tx.txId}</strong></span>
        </div>
        <div className="meta-box" style={{ textAlign: 'right' }}>
          <span className="meta-label">Date &amp; Time:</span>
          <span className="meta-value">{tx.date}</span>
        </div>
      </div>

      <div className="receipt-student-card">
        <div className="student-grid">
          <div className="student-detail">
            <span className="detail-label">Enrollment No:</span>
            <span className="detail-value">{student.enrollid}</span>
          </div>
          <div className="student-detail">
            <span className="detail-label">Student Name:</span>
            <span className="detail-value">{student.name}</span>
          </div>
          <div className="student-detail">
            <span className="detail-label">Department:</span>
            <span className="detail-value">{student.dept}</span>
          </div>
          <div className="student-detail">
            <span className="detail-label">Academic Year:</span>
            <span className="detail-value">{student.academicYear || '-'}</span>
          </div>
          <div className="student-detail">
            <span className="detail-label">Class Year:</span>
            <span className="detail-value">{student.yearClass}</span>
          </div>
          <div className="student-detail">
            <span className="detail-label">Payment Mode:</span>
            <span className="detail-value"><span className="badge badge-success">{tx.mode}</span></span>
          </div>
        </div>
      </div>

      <table className="receipt-premium-table">
        <thead>
          <tr>
            <th width="15%">Sr.No.</th>
            <th>Particulars (Payment Head)</th>
            <th style={{ textAlign: 'right' }} width="30%">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ textAlign: 'center' }}>1</td>
            <td>{tx.type}</td>
            <td style={{ textAlign: 'right' }}>₹ {tx.amount.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className="total-label" style={{ textAlign: 'right' }}>Total Amount Paid:</td>
            <td className="total-amount" style={{ textAlign: 'right' }}>₹ {tx.amount.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>

      <div className="receipt-outstanding-row">
        <span>Remaining Outstanding Balance:</span>
        <span className="outstanding-amt">₹ {student.outstanding.toLocaleString('en-IN')}</span>
      </div>

      <div className="receipt-signatures">
        <div className="signature-box">
          <div className="signature-line"></div>
          <span>Student's Signature</span>
        </div>
        <div className="signature-box">
          <div className="signature-line"></div>
          <span>Accountant / Cashier</span>
        </div>
      </div>

      <div className="receipt-footer">
        This is a computer generated fee payment voucher slip from Belhekar Institutional ERP system.
      </div>
    </div>
  );
}
