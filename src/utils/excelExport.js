// Belhekar ERP - Excel export helpers (SheetJS / xlsx)
import * as XLSX from 'xlsx';

function downloadWorkbook(sheets, filename) {
  const wb = XLSX.utils.book_new();
  sheets.forEach(({ name, rows }) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  });
  XLSX.writeFile(wb, filename);
}

export function exportDailySheet({ dept, yearClass, date, students, absentSet, actor }) {
  const rows = students.map((s, idx) => ({
    'Sr No': idx + 1,
    'Enrollment No': s.enrollid,
    'Student Name': s.name,
    'Status': absentSet.has(s.enrollid) ? 'Absent' : 'Present'
  }));

  rows.push({});
  rows.push({ 'Sr No': '', 'Enrollment No': 'Department', 'Student Name': dept, 'Status': '' });
  rows.push({ 'Sr No': '', 'Enrollment No': 'Class', 'Student Name': yearClass, 'Status': '' });
  rows.push({ 'Sr No': '', 'Enrollment No': 'Date', 'Student Name': date, 'Status': '' });
  rows.push({ 'Sr No': '', 'Enrollment No': 'Downloaded By', 'Student Name': `${actor.name} (${actor.role})`, 'Status': '' });

  downloadWorkbook(
    [{ name: 'Daily Attendance', rows }],
    `Attendance_${dept.replace(/\s+/g, '')}_${yearClass}_${date}.xlsx`
  );
}

export function exportWeeklyReport({ dept, yearClass, dateFrom, dateTo, rows, actor }) {
  const sheetRows = rows.map((r, idx) => ({
    'Sr No': idx + 1,
    'Enrollment No': r.enrollid,
    'Student Name': r.name,
    'Sessions Held': r.sessions,
    'Present': r.presentCount,
    'Absent': r.absentCount,
    'Attendance %': r.pct === null ? 'N/A' : `${r.pct}%`,
    'Absent Dates': r.absentDays.join(', ')
  }));

  sheetRows.push({});
  sheetRows.push({ 'Sr No': '', 'Enrollment No': 'Department', 'Student Name': dept });
  sheetRows.push({ 'Sr No': '', 'Enrollment No': 'Class', 'Student Name': yearClass });
  sheetRows.push({ 'Sr No': '', 'Enrollment No': 'Period', 'Student Name': `${dateFrom} to ${dateTo}` });
  sheetRows.push({ 'Sr No': '', 'Enrollment No': 'Downloaded By', 'Student Name': `${actor.name} (${actor.role})` });

  downloadWorkbook(
    [{ name: 'Weekly Report', rows: sheetRows }],
    `Weekly_Attendance_${dept.replace(/\s+/g, '')}_${yearClass}_${dateFrom}_to_${dateTo}.xlsx`
  );
}

export function exportAuditLog(auditLog) {
  const rows = auditLog.map((a, idx) => ({
    'Sr No': idx + 1,
    'Timestamp': a.timestamp,
    'Action': a.action,
    'Performed By': a.by,
    'Role': a.role,
    'Details': a.details
  }));
  downloadWorkbook([{ name: 'Attendance Audit Log', rows }], `Attendance_Audit_Log_${Date.now()}.xlsx`);
}
