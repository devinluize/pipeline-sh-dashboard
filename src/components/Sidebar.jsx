import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Shuffle, 
  CreditCard, 
  Users, 
  Cpu, 
  Zap, 
  Play, 
  Pause,
  AlertTriangle,
  Flame
} from 'lucide-react';

export default function Sidebar() {
  const {
    activePortal,
    clientTab,
    setClientTab,
    adminTab,
    setAdminTab,
    simulationSpeed,
    setSimulationSpeed,
    simulateTrafficSpike,
    simulateOutage
  } = useApp();

  return (
    <aside className="app-sidebar">
      <div>
        {activePortal === 'client' ? (
          <div className="nav-menu">
            <div style={{ padding: '0 16px 8px 16px', fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', letterSpacing: '1px' }}>
              DEVELOPER HUB
            </div>
            
            <button 
              className={`btn-secondary nav-item ${clientTab === 'overview' ? 'active' : ''}`}
              onClick={() => setClientTab('overview')}
            >
              <LayoutDashboard size={18} />
              Live Telemetry
            </button>

            <button 
              className={`btn-secondary nav-item ${clientTab === 'roi' ? 'active' : ''}`}
              onClick={() => setClientTab('roi')}
            >
              <TrendingUp size={18} />
              ROI & Savings
            </button>

            <button 
              className={`btn-secondary nav-item ${clientTab === 'rerouting' ? 'active' : ''}`}
              onClick={() => setClientTab('rerouting')}
            >
              <Shuffle size={18} />
              AI Rerouting
            </button>

            <button 
              className={`btn-secondary nav-item ${clientTab === 'billing' ? 'active' : ''}`}
              onClick={() => setClientTab('billing')}
            >
              <CreditCard size={18} />
              Billing & Quota
            </button>
          </div>
        ) : (
          <div className="nav-menu">
            <div style={{ padding: '0 16px 8px 16px', fontSize: '11px', fontWeight: '700', color: 'var(--text-light)', letterSpacing: '1px' }}>
              CRM PORTAL
            </div>

            <button 
              className={`btn-secondary nav-item ${adminTab === 'workspaces' ? 'active' : ''}`}
              onClick={() => setAdminTab('workspaces')}
            >
              <Users size={18} />
              Workspaces CRM
            </button>

            <button 
              className={`btn-secondary nav-item ${adminTab === 'plg' ? 'active' : ''}`}
              onClick={() => setAdminTab('plg')}
            >
              <Zap size={18} />
              PLG Automations
            </button>

            <button 
              className={`btn-secondary nav-item ${adminTab === 'network' ? 'active' : ''}`}
              onClick={() => setAdminTab('network')}
            >
              <Cpu size={18} />
              Router Health
            </button>
          </div>
        )}
      </div>

      {/* Simulator Quick Action Panel */}
      <div style={{ background: '#fafafa', border: '1px solid var(--border)', borderRadius: 'var(--border-radius-md)', padding: '14px', fontSize: '13px' }}>
        <div style={{ fontWeight: '700', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Simulation Cockpit
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Sim Speed:</span>
          <div style={{ display: 'flex', gap: '2px', background: '#eee', padding: '2px', borderRadius: '4px' }}>
            <button 
              onClick={() => setSimulationSpeed('normal')} 
              style={{ padding: '2px 6px', fontSize: '10px', border: 'none', background: simulationSpeed === 'normal' ? 'var(--primary)' : 'transparent', color: simulationSpeed === 'normal' ? '#fff' : 'var(--text-main)', borderRadius: '2px', cursor: 'pointer', fontWeight: '600' }}
            >
              1x
            </button>
            <button 
              onClick={() => setSimulationSpeed('fast')} 
              style={{ padding: '2px 6px', fontSize: '10px', border: 'none', background: simulationSpeed === 'fast' ? 'var(--primary)' : 'transparent', color: simulationSpeed === 'fast' ? '#fff' : 'var(--text-main)', borderRadius: '2px', cursor: 'pointer', fontWeight: '600' }}
            >
              3x
            </button>
            <button 
              onClick={() => setSimulationSpeed('paused')} 
              style={{ padding: '2px 6px', fontSize: '10px', border: 'none', background: simulationSpeed === 'paused' ? 'var(--danger)' : 'transparent', color: simulationSpeed === 'paused' ? '#fff' : 'var(--text-main)', borderRadius: '2px', cursor: 'pointer', fontWeight: '600' }}
            >
              <Pause size={8} />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={simulateTrafficSpike} 
            style={{ padding: '6px', fontSize: '11px', width: '100%', justifyContent: 'flex-start', border: '1px solid #dbeafe', background: '#eff6ff' }}
          >
            <Flame size={12} color="var(--primary)" />
            Spike API Traffic
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={simulateOutage} 
            style={{ padding: '6px', fontSize: '11px', width: '100%', justifyContent: 'flex-start', border: '1px solid #fee2e2', background: '#fef2f2' }}
          >
            <AlertTriangle size={12} color="var(--danger)" />
            Simulate OpenAI Outage
          </button>
        </div>
      </div>
    </aside>
  );
}
