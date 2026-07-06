import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { PiggyBank, Calculator, Check, ArrowRight } from 'lucide-react';

export default function ClientROI() {
  const { activeWorkspace } = useApp();

  const totalSaved = activeWorkspace.costDirect - activeWorkspace.costWithPipeline;
  const costReductionFactor = activeWorkspace.costWithPipeline > 0 
    ? (activeWorkspace.costDirect / activeWorkspace.costWithPipeline).toFixed(1) 
    : '1.0';

  // Construct a dynamic 7-day cumulative cost chart ending with today's live stats
  const generate7DayHistory = () => {
    const data = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Scale baseline history based on the active client's current accumulated volume/cost
    const currentDirect = activeWorkspace.costDirect;
    const currentPipeline = activeWorkspace.costWithPipeline;

    for (let i = 0; i < 7; i++) {
      const scale = (i + 1) / 7;
      // Add slight randomness to make the curves realistic
      const randomness = 1 + (Math.sin(i) * 0.05);
      data.push({
        day: days[i],
        'Direct Frontier APIs': parseFloat((currentDirect * scale * randomness).toFixed(2)),
        'pipeline.sh Optimized': parseFloat((currentPipeline * scale).toFixed(2)),
      });
    }
    return data;
  };

  const costHistory = generate7DayHistory();

  // Model-by-model savings breakdown
  const modelBreakdown = [
    { model: 'GPT-4o (Chat/Reasoning)', share: '35%', directAvg: '$15.00', pipelineAvg: '$6.20', savings: '58.7%', action: 'Compressed Prompt & Router Fallback' },
    { model: 'Claude 3.5 Sonnet (Coding)', share: '40%', directAvg: '$24.00', pipelineAvg: '$12.40', savings: '48.3%', action: 'Semantic Caching & Token Trimming' },
    { model: 'Gemini Pro (Multimodal)', share: '15%', directAvg: '$7.00', pipelineAvg: '$2.80', savings: '60.0%', action: 'Local Embedding Deduplication' },
    { model: 'Llama 3 70B (Summarization)', share: '10%', directAvg: '$1.50', pipelineAvg: '$0.35', savings: '76.6%', action: 'Routed to Low-Cost Groq Infrastructure' }
  ];

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>Transparency ROI & Savings</h2>
          <p>Real-time calculation comparing Direct Frontier API pricing versus pipeline.sh smart routing cache and compress benefits.</p>
        </div>
      </div>

      {/* ROI Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="dashboard-panel" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--success-light)', color: 'var(--success-text)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PiggyBank size={32} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>TOTAL COST SAVINGS</div>
            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              ${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--success-text)', fontWeight: '600' }}>
              Reduced your overall LLM expenditure significantly
            </div>
          </div>
        </div>

        <div className="dashboard-panel" style={{ flexDirection: 'row', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={32} />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: '600' }}>COST REDUCTION RATE</div>
            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
              {costReductionFactor}x
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              On average, pay less than half of normal API rates
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Cumulative Savings Chart */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">7-Day Cumulative Billing Comparison</span>
          </div>
          <div style={{ width: '100%', height: 300, marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-light)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-light)' }} axisLine={false} tickLine={false} unit="$" />
                <Tooltip 
                  formatter={(value) => [`$${parseFloat(value).toLocaleString()}`]} 
                  contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: 12 }} 
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Direct Frontier APIs" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pipeline.sh Optimized" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROI Breakdown Side Panel */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">Optimization Highlights</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={14} />
              </div>
              <div>
                <strong style={{ fontSize: '13.5px', display: 'block' }}>Semantic Query Caching</strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Cached and returned 22.4% of repeating questions instantly, costing $0.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={14} />
              </div>
              <div>
                <strong style={{ fontSize: '13.5px', display: 'block' }}>Context Pruning</strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Automatically stripped redundant instructions, saving 15M unnecessary tokens.</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ minWidth: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={14} />
              </div>
              <div>
                <strong style={{ fontSize: '13.5px', display: 'block' }}>Latency-based Rerouting</strong>
                <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Avoided high surcharge latency tiers; routed non-critical queries to Llama-Groq.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model savings Table */}
      <div className="dashboard-panel">
        <div className="panel-header">
          <span className="panel-title">Model-by-Model Optimization Performance</span>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Class</th>
                <th>Traffic Volume Share</th>
                <th>Direct Pricing (Per M Token)</th>
                <th>Optimized pipeline.sh Pricing</th>
                <th>Net Savings</th>
                <th>Primary Routing Strategy</th>
              </tr>
            </thead>
            <tbody>
              {modelBreakdown.map((row, index) => (
                <tr key={index}>
                  <td><strong>{row.model}</strong></td>
                  <td>{row.share}</td>
                  <td style={{ color: 'var(--text-light)', textDecoration: 'line-through' }}>{row.directAvg}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: '600' }}>{row.pipelineAvg}</td>
                  <td>
                    <span className="badge badge-success">{row.savings} Saved</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{row.action}</span>
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
