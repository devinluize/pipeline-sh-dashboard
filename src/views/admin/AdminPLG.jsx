import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  MailCheck, 
  UserPlus, 
  TrendingUp, 
  Percent, 
  HelpCircle,
  Play
} from 'lucide-react';

export default function AdminPLG() {
  const { plgEvents, addPlgEvent, workspaces, updateRoutingSettings } = useApp();

  const handleTestUpsell = () => {
    // Find a workspace that is not Enterprise and set its usage high
    const starterWs = workspaces.find(w => w.tier === 'Starter');
    if (starterWs) {
      addPlgEvent(
        'upsell',
        `Automated Upsell Dispatched: ${starterWs.name}`,
        `CRM detected ${starterWs.name} exceeded 90% of Starter quota limits. Outbound Pro Upgrade offering sent.`
      );
      alert(`Simulated: cross-quota event for ${starterWs.name}. Automated CRM upsell flows initiated.`);
    }
  };

  const handleTestChurn = () => {
    const auraWs = workspaces.find(w => w.id === 'aura-ai');
    if (auraWs) {
      addPlgEvent(
        'churn',
        `Automated Retention Alert: ${auraWs.name}`,
        `System flagged ${auraWs.name} LTV drop risk (health score ${auraWs.healthScore}%). Scheduling CS review.`
      );
      alert(`Simulated: Churn warning event for ${auraWs.name}. CSM Slack notifications dispatched.`);
    }
  };

  const handleTestActivation = () => {
    addPlgEvent(
      'activation',
      'New Account Registered: AlphaTech',
      'AlphaTech created pipeline.sh account. Auto-dispatching Developer Welcome docs & $10 credits.'
    );
    alert('Simulated: New signup lifecycle event. Welcome automation series triggered.');
  };

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Product-Led Growth (PLG) Automations</h2>
          <p>Real-time execution log of CRM marketing and success automation engines based on live client telemetry.</p>
        </div>
      </div>

      {/* PLG Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Automation Conversion</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}><Percent size={16} /></div>
          </div>
          <div className="stat-value">34.2%</div>
          <div className="stat-footer">
            <span className="text-light">Proactive upsells successful</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total CRM Emails Sent</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}><MailCheck size={16} /></div>
          </div>
          <div className="stat-value">1,489</div>
          <div className="stat-footer">
            <span className="text-light">100% automated lifecycle events</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Aha! Activations</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}><UserPlus size={16} /></div>
          </div>
          <div className="stat-value">88.5%</div>
          <div className="stat-footer">
            <span className="text-light">Keys generated within 24h</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Live event logs */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <Zap size={18} color="var(--primary)" />
              Automated CRM Activity Log
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {plgEvents.map(event => (
              <div 
                key={event.id}
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  padding: '16px', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: '#fff'
                }}
              >
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '8px', 
                  backgroundColor: 
                    event.type === 'upsell' ? 'var(--warning-light)' :
                    event.type === 'churn' ? 'var(--danger-light)' :
                    event.type === 'activation' ? 'var(--info-light)' : 'var(--success-light)',
                  color:
                    event.type === 'upsell' ? 'var(--warning-text)' :
                    event.type === 'churn' ? 'var(--danger-text)' :
                    event.type === 'activation' ? 'var(--info-text)' : 'var(--success-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800'
                }}>
                  {event.type[0].toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{event.title}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>{event.time}</span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRM Automation Simulator Controls */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">PLG Simulator Controls</span>
          </div>
          
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Manually trigger client events below to demonstrate how pipeline.sh automatically initiates CRM expansion campaigns and support lifecycles.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: '8px' }}>
              <strong style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>1. Quota Capacity Alarm</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>Simulate a workspace approaching 96% usage limits to verify automated Pro Upgrade sales pitch.</span>
              <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={handleTestUpsell}>
                <Play size={12} /> Trigger Quota Spike Event
              </button>
            </div>

            <div style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: '8px' }}>
              <strong style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>2. Churn Risk Warning</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>Simulate a drop in API volumes or latency anomalies to trigger CS manager intervention tickets.</span>
              <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={handleTestChurn}>
                <Play size={12} /> Trigger Churn Alert Event
              </button>
            </div>

            <div style={{ border: '1px solid var(--border)', padding: '12px', borderRadius: '8px' }}>
              <strong style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>3. Developer Onboarding Journey</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>Simulate a new developer signing up to test welcome education, API setup resources, and onboarding ROI alerts.</span>
              <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px' }} onClick={handleTestActivation}>
                <Play size={12} /> Trigger Welcome Signup Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
