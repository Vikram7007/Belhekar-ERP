import { IconStudents, IconFacultyNav, IconAccounts, IconPlacements, IconAttendance } from '../components/Icons';
import { DEPARTMENTS } from '../data/seed';
import { todayISO, formatStamp } from '../utils/attendance';

function shortLabel(dept) {
  if (dept.includes('Computer')) return 'COMP';
  if (dept.includes('Mechanical')) return 'MECH';
  if (dept.includes('Electrical')) return 'ELEC';
  return 'CIVIL';
}

const DEPARTMENT_COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#f43f5e'];

export default function DashboardView({ db }) {
  // Metrics
  const totalInflow = db.transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalBE = db.students.filter((s) => s.yearClass === 'BE').length;
  const placedBE = db.placements.length;
  const placementRate = totalBE > 0 ? Math.round((placedBE / totalBE) * 100) : 0;

  // Today's attendance snapshot (shared across Admin & Faculty portals via the same DB)
  const todaysRecords = db.attendance.filter((r) => r.date === todayISO());
  const todaysTotal = todaysRecords.reduce((sum, r) => sum + r.totalStudents, 0);
  const todaysPresent = todaysRecords.reduce((sum, r) => sum + r.presentCount, 0);
  const todaysPct = todaysTotal > 0 ? Math.round((todaysPresent / todaysTotal) * 100) : null;
  const recentAttendanceActivity = [...db.attendanceAudit].slice(0, 6);
  const liveSyncLogs = recentAttendanceActivity.map((activity) => ({
    key: activity.id,
    cls: `biometric-log-line ${activity.role === 'faculty' ? 'essl' : 'hikvision'}`,
    badgeCls: activity.role === 'faculty' ? 'es' : 'hik',
    badgeLabel: activity.role === 'faculty' ? 'FACULTY' : 'ADMIN',
    text: `[${formatStamp(activity.timestamp)}] ${activity.by}`,
    actionText: ` | ${activity.action.replace(/_/g, ' ')}`
  }));

  // Enrollment chart
  const depts = {};
  db.students.forEach((s) => { depts[s.dept] = (depts[s.dept] || 0) + 1; });
  const totalStudents = db.students.length;
  let donutStart = 0;
  const departmentData = DEPARTMENTS.map((department, index) => {
    const count = depts[department] || 0;
    const percentage = totalStudents ? (count / totalStudents) * 100 : 0;
    const segment = `${DEPARTMENT_COLORS[index]} ${donutStart}% ${donutStart + percentage}%`;
    donutStart += percentage;
    return { department, count, percentage, color: DEPARTMENT_COLORS[index], segment };
  });
  const donutBackground = departmentData.length
    ? `conic-gradient(${departmentData.map((item) => item.segment).join(', ')})`
    : '#e2e8f0';

  return (
    <section className="module-view active" id="view-dashboard">
      <div className="dashboard-hero">
        <div className="hero-content">
          <h2 className="hero-title">Belhekar ERP Dashboard</h2>
          <p className="hero-subtitle">Manage admissions, course records, compliance sheets, accounts transactions, and daily attendance logs seamlessly.</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon"><IconStudents /></div>
          <div className="metric-info">
            <span className="metric-value" id="metric-students-count">{db.students.length}</span>
            <span className="metric-label">Active Students</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon"><IconFacultyNav /></div>
          <div className="metric-info">
            <span className="metric-value" id="metric-faculty-count">{db.faculty.length}</span>
            <span className="metric-label">Active Faculty</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon"><IconAccounts /></div>
          <div className="metric-info">
            <span className="metric-value" id="metric-fees-collected">₹ {totalInflow.toLocaleString('en-IN')}</span>
            <span className="metric-label">Total Fee Inflow</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon"><IconPlacements /></div>
          <div className="metric-info">
            <span className="metric-value" id="metric-placement-rate">{placedBE} ({placementRate}%)</span>
            <span className="metric-label">Placements Registered</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon"><IconAttendance /></div>
          <div className="metric-info">
            <span className="metric-value" id="metric-attendance-today">{todaysPct === null ? 'Not Marked' : `${todaysPct}%`}</span>
            <span className="metric-label">Today's Attendance ({todaysRecords.length} class{todaysRecords.length === 1 ? '' : 'es'})</span>
          </div>
        </div>
      </div>

      <div className="dashboard-details-grid">
        <div className="panel-card">
          <div className="panel-title">
            <span>Department Distribution</span>
            <span className="badge badge-info">Live Enrollment</span>
          </div>
          <div className="distribution-row">
            <div className="department-donut" style={{ background: donutBackground }}>
              <div className="donut-hole">
                <strong>{totalStudents}</strong>
                <span>Students</span>
              </div>
            </div>
            <div className="department-legend">
              {departmentData.map(({ department, count, percentage, color }) => (
                <div className="legend-item" key={department}>
                  <span className="legend-swatch" style={{ background: color }} />
                  <span>{shortLabel(department)}</span>
                  <strong>{count}</strong>
                  <small>{percentage.toFixed(0)}%</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-title">
            <span>Live Database Activity</span>
            <span className="badge badge-success">MongoDB Sync</span>
          </div>
          <div className="biometric-log-console" id="biometric-console-panel">
            {liveSyncLogs.length === 0 ? <div className="biometric-log-line">No live activity recorded yet.</div> : liveSyncLogs.map((line) => (
              <div className={line.cls} key={line.key}>
                <span className={`biometric-badge ${line.badgeCls}`}>{line.badgeLabel}</span>
                {' '}{line.text}{line.actionText}
              </div>
            ))}
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-title">
            <span>Recent Attendance Activity</span>
            <span className="badge badge-info">Admin &amp; Faculty Shared</span>
          </div>
          <div className="table-responsive">
            <table className="data-table" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>When</th>
                  <th>Action</th>
                  <th>By</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {recentAttendanceActivity.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center' }}>No attendance activity yet.</td></tr>
                ) : recentAttendanceActivity.map((a) => (
                  <tr key={a.id}>
                    <td>{formatStamp(a.timestamp)}</td>
                    <td>{a.action.replace(/_/g, ' ')}</td>
                    <td><strong>{a.by}</strong></td>
                    <td>{a.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
