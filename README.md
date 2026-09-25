# Belhekar-ERP

A React/Vite institutional ERP portal with role-based access, student and faculty
records, fee transactions, attendance, documents, academics, and placements.

## Getting Started

```bash
npm install
npm run dev       # start API and Vite client
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

The API uses MongoDB. Copy `.env.example` to `.env` and set `MONGODB_URI` to a
MongoDB connection string before starting the server. Never commit `.env` or
database credentials.

## Demo Logins

| Role          | Username          | Password       |
|---------------|-------------------|----------------|
| Administrator | admin.belhekar    | Admin@2026     |
| Clerk         | clerk.office      | Clerk@2026     |
| Faculty       | faculty.portal    | Faculty@2026   |
| Accountant    | accounts.desk     | Accounts@2026  |

These are demo credentials for development only. Replace them with secure,
server-side authentication before deploying for real users.

## Project Structure

```
src/
  data/seed.js            Roles config + seed/mock data + document templates
  hooks/useERPDatabase.js MongoDB-backed app data refresh and sync
  components/             Reusable UI: Icons, Login Portal, Sidebar, Topbar, modals
  views/                  One component per ERP module (Dashboard, Students, Faculty,
                           Accounts, Attendance, Documents, Academics, Placements,
                           Compliance)
  App.jsx                 Top-level routing between login screen and module views
  index.css               Full design system (ported 1:1 from the original styles.css)
```

## Student Attendance Management

The Attendance module (`src/views/AttendanceView.jsx`) is a full absentee-only workflow,
available to the **Admin** and **Faculty** roles and shared through the same local
database, so anything one role records is immediately visible to the other:

- **Take Attendance** — pick Department, Year/Class and Date, then tick only the
  students who are **absent**; everyone else is saved as Present automatically.
  Re-opening a class/date that was already marked loads the saved list for editing
  and updates the same record instead of duplicating it.
- **Weekly Reports** — aggregates every daily record in a date range into a
  per-student Present/Absent/Attendance % table, with an "At Risk" badge for
  students below {`ATTENDANCE_PASS_THRESHOLD`} = 75%.
- **Excel Downloads** — daily sheets, weekly reports, and the full audit log can
  each be downloaded as `.xlsx` (via `xlsx`/SheetJS in `src/utils/excelExport.js`).
- **Audit History** — every mark, update, and download is logged with who did it,
  their role, and a timestamp (`src/utils/attendance.js` + `db.attendanceAudit`),
  filterable by action type and exportable to Excel.
- The **Dashboard** surfaces a live "Today's Attendance %" metric and a "Recent
  Attendance Activity" feed sourced from the same audit log, so Admin and Faculty
  portals always show the same up-to-date picture.

## Notes

- The API seeds the MongoDB database with development data when it is empty.
- The dashboard refreshes data from the API every 10 seconds.
- Printable views (fee receipts, certificates, NAAC/NBA sheets) use `window.print()`
  the same way the original app did.
