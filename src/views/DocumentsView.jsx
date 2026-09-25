import { useEffect, useRef, useState } from 'react';
import { IconPrint } from '../components/Icons';
import belhekarLogo from '../assets/belhekar-logo.jpeg';
import dnyaneshwarLogo from '../assets/dnyaneshwar-logo.png';

const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function numToWords(n) {
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return tens[t] + (o ? ' ' + ones[o] : '');
}

function dateToWords(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  
  const dayStr = numToWords(d);
  const monthStr = months[m-1];
  
  let yearStr = '';
  if (y >= 2000) {
    const rem = y - 2000;
    yearStr = 'Two Thousand' + (rem > 0 ? ' ' + numToWords(rem) : '');
  } else if (y >= 1900) {
    const rem = y - 1900;
    yearStr = 'Nineteen Hundred' + (rem > 0 ? ' ' + numToWords(rem) : '');
  }
  
  return `${dayStr} ${monthStr} ${yearStr}`;
}

// Real Belhekar / Dnyaneshwar Polytechnic documents, added as-is.
// Each entry points to the original document (kept for download) and a
// PDF rendition used for on-screen preview so the layout, fonts and page
// size look exactly the same as the original Word file.
const DOCUMENT_LIBRARY = [
  {
    key: 'bonafide',
    label: 'Bonafide Certificate',
    file: 'bonafide.pdf',
    original: 'bonafide.docx',
    originalName: 'Bonafied.docx'
  },
  {
    key: 'leaving',
    label: 'Leaving Certificate (LC)',
    file: 'leaving-certificate.pdf',
    original: 'leaving-certificate.docx',
    originalName: 'LC.docx'
  },
  {
    key: '15a',
    label: '15A Form (Tax Verification)',
    file: '15a-form.pdf',
    original: '15a-form.docx',
    originalName: '15A For 2026.docx'
  },
  {
    key: 'college-letter',
    label: 'Caste Validity College Letter',
    file: 'college-letter-caste-validity.pdf',
    original: 'college-letter-caste-validity.docx',
    originalName: 'College Letter 2026.docx'
  }
];

export default function DocumentsView({ db }) {
  const [docKey, setDocKey] = useState(DOCUMENT_LIBRARY[0].key);
  const [selectedStudentId, setSelectedStudentId] = useState(() => db?.students?.[0]?.enrollid || '');
  const [studentSearch, setStudentSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('');
  const iframeRef = useRef(null);

  const activeDoc = DOCUMENT_LIBRARY.find((d) => d.key === docKey) || DOCUMENT_LIBRARY[0];
  const pdfUrl = `/documents/${activeDoc.file}`;
  const originalUrl = `/documents/${activeDoc.original}`;

  const printBonafideRef = useRef(null);
  const printLeavingRef = useRef(null);
  const print15aRef = useRef(null);
  const printCollegeLetterRef = useRef(null);

  function handleFilterChange(setter, value) {
    setter(value);
    setSelectedStudentId('');
  }

  const filteredStudents = db?.students?.filter(s => {
    const query = studentSearch.trim().toLowerCase();
    const matchesSearch = !query || s.name.toLowerCase().includes(query) || s.enrollid.toLowerCase().includes(query);
    const matchesYear = !yearFilter || s.yearClass === yearFilter;
    const matchesDept = !deptFilter || s.dept === deptFilter;
    const matchesAcademicYear = !academicYearFilter || s.academicYear === academicYearFilter;
    return matchesSearch && matchesYear && matchesDept && matchesAcademicYear;
  }) || [];

  useEffect(() => {
    if (!filteredStudents.some((student) => student.enrollid === selectedStudentId)) {
      setSelectedStudentId(filteredStudents[0]?.enrollid || '');
    }
  }, [filteredStudents, selectedStudentId]);

  function printDoc() {
    if (['bonafide', 'leaving', '15a', 'college-letter'].includes(docKey)) {
      let content = '';
      let title = '';
      if (docKey === 'bonafide') {
        content = printBonafideRef.current.innerHTML;
        title = 'Bonafide Certificate';
      } else if (docKey === 'leaving') {
        content = printLeavingRef.current.innerHTML;
        title = 'Leaving Certificate';
      } else if (docKey === '15a') {
        content = print15aRef.current.innerHTML;
        title = '15A Form (Tax Verification)';
      } else if (docKey === 'college-letter') {
        content = printCollegeLetterRef.current.innerHTML;
        title = 'Caste Validity College Letter';
      }

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: "Times New Roman", Times, serif;
                margin: 0;
                padding: 20px; /* Provides space since page margin is 0 */
                background: white;
                color: black;
                box-sizing: border-box;
              }
              .print-wrapper {
                box-sizing: border-box;
                width: 100%;
              }
              .print-wrapper > div {
                min-height: auto !important; /* Remove min-height to fit on one page */
                box-shadow: none !important;
                margin: 0 auto;
                max-width: 190mm;
                /* Slight scale down if content is too tall */
                transform-origin: top center;
              }
              .college-letter-print-container {
                width: 190mm !important;
                max-width: 190mm !important;
                min-height: 0 !important;
                padding: 7mm 8mm 8mm !important;
                border: 1px solid #111;
                box-shadow: none !important;
                font-family: "Times New Roman", Times, serif;
                font-size: 9.5pt;
                line-height: 1.25;
              }
              .college-letter-top-note {
                width: max-content;
                margin: 0 auto 3mm;
                padding: 1mm 3mm;
                background: #fff200;
                font-size: 8pt;
                font-weight: 700;
              }
              .college-letter-header {
                display: grid;
                grid-template-columns: 22mm 1fr 22mm;
                align-items: center;
                gap: 3mm;
                padding-bottom: 2mm;
                border-bottom: 1px solid #111;
                text-align: center;
              }
              .college-letter-header img {
                width: 22mm;
                height: 22mm;
                object-fit: contain;
              }
              .college-letter-trust { font-size: 7.5pt; }
              .college-letter-header h2 {
                margin: 0.5mm 0;
                color: #c00000;
                font-size: 17pt;
                font-weight: 700;
              }
              .college-letter-header strong,
              .college-letter-header div:last-child { font-size: 7pt; }
              .college-letter-meta {
                display: flex;
                justify-content: space-between;
                padding: 2mm 0;
                border-bottom: 1px solid #111;
                font-size: 8pt;
                font-weight: 700;
              }
              .college-letter-body {
                padding: 7mm 2mm 0;
                font-size: 10pt;
                line-height: 1.35;
                text-align: justify;
              }
              .college-letter-body p { margin: 0 0 4mm; }
              .college-letter-signature { margin-top: 10mm; text-align: right; }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page { size: A4 portrait; margin: 8mm; }
            </style>
          </head>
          <body>
            <div class="print-wrapper">
              ${content}
            </div>
          </body>
        </html>
      `);
      iframe.contentWindow.document.close();
      
      iframe.contentWindow.focus();
      setTimeout(() => {
        iframe.contentWindow.print();
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 250);
      return;
    }
    const frame = iframeRef.current;
    if (frame && frame.contentWindow) {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
        return;
      } catch (e) {
        // fall through to opening in a new tab
      }
    }
    window.open(pdfUrl, '_blank');
  }

  const selectedStudent = db?.students?.find(s => s.enrollid === selectedStudentId) || filteredStudents[0];
  const academicYears = [...new Set((db?.students || []).map((student) => student.academicYear).filter(Boolean))];
  const departments = [...new Set((db?.students || []).map((student) => student.dept).filter(Boolean))];

  return (
    <section className="module-view active" id="view-documents">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Statutory Certificates &amp; Letters Desk</h2>
          <p>Official Belhekar / Dnyaneshwar Polytechnic documents (Bonafide, Leaving Certificate, 15A tax document, Caste Validity Letter) shown exactly as issued.</p>
        </div>
      </div>

      <div className="doc-builder-container">
        <div className="doc-form-card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>Document Configuration</h3>
          
          <div className="form-grid">
            <div className="form-group form-group-full">
              <label htmlFor="doc-type-select">Document Template</label>
              <select id="doc-type-select" className="form-input" value={docKey} onChange={(e) => setDocKey(e.target.value)}>
                {DOCUMENT_LIBRARY.map((d) => (
                  <option value={d.key} key={d.key}>{d.label}</option>
                ))}
              </select>
            </div>
            
            <>
                <div className="form-group form-group-full">
                  <label htmlFor="doc-student-search">Search Student</label>
                  <input
                    id="doc-student-search"
                    className="form-input"
                    type="search"
                    placeholder="Search by name or enrollment number"
                    value={studentSearch}
                    onChange={(e) => handleFilterChange(setStudentSearch, e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="doc-year-filter">Filter by Class Year</label>
                  <select id="doc-year-filter" className="form-input" value={yearFilter} onChange={(e) => handleFilterChange(setYearFilter, e.target.value)}>
                    <option value="">All Years</option>
                    <option value="FE">First Year (FE)</option>
                    <option value="SE">Second Year (SE)</option>
                    <option value="TE">Third Year (TE)</option>
                    <option value="BE">Final Year (BE)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="doc-dept-filter">Filter by Branch</label>
                  <select id="doc-dept-filter" className="form-input" value={deptFilter} onChange={(e) => handleFilterChange(setDeptFilter, e.target.value)}>
                    <option value="">All Branches</option>
                    {departments.map((department) => <option value={department} key={department}>{department}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="doc-academic-year-filter">Academic Year</label>
                  <select id="doc-academic-year-filter" className="form-input" value={academicYearFilter} onChange={(e) => handleFilterChange(setAcademicYearFilter, e.target.value)}>
                    <option value="">All Academic Years</option>
                    {academicYears.map((year) => <option value={year} key={year}>{year}</option>)}
                  </select>
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="student-select">Select Student (Active Registry)</label>
                  <select 
                    id="student-select" 
                    className="form-input" 
                    value={selectedStudentId} 
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                  >
                    <option value="">-- Select Student --</option>
                    {filteredStudents.map(s => (
                      <option key={s.enrollid} value={s.enrollid}>{s.name} ({s.enrollid})</option>
                    ))}
                  </select>
                </div>
            </>
          </div>

          <div className="selected-student-banner">
            <span className="selected-student-label">Auto-filled student</span>
            <strong>{selectedStudent ? selectedStudent.name : 'No student matches these filters'}</strong>
            {selectedStudent && <span>{selectedStudent.enrollid} · {selectedStudent.dept} · {selectedStudent.yearClass}</span>}
          </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
              This is the original office document (<strong>{activeDoc.originalName}</strong>). Student details are automatically filled from the filtered active registry before printing.
            </p>

          <button className="btn btn-full" onClick={printDoc} style={{ marginTop: '1rem' }} type="button">
            <IconPrint />
            Print / Open Document
          </button>
          <a className="btn btn-full btn-secondary" href={originalUrl} download={activeDoc.originalName} style={{ marginTop: '0.75rem', textAlign: 'center', textDecoration: 'none' }}>
            Download Original (.docx)
          </a>
        </div>

        <div className="doc-preview-canvas" style={{ background: '#fff' }}>
          {docKey === 'bonafide' ? (
            <div ref={printBonafideRef} className="bonafide-print-container" style={{ 
              padding: '20px', 
              minHeight: '850px', 
              border: '2px solid #000', 
              boxShadow: 'var(--shadow-lg)',
              fontFamily: '"Times New Roman", Times, serif',
              color: '#000',
              background: '#fff',
              position: 'relative'
            }}>
               <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                 <span style={{ backgroundColor: 'yellow', fontWeight: 'bold', fontSize: '15px', padding: '2px 8px', border: '1px solid transparent' }}>
                   Used for Scholarship only
                 </span>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {/* Placeholder for Dnyaneshwar Logo */}
                     <img src={dnyaneshwarLogo} alt="Dnyaneshwar Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
                     <div style={{ fontSize: '16px', marginBottom: '2px' }}>
                        Sulochana Belhekar Samajik Va Bahu Uddeshiya Shikshan Sanstha
                     </div>
                     <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#c00000', marginBottom: '5px', letterSpacing: '1px' }}>
                        DNYANESHWAR POLYTECHNIC
                     </div>
                     <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>
                        AICTE. DTE Approved and MSBTE Mumbai Affiliated DTE 5248, MSBTE-1174
                     </div>
                     <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '2px' }}>
                        Email- <a href="mailto:1174principal@msbte.ac.in" style={{ color: 'blue', textDecoration: 'underline' }}>1174principal@msbte.ac.in</a>; Web <a href="https://belhekargroupofinstitute.in/" style={{ color: 'blue', textDecoration: 'underline' }}>https://belhekargroupofinstitute.in/</a>
                     </div>
                     <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
                        Bhanashivre, Tal: Newasa, Dist: Ahmednagar (Maharshtra) 414609 Phone/Fax- (02427) 297099; 8830443056
                     </div>
                  </div>

                  <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {/* Belhekar Logo */}
                     <img src={belhekarLogo} alt="Belhekar Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
               </div>

               <div style={{ borderBottom: '1.5px solid #000', margin: '15px 0' }}></div>

               <div style={{ textAlign: 'center', margin: '20px 0 30px 0' }}>
                  <div style={{
                    display: 'inline-block',
                    border: '3px solid #d99a9a',
                    padding: '6px 25px',
                    background: 'linear-gradient(to bottom, #ffffff 0%, #f2d2d2 50%, #ffffff 100%)',
                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                  }}>
                     <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', fontFamily: '"Times New Roman", Times, serif', color: '#000', letterSpacing: '1px' }}>
                        BONAFIED CERTIFICATE
                     </h2>
                  </div>
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold', fontSize: '16px', padding: '0 5px' }}>
                  <span>Sr.No. SBSBSS/DP/26-27/</span>
                  <span>Date: &nbsp;&nbsp;&nbsp;&nbsp; /&nbsp;&nbsp;&nbsp;&nbsp; /2026</span>
               </div>

               <div style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '2.0', padding: '0 5px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                     <span style={{ whiteSpace: 'nowrap' }}>This is certify that Mr./Miss&nbsp;</span>
                     <span style={{ flexGrow: 1, borderBottom: '2px solid black', textAlign: 'center' }}>{selectedStudent?.name || ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                     <span style={{ whiteSpace: 'nowrap' }}>Is a Bonafied Student of this College Studying in Year&nbsp;</span>
                     <span style={{ flexGrow: 1, borderBottom: '2px solid black', textAlign: 'center', minWidth: '100px' }}>{selectedStudent?.yearClass || ''}</span>
                     <span style={{ whiteSpace: 'nowrap' }}>&nbsp;at Course&nbsp;&nbsp;</span>
                     <span style={{ borderBottom: '2px solid black', textAlign: 'center', padding: '0 10px' }}>Diploma in</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                     <span style={{ flexGrow: 1, borderBottom: '2px solid black', textAlign: 'center', minWidth: '200px' }}>{selectedStudent?.dept || ''}</span>
                     <span style={{ whiteSpace: 'nowrap' }}>&nbsp;&nbsp;&nbsp;&nbsp;Enrolment No:&nbsp;</span>
                     <span style={{ flexGrow: 1, borderBottom: '2px solid black', textAlign: 'center', minWidth: '150px' }}>{selectedStudent?.enrollid || ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                     <span style={{ whiteSpace: 'nowrap' }}>Application id:&nbsp;</span>
                     <span style={{ flexGrow: 1, borderBottom: '2px solid black', textAlign: 'center', maxWidth: '250px' }}>{selectedStudent?.appid || ''}</span>
                     <span style={{ whiteSpace: 'nowrap' }}>&nbsp;&nbsp;For Academic Year&nbsp;</span>
                     <span style={{ borderBottom: '2px solid black', textAlign: 'center', padding: '0 10px' }}>2026-27.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                     <span style={{ whiteSpace: 'nowrap' }}>His / Her Date of Birth according to our Register is&nbsp;</span>
                     <span style={{ flexGrow: 1, borderBottom: '2px solid black', textAlign: 'center', maxWidth: '300px' }}>{selectedStudent?.dob || ''}</span>
                  </div>
               </div>

               <div style={{ marginTop: '50px', padding: '0 5px', fontSize: '18px', fontWeight: 'bold', lineHeight: '1.6' }}>
                  <div>Place: Bhanshiware</div>
                  <div>Date: &nbsp;&nbsp;&nbsp;/ &nbsp;&nbsp;&nbsp;/2026</div>
               </div>
             </div>
          ) : docKey === 'leaving' ? (
            <div ref={printLeavingRef} className="leaving-print-container" style={{
              padding: '40px',
              minHeight: '850px',
              border: '2px solid #000',
              boxShadow: 'var(--shadow-lg)',
              fontFamily: '"Times New Roman", Times, serif',
              color: '#000',
              background: '#fff',
              position: 'relative'
            }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <img src={dnyaneshwarLogo} alt="Dnyaneshwar Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
                     <div style={{ fontSize: '13px', marginBottom: '2px' }}>
                        Sulochana Belhekar Samajik &amp; Bahuuddeshiya Shikshan Sanstha's
                     </div>
                     <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px', letterSpacing: '1px' }}>
                        DNYANESHWAR POLYTECHNIC
                     </div>
                     <div style={{ fontSize: '14px', marginBottom: '2px' }}>
                        Bhanashivre, Tal - Newasa, Dist - Ahmednagar
                     </div>
                     <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '2px' }}>
                        AICTE Approval No.: F-22-2894/2009 Dated: - 25/06/2009<br />
                        MSBTE Code:- 1174 DTE Code:- 5248
                     </div>
                  </div>

                  <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {/* Empty space for symmetry as in LC */}
                  </div>
               </div>

               <div style={{ textAlign: 'center', margin: '20px 0 10px 0' }}>
                 <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', textTransform: 'uppercase', textDecoration: 'underline', letterSpacing: '1px' }}>
                    LEAVING CERTIFICATE
                 </h2>
                 <div style={{ fontSize: '11px', marginTop: '4px' }}>(Prescribed by rule 17 in chapter II Grant-in-aid-code)</div>
               </div>
               
               <div style={{ fontSize: '11px', textAlign: 'center', fontStyle: 'italic', marginBottom: '20px' }}>
                 N.B: No change in any entry is to be made except by the authority issuing the leaving Certificate and infringement of the rule will be punished with rustication.
               </div>

               <div style={{ textAlign: 'right', marginBottom: '20px', fontWeight: 'bold' }}>
                  <span style={{ border: '1px solid black', padding: '4px 20px', fontSize: '13px' }}>Register No. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
               </div>

               <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px', lineHeight: '1.9' }}>
                 <tbody>
                   <tr>
                     <td style={{ width: '45%', paddingRight: '10px', verticalAlign: 'top' }}>1. Name of candidate in full</td>
                     <td style={{ verticalAlign: 'top' }}>:- <strong>{selectedStudent?.name || ''}</strong></td>
                   </tr>
                   <tr>
                     <td style={{ verticalAlign: 'top', paddingRight: '10px' }}>2. Caste and sub caste only in the case of candidate Belonging to Backward classes and category among Backward classes</td>
                     <td style={{ verticalAlign: 'bottom' }}>:- <strong>{selectedStudent?.category || ''}</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>3. Nationality</td>
                     <td>:- <strong>Indian</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>4. Place of Birth</td>
                     <td>:- <strong>{selectedStudent?.birthplace || ''}</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>5. Date of Birth, in Figures</td>
                     <td>:- <strong>{selectedStudent?.dob ? selectedStudent.dob.split('-').reverse().join('-') : ''}</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>6. Date of Birth in Words</td>
                     <td>:- <strong style={{ textTransform: 'capitalize' }}>{selectedStudent?.dob ? dateToWords(selectedStudent.dob) : ''}</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>7. Last School / College attended</td>
                     <td>:- <strong></strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>8. Date of Admission</td>
                     <td>:- <strong>{selectedStudent?.yearAdmission || ''}</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>9. Progress</td>
                     <td>:- <strong>Good</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>10. Conduct</td>
                     <td>:- <strong>Good</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>11. Date of Leaving Institute</td>
                     <td>:- <strong></strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>12. Standard in which studing when leaving the institute:-</td>
                     <td><strong>{selectedStudent?.yearClass ? `${selectedStudent.yearClass} - ${selectedStudent.dept || ''}` : ''}</strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>13. Reason of Leaving Institute</td>
                     <td>:- <strong></strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                   <tr>
                     <td style={{ paddingRight: '10px' }}>14. Remark</td>
                     <td>:- <strong></strong><div style={{ borderBottom: '1px solid black', marginTop: '2px' }}></div></td>
                   </tr>
                 </tbody>
               </table>

               <div style={{ marginTop: '25px', fontSize: '15px' }}>
                 Certificate that, the above information is accordance with the institute register.
               </div>
               
               <div style={{ marginTop: '10px', fontSize: '15px' }}>
                 Date:- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/20
               </div>

               <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', fontSize: '16px', fontWeight: 'bold' }}>
                  <div style={{ paddingLeft: '20px' }}>Checked by</div>
                  <div style={{ paddingRight: '20px' }}>Principal</div>
               </div>
            </div>
          ) : docKey === '15a' ? (
            <div ref={print15aRef} className="15a-print-container" style={{
              minHeight: '850px',
              border: '2px solid #000',
              boxShadow: 'var(--shadow-lg)',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column'
            }}>
               <div style={{ flex: 1 }}>
                 <div style={{ padding: '60px 80px', fontFamily: '"Times New Roman", Times, serif', color: '#000', lineHeight: '2.0' }}>
                   <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                     <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Form-15A</h2>
                     <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '15px' }}>
                       Certificate to be given by Principal of the College
                     </div>
                   </div>
                   
                   <div style={{ fontSize: '18px', textAlign: 'justify', textJustify: 'inter-word' }}>
                     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This is to Certify that Shri/Kum <strong>{selectedStudent?.name || '________________________'}</strong> is Student of this Dnyaneshwar Polytechnic Bharshiware College in Year 2026-27 Enrollment No: <strong>{selectedStudent?.enrollid || '_______________'}</strong> and he/she is studying in Std Diploma in <strong>{selectedStudent?.dept?.replace(' Engineering', '') || '_______________'}</strong> Engineering faculty. His/her name and other information is as per mentioned at number ______________ in general register. And the Caste stated as per our general register is <strong>{selectedStudent?.category || '___________________'}</strong>. (Strike out if if not applicable).
                   </div>

                   <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', fontSize: '17px' }}>
                     <div>
                       <div>Place: Bharshiware</div>
                       <div>Date: &nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;/2026</div>
                     </div>
                     <div style={{ textAlign: 'right', marginTop: '20px' }}>
                       Seal and Signature of the Principal
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          ) : docKey === 'college-letter' ? (
            <div ref={printCollegeLetterRef} className="college-letter-print-container">
              <div className="college-letter-top-note">For Scholarship / Caste Validity Purpose</div>
              <div className="college-letter-header">
                <img src={dnyaneshwarLogo} alt="Dnyaneshwar Polytechnic Logo" />
                <div>
                  <div className="college-letter-trust">Sulochana Belhekar Samajik Va Bahu Uddeshiya Shikshan Sanstha</div>
                  <h2>DNYANESHWAR POLYTECHNIC</h2>
                  <strong>AICTE, DTE Approved and MSBTE Mumbai Affiliated DTE 5248, MSBTE-1174</strong>
                  <div>Email: 1174principal@msbte.ac.in | Web: belhekargroupofinstitute.in</div>
                  <div>Bhanashivre, Tal: Newasa, Dist: Ahmednagar (Maharashtra) 414609 | Phone: (02427) 297099</div>
                </div>
                <img src={belhekarLogo} alt="Belhekar Group Logo" />
              </div>

              <div className="college-letter-meta">
                <span>SBSBSS/DP/2025-26/{selectedStudent?.enrollid || '____'}</span>
                <span>Date: 03/07/2026</span>
              </div>

              <div className="college-letter-body">
                <p>To,<br />The Member Secretary,<br />Caste Validity Committee</p>
                <p><strong>Subject:</strong> Regarding submission of proposal for caste validity certificate.</p>
                <p><strong>Reference:</strong> Student information and college record.</p>
                <p>Respected Sir/Madam,</p>
                <p>
                  This is to certify that <strong>{selectedStudent?.name || '________________________'}</strong> is a bonafide student of Dnyaneshwar Polytechnic, Bhanashivre. The student is studying in <strong>{selectedStudent?.yearClass || '________'}</strong> Diploma in <strong>{selectedStudent?.dept || '________________________'}</strong> for the academic year <strong>{selectedStudent?.academicYear || '2025-2026'}</strong>.
                </p>
                <p>
                  The student details recorded in our register are as follows: Enrollment No. <strong>{selectedStudent?.enrollid || '________________'}</strong>, Application ID <strong>{selectedStudent?.appid || '________________'}</strong>, Category <strong>{selectedStudent?.category || '________________'}</strong>. This letter is issued on the student's request for submission to the concerned authority.
                </p>
                <p>Kindly accept this letter for further necessary action.</p>
                <div className="college-letter-signature">Yours faithfully,<br /><br /><strong>Principal</strong><br />Dnyaneshwar Polytechnic</div>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              key={activeDoc.key}
              src={pdfUrl}
              title={activeDoc.label}
              style={{ width: '100%', minHeight: '850px', border: '1px solid #94a3b8', background: '#fff', boxShadow: 'var(--shadow-lg)' }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
