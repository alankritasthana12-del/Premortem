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
    const el = agentRef.current;
    if (!el) return false;

    let success = false;

    // Function to search an object for injection methods
    const searchAndInject = (obj) => {
      if (!obj) return false;
      const methods = ['addContext', 'sendMessage', 'sendText', 'sendSystemMessage'];
      for (let m of methods) {
        if (typeof obj[m] === 'function') {
          try {
            obj[m](contextData);
            console.log(`Successfully injected via ${m}`);
            return true;
          } catch (e) {
            console.error(`Error calling ${m}:`, e);
          }
        }
      }
      return false;
    };

    // 1. Check directly on the element
    if (searchAndInject(el)) success = true;

    // 2. Search properties of the element (like .anamClient, .client, .session, etc.)
    if (!success) {
      for (let key in el) {
        try {
          if (el[key] && typeof el[key] === 'object') {
             if (searchAndInject(el[key])) {
                success = true;
                break;
             }
          }
        } catch (e) {} // ignore cross-origin or getter errors
      }
    }

    // 3. Fallback: try setting every conceivable attribute
    if (!success) {
      el.setAttribute('context', contextData);
      el.setAttribute('system-prompt', contextData);
      el.setAttribute('systemPrompt', contextData);
      el.setAttribute('data-context', contextData);
      el.context = contextData;
      el.systemPrompt = contextData;
    }

    return success;
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
    <>
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
          position: 'fixed',
          bottom: '420px', // Lifted high enough to clear the expanded widget
          right: '24px',
          zIndex: 10000,
          background: 'linear-gradient(90deg, #f43f5e, #fb923c)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '999px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '13px',
          boxShadow: '0 4px 16px rgba(244,63,94,0.4)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        🧠 Share Report with AI
      </button>
      
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
        <anam-agent 
          ref={agentRef}
          agent-id="ebd4f7f8-ab8e-47a2-9d80-bde36011ef7c"
        ></anam-agent>
      </div>
    </>
  );
}
