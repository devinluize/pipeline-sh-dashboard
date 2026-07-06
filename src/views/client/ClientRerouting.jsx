import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Sliders, 
  Shuffle, 
  HelpCircle, 
  KeyRound, 
  Lock 
} from 'lucide-react';

export default function ClientRerouting() {
  const { 
    activeWorkspace, 
    generateApiKey, 
    revokeApiKey, 
    updateRoutingSettings 
  } = useApp();

  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  const { strategy, weights } = activeWorkspace.routingSettings;

  const handleStrategyChange = (newStrategy) => {
    // Automatically pre-populate sensible model weights for standard optimization strategies
    let defaultWeights = { openai: 25, anthropic: 25, gemini: 25, llama: 25 };
    if (newStrategy === 'cost') {
      defaultWeights = { openai: 15, anthropic: 10, gemini: 25, llama: 50 };
    } else if (newStrategy === 'speed') {
      defaultWeights = { openai: 10, anthropic: 20, gemini: 50, llama: 20 };
    } else if (newStrategy === 'quality') {
      defaultWeights = { openai: 45, anthropic: 45, gemini: 10, llama: 0 };
    } else if (newStrategy === 'fallback') {
      defaultWeights = { openai: 50, anthropic: 25, gemini: 15, llama: 10 };
    }

    updateRoutingSettings(activeWorkspace.id, { 
      strategy: newStrategy,
      weights: defaultWeights
    });
  };

  const handleWeightChange = (provider, value) => {
    updateRoutingSettings(activeWorkspace.id, {
      weights: {
        ...weights,
        [provider]: parseInt(value)
      }
    });
  };

  const handleCopy = (id, prefix) => {
    navigator.clipboard.writeText(prefix.replace('...', 'abc123xyz_active'));
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleGenerateKeySubmit = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    generateApiKey(activeWorkspace.id, newKeyName);
    setNewKeyName('');
    setShowKeyModal(false);
  };

  // Calculate sum of weights
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="view-header">
        <div className="view-title-group">
          <h2>AI Rerouting & API Config</h2>
          <p>Configure model rerouting rules, allocate traffic weights across major LLM APIs, and manage credentials.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Rerouting Strategy Config */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <Sliders size={18} color="var(--primary)" />
              Gateway Routing Strategy
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div 
              style={{ 
                border: '1px solid',
                borderColor: strategy === 'cost' ? 'var(--primary)' : 'var(--border)',
                background: strategy === 'cost' ? 'var(--primary-light)' : 'transparent',
                padding: '16px',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer'
              }}
              onClick={() => handleStrategyChange('cost')}
            >
              <h4 style={{ color: strategy === 'cost' ? 'var(--primary)' : 'var(--text-main)', fontSize: '14.5px', marginBottom: '4px' }}>
                Minimize Cost
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Prioritizes Meta Llama and Gemini. Automatically compresses prompts. Ideal for development & summaries.</p>
            </div>

            <div 
              style={{ 
                border: '1px solid',
                borderColor: strategy === 'speed' ? 'var(--primary)' : 'var(--border)',
                background: strategy === 'speed' ? 'var(--primary-light)' : 'transparent',
                padding: '16px',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer'
              }}
              onClick={() => handleStrategyChange('speed')}
            >
              <h4 style={{ color: strategy === 'speed' ? 'var(--primary)' : 'var(--text-main)', fontSize: '14.5px', marginBottom: '4px' }}>
                Minimize Latency
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Routes to low latency providers. Automatically selects models dynamically maintaining sub-150ms responses.</p>
            </div>

            <div 
              style={{ 
                border: '1px solid',
                borderColor: strategy === 'quality' ? 'var(--primary)' : 'var(--border)',
                background: strategy === 'quality' ? 'var(--primary-light)' : 'transparent',
                padding: '16px',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer'
              }}
              onClick={() => handleStrategyChange('quality')}
            >
              <h4 style={{ color: strategy === 'quality' ? 'var(--primary)' : 'var(--text-main)', fontSize: '14.5px', marginBottom: '4px' }}>
                Quality & Reasoning
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Locks routes to Claude 3.5 Sonnet and GPT-4o. Only falls back if API endpoints fail or hit rate limits.</p>
            </div>

            <div 
              style={{ 
                border: '1px solid',
                borderColor: strategy === 'fallback' ? 'var(--primary)' : 'var(--border)',
                background: strategy === 'fallback' ? 'var(--primary-light)' : 'transparent',
                padding: '16px',
                borderRadius: 'var(--border-radius-md)',
                cursor: 'pointer'
              }}
              onClick={() => handleStrategyChange('fallback')}
            >
              <h4 style={{ color: strategy === 'fallback' ? 'var(--primary)' : 'var(--text-main)', fontSize: '14.5px', marginBottom: '4px' }}>
                Smart Fallback Chain
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Uses custom model sequence chains. If primary fails, secondary responds seamlessly to prevent API errors.</p>
            </div>
          </div>

          <div className="panel-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <span className="panel-title" style={{ fontSize: '14px' }}>
              Custom Routing Weight Allocation ({totalWeight}%)
            </span>
          </div>

          <div style={{ marginTop: '16px' }}>
            <div className="slider-group">
              <div className="slider-label">
                <span>OpenAI GPT-4o</span>
                <span className="muted">{weights.openai}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="100" 
                value={weights.openai}
                onChange={(e) => handleWeightChange('openai', e.target.value)}
              />
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>Anthropic Claude 3.5</span>
                <span className="muted">{weights.anthropic}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="100" 
                value={weights.anthropic}
                onChange={(e) => handleWeightChange('anthropic', e.target.value)}
              />
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>Google Gemini Pro</span>
                <span className="muted">{weights.gemini}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="100" 
                value={weights.gemini}
                onChange={(e) => handleWeightChange('gemini', e.target.value)}
              />
            </div>

            <div className="slider-group">
              <div className="slider-label">
                <span>Meta Llama 3 (Groq)</span>
                <span className="muted">{weights.llama}%</span>
              </div>
              <input 
                type="range" 
                className="custom-slider" 
                min="0" 
                max="100" 
                value={weights.llama}
                onChange={(e) => handleWeightChange('llama', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* API Credentials */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <span className="panel-title">
              <KeyRound size={18} color="var(--primary)" />
              Access Tokens ({activeWorkspace.activeKeys.filter(k => k.status === 'active').length})
            </span>
            <button 
              className="btn btn-primary" 
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setShowKeyModal(true)}
            >
              <Plus size={14} />
              New Key
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {activeWorkspace.activeKeys.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-light)' }}>
                No active API credentials found.
              </div>
            ) : (
              activeWorkspace.activeKeys.map(key => (
                <div 
                  key={key.id} 
                  style={{ 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--border-radius-md)', 
                    padding: '12px 16px',
                    backgroundColor: key.status === 'revoked' ? '#fafafa' : '#fff',
                    opacity: key.status === 'revoked' ? 0.6 : 1
                  }}
                >
                  <div className="flex-between">
                    <strong style={{ fontSize: '13.5px' }}>{key.name}</strong>
                    <span className={`badge ${key.status === 'active' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '10px' }}>
                      {key.status}
                    </span>
                  </div>
                  
                  <div className="flex-between mt-10" style={{ gap: '8px' }}>
                    <code style={{ background: 'var(--bg-app)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', flex: 1, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {key.prefix}
                    </code>
                    
                    {key.status === 'active' && (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px', minWidth: '30px' }}
                          onClick={() => handleCopy(key.id, key.prefix)}
                          title="Copy API Key to Clipboard"
                        >
                          {copiedKeyId === key.id ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{ padding: '6px', minWidth: '30px', backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--danger)' }}
                          onClick={() => revokeApiKey(activeWorkspace.id, key.id)}
                          title="Revoke and delete API Key"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-between mt-10" style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                    <span>Created: {key.created}</span>
                    <span>Accumulated Calls: {key.calls.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for creating a new key */}
      {showKeyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--border)', padding: '24px', width: '90%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Generate API Credential</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Provide a descriptive label for your key to monitor its traffic allocations.</p>
            
            <form onSubmit={handleGenerateKeySubmit}>
              <input 
                type="text" 
                placeholder="e.g. Production Mobile App" 
                value={newKeyName} 
                onChange={(e) => setNewKeyName(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border)', fontSize: '14px', marginBottom: '20px' }}
                autoFocus
              />
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowKeyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!newKeyName.trim()}
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
