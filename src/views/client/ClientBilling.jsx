import React from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function ClientBilling() {
  const { activeWorkspace, upgradeTier } = useApp();

  const isStarter = activeWorkspace.tier === 'Starter';
  const isPro = activeWorkspace.tier === 'Pro';
  const isEnterprise = activeWorkspace.tier === 'Enterprise';

  const progressColorClass = () => {
    if (activeWorkspace.quotaUsed > 90) return 'danger';
    if (activeWorkspace.quotaUsed > 75) return 'warning';
    return '';
  };

  const invoiceHistory = [
    { id: 'INV-2026-006', date: 'Jul 1, 2026', amount: activeWorkspace.tier === 'Starter' ? '$49.00' : activeWorkspace.tier === 'Pro' ? '$299.00' : '$1,499.00', status: 'Paid' },
    { id: 'INV-2026-005', date: 'Jun 1, 2026', amount: '$49.00', status: 'Paid' },
    { id: 'INV-2026-004', date: 'May 1, 2026', amount: '$49.00', status: 'Paid' }
  ];

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Quota & Plan Subscriptions</h2>
          <p>Monitor your token and API call limits, upgrade subscription tiers instantly, and view payment history.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Quota Progress Panel */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <Award size={18} color="var(--primary)" />
              Monthly Quota Utilization
            </span>
            <span className="badge badge-info">{activeWorkspace.tier} Plan</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="flex-between">
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Accumulated API Calls</span>
              <strong style={{ fontSize: '14.5px' }}>
                {activeWorkspace.volume.toLocaleString()} / {activeWorkspace.quotaLimit.toLocaleString()}
              </strong>
            </div>

            <div className="progress-bar-wrap" style={{ height: '12px' }}>
              <div 
                className={`progress-bar-fill ${progressColorClass()}`}
                style={{ width: `${activeWorkspace.quotaUsed}%` }}
              ></div>
            </div>

            <div className="flex-between mt-10">
              <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>Resets in 24 days</span>
              <strong style={{ fontSize: '15px', color: activeWorkspace.quotaUsed > 90 ? 'var(--danger-text)' : 'var(--text-main)' }}>
                {activeWorkspace.quotaUsed}% Consumed
              </strong>
            </div>

            {activeWorkspace.quotaUsed > 80 && (
              <div 
                style={{ 
                  marginTop: '20px', 
                  padding: '12px 16px', 
                  borderRadius: 'var(--border-radius-md)', 
                  background: 'var(--danger-light)', 
                  border: '1px solid var(--danger-light)',
                  color: 'var(--danger-text)',
                  fontSize: '12.5px' 
                }}
              >
                ⚠️ <strong>Quota Alert:</strong> You are nearing your monthly call allocation. Upgrade to the Pro or Enterprise plan to prevent automatic routing restrictions.
              </div>
            )}
          </div>
        </div>

        {/* Payment Profile Overview */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <CreditCard size={18} color="var(--primary)" />
              Payment Profile
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>Payment Method:</span>
              <strong style={{ fontSize: '13.5px' }}>Visa ending in 4242</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>Billing Contact:</span>
              <strong style={{ fontSize: '13.5px' }}>billing@acme.com</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13.5px' }}>Next Billing Date:</span>
              <strong style={{ fontSize: '13.5px' }}>August 1, 2026</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Options */}
      <div className="panel-header" style={{ borderBottom: 'none', paddingBottom: 0, marginTop: '16px' }}>
        <span className="panel-title">Available Subscription Plans</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px', marginBottom: '28px' }}>
        {/* Starter Plan */}
        <div 
          style={{ 
            backgroundColor: '#fff', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--border-radius-lg)', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: isStarter ? 'var(--shadow-md)' : 'none',
            outline: isStarter ? '2px solid var(--primary)' : 'none'
          }}
        >
          {isStarter && (
            <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
              ACTIVE
            </span>
          )}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Starter</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Best for side projects, validation, and MVPs.</p>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>$49</span>
              <span style={{ color: 'var(--text-light)', fontSize: '13px' }}> / month</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> 300,000 requests / month</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> Intelligent LLM fallback chain</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> Latency-optimized routing</li>
            </ul>
          </div>
          
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', alignSelf: 'flex-end' }}
            disabled={isStarter}
            onClick={() => upgradeTier(activeWorkspace.id, 'Starter')}
          >
            {isStarter ? 'Current Plan' : 'Downgrade to Starter'}
          </button>
        </div>

        {/* Pro Plan */}
        <div 
          style={{ 
            backgroundColor: '#fff', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--border-radius-lg)', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: isPro ? 'var(--shadow-md)' : 'none',
            outline: isPro ? '2px solid var(--primary)' : 'none'
          }}
        >
          {isPro && (
            <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
              ACTIVE
            </span>
          )}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Pro</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Ideal for growing production software & platforms.</p>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>$299</span>
              <span style={{ color: 'var(--text-light)', fontSize: '13px' }}> / month</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> 2,000,000 requests / month</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> Semantic query caching (Save up to 40%)</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> Custom routing weighting allocation</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> Support SLA</li>
            </ul>
          </div>
          
          <button 
            className={`btn ${isPro ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ width: '100%', alignSelf: 'flex-end' }}
            disabled={isPro}
            onClick={() => upgradeTier(activeWorkspace.id, 'Pro')}
          >
            {isPro ? 'Current Plan' : isStarter ? 'Upgrade to Pro' : 'Downgrade to Pro'}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div 
          style={{ 
            backgroundColor: '#fff', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--border-radius-lg)', 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: isEnterprise ? 'var(--shadow-md)' : 'none',
            outline: isEnterprise ? '2px solid var(--primary)' : 'none'
          }}
        >
          {isEnterprise && (
            <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
              ACTIVE
            </span>
          )}
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Enterprise</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>For large-scale applications requiring high availability.</p>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>$1,499</span>
              <span style={{ color: 'var(--text-light)', fontSize: '13px' }}> / month</span>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> 20,000,000 requests / month</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> dedicated route gateways & custom models</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> Dedicated CSM support channel</li>
              <li style={{ display: 'flex', gap: '8px' }}><CheckCircle2 size={16} color="var(--success)" /> Custom routing policies & compliance filters</li>
            </ul>
          </div>
          
          <button 
            className={`btn ${isEnterprise ? 'btn-secondary' : 'btn-primary'}`} 
            style={{ width: '100%', alignSelf: 'flex-end' }}
            disabled={isEnterprise}
            onClick={() => upgradeTier(activeWorkspace.id, 'Enterprise')}
          >
            {isEnterprise ? 'Current Plan' : 'Upgrade to Enterprise'}
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <span className="panel-title">Invoicing history</span>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Billing Date</th>
                <th>Amount Charged</th>
                <th>Payment Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {invoiceHistory.map((inv, idx) => (
                <tr key={idx}>
                  <td><strong>{inv.id}</strong></td>
                  <td>{inv.date}</td>
                  <td>{inv.amount}</td>
                  <td>
                    <span className="badge badge-success">{inv.status}</span>
                  </td>
                  <td>
                    <a href="#download" onClick={(e) => e.preventDefault()} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Download PDF <ArrowUpRight size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
