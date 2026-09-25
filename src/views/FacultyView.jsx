import { useMemo, useState } from 'react';
import { IconPlus, IconSearch, IconUser } from '../components/Icons';
import FacultyModal from '../components/FacultyModal';

export default function FacultyView({ db, setDb, currentRole }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [designationFilter, setDesignationFilter] = useState('all');
  const [modalMode, setModalMode] = useState(null);
  const [activeFaculty, setActiveFaculty] = useState(null);

  const canManage = currentRole === 'admin';

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return db.faculty.filter((fac) => {
      const matchesSearch = fac.name.toLowerCase().includes(s) ||
        fac.id.toLowerCase().includes(s) ||
        fac.email.toLowerCase().includes(s);
      const matchesDept = deptFilter === 'all' || fac.dept === deptFilter;
      const matchesDesignation = designationFilter === 'all' || fac.designation === designationFilter;
      return matchesSearch && matchesDept && matchesDesignation;
    });
  }, [db.faculty, search, deptFilter, designationFilter]);

  function openNew() {
    setActiveFaculty(null);
    setModalMode('new');
  }

  function openView(fac) {
    setActiveFaculty(fac);
    setModalMode('view');
  }

  function openEdit(fac) {
    if (currentRole !== 'admin') {
      alert('Security Restriction: Only System Admin can edit faculty credentials.');
      return;
    }
    setActiveFaculty(fac);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setActiveFaculty(null);
  }

  function handleSave(facObj, mode, origId) {
    if (mode === 'new') {
      setDb((prev) => ({ ...prev, faculty: [...prev.faculty, facObj] }));
    } else {
      setDb((prev) => ({
        ...prev,
        faculty: prev.faculty.map((f) => (f.id === origId ? facObj : f))
      }));
    }
    closeModal();
  }

  return (
    <section className="module-view active" id="view-faculty">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Faculty Directory Ledger</h2>
          <p>Manage faculty details, salary credentials, banking structures, and assignments.</p>
        </div>
        <div className="view-actions" id="faculty-add-btn-wrapper" style={{ display: canManage ? 'block' : 'none' }}>
          <button className="btn" onClick={openNew}>
            <IconPlus />
            Add Faculty Profile
          </button>
        </div>
      </div>

      <div className="table-filter-bar">
        <div className="search-box-wrapper">
          <IconSearch />
          <input
            type="text" className="search-box" id="faculty-search-input"
            placeholder="Search by name, ID or email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="filter-select" id="faculty-filter-designation" value={designationFilter} onChange={(e) => setDesignationFilter(e.target.value)}>
            <option value="all">All Designations</option>
            <option value="HOD">HOD</option>
            <option value="Professor">Professor</option>
            <option value="Associate Professor">Associate Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Lab Assistant">Lab Assistant</option>
          </select>
          <select className="filter-select" id="faculty-filter-dept" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="all">All Departments</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table" id="faculty-data-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Mobile</th>
              <th>Email ID</th>
              <th>Aadhar Details</th>
              <th>Net Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((fac) => (
              <tr id={`faculty-row-${fac.id}`} key={fac.id}>
                <td>
                  <div className="avatar-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-accent)', color: 'var(--text-secondary)' }}>
                    <IconUser width="18" height="18" />
                  </div>
                </td>
                <td><strong>{fac.id}</strong></td>
                <td>{fac.name}</td>
                <td>{fac.dept}</td>
                <td>{fac.designation}</td>
                <td>{fac.mobile}</td>
                <td>{fac.email}</td>
                <td>{fac.aadhar} / {fac.pan}</td>
                <td>₹ {fac.salary.toLocaleString('en-IN')}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => openView(fac)}>Details</button>
                    <button className="btn" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => openEdit(fac)}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalMode && (
        <FacultyModal
          mode={modalMode}
          faculty={activeFaculty}
          facultyCount={db.faculty.length}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
