import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, Shield, Users, HelpCircle } from 'lucide-react';

export default function Header() {
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    activePortal,
    setActivePortal,
    simulationSpeed
  } = useApp();

  const handleWorkspaceChange = (e) => {
    setActiveWorkspaceId(e.target.value);
  };

  return (
    <header className="app-header">
      <div className="logo-section">
        <div className="logo-icon">⚡</div>
        <div>
          <span className="logo-text">pipeline<span className="logo-accent">.sh</span></span>
        </div>
      </div>

      <div className="header-controls">
        {/* Connection status heartbeat */}
        <div className="workspace-selector-container" style={{ gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={`pulse-indicator ${simulationSpeed === 'paused' ? 'paused' : ''}`}></span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
              {simulationSpeed === 'paused' ? 'SIM PAUSED' : 'LIVE TELEMETRY'}
            </span>
          </div>
        </div>

        {/* Workspace Switcher (visible in client view or to see which workspace details to load) */}
        <div className="workspace-selector-container">
          <span style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '500' }}>Workspace:</span>
          <select 
            className="workspace-select" 
            value={activeWorkspaceId} 
            onChange={handleWorkspaceChange}
          >
            {workspaces.map(ws => (
              <option key={ws.id} value={ws.id}>
                {ws.name} ({ws.tier})
              </option>
            ))}
          </select>
        </div>

        {/* Portal toggle */}
        <div className="portal-toggle">
          <button 
            className={`toggle-btn ${activePortal === 'client' ? 'active' : 'inactive'}`}
            onClick={() => setActivePortal('client')}
            title="Switch to Client Developer Dashboard"
          >
            <Shield size={16} />
            Developer
          </button>
          <button 
            className={`toggle-btn ${activePortal === 'admin' ? 'active' : 'inactive'}`}
            onClick={() => setActivePortal('admin')}
            title="Switch to Admin CRM & PLG Portal"
          >
            <Users size={16} />
            Admin CRM
          </button>
        </div>
      </div>
    </header>
  );
}
