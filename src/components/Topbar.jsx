import { useEffect, useState } from 'react';
import { ROLES } from '../data/seed';
import { IconMenu, IconClock } from './Icons';

function formatNow() {
  const now = new Date();
  return now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');
}

export default function Topbar({ currentRole, onToggleSidebar }) {
  const [clock, setClock] = useState(formatNow());

  useEffect(() => {
    const id = setInterval(() => setClock(formatNow()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="sidebar-toggle-btn" onClick={onToggleSidebar}>
          <IconMenu />
        </button>
        <span className="breadcrumb-role" id="topbar-role-badge">{ROLES[currentRole].label}</span>
      </div>

      <div className="topbar-right">
        <div className="live-time-box">
          <IconClock />
          <span id="topbar-clock">{clock}</span>
        </div>
      </div>
    </header>
  );
}
