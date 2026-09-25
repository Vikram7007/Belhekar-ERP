import { useState } from 'react';
import { ROLES } from './data/seed';
import { useERPDatabase } from './hooks/useERPDatabase';
import LoginPortal from './components/LoginPortal';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './views/DashboardView';
import StudentsView from './views/StudentsView';
import FacultyView from './views/FacultyView';
import AccountsView from './views/AccountsView';
import AttendanceView from './views/AttendanceView';
import DocumentsView from './views/DocumentsView';
import AcademicsView from './views/AcademicsView';
import PlacementsView from './views/PlacementsView';
import ComplianceView from './views/ComplianceView';

export default function App() {
  const [db, setDb] = useERPDatabase();
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState('admin');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = {
    name: ROLES[currentRole].displayName,
    username: ROLES[currentRole].username
  };

  function handleLogin(role) {
    setCurrentRole(role);
    setActiveModule('dashboard');
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
  }

  function handleSwitchModule(moduleName) {
    const allowed = ROLES[currentRole].modules;
    if (!allowed.includes(moduleName)) return;
    setActiveModule(moduleName);
    setSidebarOpen(false);
  }

  if (!loggedIn) {
    return <LoginPortal onLogin={handleLogin} />;
  }

  return (
    <div id="app-container" style={{ display: 'flex' }}>
      <Sidebar
        currentRole={currentRole}
        activeModule={activeModule}
        onSwitchModule={handleSwitchModule}
        currentUser={currentUser}
        sidebarOpen={sidebarOpen}
        onLogout={handleLogout}
      />

      <main id="main-content">
        <Topbar
          currentRole={currentRole}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
        />

        {activeModule === 'dashboard' && <DashboardView db={db} />}
        {activeModule === 'students' && <StudentsView db={db} setDb={setDb} currentRole={currentRole} />}
        {activeModule === 'faculty' && <FacultyView db={db} setDb={setDb} currentRole={currentRole} />}
        {activeModule === 'accounts' && <AccountsView db={db} setDb={setDb} currentRole={currentRole} />}
        {activeModule === 'attendance' && <AttendanceView db={db} setDb={setDb} currentRole={currentRole} currentUser={currentUser} />}
        {activeModule === 'documents' && <DocumentsView db={db} />}
        {activeModule === 'academics' && <AcademicsView db={db} setDb={setDb} currentRole={currentRole} />}
        {activeModule === 'placements' && <PlacementsView db={db} setDb={setDb} currentRole={currentRole} />}
        {activeModule === 'compliance' && <ComplianceView db={db} />}
      </main>
    </div>
  );
}
