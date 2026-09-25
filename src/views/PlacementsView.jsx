import { useState } from 'react';
import { IconPlus, IconGraduate, IconClose } from '../components/Icons';

export default function PlacementsView({ db, setDb, currentRole }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pStudent, setPStudent] = useState('');
  const [pCompany, setPCompany] = useState('');
  const [pPackage, setPPackage] = useState('');
  const [pYear, setPYear] = useState('2026-27');

  const canManagePlacements = currentRole === 'admin' || currentRole === 'clerk';
  const beStudents = db.students.filter((s) => s.yearClass === 'BE');

  function openModal() {
    setPStudent('');
    setPCompany('');
    setPPackage('');
    setPYear('2026-27');
    setModalOpen(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canManagePlacements) {
      alert('Access Denied: Placements manager requires Clerk or Admin role.');
      return;
    }
    if (!pStudent) return;
    const student = db.students.find((s) => s.enrollid === pStudent);
    if (!student) return;

    const placementObj = {
      name: student.name, enrollid: pStudent, dept: student.dept,
      company: pCompany.trim(), package: parseFloat(pPackage) || 0, year: pYear.trim()
    };

    setDb((prev) => ({ ...prev, placements: [...prev.placements, placementObj] }));
    setModalOpen(false);
    alert('Placement Recorded successfully!');
  }

  function triggerBatchGraduation() {
    if (!canManagePlacements) {
      alert('Security Restriction: Graduation migration requires Clerk / Admin permissions.');
      return;
    }
    const activeBE = db.students.filter((s) => s.yearClass === 'BE');
    if (activeBE.length === 0) {
      alert('No BE (Final Year) candidates found in active roster to graduate.');
      return;
    }
    const confirmGrad = confirm(`Are you sure you want to graduate and archive ${activeBE.length} final year (BE) students to Alumni archives? This will migrate their database state.`);
    if (!confirmGrad) return;

    const currentYear = new Date().getFullYear().toString();
    const newAlumni = activeBE.map((s) => ({ name: s.name, enrollid: s.enrollid, year: currentYear, dept: s.dept }));
    const graduatingIds = new Set(activeBE.map((s) => s.enrollid));

    setDb((prev) => ({
      ...prev,
      alumni: [...prev.alumni, ...newAlumni],
      students: prev.students.filter((s) => !graduatingIds.has(s.enrollid))
    }));

    alert('Migration complete! Archiving finalized.');
  }

  return (
    <section className="module-view active" id="view-placements">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Career Placements &amp; Alumni Hub</h2>
          <p>Track recruitment success rates, salary structures, and manage the active-to-alumni graduation migration.</p>
        </div>
        <div className="view-actions" id="placements-actions-wrapper">
          <button className="btn btn-secondary" onClick={triggerBatchGraduation} style={{ marginRight: '0.5rem' }}>
            <IconGraduate />
            Batch Graduate (TE &amp; BE to Alumni)
          </button>
          <button className="btn" onClick={openModal}>
            <IconPlus />
            Add Placement Record
          </button>
        </div>
      </div>

      <div className="dashboard-details-grid">
        <div className="panel-card">
          <div className="panel-title">Placement Records Database</div>
          <div className="table-responsive">
            <table className="data-table" id="placement-records-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Enrollment No</th>
                  <th>Department</th>
                  <th>Recruiter Company</th>
                  <th>CTC Package Offered</th>
                  <th>Academic Year</th>
                </tr>
              </thead>
              <tbody>
                {db.placements.map((p, idx) => (
                  <tr key={`${p.enrollid}-${idx}`}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.enrollid}</td>
                    <td>{p.dept}</td>
                    <td>{p.company}</td>
                    <td><span className="badge badge-success">{p.package} LPA</span></td>
                    <td>{p.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-title">Historical Alumni Directory</div>
          <div className="table-responsive">
            <table className="data-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Alumnus Name</th>
                  <th>Enrollment ID</th>
                  <th>Passing Year</th>
                  <th>Department</th>
                </tr>
              </thead>
              <tbody id="alumni-records-table-tbody">
                {db.alumni.map((a, idx) => (
                  <tr key={`${a.enrollid}-${idx}`}>
                    <td><strong>{a.name}</strong></td>
                    <td>{a.enrollid}</td>
                    <td><span className="badge badge-info">{a.year}</span></td>
                    <td>{a.dept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay active" id="placement-modal">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Add Placement Record</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}><IconClose /></button>
            </div>
            <div className="modal-body">
              <form id="placement-form" onSubmit={handleSubmit}>
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="form-group">
                    <label htmlFor="p-student-select">Select Candidate Student *</label>
                    <select id="p-student-select" className="form-input" value={pStudent} onChange={(e) => setPStudent(e.target.value)} required>
                      <option value="">-- Select Candidate --</option>
                      {beStudents.map((s) => (
                        <option value={s.enrollid} key={s.enrollid}>{s.name} ({s.enrollid})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="p-company">Hiring Company Name *</label>
                    <input type="text" id="p-company" className="form-input" placeholder="e.g. Tata Consultancy Services" required
                      value={pCompany} onChange={(e) => setPCompany(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="p-package">Offered CTC Package (LPA) *</label>
                    <input type="number" id="p-package" className="form-input" step="0.1" placeholder="e.g. 6.5" required
                      value={pPackage} onChange={(e) => setPPackage(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="p-year">Recruitment Academic Year *</label>
                    <input type="text" id="p-year" className="form-input" required
                      value={pYear} onChange={(e) => setPYear(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn">Register Offer</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
