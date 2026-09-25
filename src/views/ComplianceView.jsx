export default function ComplianceView({ db }) {
  const ratioVal = db.faculty.length > 0 ? Math.round(db.students.length / db.faculty.length) : db.students.length;

  const BECount = db.students.filter((s) => s.yearClass === 'BE').length;
  const placementCount = db.placements.length;
  const pct = BECount > 0 ? Math.round((placementCount / BECount) * 100) : 0;

  let k3Sum = 0, k5Sum = 0, k6Sum = 0, count = 0;
  db.students.forEach((s) => {
    if (s.marks) {
      k3Sum += s.marks.k3 || 0;
      k5Sum += s.marks.k5 || 0;
      k6Sum += s.marks.k6 || 0;
      count++;
    }
  });
  const k3Pct = count > 0 ? Math.round((k3Sum / (count * 20)) * 100) : 0;
  const k5Pct = count > 0 ? Math.round((k5Sum / (count * 40)) * 100) : 0;
  const k6Pct = count > 0 ? Math.round((k6Sum / (count * 40)) * 100) : 0;

  function printSheet(boxId) {
    const target = document.getElementById(boxId);
    target.classList.add('printable-document-container');
    window.print();
    target.classList.remove('printable-document-container');
  }

  return (
    <section className="module-view active" id="view-compliance">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Accreditation &amp; Compliance Formats</h2>
          <p>Generate pre-compiled formatting sheets required for NAAC SSR audits and NBA Outcomes metrics mapping.</p>
        </div>
      </div>

      <div className="compliance-summary-grid">
        <div className="compliance-info-card">
          <div className="compliance-info-title">Student Teacher Ratio (STR)</div>
          <div className="compliance-info-val" id="comp-str">{ratioVal} : 1</div>
          <div className="mapping-formula">Ratio = Total Students / Total Faculty</div>
        </div>
        <div className="compliance-info-card">
          <div className="compliance-info-title">NBA Marks Mapping Matrix</div>
          <div className="compliance-info-val">OBE Matrix 4.2</div>
          <div className="mapping-formula">CO-PO Mapping = f(K3, K5, K6)</div>
        </div>
        <div className="compliance-info-card">
          <div className="compliance-info-title">Graduate Placement Rate</div>
          <div className="compliance-info-val" id="comp-placement-pct">{pct}%</div>
          <div className="mapping-formula">Placements / BE Graduates * 100</div>
        </div>
      </div>

      <div className="dashboard-details-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="panel-card">
          <div className="panel-title">
            <span>NAAC Format Compilation</span>
            <button className="btn btn-secondary" onClick={() => printSheet('naac-print-box')}>Print NAAC Form</button>
          </div>
          <div className="table-responsive" id="naac-print-box">
            <table className="data-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Criteria Category</th>
                  <th>Parameter Indicator</th>
                  <th>Calculated Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Criterion 2.1</strong></td>
                  <td>Student Enrollment Ratio</td>
                  <td id="naac-enrollment-val">100%</td>
                </tr>
                <tr>
                  <td><strong>Criterion 2.2</strong></td>
                  <td>Student - Teacher Ratio (NAAC SSR)</td>
                  <td id="naac-str-val">{ratioVal} : 1</td>
                </tr>
                <tr>
                  <td><strong>Criterion 5.2</strong></td>
                  <td>Student Placement Statistics</td>
                  <td id="naac-placement-val">{placementCount} Placements ({pct}%)</td>
                </tr>
                <tr>
                  <td><strong>Criterion 5.3</strong></td>
                  <td>Alumni Registration Index</td>
                  <td id="naac-alumni-count">{db.alumni.length} Alumni Records</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-title">
            <span>NBA Outcome-Based Education mapping</span>
            <button className="btn btn-secondary" onClick={() => printSheet('nba-print-box')}>Print NBA Form</button>
          </div>
          <div className="table-responsive" id="nba-print-box">
            <table className="data-table" style={{ fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th>Assessment Level</th>
                  <th>Course Outcome Mapping (CO)</th>
                  <th>Program Outcome Mapping (PO)</th>
                  <th>Calculated Compliance Index</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>K3 (Application)</strong></td>
                  <td>CO1, CO2</td>
                  <td>PO1, PO2, PO3</td>
                  <td id="nba-k3-val">{k3Pct}% Compliance Outcome</td>
                </tr>
                <tr>
                  <td><strong>K5 (Synthesis)</strong></td>
                  <td>CO3, CO4</td>
                  <td>PO3, PO5, PO8</td>
                  <td id="nba-k5-val">{k5Pct}% Compliance Outcome</td>
                </tr>
                <tr>
                  <td><strong>K6 (Evaluation)</strong></td>
                  <td>CO5</td>
                  <td>PO9, PO11, PO12</td>
                  <td id="nba-k6-val">{k6Pct}% Compliance Outcome</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
