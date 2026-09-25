// Belhekar ERP - Attendance domain helpers
// Central place for the "mark absentees only, everyone else present" logic,
// record identity, weekly aggregation, and audit log entry construction.

export const ATTENDANCE_PASS_THRESHOLD = 75; // % — below this a student is "at risk"

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function isoDaysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function nowStamp() {
  const d = new Date();
  return d.toISOString();
}

export function formatStamp(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function deptCode(dept = '') {
  if (dept.includes('Computer')) return 'CE';
  if (dept.includes('Mechanical')) return 'ME';
  if (dept.includes('Electrical')) return 'EE';
  if (dept.includes('Civil')) return 'CV';
  return dept.slice(0, 2).toUpperCase();
}

// One record per Department + Year/Class + Date. Saving again for the same
// combination updates the existing record instead of duplicating it.
export function buildRecordId(dept, yearClass, date) {
  return `ATT-${deptCode(dept)}-${yearClass}-${date}`;
}

export function findAttendanceRecord(attendance, dept, yearClass, date) {
  const id = buildRecordId(dept, yearClass, date);
  return attendance.find((r) => r.id === id) || null;
}

// Builds the record to persist. `absentSet` holds enrollids marked absent —
// every other enrolled student in the class is implicitly Present.
export function buildAttendanceRecord({ dept, yearClass, date, students, absentSet, actor, existing }) {
  const absentees = students
    .filter((s) => absentSet.has(s.enrollid))
    .map((s) => ({ enrollid: s.enrollid, name: s.name }));

  const base = {
    id: buildRecordId(dept, yearClass, date),
    date,
    dept,
    yearClass,
    totalStudents: students.length,
    absentees,
    presentCount: students.length - absentees.length,
    absentCount: absentees.length
  };

  if (existing) {
    return {
      ...existing,
      ...base,
      updatedBy: actor,
      updatedAt: nowStamp()
    };
  }
  return {
    ...base,
    markedBy: actor,
    markedAt: nowStamp(),
    updatedBy: null,
    updatedAt: null
  };
}

export function makeAuditEntry(action, actor, details) {
  return {
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    action,
    by: actor.name,
    role: actor.role,
    timestamp: nowStamp(),
    details
  };
}

// Aggregates every attendance record within [dateFrom, dateTo] (inclusive)
// for the given dept/yearClass into a per-student Present/Absent/% table.
export function computeWeeklyReport({ students, attendance, dept, yearClass, dateFrom, dateTo }) {
  const records = attendance
    .filter((r) => r.dept === dept && r.yearClass === yearClass && r.date >= dateFrom && r.date <= dateTo)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const rows = students.map((s) => {
    const sessions = records.length;
    const absentDays = records.filter((r) => r.absentees.some((a) => a.enrollid === s.enrollid)).map((r) => r.date);
    const absentCount = absentDays.length;
    const presentCount = sessions - absentCount;
    const pct = sessions > 0 ? Math.round((presentCount / sessions) * 100) : null;
    return {
      enrollid: s.enrollid,
      name: s.name,
      sessions,
      presentCount,
      absentCount,
      pct,
      absentDays
    };
  });

  const totalSessions = records.length;
  const avgPct = rows.length > 0
    ? Math.round(rows.reduce((sum, r) => sum + (r.pct ?? 0), 0) / rows.length)
    : 0;

  return { records, rows, totalSessions, avgPct };
}
