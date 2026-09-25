import { useMemo, useState } from 'react';
import { DEPARTMENTS, YEAR_CLASSES } from '../data/seed';

const ASSESSMENTS = {
  k3: {
    label: 'K3 – Formative Assessment of Practical (FA-PR)',
    columns: [
      'Experiment / Practical 1', 'Experiment / Practical 2', 'Experiment / Practical 3',
      'Experiment / Practical 4', 'Experiment / Practical 5', 'Experiment / Practical 6',
      'Experiment / Practical 7', 'Experiment / Practical 8', 'Experiment / Practical 9',
      'Experiment / Practical 10'
    ]
  },
  k5: {
    label: 'K5 – Formative Assessment of Theory (FA-TH)',
    columns: ['Class Test - I', 'Class Test - II', 'Average of Test I & II']
  },
  k6: {
    label: 'K6 – Self Learning Assessment (SLA)',
    columns: ['Micro Project', 'Assignments', 'Other Activities for Specific Learning', 'SLA Marks']
  }
};

function numeric(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function makeAcademicRecord(student) {
  const old = student.marks || {};
  const existing = student.academicGrades || {};

  return {
    k3: {
      experiments: Array.isArray(existing.k3?.experiments)
        ? [...existing.k3.experiments, ...Array(10).fill('')].slice(0, 10)
        : [old.k3 ?? '', ...Array(9).fill('')],
      converted: existing.k3?.converted ?? old.k3 ?? '',
      signature: existing.k3?.signature ?? false
    },
    k5: {
      test1: existing.k5?.test1 ?? old.k5 ?? '',
      test2: existing.k5?.test2 ?? '',
      average: existing.k5?.average ?? old.k5 ?? '',
      signature: existing.k5?.signature ?? false
    },
    k6: {
      microProject: existing.k6?.microProject ?? old.k6 ?? '',
      assignments: existing.k6?.assignments ?? '',
      otherActivities: existing.k6?.otherActivities ?? '',
      slaMarks: existing.k6?.slaMarks ?? old.k6 ?? '',
      signature: existing.k6?.signature ?? false
    }
  };
}

export default function AcademicsView({ db, setDb, currentRole }) {
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [yearClass, setYearClass] = useState('FE');
  const [assessment, setAssessment] = useState('k3');
  const [draftGrades, setDraftGrades] = useState({});

  const canSave = currentRole === 'admin' || currentRole === 'faculty';

  const matched = useMemo(
    () => db.students.filter((s) => s.dept === dept && s.yearClass === yearClass),
    [db.students, dept, yearClass]
  );

  function getRecord(student) {
    return draftGrades[student.enrollid] || makeAcademicRecord(student);
  }

  function updateRecord(enrollid, updater) {
    setDraftGrades((prev) => {
      const student = matched.find((s) => s.enrollid === enrollid);
      const current = prev[enrollid] || makeAcademicRecord(student);
      return { ...prev, [enrollid]: updater(current) };
    });
  }

  function updateK3(enrollid, index, value) {
    updateRecord(enrollid, (record) => ({
      ...record,
      k3: {
        ...record.k3,
        experiments: record.k3.experiments.map((v, i) => i === index ? value : v)
      }
    }));
  }

  function updateK5(enrollid, field, value) {
    updateRecord(enrollid, (record) => ({
      ...record,
      k5: { ...record.k5, [field]: value }
    }));
  }

  function updateK6(enrollid, field, value) {
    updateRecord(enrollid, (record) => ({
      ...record,
      k6: { ...record.k6, [field]: value }
    }));
  }

  function updateSignature(enrollid, checked) {
    updateRecord(enrollid, (record) => ({
      ...record,
      [assessment]: { ...record[assessment], signature: checked }
    }));
  }

  function k3Total(record) {
    return record.k3.experiments.reduce((sum, value) => sum + numeric(value), 0);
  }

  function k5Average(record) {
    const a = numeric(record.k5.test1);
    const b = numeric(record.k5.test2);
    if (record.k5.average !== '' && record.k5.average !== undefined) return numeric(record.k5.average);
    if (record.k5.test1 === '' && record.k5.test2 === '') return 0;
    return (a + b) / 2;
  }

  function k6Total(record) {
    return numeric(record.k6.microProject) + numeric(record.k6.assignments) + numeric(record.k6.otherActivities);
  }

  function validate(record) {
    if (assessment === 'k3') {
      return record.k3.experiments.every((v) => v === '' || (numeric(v) >= 0 && numeric(v) <= 25)) &&
        (record.k3.converted === '' || (numeric(record.k3.converted) >= 0 && numeric(record.k3.converted) <= 25));
    }
    if (assessment === 'k5') {
      return ['test1', 'test2', 'average'].every((f) =>
        record.k5[f] === '' || (numeric(record.k5[f]) >= 0 && numeric(record.k5[f]) <= 30)
      );
    }
    return ['microProject', 'assignments', 'otherActivities', 'slaMarks'].every((f) =>
      record.k6[f] === '' || numeric(record.k6[f]) >= 0
    );
  }

  function handleSave() {
    if (!canSave) {
      alert('Security Restriction: Only Course Faculty or Admin can save academic grades.');
      return;
    }

    const invalid = matched.some((student) => !validate(getRecord(student)));
    if (invalid) {
      alert('Cannot save! Please correct invalid marks before saving.');
      return;
    }

    setDb((prev) => ({
      ...prev,
      students: prev.students.map((student) => {
        if (student.dept !== dept || student.yearClass !== yearClass) return student;

        const record = getRecord(student);
        const saved = {
          ...student,
          academicGrades: record,
          // Keep the existing marks object for compatibility with older dashboard/report code.
          marks: {
            k3: numeric(record.k3.converted) || numeric(record.k3.experiments[0]),
            k5: numeric(record.k5.average) || k5Average(record),
            k6: numeric(record.k6.slaMarks) || k6Total(record)
          }
        };
        return saved;
      })
    }));

    alert(`${ASSESSMENTS[assessment].label} sheet saved for ${matched.length} students.`);
  }

  function renderK3(record, student) {
    return (
      <>
        {record.k3.experiments.map((value, index) => (
          <td key={index}>
            <input
              type="number"
              className="marks-input"
              min="0"
              max="25"
              value={value}
              placeholder="0"
              onChange={(e) => updateK3(student.enrollid, index, e.target.value)}
            />
          </td>
        ))}
        <td><strong>{k3Total(record)}</strong></td>
        <td>
          <input
            type="number"
            className="marks-input"
            min="0"
            max="25"
            value={record.k3.converted}
            placeholder="0"
            onChange={(e) => updateRecord(student.enrollid, (r) => ({
              ...r, k3: { ...r.k3, converted: e.target.value }
            }))}
          />
        </td>
        <td style={{ textAlign: 'center' }}>
          <input
            type="checkbox"
            className="marks-checkbox"
            checked={!!record.k3.signature}
            onChange={(e) => updateSignature(student.enrollid, e.target.checked)}
          />
        </td>
      </>
    );
  }

  function renderK5(record, student) {
    return (
      <>
        <td><input type="number" className="marks-input" min="0" max="30" value={record.k5.test1} onChange={(e) => updateK5(student.enrollid, 'test1', e.target.value)} /></td>
        <td><input type="number" className="marks-input" min="0" max="30" value={record.k5.test2} onChange={(e) => updateK5(student.enrollid, 'test2', e.target.value)} /></td>
        <td>
          <input
            type="number"
            className="marks-input"
            min="0"
            max="30"
            value={record.k5.average}
            onChange={(e) => updateK5(student.enrollid, 'average', e.target.value)}
          />
          <div style={{ fontSize: '0.7rem', marginTop: '0.2rem', opacity: 0.7 }}>
            Calculated: {k5Average(record).toFixed(1)}
          </div>
        </td>
        <td style={{ textAlign: 'center' }}>
          <input
            type="checkbox"
            className="marks-checkbox"
            checked={!!record.k5.signature}
            onChange={(e) => updateSignature(student.enrollid, e.target.checked)}
          />
        </td>
      </>
    );
  }

  function renderK6(record, student) {
    return (
      <>
        <td><input type="number" className="marks-input" min="0" value={record.k6.microProject} onChange={(e) => updateK6(student.enrollid, 'microProject', e.target.value)} /></td>
        <td><input type="number" className="marks-input" min="0" value={record.k6.assignments} onChange={(e) => updateK6(student.enrollid, 'assignments', e.target.value)} /></td>
        <td><input type="number" className="marks-input" min="0" value={record.k6.otherActivities} onChange={(e) => updateK6(student.enrollid, 'otherActivities', e.target.value)} /></td>
        <td><strong>{k6Total(record)}</strong></td>
        <td style={{ textAlign: 'center' }}>
          <input
            type="checkbox"
            className="marks-checkbox"
            checked={!!record.k6.signature}
            onChange={(e) => updateSignature(student.enrollid, e.target.checked)}
          />
        </td>
      </>
    );
  }

  const headers = assessment === 'k3'
    ? [...ASSESSMENTS.k3.columns, 'Total Marks', 'FA Marks Converted (Max 25)', 'Signature Of Students']
    : assessment === 'k5'
      ? [...ASSESSMENTS.k5.columns, 'Signature Of Students']
      : [...ASSESSMENTS.k6.columns, 'Signature Of Students'];

  return (
    <section className="module-view active" id="view-academics">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Academic Grades &amp; Assessment</h2>
          <p>Enter academic grades using the same assessment columns as the reference MSBTE spreadsheets.</p>
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-title">Academic Assessment Sheet</div>

        <div className="table-filter-bar" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          <select className="filter-select" value={dept} onChange={(e) => setDept(e.target.value)}>
            {DEPARTMENTS.map((d) => <option value={d} key={d}>{d}</option>)}
          </select>

          <select className="filter-select" value={yearClass} onChange={(e) => setYearClass(e.target.value)}>
            {YEAR_CLASSES.map((y) => <option value={y.value} key={y.value}>{y.label}</option>)}
          </select>

          <select className="filter-select" value={assessment} onChange={(e) => setAssessment(e.target.value)}>
            <option value="k3">K3 – Practical / FA-PR</option>
            <option value="k5">K5 – Theory / FA-TH</option>
            <option value="k6">K6 – Self Learning / SLA</option>
          </select>

          <button className="btn" onClick={handleSave}>Save Academic Grades</button>
        </div>

        <div className="table-responsive">
          <table className="data-table marks-entry-table" id="exam-marks-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Enrollment No</th>
                <th>Exam Seat No</th>
                <th>Name of the Student</th>
                {headers.map((header) => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {matched.length === 0 ? (
                <tr><td colSpan={4 + headers.length} style={{ textAlign: 'center' }}>No students enrolled in this category.</td></tr>
              ) : matched.map((student, index) => {
                const record = getRecord(student);
                return (
                  <tr key={student.enrollid}>
                    <td><strong>{index + 1}</strong></td>
                    <td><strong>{student.enrollid}</strong></td>
                    <td>{student.examSeatNo || '—'}</td>
                    <td>{student.name}</td>
                    {assessment === 'k3' && renderK3(record, student)}
                    {assessment === 'k5' && renderK5(record, student)}
                    {assessment === 'k6' && renderK6(record, student)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', opacity: 0.75 }}>
          <strong>Reference alignment:</strong> K3 follows the practical FA-PR sheet, K5 follows the theory FA-TH sheet, and K6 follows the SLA sheet. Admin and Faculty can enter and save these grades.
        </div>
      </div>
    </section>
  );
}
