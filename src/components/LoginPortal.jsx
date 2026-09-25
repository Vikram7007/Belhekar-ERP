import { useState } from 'react';
import { ROLES } from '../data/seed';
import { IconAdmin, IconClerk, IconFaculty, IconAccountant } from './Icons';
import belhekarLogo from '../assets/belhekar-logo.jpeg';

const ROLE_CARDS = [
  { key: 'admin', name: 'Administrator', desc: 'Full system access, compliance & reporting', Icon: IconAdmin },
  { key: 'clerk', name: 'Clerk', desc: 'Student profiles, certificates, career tracking', Icon: IconClerk },
  { key: 'faculty', name: 'Faculty', desc: 'Personal files, student grades & attendance', Icon: IconFaculty },
  { key: 'accountant', name: 'Accountant', desc: 'Fees tracker, invoices & transactions', Icon: IconAccountant }
];

export default function LoginPortal({ onLogin, defaultRole = 'admin' }) {
  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  function selectPortalRole(role) {
    setSelectedRole(role);
    setUsername('');
    setPassword('');
    setMessage({ type: '', text: '' });
  }

  function handlePortalLogin(e) {
    e.preventDefault();
    const userIn = username.trim();
    const passIn = password;

    const foundRole = Object.entries(ROLES).find(([, roleConfig]) => (
      roleConfig.username === userIn && roleConfig.password === passIn
    ));

    if (foundRole) {
      onLogin(foundRole[0]);
    } else {
      setMessage({ type: 'error', text: 'The user ID or password is incorrect.' });
    }
  }

  function handleForgotPassword(e) {
    e.preventDefault();
    if (!username.trim()) {
      setMessage({ type: 'error', text: 'Enter your role username to request a reset link.' });
      return;
    }
    setMessage({ type: 'success', text: 'If this account exists, password reset instructions have been sent.' });
  }

  return (
    <div id="portal-container">
      <div className="portal-card">
        <section className="portal-showcase">
          <div className="portal-brand-mark">
            <img src={belhekarLogo} alt="Belhekar Group of Institutes" className="portal-brand-logo" />
          </div>
          <p className="portal-kicker">Belhekar Group of Institutes</p>
          <h1 className="portal-title">Belhekar ERP</h1>
          <p className="portal-subtitle">One secure workspace for every institutional operation.</p>
          <div className="portal-status"><span /> Secure institutional access</div>
        </section>

        <section className="portal-login-panel">
          <div className="portal-header">
            <p className="login-eyebrow">Welcome back</p>
            <h2>Sign in to your portal</h2>
            <p className="portal-helper">Choose your department and continue with its separate credentials.</p>
          </div>

        <div className="role-selector-grid">
          {ROLE_CARDS.map(({ key, name, desc, Icon }) => (
            <button
              key={key}
              type="button"
              className={`role-card${selectedRole === key ? ' selected' : ''}`}
              onClick={() => selectPortalRole(key)}
            >
              <div className="role-icon-wrapper">
                <Icon />
              </div>
              <div className="role-name">{name}</div>
              <div className="role-desc">{desc}</div>
            </button>
          ))}
        </div>

        <div className="login-action-box">
          <form id="login-form" onSubmit={handlePortalLogin}>
            <div className="login-input-group">
              <label htmlFor="username">User Name ID</label>
              <input
                type="text" id="username" className="login-input"
                value={username} onChange={(e) => setUsername(e.target.value)} required
              />
            </div>
            <div className="login-input-group">
              <label htmlFor="password">Security Password</label>
              <input
                type={showPassword ? 'text' : 'password'} id="password" className="login-input"
                value={password} onChange={(e) => setPassword(e.target.value)} required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {message.text && <div className={`login-message ${message.type}`} role="alert">{message.text}</div>}
            <button type="submit" className="btn btn-full">Secure Login</button>
          </form>

          <button type="button" className="forgot-link" onClick={() => { setShowForgotPassword((value) => !value); setMessage({ type: '', text: '' }); }}>
            Forgot password?
          </button>

          {showForgotPassword && (
            <form className="forgot-panel" onSubmit={handleForgotPassword}>
              <strong>Reset {ROLES[selectedRole].displayName} access</strong>
              <p>We will send instructions to the registered department contact.</p>
              <button type="submit" className="btn btn-secondary btn-full">Request reset link</button>
            </form>
          )}

          <div className="demo-credentials" id="demo-creds-box">
            <strong>Demo ID:</strong> <span id="demo-user">{ROLES[selectedRole].username}</span>
            <span className="credential-divider">|</span>
            <strong>Password:</strong> <span id="demo-pass">{ROLES[selectedRole].password}</span>
          </div>
        </div>
        </section>
      </div>
    </div>
  );
}
