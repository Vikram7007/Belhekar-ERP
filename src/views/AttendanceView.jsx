import { useEffect, useMemo, useState } from 'react';
import { DEPARTMENTS, YEAR_CLASSES } from '../data/seed';
import {
  todayISO, isoDaysAgo, formatStamp, findAttendanceRecord, buildAttendanceRecord,
  makeAuditEntry, computeWeeklyReport, ATTENDANCE_PASS_THRESHOLD
} from '../utils/attendance';
import { exportDailySheet, exportWeeklyReport, exportAuditLog } from '../utils/excelExport';

const TABS = [
  { id: 'take', label: 'Take Attendance' },
  { id: 'weekly', label: 'Weekly Reports' },
  { id: 'history', label: 'Audit History' },
  { id: 'biometric', label: 'Faculty Attendance' }
];

export default function AttendanceView({ db, setDb, currentRole, currentUser }) {
  const [activeTab, setActiveTab] = useState('take');

  const canMark = currentRole === 'admin' || currentRole === 'faculty';
  const actor = { name: currentUser.name, role: currentRole };

  return (
    <section className="module-view active" id="view-attendance">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Student Attendance Management</h2>
          <p>Mark only absent students — everyone else is recorded present automatically. Track daily sheets, weekly reports, and a full audit trail.</p>
        </div>
      </div>

      <div className="form-tabs">
        {TABS.map((t) => (
          <button
            type="button" key={t.id}
            className={`form-tab-btn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={`form-tab-panel${activeTab === 'take' ? ' active' : ''}`}>
        <TakeAttendanceTab db={db} setDb={setDb} canMark={canMark} actor={actor} />
      </div>

      <div className={`form-tab-panel${activeTab === 'weekly' ? ' active' : ''}`}>
        <WeeklyReportTab db={db} setDb={setDb} actor={actor} />
      </div>

      <div className={`form-tab-panel${activeTab === 'history' ? ' active' : ''}`}>
        <AuditHistoryTab db={db} actor={actor} />
      </div>

      <div className={`form-tab-panel${activeTab === 'biometric' ? ' active' : ''}`}>
        <FacultyBiometricTab db={db} />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Take Attendance — mark absentees only, all else default Present        */
/* ---------------------------------------------------------------------- */

function TakeAttendanceTab({ db, setDb, canMark, actor }) {
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [yearClass, setYearClass] = useState('FE');
  const [date, setDate] = useState(todayISO());
  const [absentSet, setAbsentSet] = useState(new Set());
  const [savedFlash, setSavedFlash] = useState('');

  const matched = useMemo(
    () => db.students.filter((s) => s.dept === dept && s.yearClass === yearClass),
    [db.students, dept, yearClass]
  );

  const existing = useMemo(
    () => findAttendanceRecord(db.attendance, dept, yearClass, date),
    [db.attendance, dept, yearClass, date]
  );

  // Whenever the class/date selection changes, load any previously saved
  // absentee list for that exact combination so faculty can review/edit it.
  useEffect(() => {
    if (existing) {
      setAbsentSet(new Set(existing.absentees.map((a) => a.enrollid)));
    } else {
      setAbsentSet(new Set());
    }
    setSavedFlash('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept, yearClass, date]);

  function toggleAbsent(enrollid) {
    setAbsentSet((prev) => {
      const next = new Set(prev);
      if (next.has(enrollid)) next.delete(enrollid); else next.add(enrollid);
      return next;
    });
  }

  function markAllAbsent() {
    setAbsentSet(new Set(matched.map((s) => s.enrollid)));
  }

  function resetAllPresent() {
    setAbsentSet(new Set());
  }

  function handleSave() {
    if (!canMark) {
      alert('Permission Denied: Attendance entry is restricted to Faculty/Admin.');
      return;
    }
    if (matched.length === 0) {
      alert('No students enrolled in this Department / Year selection.');
      return;
    }

    const record = buildAttendanceRecord({ dept, yearClass, date, students: matched, absentSet, actor, existing });
    const isUpdate = Boolean(existing);

    setDb((prev) => ({
      ...prev,
      attendance: isUpdate
        ? prev.attendance.map((r) => (r.id === record.id ? record : r))
        : [...prev.attendance, record],
      attendanceAudit: [
        makeAuditEntry(
          isUpdate ? 'UPDATE_ATTENDANCE' : 'MARK_ATTENDANCE',
          actor,
          `${dept} / ${yearClass} — ${date}: ${record.absentCount} absent of ${record.totalStudents} students`
        ),
        ...prev.attendanceAudit
      ]
    }));

    setSavedFlash(`Attendance ${isUpdate ? 'updated' : 'saved'} — ${record.presentCount} present, ${record.absentCount} absent of ${record.totalStudents}.`);
  }

  function handleDownload() {
    exportDailySheet({ dept, yearClass, date, students: matched, absentSet, actor });
    setDb((prev) => ({
      ...prev,
      attendanceAudit: [
        makeAuditEntry('DOWNLOAD_DAILY', actor, `Downloaded daily sheet — ${dept} / ${yearClass} — ${date}`),
        ...prev.attendanceAudit
      ]
    }));
  }

  const presentCount = matched.length - absentSet.size;

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Daily Class Attendance</span>
        <span className="badge badge-info">{date}</span>
      </div>

      <div className="table-filter-bar" style={{ padding: '0.75rem 1rem', marginBottom: '0.5rem' }}>
        <select className="filter-select" value={dept} onChange={(e) => setDept(e.target.value)}>
          {DEPARTMENTS.map((d) => <option value={d} key={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={yearClass} onChange={(e) => setYearClass(e.target.value)}>
          {YEAR_CLASSES.map((y) => <option value={y.value} key={y.value}>{y.label}</option>)}
        </select>
        <input
          type="date" className="filter-select" value={date} max={todayISO()}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="filter-group">
          <button className="btn btn-secondary" onClick={markAllAbsent} disabled={!canMark}>Mark All Absent</button>
          <button className="btn btn-secondary" onClick={resetAllPresent} disabled={!canMark}>Reset All Present</button>
        </div>
      </div>

      {existing && (
        <div style={{ padding: '0.6rem 1rem', marginBottom: '1rem', background: 'var(--warning-bg)', borderRadius: '10px', fontSize: '0.85rem' }}>
          Already marked by <strong>{existing.markedBy.name}</strong> ({existing.markedBy.role}) on {formatStamp(existing.markedAt)}
          {existing.updatedAt && <> · last updated by <strong>{existing.updatedBy.name}</strong> on {formatStamp(existing.updatedAt)}</>}
          . Saving again will update this record and log the change.
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span className="badge badge-info">Total: {matched.length}</span>
        <span className="badge badge-success">Present: {presentCount}</span>
        <span className="badge badge-danger">Absent: {absentSet.size}</span>
      </div>

      <div className="table-responsive">
        <table className="data-table" id="student-attendance-table">
          <thead>
            <tr>
              <th>Enrollment No</th>
              <th>Name</th>
              <th>Status</th>
              <th>Mark Absent</th>
            </tr>
          </thead>
          <tbody>
            {matched.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No students enrolled in this division.</td></tr>
            ) : matched.map((s) => {
              const isAbsent = absentSet.has(s.enrollid);
              return (
                <tr key={s.enrollid}>
                  <td><strong>{s.enrollid}</strong></td>
                  <td>{s.name}</td>
                  <td>
                    {isAbsent
                      ? <span className="badge badge-danger">Absent</span>
                      : <span className="badge badge-success">Present</span>}
                  </td>
                  <td>
                    <input
                      type="checkbox" checked={isAbsent} disabled={!canMark}
                      onChange={() => toggleAbsent(s.enrollid)}
                      style={{ width: '18px', height: '18px', cursor: canMark ? 'pointer' : 'not-allowed' }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn" onClick={handleSave} disabled={!canMark}>Save Attendance Sheet</button>
        <button className="btn btn-secondary" onClick={handleDownload} disabled={matched.length === 0}>Download Excel (Daily Sheet)</button>
        {savedFlash && <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem' }}>{savedFlash}</span>}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Weekly Reports                                                         */
/* ---------------------------------------------------------------------- */

function WeeklyReportTab({ db, setDb, actor }) {
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [yearClass, setYearClass] = useState('FE');
  const [dateFrom, setDateFrom] = useState(isoDaysAgo(6));
  const [dateTo, setDateTo] = useState(todayISO());

  const students = useMemo(
    () => db.students.filter((s) => s.dept === dept && s.yearClass === yearClass),
    [db.students, dept, yearClass]
  );

  const report = useMemo(
    () => computeWeeklyReport({ students, attendance: db.attendance, dept, yearClass, dateFrom, dateTo }),
    [students, db.attendance, dept, yearClass, dateFrom, dateTo]
  );

  function handleDownload() {
    if (report.rows.length === 0) {
      alert('No students found for this Department / Year selection.');
      return;
    }
    exportWeeklyReport({ dept, yearClass, dateFrom, dateTo, rows: report.rows, actor });
    setDb((prev) => ({
      ...prev,
      attendanceAudit: [
        makeAuditEntry('DOWNLOAD_WEEKLY', actor, `Downloaded weekly report — ${dept} / ${yearClass} — ${dateFrom} to ${dateTo}`),
        ...prev.attendanceAudit
      ]
    }));
  }

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Weekly Attendance Report</span>
        <span className="badge badge-info">{report.totalSessions} session(s) held</span>
      </div>

      <div className="table-filter-bar" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <select className="filter-select" value={dept} onChange={(e) => setDept(e.target.value)}>
          {DEPARTMENTS.map((d) => <option value={d} key={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={yearClass} onChange={(e) => setYearClass(e.target.value)}>
          {YEAR_CLASSES.map((y) => <option value={y.value} key={y.value}>{y.label}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          From
          <input type="date" className="filter-select" value={dateFrom} max={dateTo} onChange={(e) => setDateFrom(e.target.value)} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          To
          <input type="date" className="filter-select" value={dateTo} max={todayISO()} onChange={(e) => setDateTo(e.target.value)} />
        </label>
        <button className="btn" onClick={handleDownload}>Download Excel (Weekly)</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span className="badge badge-info">Students: {students.length}</span>
        <span className="badge badge-success">Class Average: {report.avgPct}%</span>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Enrollment No</th>
              <th>Name</th>
              <th>Sessions</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {report.rows.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>No students enrolled in this division.</td></tr>
            ) : report.rows.map((r) => (
              <tr key={r.enrollid}>
                <td><strong>{r.enrollid}</strong></td>
                <td>{r.name}</td>
                <td>{r.sessions}</td>
                <td>{r.presentCount}</td>
                <td>{r.absentCount}</td>
                <td>{r.pct === null ? 'N/A' : `${r.pct}%`}</td>
                <td>
                  {r.pct === null
                    ? <span className="badge badge-info">No Data</span>
                    : r.pct >= ATTENDANCE_PASS_THRESHOLD
                      ? <span className="badge badge-success">Good</span>
                      : <span className="badge badge-danger">At Risk</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Audit History — who took / downloaded attendance                       */
/* ---------------------------------------------------------------------- */

function AuditHistoryTab({ db, actor }) {
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = useMemo(
    () => actionFilter === 'all' ? db.attendanceAudit : db.attendanceAudit.filter((a) => a.action === actionFilter),
    [db.attendanceAudit, actionFilter]
  );

  function handleDownload() {
    if (db.attendanceAudit.length === 0) return;
    exportAuditLog(db.attendanceAudit);
  }

  return (
    <div className="panel-card">
      <div className="panel-title">
        <span>Attendance Audit Trail</span>
        <span className="badge badge-info">{db.attendanceAudit.length} logged event(s)</span>
      </div>

      <div className="table-filter-bar" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <select className="filter-select" value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
          <option value="all">All Actions</option>
          <option value="MARK_ATTENDANCE">Marked Attendance</option>
          <option value="UPDATE_ATTENDANCE">Updated Attendance</option>
          <option value="DOWNLOAD_DAILY">Downloaded Daily Sheet</option>
          <option value="DOWNLOAD_WEEKLY">Downloaded Weekly Report</option>
        </select>
        <button className="btn btn-secondary" onClick={handleDownload}>Export Full Log (Excel)</button>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Performed By</th>
              <th>Role</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No attendance activity recorded yet.</td></tr>
            ) : filtered.map((a) => (
              <tr key={a.id}>
                <td>{formatStamp(a.timestamp)}</td>
                <td><ActionBadge action={a.action} /></td>
                <td><strong>{a.by}</strong>{a.by === actor.name && <span className="badge badge-info" style={{ marginLeft: '0.4rem' }}>You</span>}</td>
                <td>{a.role}</td>
                <td>{a.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBadge({ action }) {
  const map = {
    MARK_ATTENDANCE: { cls: 'badge-success', label: 'Marked' },
    UPDATE_ATTENDANCE: { cls: 'badge-warning', label: 'Updated' },
    DOWNLOAD_DAILY: { cls: 'badge-info', label: 'Downloaded Daily' },
    DOWNLOAD_WEEKLY: { cls: 'badge-info', label: 'Downloaded Weekly' }
  };
  const cfg = map[action] || { cls: 'badge-info', label: action };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}

/* ---------------------------------------------------------------------- */
/* Faculty Biometric punch simulator (kept from the original module)      */
/* ---------------------------------------------------------------------- */

function FacultyBiometricTab({ db }) {
  const [selectedFacultyId, setSelectedFacultyId] = useState(db.faculty[0]?.id || '');
  const [punchLog, setPunchLog] = useState([]);

  function simulatePunch(type) {
    const fac = db.faculty.find((x) => x.id === selectedFacultyId);
    if (!fac) return;
    const timeStr = new Date().toLocaleTimeString();
    setPunchLog((prev) => [{ key: `${Date.now()}-${type}`, name: fac.name, type, time: timeStr }, ...prev]);
  }

  return (
    <div className="panel-card">
      <div className="panel-title">Faculty Punch Simulator</div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="attn-faculty-select">Faculty Employee</label>
        <select id="attn-faculty-select" className="form-input" value={selectedFacultyId} onChange={(e) => setSelectedFacultyId(e.target.value)}>
          {db.faculty.map((f) => (
            <option value={f.id} key={f.id}>{f.name} ({f.dept})</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button className="btn btn-full" onClick={() => simulatePunch('IN')}> PUNCH IN</button>
        <button className="btn btn-secondary btn-full" onClick={() => simulatePunch('OUT')}> PUNCH OUT</button>
      </div>

      <div className="table-responsive">
        <table className="data-table" style={{ fontSize: '0.8rem' }}>
          <thead>
            <tr>
              <th>Faculty Name</th>
              <th>Type</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {punchLog.map((p) => (
              <tr key={p.key}>
                <td><strong>{p.name}</strong></td>
                <td><span className={`badge ${p.type === 'IN' ? 'badge-success' : 'badge-danger'}`}>PUNCH {p.type}</span></td>
                <td>{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
