import { ROLES } from '../data/seed';
import belhekarLogo from '../assets/belhekar-logo.jpeg';
import {
  IconDashboard, IconStudents, IconFacultyNav, IconAccounts, IconAttendance,
  IconDocuments, IconAcademics, IconPlacements, IconLogout
} from './Icons';

const CORE_NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard Home', Icon: IconDashboard },
  { key: 'students', label: 'Students Directory', Icon: IconStudents },
  { key: 'faculty', label: 'Faculty Roster', Icon: IconFacultyNav },
  { key: 'accounts', label: 'Accounts & Fees', Icon: IconAccounts },
  { key: 'attendance', label: 'Attendance Ledger', Icon: IconAttendance },
  { key: 'documents', label: 'Document Builder', Icon: IconDocuments },
  { key: 'academics', label: 'Academic Grades', Icon: IconAcademics },
  { key: 'placements', label: 'Career & Placements', Icon: IconPlacements }
];

export default function Sidebar({ currentRole, activeModule, onSwitchModule, currentUser, sidebarOpen, onLogout }) {
  const allowed = ROLES[currentRole].modules;

  return (
    <aside id="sidebar" className={sidebarOpen ? 'open' : ''}>
      <div className="sidebar-header">
  <img
    src={belhekarLogo}
    alt="Belhekar Group of Institutes"
    className="belhekar-logo"
  />
</div>

      <div className="sidebar-nav">
        <div className="nav-label">Core Modules</div>
        <ul className="nav-list">
          {CORE_NAV_ITEMS.map(({ key, label, Icon }) => (
            <li
              key={key}
              className={`nav-item${activeModule === key ? ' active' : ''}`}
              id={`nav-${key}`}
              style={{ display: allowed.includes(key) ? 'block' : 'none' }}
              onClick={() => onSwitchModule(key)}
            >
              <a>
                <Icon />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-label" id="compliance-label" style={{ display: allowed.includes('compliance') ? 'block' : 'none' }}>
          Audit &amp; Compliance
        </div>
        <ul className="nav-list" id="compliance-nav">
          <li
            className={`nav-item${activeModule === 'compliance' ? ' active' : ''}`}
            id="nav-compliance"
            style={{ display: allowed.includes('compliance') ? 'block' : 'none' }}
            onClick={() => onSwitchModule('compliance')}
          >
            <a>
              <IconDocuments />
              <span>Compliance Reports</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar" id="avatar-letter">{currentUser.name.charAt(0)}</div>
          <div className="user-info">
            <span className="user-name" id="user-display-name">{currentUser.name}</span>
            <span className="user-role-label" id="user-display-role">{ROLES[currentRole].label}</span>
          </div>
        </div>
        <button className="btn btn-secondary btn-full" onClick={onLogout}>
          <IconLogout />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
