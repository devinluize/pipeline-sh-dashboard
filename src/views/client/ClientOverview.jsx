import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Zap, 
  Clock, 
  AlertOctagon, 
  PiggyBank, 
  ArrowUpRight, 
  Bell, 
  ServerCrash 
} from 'lucide-react';

export default function ClientOverview() {
  const { activeWorkspace, alerts } = useApp();
  const [chartData, setChartData] = useState([]);

  // Generate historical chart points based on activeWorkspace data updates
  useEffect(() => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setChartData(prev => {
      const next = [...prev, {
        time: timeStr,
        latency: activeWorkspace.latency,
        requests: Math.round(activeWorkspace.volume % 500) + 100, // mock periodic load shape
        errors: activeWorkspace.errorRate * 10
      }];
      if (next.length > 10) next.shift();
      return next;
    });
  }, [activeWorkspace.volume, activeWorkspace.latency, activeWorkspace.errorRate]);

  // Filter alerts for the active workspace
  const workspaceAlerts = alerts.filter(a => a.workspaceId === activeWorkspace.id);

  // Compute stats
  const totalSaved = activeWorkspace.costDirect - activeWorkspace.costWithPipeline;
  const roiPercent = activeWorkspace.costDirect > 0 
    ? Math.round((totalSaved / activeWorkspace.costDirect) * 100) 
    : 0;

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Telemetry & Savings Overview</h2>
          <p>Real-time API gateway activity and model performance optimization metrics for {activeWorkspace.name}.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">API Call Volume</span>
            <div className="stat-icon"><Zap size={16} /></div>
          </div>
          <div className="stat-value">
            {activeWorkspace.volume.toLocaleString()}
          </div>
          <div className="stat-footer">
            <span className="trend-badge up">
              <ArrowUpRight size={12} />
              +14.2%
            </span>
            <span className="text-light">from yesterday</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Average Latency</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="stat-value">
            {activeWorkspace.latency} ms
          </div>
          <div className="stat-footer">
            <span className="trend-badge down">
              -8.4%
            </span>
            <span className="text-light">optimized paths</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Gateway ROI</span>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)' }}>
              <PiggyBank size={16} />
            </div>
          </div>
          <div className="stat-value">
            {roiPercent}%
          </div>
          <div className="stat-footer">
            <span className="trend-badge up" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-text)' }}>
              ${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Saved
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Error Rate</span>
            <div className="stat-icon" style={{ 
              backgroundColor: activeWorkspace.errorRate > 2.5 ? 'var(--danger-light)' : 'var(--warning-light)', 
              color: activeWorkspace.errorRate > 2.5 ? 'var(--danger)' : 'var(--warning)' 
            }}>
              <AlertOctagon size={16} />
            </div>
          </div>
          <div className="stat-value">
            {activeWorkspace.errorRate}%
          </div>
          <div className="stat-footer">
            <span className={`badge ${
              activeWorkspace.status === 'healthy' ? 'badge-success' : 
              activeWorkspace.status === 'warning' ? 'badge-warning' : 'badge-danger'
            }`}>
              Gateway {activeWorkspace.status}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Real-time Telemetry Chart */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <ServerCrash size={18} color="var(--primary)" />
              Real-Time Gateway Performance (Latency vs Rate)
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulse-indicator"></span> 3s poll intervals
            </span>
          </div>
          
          <div style={{ width: '100%', height: 280, marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--info)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--info)" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-light)' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--text-light)' }} axisLine={false} tickLine={false} label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 10, fill: 'var(--text-light)' } }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--text-light)' }} axisLine={false} tickLine={false} label={{ value: 'Calls/Sec', angle: 90, position: 'insideRight', offset: 10, style: { fontSize: 10, fill: 'var(--text-light)' } }} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: 12 }} 
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area yAxisId="left" type="monotone" dataKey="latency" name="Latency (ms)" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                <Area yAxisId="right" type="monotone" dataKey="requests" name="Request Load" stroke="var(--info)" strokeWidth={2} fillOpacity={1} fill="url(#colorRequests)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proactive Support & Alerts Log */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <Bell size={18} color="var(--primary)" />
              Gateway Routing Activity ({workspaceAlerts.length})
            </span>
          </div>

          <div className="alerts-list">
            {workspaceAlerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-light)', fontSize: '13.5px' }}>
                No anomaly triggers or alerts logged for this workspace. All routes stable.
              </div>
            ) : (
              workspaceAlerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.type}`}>
                  <div className="alert-body">
                    <div className="alert-title">{alert.title}</div>
                    <div>{alert.message}</div>
                    <div className="alert-time">{alert.timestamp}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
