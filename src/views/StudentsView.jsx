import { useEffect, useMemo, useState } from 'react';
import { IconPlus, IconSearch, IconUser } from '../components/Icons';
import StudentModal from '../components/StudentModal';

export default function StudentsView({ db, setDb, currentRole }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [academicYearFilter, setAcademicYearFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState(null); // 'new' | 'edit' | 'view' | null
  const [activeStudent, setActiveStudent] = useState(null);

  const canManage = currentRole === 'admin' || currentRole === 'clerk';

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return db.students.filter((student) => {
      const matchesSearch = student.name.toLowerCase().includes(s) ||
        student.enrollid.toLowerCase().includes(s) ||
        student.category.toLowerCase().includes(s);
      const matchesDept = deptFilter === 'all' || student.dept === deptFilter;
      const matchesCat = catFilter === 'all' || student.category === catFilter;
      const matchesYear = yearFilter === 'all' || student.yearClass === yearFilter;
      const matchesAcademicYear = academicYearFilter === 'all' || student.academicYear === academicYearFilter;
      return matchesSearch && matchesDept && matchesCat && matchesYear && matchesAcademicYear;
    });
  }, [db.students, search, deptFilter, catFilter, yearFilter, academicYearFilter]);

  const rowsPerPage = 6;
  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageStudents = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, deptFilter, catFilter, yearFilter, academicYearFilter]);

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(pageCount);
  }, [currentPage, pageCount]);

  function openNew() {
    setActiveStudent(null);
    setModalMode('new');
  }

  function openView(student) {
    setActiveStudent(student);
    setModalMode('view');
  }

  function openEdit(student) {
    if (!canManage) {
      alert('Access Denied: Head Clerk or Admin privileges required.');
      return;
    }
    setActiveStudent(student);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setActiveStudent(null);
  }

  function handleSave(studentObj, mode, origEnrollId) {
    if (mode === 'new') {
      const duplicate = db.students.some((s) => s.enrollid === studentObj.enrollid);
      if (duplicate) {
        alert('Error: Enrollment ID already exists!');
        return;
      }
      setDb((prev) => ({ ...prev, students: [...prev.students, studentObj] }));
    } else {
      setDb((prev) => ({
        ...prev,
        students: prev.students.map((s) => (s.enrollid === origEnrollId ? studentObj : s))
      }));
    }
    closeModal();
  }

  return (
    <section className="module-view active" id="view-students">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Students Registry Directory</h2>
          <p>View student records, add admissions details, category structures, and financial configurations.</p>
        </div>
        <div className="view-actions" id="student-add-btn-wrapper" style={{ display: canManage ? 'block' : 'none' }}>
          <button className="btn" onClick={openNew}>
            <IconPlus />
            Register New Student
          </button>
        </div>
      </div>

      <div className="table-filter-bar">
        <div className="search-box-wrapper">
          <IconSearch />
          <input
            type="text" className="search-box" id="student-search-input"
            placeholder="Search by name, enrollment ID or category..."
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="filter-select" id="student-filter-acad-year" value={academicYearFilter} onChange={(e) => setAcademicYearFilter(e.target.value)}>
            <option value="all">All Academic Years</option>
            <option value="2021-2022">2021-2022</option>
            <option value="2022-2023">2022-2023</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
          <select className="filter-select" id="student-filter-dept" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="all">All Departments</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
          <select className="filter-select" id="student-filter-year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="all">All Class Years</option>
            <option value="FE">First Year (FE)</option>
            <option value="SE">Second Year (SE)</option>
            <option value="TE">Third Year (TE)</option>
            <option value="BE">Final Year (BE)</option>
          </select>
          <select className="filter-select" id="student-filter-cat" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="data-table" id="students-data-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Enrollment No</th>
              <th>Full Name</th>
              <th>Department</th>
              <th>Class</th>
              <th>Acad. Year</th>
              <th>CAP Type</th>
              <th>Category</th>
              <th>Scholarship</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageStudents.length === 0 ? (
              <tr><td colSpan="11" className="table-empty-state">No students match the selected filters.</td></tr>
            ) : pageStudents.map((student) => {
              const isOverdue = student.outstanding > 0;
              return (
                <tr id={`student-row-${student.enrollid}`} key={student.enrollid}>
                  <td>
                    <div className="avatar-thumbnail" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-accent)', color: 'var(--text-secondary)' }}>
                      <IconUser width="18" height="18" />
                    </div>
                  </td>
                  <td><strong>{student.enrollid}</strong></td>
                  <td>{student.name}</td>
                  <td>{student.dept}</td>
                  <td>{student.yearClass}</td>
                  <td>{student.academicYear || '-'}</td>
                  <td><span className="badge badge-info">{student.cap}</span></td>
                  <td>{student.category}</td>
                  <td>{student.scholarshipEligible === 'Yes' ? 'Eligible' : 'Regular'}</td>
                  <td>
                    {isOverdue
                      ? <span className="badge badge-warning">Fees Unpaid</span>
                      : <span className="badge badge-success">Fully Paid</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => openView(student)}>Details</button>
                      <button className="btn" style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }} onClick={() => openEdit(student)}>Edit</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination-bar">
        <span className="pagination-summary">
          Showing {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filtered.length)} of {filtered.length} students
        </span>
        <div className="pagination-controls">
          <button type="button" className="pagination-button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
            Previous
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button
              type="button"
              className={`pagination-button${page === currentPage ? ' active' : ''}`}
              key={page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button type="button" className="pagination-button" disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => page + 1)}>
            Next
          </button>
        </div>
      </div>

      {modalMode && (
        <StudentModal
          mode={modalMode}
          student={activeStudent}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
