import React from 'react';

export default function PersonaCard({ persona }) {
  const getSeverityStyle = (severity) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return { bg: 'var(--risk-critical)', text: '#fff' };
      case 'HIGH': return { bg: 'var(--risk-high)', text: '#000' };
      case 'MEDIUM': return { bg: 'var(--risk-medium)', text: '#000' };
      case 'LOW': return { bg: 'var(--risk-low)', text: '#fff' };
      default: return { bg: 'var(--bg-border)', text: 'var(--text-primary)' };
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }} className="border p-6 shadow-xl rounded-sm">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800">
        <span className="text-3xl" role="img" aria-label="icon">{persona.icon}</span>
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }} className="text-xl font-bold uppercase tracking-wider">{persona.name}</h2>
      </div>
      
      <div className="flex flex-col gap-8">
        {persona.risks.map((risk, index) => {
          const sevStyle = getSeverityStyle(risk.severity);
          return (
            <div key={index} className="flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <span 
                  style={{ backgroundColor: sevStyle.bg, color: sevStyle.text, fontFamily: 'var(--font-mono)' }} 
                  className="text-[10px] font-bold px-2 py-1 uppercase tracking-widest mt-1 rounded-sm"
                >
                  {risk.severity}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }} className="text-lg font-bold">{risk.title}</h3>
              </div>
              
              <div style={{ borderColor: 'var(--bg-border)' }} className="pl-4 border-l-2 ml-4 flex flex-col gap-4">
                <div>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} className="block text-xs uppercase tracking-widest mb-1">Analysis: </span>
                  <span style={{ color: 'var(--text-secondary)' }} className="block text-sm leading-relaxed">{risk.description}</span>
                </div>
                <div style={{ backgroundColor: 'rgba(56, 161, 105, 0.1)', borderColor: 'rgba(56, 161, 105, 0.2)' }} className="p-4 border rounded-sm">
                  <span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }} className="block text-xs uppercase tracking-widest mb-1">Countermeasure: </span>
                  <span style={{ color: 'var(--text-primary)' }} className="block text-sm leading-relaxed">{risk.mitigation}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
