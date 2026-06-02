import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { DUMMY_REPORT } from '../lib/dummyData';
import PersonaCard from '../components/report/PersonaCard';

export default function ReportPage() {
  const { id } = useParams();
  const report = DUMMY_REPORT;

  const getRiskColor = (score) => {
    if (score > 70) return 'var(--risk-critical)';
    if (score > 40) return 'var(--risk-high)';
    return 'var(--success)';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-12">
      {/* Header Section */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 p-8 border rounded-sm">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-4xl font-black uppercase tracking-wider mb-2">{report.startup.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="text-sm uppercase tracking-widest mb-4">Code Name // {id || report.id}</p>
          <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }} className="inline-block border px-3 py-1 text-xs">
            <span style={{ color: 'var(--text-muted)' }}>GENERATED: </span>
            <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{report.createdAt}</span>
          </div>
        </div>
        
        {/* Risk Score Circle */}
        <div className="mt-8 md:mt-0 flex flex-col items-center">
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="text-xs uppercase tracking-widest mb-3">Threat Level</span>
          <div 
            className="w-32 h-32 flex items-center justify-center rounded-full border-4 shadow-xl shadow-black/50"
            style={{ borderColor: getRiskColor(report.overallRisk), backgroundColor: 'var(--bg-elevated)', color: getRiskColor(report.overallRisk) }}
          >
            <span style={{ fontFamily: 'var(--font-display)' }} className="text-5xl font-black">{report.overallRisk}</span>
          </div>
        </div>
      </div>

      {/* Personas Section */}
      <div className="mb-16">
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-red)', borderColor: 'var(--accent-red-dim)' }} className="text-2xl font-bold mb-8 uppercase tracking-widest border-b pb-4">
          // Adversarial Vectors
        </h2>
        <div className="grid gap-6">
          {report.personas.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      </div>

      {/* Challenger Path Section */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }} className="border p-8 mt-16 rounded-sm">
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }} className="text-2xl font-bold mb-8 uppercase tracking-widest border-b border-gray-800 pb-4">
          // The Challenger Path
        </h2>
        <div className="mb-8 flex items-center gap-4">
          <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="uppercase text-sm tracking-wider">Historical Survival Probability:</span>
          <span style={{ backgroundColor: 'var(--accent-red-dim)', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }} className="font-bold text-xl px-4 py-2 border border-red-900 rounded-sm">
            {report.challengerPath.successRate}
          </span>
        </div>
        
        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="uppercase text-xs tracking-widest mb-4">Known Operational Successes:</h3>
          <ul className="list-none flex flex-col gap-4">
            {report.challengerPath.whatWorked.map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <span style={{ color: 'var(--success)' }} className="text-xl leading-none mt-1">✓</span>
                <span style={{ color: 'var(--text-primary)' }} className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link to="/" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="text-sm uppercase hover:text-white underline tracking-widest transition">
          &lt; Return to Command Center
        </Link>
      </div>
    </div>
  );
}
