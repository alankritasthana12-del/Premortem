import React, { useEffect, useRef } from 'react';

export default function AnamAgent({ report }) {
  const agentRef = useRef(null);

  useEffect(() => {
    if (!document.querySelector('script[src="https://unpkg.com/@anam-ai/agent-widget"]')) {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@anam-ai/agent-widget";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (agentRef.current && report) {
      const context = `The user is viewing the report for startup "${report.startup?.name}". Executive Summary: ${report.executiveSummary || 'N/A'}. Success Probability: ${report.successProbability}%. Threat Level: ${report.overallRisk}%. Please help them understand this report.`;
      
      // Attempt to pass context via attribute if the widget supports it
      agentRef.current.setAttribute('context', context);
      
      // Also set property in case it's exposed that way
      agentRef.current.context = context;
    }
  }, [report]);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '24px', 
      right: '24px', 
      zIndex: 9999 
    }}>
      <anam-agent 
        ref={agentRef}
        agent-id="ebd4f7f8-ab8e-47a2-9d80-bde36011ef7c"
      ></anam-agent>
    </div>
  );
}
