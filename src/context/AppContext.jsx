import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext();

const initialWorkspaces = [
  {
    id: 'acme-corp',
    name: 'Acme Corporation',
    tier: 'Pro',
    volume: 1245890,
    latency: 145,
    errorRate: 0.2,
    costWithPipeline: 1450.40,
    costDirect: 3120.80,
    quotaUsed: 62.3,
    quotaLimit: 2000000,
    healthScore: 94,
    status: 'healthy',
    activeKeys: [
      { id: 'key-ac1', name: 'Prod API Key', prefix: 'pk_live_ac1...', created: '2026-02-14', calls: 980450, status: 'active' },
      { id: 'key-ac2', name: 'Staging API Key', prefix: 'pk_test_ac2...', created: '2026-03-01', calls: 265440, status: 'active' }
    ],
    routingSettings: {
      strategy: 'cost', // cost, speed, fallback, quality
      weights: { openai: 30, anthropic: 40, gemini: 20, llama: 10 }
    },
    failoversCount: 14,
    churnRisk: 'low'
  },
  {
    id: 'bytesize',
    name: 'ByteSize Startup',
    tier: 'Starter',
    volume: 245100,
    latency: 210,
    errorRate: 2.8,
    costWithPipeline: 310.20,
    costDirect: 540.60,
    quotaUsed: 81.7,
    quotaLimit: 300000,
    healthScore: 78,
    status: 'warning',
    activeKeys: [
      { id: 'key-bs1', name: 'Main Key', prefix: 'pk_live_bs1...', created: '2026-05-10', calls: 245100, status: 'active' }
    ],
    routingSettings: {
      strategy: 'fallback',
      weights: { openai: 60, anthropic: 10, gemini: 10, llama: 20 }
    },
    failoversCount: 8,
    churnRisk: 'medium'
  },
  {
    id: 'edusmart',
    name: 'EduSmart Academy',
    tier: 'Starter',
    volume: 288400,
    latency: 160,
    errorRate: 0.5,
    costWithPipeline: 350.50,
    costDirect: 720.00,
    quotaUsed: 96.1,
    quotaLimit: 300000,
    healthScore: 88,
    status: 'warning',
    activeKeys: [
      { id: 'key-es1', name: 'LMS Integration', prefix: 'pk_live_es1...', created: '2026-01-20', calls: 288400, status: 'active' }
    ],
    routingSettings: {
      strategy: 'speed',
      weights: { openai: 10, anthropic: 20, gemini: 60, llama: 10 }
    },
    failoversCount: 4,
    churnRisk: 'low'
  },
  {
    id: 'devinluize-ent',
    name: 'DevinLuize Enterprise',
    tier: 'Enterprise',
    volume: 8740520,
    latency: 135,
    errorRate: 0.1,
    costWithPipeline: 9240.00,
    costDirect: 21450.00,
    quotaUsed: 43.7,
    quotaLimit: 20000000,
    healthScore: 98,
    status: 'healthy',
    activeKeys: [
      { id: 'key-dl1', name: 'US-East Production', prefix: 'pk_live_dl1...', created: '2025-11-05', calls: 5120400, status: 'active' },
      { id: 'key-dl2', name: 'EU-Central Production', prefix: 'pk_live_dl2...', created: '2025-12-12', calls: 3620120, status: 'active' }
    ],
    routingSettings: {
      strategy: 'quality',
      weights: { openai: 40, anthropic: 40, gemini: 20, llama: 0 }
    },
    failoversCount: 42,
    churnRisk: 'low'
  },
  {
    id: 'aura-ai',
    name: 'Aura Analytics',
    tier: 'Pro',
    volume: 120500,
    latency: 280,
    errorRate: 4.5,
    costWithPipeline: 280.90,
    costDirect: 310.20,
    quotaUsed: 12.0,
    quotaLimit: 1000000,
    healthScore: 45,
    status: 'danger',
    activeKeys: [
      { id: 'key-au1', name: 'Data Pipeline', prefix: 'pk_live_au1...', created: '2026-04-02', calls: 120500, status: 'active' }
    ],
    routingSettings: {
      strategy: 'cost',
      weights: { openai: 10, anthropic: 10, gemini: 10, llama: 70 }
    },
    failoversCount: 31,
    churnRisk: 'high'
  }
];

const initialAlerts = [
  { id: 1, type: 'info', title: 'Route Optimization Active', message: 'Llama 3 is now resolving standard chat queries to reduce costs.', workspaceId: 'acme-corp', timestamp: '10 mins ago' },
  { id: 2, type: 'warning', title: 'OpenAI Latency Spike', message: 'OpenAI API response latency exceeded 1200ms. Rerouted 45 requests to Claude 3.5.', workspaceId: 'acme-corp', timestamp: '15 mins ago' },
  { id: 3, type: 'danger', title: 'Quota limit approaching', message: 'You have consumed 96% of your monthly API quota. Upgrade now to avoid interruption.', workspaceId: 'edusmart', timestamp: '1 hour ago' },
  { id: 4, type: 'success', title: 'Auto-Failover Recovered', message: 'Gemini Pro rates returned to normal. Secondary routes closed.', workspaceId: 'devinluize-ent', timestamp: '2 hours ago' }
];

const initialPlgEvents = [
  { id: 1, type: 'upsell', title: 'Upsell Triggered: EduSmart', description: 'System detected EduSmart is at 96% quota capacity. Sent automated upgrade email.', time: '1 hour ago' },
  { id: 2, type: 'roi', title: 'Aha! Moment Email: Acme Corp', description: 'Weekly digest sent to Acme: "You saved $1,670 this week using pipeline.sh!"', time: '4 hours ago' },
  { id: 3, type: 'churn', title: 'High Churn Risk Raised: Aura Analytics', description: 'System flagged Aura AI. Volume declined 45% week-over-week. Alert sent to CSM.', time: '1 day ago' },
  { id: 4, type: 'activation', title: 'Welcome Journey Completed', description: 'ByteSize Startup published their 1st live production key. Activation email sent.', time: '2 days ago' }
];

export const AppProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('acme-corp');
  const [alerts, setAlerts] = useState(initialAlerts);
  const [plgEvents, setPlgEvents] = useState(initialPlgEvents);
  
  // Navigation states
  const [activePortal, setActivePortal] = useState('client'); // 'client' | 'admin'
  const [clientTab, setClientTab] = useState('overview'); // 'overview' | 'roi' | 'rerouting' | 'billing'
  const [adminTab, setAdminTab] = useState('workspaces'); // 'workspaces' | 'plg' | 'network'
  
  // Provider states
  const [providers, setProviders] = useState({
    openai: { name: 'OpenAI (GPT-4o)', latency: 240, status: 'operational', load: 35 },
    anthropic: { name: 'Anthropic (Claude 3.5)', latency: 190, status: 'operational', load: 45 },
    gemini: { name: 'Google Gemini Pro', latency: 120, status: 'operational', load: 20 },
    llama: { name: 'Meta Llama 3 (Groq)', latency: 45, status: 'operational', load: 60 }
  });

  const [simulationSpeed, setSimulationSpeed] = useState('normal'); // 'normal' | 'fast' | 'paused'
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  // Helper to add alerts
  const addAlert = useCallback((type, title, message, wsId = activeWorkspaceId) => {
    const newAlert = {
      id: Date.now() + Math.random(),
      type,
      title,
      message,
      workspaceId: wsId,
      timestamp: 'Just now'
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 19)]);
  }, [activeWorkspaceId]);

  // Helper to add PLG event
  const addPlgEvent = useCallback((type, title, description) => {
    const newEvent = {
      id: Date.now() + Math.random(),
      type,
      title,
      description,
      time: 'Just now'
    };
    setPlgEvents(prev => [newEvent, ...prev.slice(0, 19)]);
  }, []);

  // Modify routing setting
  const updateRoutingSettings = useCallback((wsId, settings) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          routingSettings: { ...w.routingSettings, ...settings }
        };
      }
      return w;
    }));
  }, []);

  // Upgrade Tier Sim
  const upgradeTier = useCallback((wsId, newTier) => {
    let quota = 300000;
    if (newTier === 'Pro') quota = 2000000;
    if (newTier === 'Enterprise') quota = 20000000;

    setWorkspaces(prev => prev.map(w => {
      if (w.id === wsId) {
        const currentQuotaUsed = (w.volume / quota) * 100;
        return {
          ...w,
          tier: newTier,
          quotaLimit: quota,
          quotaUsed: parseFloat(currentQuotaUsed.toFixed(1)),
          status: currentQuotaUsed > 90 ? 'warning' : 'healthy',
          healthScore: Math.min(100, Math.max(0, 100 - Math.round(currentQuotaUsed / 10)))
        };
      }
      return w;
    }));
    
    addAlert('success', 'Workspace Upgraded', `Successfully upgraded workspace to the ${newTier} plan.`, wsId);
    addPlgEvent('upsell', `Workspace Upgraded: ${wsId}`, `Client manually upgraded to ${newTier} Plan, expanding revenue potential.`);
  }, [addAlert, addPlgEvent]);

  // Generate new API Key
  const generateApiKey = useCallback((wsId, keyName) => {
    const keyId = 'key-' + Math.random().toString(36).substr(2, 5);
    const newKey = {
      id: keyId,
      name: keyName,
      prefix: `pk_live_${keyId.substring(4)}...`,
      created: new Date().toISOString().split('T')[0],
      calls: 0,
      status: 'active'
    };
    setWorkspaces(prev => prev.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          activeKeys: [...w.activeKeys, newKey]
        };
      }
      return w;
    }));
    addAlert('info', 'API Key Generated', `Created new API key "${keyName}".`, wsId);
  }, [addAlert]);

  // Revoke API Key
  const revokeApiKey = useCallback((wsId, keyId) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id === wsId) {
        return {
          ...w,
          activeKeys: w.activeKeys.map(k => k.id === keyId ? { ...k, status: 'revoked' } : k)
        };
      }
      return w;
    }));
    addAlert('warning', 'API Key Revoked', `API key was suspended/revoked.`, wsId);
  }, [addAlert]);

  // Trigger Traffic Spike simulation
  const simulateTrafficSpike = useCallback(() => {
    addAlert('warning', 'API Traffic Spike', 'Incoming traffic increased by 300% on US-East production routes.', activeWorkspaceId);
    addPlgEvent('roi', `Spike Detected: ${activeWorkspace.name}`, `Simulated surge processed safely. Live savings ROI increased by 15%.`);
    
    // Temporarily trigger workspace load increments
    setWorkspaces(prev => prev.map(w => {
      if (w.id === activeWorkspaceId) {
        const addedVolume = Math.round(w.quotaLimit * 0.08); // 8% spike
        const newVolume = w.volume + addedVolume;
        const newQuotaUsed = parseFloat(((newVolume / w.quotaLimit) * 100).toFixed(1));
        
        let wsStatus = w.status;
        if (newQuotaUsed > 90) wsStatus = 'warning';
        if (newQuotaUsed > 98) wsStatus = 'danger';

        // Compute new costs
        const directCostIncrease = addedVolume * 0.0022; // $0.0022 per token direct
        const pipelineCostIncrease = directCostIncrease * 0.44; // pipeline.sh saves ~56%

        return {
          ...w,
          volume: newVolume,
          quotaUsed: Math.min(100, newQuotaUsed),
          costDirect: w.costDirect + directCostIncrease,
          costWithPipeline: w.costWithPipeline + pipelineCostIncrease,
          status: wsStatus,
          healthScore: Math.min(100, Math.max(30, 100 - Math.round(newQuotaUsed / 10) - (wsStatus === 'warning' ? 10 : 0)))
        };
      }
      return w;
    }));
  }, [activeWorkspaceId, activeWorkspace, addAlert, addPlgEvent]);

  // Trigger Provider Outage simulation
  const simulateOutage = useCallback(() => {
    setProviders(prev => ({
      ...prev,
      openai: { ...prev.openai, status: 'critical', latency: 4500 }
    }));
    
    addAlert('danger', 'OpenAI API Outage Detected', 'OpenAI (GPT-4o) returned 503 Service Unavailable. Automatic routing failover initiated.', activeWorkspaceId);
    addAlert('success', 'Rerouting Complete', 'Rerouted all active GPT-4o streams to Claude 3.5 Sonnet and Gemini Pro. Zero downtime experienced by user.', activeWorkspaceId);
    
    addPlgEvent('churn', 'System Failover Triggered', `OpenAI outage auto-routed for ${activeWorkspace.name}. Demonstrated high availability ROI.`);

    // Restore provider after 10 seconds
    setTimeout(() => {
      setProviders(prev => ({
        ...prev,
        openai: { ...prev.openai, status: 'operational', latency: 240 }
      }));
      addAlert('info', 'OpenAI Service Restored', 'OpenAI (GPT-4o) latency and error rates stabilized. Normal routing weights resumed.', activeWorkspaceId);
    }, 10000);
  }, [activeWorkspaceId, activeWorkspace, addAlert, addPlgEvent]);

  // Simulation engine loop
  useEffect(() => {
    if (simulationSpeed === 'paused') return;
    
    const intervalTime = simulationSpeed === 'fast' ? 1000 : 3000;
    const timer = setInterval(() => {
      setWorkspaces(prev => prev.map(w => {
        // Increment calls
        const isCurrent = w.id === activeWorkspaceId;
        const baseCalls = isCurrent ? 120 : 40;
        const callIncrement = Math.round(baseCalls * (Math.random() * 0.8 + 0.6));
        
        const newVolume = w.volume + callIncrement;
        const newQuotaUsed = parseFloat(((newVolume / w.quotaLimit) * 100).toFixed(1));
        
        // Calculate new costs
        const directCostIncrease = callIncrement * 0.0024;
        // Cost saving depend on settings
        let savingsRatio = 0.45; // default 55% saved
        if (w.routingSettings.strategy === 'cost') savingsRatio = 0.35; // 65% saved
        if (w.routingSettings.strategy === 'speed') savingsRatio = 0.50; // 50% saved
        if (w.routingSettings.strategy === 'quality') savingsRatio = 0.60; // 40% saved

        const pipelineCostIncrease = directCostIncrease * savingsRatio;

        // Auto trigger PLG alarms inside loop
        if (newQuotaUsed >= 95 && w.quotaUsed < 95) {
          setTimeout(() => {
            addAlert('danger', 'Critical Quota Limit', `Your quota consumption is at ${newQuotaUsed}%. Upgrade immediately to avoid routing disruption.`, w.id);
            addPlgEvent('upsell', `Critical Alert: ${w.name}`, `Quota consumption crossed 95%. Upsell email campaign auto-dispatched.`);
          }, 0);
        } else if (newQuotaUsed >= 80 && w.quotaUsed < 80) {
          setTimeout(() => {
            addAlert('warning', 'High Quota Usage', `Your quota is at ${newQuotaUsed}%. Consider upgrading to the next tier.`, w.id);
            addPlgEvent('upsell', `Warning Alert: ${w.name}`, `Quota consumption crossed 80%. Automated upgrade recommendation sent.`);
          }, 0);
        }

        // Simulating error rate fluctuations
        let currentErr = w.errorRate;
        if (Math.random() > 0.9) {
          currentErr = parseFloat((Math.random() * 1.5 + 0.1).toFixed(2));
        }

        // Simulating latency
        let baseLat = 150;
        if (w.routingSettings.strategy === 'speed') baseLat = 100;
        if (w.routingSettings.strategy === 'quality') baseLat = 180;
        const currentLat = Math.round(baseLat + (Math.random() * 40 - 20));

        let wsStatus = w.status;
        if (newQuotaUsed > 90 || currentErr > 3) wsStatus = 'warning';
        if (newQuotaUsed > 98 || currentErr > 5) wsStatus = 'danger';
        if (newQuotaUsed <= 90 && currentErr <= 3) wsStatus = 'healthy';

        // Churn calculation simulation for Admin CRM
        let calculatedRisk = w.churnRisk;
        if (currentErr > 4 && w.healthScore < 60) {
          calculatedRisk = 'high';
        } else if (w.healthScore < 80) {
          calculatedRisk = 'medium';
        } else {
          calculatedRisk = 'low';
        }

        return {
          ...w,
          volume: newVolume,
          quotaUsed: Math.min(100, newQuotaUsed),
          costWithPipeline: w.costWithPipeline + pipelineCostIncrease,
          costDirect: w.costDirect + directCostIncrease,
          errorRate: currentErr,
          latency: currentLat,
          status: wsStatus,
          churnRisk: calculatedRisk,
          healthScore: Math.min(100, Math.max(20, 100 - Math.round(newQuotaUsed / 10) - (wsStatus === 'warning' ? 12 : wsStatus === 'danger' ? 30 : 0)))
        };
      }));

      // Random provider latency updates
      setProviders(prev => {
        const updateVal = (key, baseVal) => {
          if (prev[key].status === 'critical') return prev[key];
          const newLat = Math.round(baseVal + (Math.random() * 30 - 15));
          const newLoad = Math.max(10, Math.min(95, prev[key].load + Math.round(Math.random() * 10 - 5)));
          return { ...prev[key], latency: newLat, load: newLoad };
        };
        return {
          openai: updateVal('openai', 240),
          anthropic: updateVal('anthropic', 190),
          gemini: updateVal('gemini', 120),
          llama: updateVal('llama', 45)
        };
      });

    }, intervalTime);

    return () => clearInterval(timer);
  }, [simulationSpeed, activeWorkspaceId, addAlert, addPlgEvent]);

  return (
    <AppContext.Provider value={{
      workspaces,
      activeWorkspaceId,
      setActiveWorkspaceId,
      activeWorkspace,
      alerts,
      plgEvents,
      activePortal,
      setActivePortal,
      clientTab,
      setClientTab,
      adminTab,
      setAdminTab,
      providers,
      simulationSpeed,
      setSimulationSpeed,
      upgradeTier,
      generateApiKey,
      revokeApiKey,
      updateRoutingSettings,
      simulateTrafficSpike,
      simulateOutage,
      addAlert,
      addPlgEvent
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
