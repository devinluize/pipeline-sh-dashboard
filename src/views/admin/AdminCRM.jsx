import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Filter, 
  Mail, 
  TrendingUp, 
  AlertCircle, 
  Percent, 
  Sparkles, 
  ArrowUpRight, 
  Activity,
  Heart
} from 'lucide-react';

export default function AdminCRM() {
  const { workspaces, addPlgEvent, addAlert } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedWsId, setSelectedWsId] = useState(workspaces[0]?.id || null);

  const selectedWorkspace = workspaces.find(w => w.id === selectedWsId);

  // Filter workspaces
  const filteredWorkspaces = workspaces.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || w.churnRisk === riskFilter;
    const matchesTier = tierFilter === 'all' || w.tier === tierFilter;
    return matchesSearch && matchesRisk && matchesTier;
  });

  const handleSendWarning = (ws) => {
    addAlert('danger', 'Critical Performance Alert', 'Admin flagged your account for high failure rate. Please optimize route weights.', ws.id);
    addPlgEvent('churn', `CSM Warning Dispatched: ${ws.name}`, `Technical optimization warning sent to client contacts due to higher error rates.`);
    alert(`Emailed performance optimization guide to contacts of ${ws.name}.`);
  };

  const handleProactiveUpsell = (ws) => {
    addAlert('info', 'Exclusive Coupon Received', 'Unlock 25% off Pro upgrade this week. Code: PIPELINE25PRO', ws.id);
    addPlgEvent('upsell', `Proactive Promo Sent: ${ws.name}`, `Emailed special upgrade incentives (25% off coupon) to accelerate expansion.`);
    alert(`Dispatched proactive upgrade promotion coupon to ${ws.name}.`);
  };

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Universal Workspaces CRM</h2>
          <p>Internal relationship management. Monitor health scores, detect churn risk, and trigger proactive expansion (upsell) actions.</p>
        </div>
      </div>

      {/* CRM Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Managed Workspaces</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Heart size={16} />
            </div>
          </div>
          <div className="stat-value">{workspaces.length}</div>
          <div className="stat-footer">
            <span className="text-light">Active development projects</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">High Churn Risk Accounts</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--danger-light)', color: 'var(--danger)' }}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="stat-value">
            {workspaces.filter(w => w.churnRisk === 'high').length}
          </div>
          <div className="stat-footer">
            <span className="trend-badge down">
              Requires CS outreach
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Upsell Candidates</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-light)', color: 'var(--warning)' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="stat-value">
            {workspaces.filter(w => w.quotaUsed > 80 && w.tier !== 'Enterprise').length}
          </div>
          <div className="stat-footer">
            <span className="trend-badge up">
              Near Quota Capacity
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Avg Health Score</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
              <Activity size={16} />
            </div>
          </div>
          <div className="stat-value">
            {Math.round(workspaces.reduce((acc, curr) => acc + curr.healthScore, 0) / workspaces.length)}%
          </div>
          <div className="stat-footer">
            <span className="text-light">Stable routing network</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '24px', alignItems: 'start' }}>
        {/* Workspace directory */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">Workspaces Directory</span>
            
            {/* Search & Filter bar */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={14} style={{ position: 'absolute', left: '8px', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="Search workspace..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ padding: '4px 8px 4px 28px', fontSize: '12px', border: '1px solid var(--border)', borderRadius: '6px', width: '150px' }}
                />
              </div>

              <select 
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                style={{ padding: '4px', fontSize: '11px', border: '1px solid var(--border)', borderRadius: '6px' }}
              >
                <option value="all">All Risk</option>
                <option value="low">Low Risk</option>
                <option value="medium">Med Risk</option>
                <option value="high">High Risk</option>
              </select>

              <select 
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                style={{ padding: '4px', fontSize: '11px', border: '1px solid var(--border)', borderRadius: '6px' }}
              >
                <option value="all">All Tiers</option>
                <option value="Starter">Starter</option>
                <option value="Pro">Pro</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Workspace Name</th>
                  <th>Tier</th>
                  <th>Monthly Calls</th>
                  <th>Health Score</th>
                  <th>Churn Risk</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkspaces.map(ws => (
                  <tr 
                    key={ws.id} 
                    onClick={() => setSelectedWsId(ws.id)}
                    style={{ 
                      cursor: 'pointer', 
                      backgroundColor: selectedWsId === ws.id ? 'var(--primary-light)' : 'transparent',
                      fontWeight: selectedWsId === ws.id ? '600' : 'normal'
                    }}
                  >
                    <td>{ws.name}</td>
                    <td>{ws.tier}</td>
                    <td>{ws.volume.toLocaleString()}</td>
                    <td>
                      <span style={{ 
                        color: ws.healthScore > 85 ? 'var(--success-text)' : ws.healthScore > 65 ? 'var(--warning-text)' : 'var(--danger-text)' 
                      }}>
                        {ws.healthScore}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        ws.churnRisk === 'low' ? 'badge-success' : ws.churnRisk === 'medium' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {ws.churnRisk}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        ws.status === 'healthy' ? 'badge-success' : ws.status === 'warning' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {ws.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredWorkspaces.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-light)' }}>
                      No matching workspaces found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Workspace details CRM control panel */}
        {selectedWorkspace ? (
          <div className="dashboard-panel" style={{ border: '1px solid var(--primary)', boxShadow: 'var(--shadow-md)' }}>
            <div className="panel-header" style={{ borderColor: 'var(--primary)' }}>
              <span className="panel-title" style={{ color: 'var(--primary)' }}>
                <Sparkles size={16} />
                Workspace Relationship Card
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-main)', marginBottom: '2px' }}>
                {selectedWorkspace.name}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                ID: {selectedWorkspace.id} | Tier: <strong style={{ color: 'var(--primary)' }}>{selectedWorkspace.tier}</strong>
              </p>

              {/* Telemetry Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: '#fafafa', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Quota Status</span>
                  <strong style={{ fontSize: '14px' }}>{selectedWorkspace.quotaUsed}%</strong>
                  <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)' }}>
                    {selectedWorkspace.volume.toLocaleString()} calls
                  </span>
                </div>
                <div style={{ background: '#fafafa', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Average Latency</span>
                  <strong style={{ fontSize: '14px' }}>{selectedWorkspace.latency} ms</strong>
                  <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)' }}>
                    Failovers: {selectedWorkspace.failoversCount}
                  </span>
                </div>
                <div style={{ background: '#fafafa', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Error Rate</span>
                  <strong style={{ fontSize: '14px', color: selectedWorkspace.errorRate > 2.5 ? 'var(--danger-text)' : 'inherit' }}>{selectedWorkspace.errorRate}%</strong>
                  <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)' }}>Across active keys</span>
                </div>
                <div style={{ background: '#fafafa', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Savings (ROI)</span>
                  <strong style={{ fontSize: '14px', color: 'var(--success-text)' }}>
                    ${(selectedWorkspace.costDirect - selectedWorkspace.costWithPipeline).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </strong>
                  <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)' }}>
                    LTV: ${(selectedWorkspace.costWithPipeline).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              {/* Active Routing setup */}
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-muted)' }}>Active Rerouting Policy</div>
                <div className="flex-between" style={{ fontSize: '13px', marginBottom: '8px' }}>
                  <span>Strategy:</span>
                  <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{selectedWorkspace.routingSettings.strategy}</strong>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.entries(selectedWorkspace.routingSettings.weights).map(([model, weight]) => (
                    <span 
                      key={model} 
                      style={{ 
                        fontSize: '11px', 
                        background: 'var(--bg-app)', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid var(--border)' 
                      }}
                    >
                      {model}: <strong>{weight}%</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Proactive Account Engagement (PLG Actions) */}
              <div style={{ border: '1px dashed var(--primary)', borderRadius: '8px', padding: '14px', backgroundColor: 'var(--primary-light)' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} />
                  Proactive Engagement Triggers
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '8px', fontSize: '12.5px', justifyContent: 'center' }}
                    onClick={() => handleProactiveUpsell(selectedWorkspace)}
                    disabled={selectedWorkspace.tier === 'Enterprise'}
                  >
                    <Sparkles size={14} />
                    Deploy Expansion Incentive
                  </button>

                  <button 
                    className="btn btn-secondary" 
                    style={{ width: '100%', padding: '8px', fontSize: '12.5px', justifyContent: 'center', backgroundColor: '#fff' }}
                    onClick={() => handleSendWarning(selectedWorkspace)}
                  >
                    <Mail size={14} />
                    Dispatch Optimization Support
                  </button>
                </div>
                
                {selectedWorkspace.quotaUsed > 80 && selectedWorkspace.tier !== 'Enterprise' && (
                  <div style={{ fontSize: '11px', color: 'var(--warning-text)', marginTop: '8px', fontWeight: '500', textAlign: 'center' }}>
                    💡 Eligible for Proactive Upsell campaign due to high quota usage.
                  </div>
                )}
                {selectedWorkspace.churnRisk === 'high' && (
                  <div style={{ fontSize: '11px', color: 'var(--danger-text)', marginTop: '8px', fontWeight: '600', textAlign: 'center' }}>
                    🚨 Highly vulnerable Churn alert! Dispatch technical optimization guide now.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-panel" style={{ alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--text-light)' }}>
            Select a workspace from the directory to review its details and CRM outreach options.
          </div>
        )}
      </div>
    </div>
  );
}
