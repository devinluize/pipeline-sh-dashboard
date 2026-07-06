import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Cpu, HardDrive, ShieldAlert, Wifi } from 'lucide-react';

export default function AdminNetwork() {
  const { providers, workspaces } = useApp();
  const [networkHistory, setNetworkHistory] = useState([]);

  // Calculate sum of volumes
  const aggregateVolume = workspaces.reduce((acc, curr) => acc + curr.volume, 0);

  // Poll aggregate metrics for aggregate load chart
  useEffect(() => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    setNetworkHistory(prev => {
      const next = [...prev, {
        time: timeStr,
        throughput: Math.round(aggregateVolume % 1000) + 1500, // mock base system traffic
        avgLatency: Math.round(workspaces.reduce((acc, curr) => acc + curr.latency, 0) / workspaces.length)
      }];
      if (next.length > 10) next.shift();
      return next;
    });
  }, [aggregateVolume, workspaces]);

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Router Health & Telemetry</h2>
          <p>Global monitor of downstream frontier LLM latency, rates, operational status, and total network throughput.</p>
        </div>
      </div>

      {/* Provider latencies */}
      <div className="panel-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <span className="panel-title">Active AI Models & Gateways</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '16px', marginBottom: '28px' }}>
        {Object.entries(providers).map(([key, prov]) => (
          <div 
            key={key} 
            style={{ 
              backgroundColor: '#fff', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--border-radius-lg)', 
              padding: '20px',
              position: 'relative'
            }}
          >
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: '700', textTransform: 'uppercase' }}>
                {key === 'openai' ? 'OpenAI GPT-4o' : key === 'anthropic' ? 'Anthropic Claude' : key === 'gemini' ? 'Google Gemini' : 'Llama 3 (Groq)'}
              </span>
              <span className={`badge ${
                prov.status === 'operational' ? 'badge-success' : 
                prov.status === 'degraded' ? 'badge-warning' : 'badge-danger'
              }`} style={{ fontSize: '9px' }}>
                {prov.status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
              <span style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                {prov.latency}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>ms</span>
            </div>

            <div className="progress-bar-wrap" style={{ height: '4px' }}>
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${prov.load}%`,
                  backgroundColor: prov.status === 'critical' ? 'var(--danger)' : 'var(--primary)'
                }}
              ></div>
            </div>

            <div className="flex-between mt-10" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Capacity Load: {prov.load}%</span>
              <span>Rerouting safe</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Global Throughput chart */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <Wifi size={18} color="var(--primary)" />
              Aggregate Router Network Load (Requests/sec)
            </span>
          </div>

          <div style={{ width: '100%', height: 260, marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={networkHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-light)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-light)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: 12 }} />
                <Line type="monotone" dataKey="throughput" name="Requests / Sec" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global stats info panel */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <HardDrive size={18} color="var(--primary)" />
              Gateway Infrastructure Stats
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Total Aggregate Calls:</span>
              <strong style={{ fontSize: '13.5px' }}>{aggregateVolume.toLocaleString()}</strong>
            </div>

            <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Semantic Cache Hit Rate:</span>
              <strong style={{ fontSize: '13.5px', color: 'var(--success-text)' }}>24.8% hit rate</strong>
            </div>

            <div className="flex-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Router Network Uptime:</span>
              <strong style={{ fontSize: '13.5px' }}>99.998%</strong>
            </div>

            <div className="flex-between">
              <span style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>Average Hop Latency:</span>
              <strong style={{ fontSize: '13.5px' }}>12.4 ms</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
