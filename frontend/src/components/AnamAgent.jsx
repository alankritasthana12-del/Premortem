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

  const contextData = `CRITICAL INSTRUCTION: You are an AI assistant whose SOLE purpose is to explain the following startup analysis report. Do not answer questions outside the scope of this report.
  
  REPORT DETAILS:
  Startup Name: ${report?.startup?.name}
  Threat Level: ${report?.overallRisk}%
  Success Probability: ${report?.successProbability}%
  Executive Summary: ${report?.executiveSummary || 'N/A'}`;

  const injectContext = () => {
    if (agentRef.current && typeof agentRef.current.addContext === 'function') {
      try {
        agentRef.current.addContext(contextData);
        console.log("Anam context injected successfully.");
        return true;
      } catch (e) {
        console.error("Failed to inject Anam context", e);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const el = agentRef.current;
    if (!el) return;

    // Listen to all likely Anam events to inject context automatically when the session starts
    const events = ['anam-session-ready', 'SESSION_READY', 'anam-connection-established', 'CONNECTION_ESTABLISHED'];
    const handleEvent = () => {
      injectContext();
    };

    events.forEach(ev => el.addEventListener(ev, handleEvent));
    window.addEventListener('anam-session-ready', handleEvent);

    return () => {
      events.forEach(ev => el.removeEventListener(ev, handleEvent));
      window.removeEventListener('anam-session-ready', handleEvent);
    };
  }, [report]);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '24px', 
      right: '24px', 
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '12px'
    }}>
      <button 
        onClick={() => {
          const success = injectContext();
          if (success) {
            alert("Report successfully loaded into the AI's memory! She can now see it.");
          } else {
            alert("Please start the AI session first by clicking the widget and granting microphone access, then click this button again.");
          }
        }}
        style={{
          background: 'linear-gradient(90deg, #f43f5e, #fb923c)',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '999px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '12px',
          boxShadow: '0 4px 12px rgba(244,63,94,0.3)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        🧠 Share Report with AI
      </button>
      <anam-agent 
        ref={agentRef}
        agent-id="ebd4f7f8-ab8e-47a2-9d80-bde36011ef7c"
      ></anam-agent>
    </div>
  );
}
