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
    // We wait for the web component to be defined and ready
    const configureAgent = async () => {
      await customElements.whenDefined('anam-agent');
      
      if (agentRef.current && report) {
        // Build a strict system instruction string
        const contextData = `CRITICAL INSTRUCTION: You are an AI assistant whose SOLE purpose is to explain the following startup analysis report. Do not answer questions outside the scope of this report.
        
        REPORT DETAILS:
        Startup Name: ${report.startup?.name}
        Threat Level: ${report.overallRisk}%
        Success Probability: ${report.successProbability}%
        Executive Summary: ${report.executiveSummary || 'N/A'}`;

        // The widget usually supports addContext for injecting session context
        try {
          if (typeof agentRef.current.addContext === 'function') {
            agentRef.current.addContext(contextData);
          } else {
            // Fallbacks
            agentRef.current.setAttribute('system-prompt', contextData);
            agentRef.current.context = contextData;
          }
        } catch (e) {
          console.error("Failed to inject Anam context", e);
        }
      }
    };

    configureAgent();
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
