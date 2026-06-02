import React from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_REPORT } from '../lib/dummyData';
import '../styles/globals.css';

const personas = [
  { name: 'Venture Capitalist', icon: '💼', attack: 'Market size & fundability' },
  { name: 'Competitor CEO', icon: '🎯', attack: 'Moat & speed to market' },
  { name: 'Potential Customer', icon: '🧑‍🎓', attack: 'Value proposition & pricing' },
  { name: 'Regulatory Body', icon: '⚖️', attack: 'Compliance & legal risks' },
  { name: 'Cynical Engineer', icon: '💻', attack: 'Technical feasibility & scale' },
  { name: 'Macro Economist', icon: '📉', attack: 'Market timing & trends' },
  { name: 'Burn Rate Auditor', icon: '🔥', attack: 'Unit economics & runway' }
];

export default function LandingPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }} className="min-h-screen text-left">
      
      {/* 1. Hero Section */}
      <header className="flex flex-col items-center justify-center text-center py-32 px-4">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }} className="text-5xl md:text-7xl font-bold max-w-4xl mb-6">
          Kill your startup's failure modes before they kill your startup.
        </h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-xl md:text-2xl max-w-2xl mb-10">
          Premortem attacks your idea from 7 adversarial perspectives before you build.
        </p>
        <Link 
          to="/submit"
          style={{ backgroundColor: 'var(--accent-red)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          className="px-8 py-4 text-lg font-bold rounded-sm hover:opacity-90 transition uppercase tracking-wider"
        >
          Stress-test your idea
        </Link>
      </header>

      {/* 2. How it works */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--bg-border)', borderBottom: '1px solid var(--bg-border)' }} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl md:text-4xl font-bold mb-16 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }} className="w-16 h-16 rounded-full border flex items-center justify-center text-2xl mb-6 shadow-lg font-bold">1</div>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold mb-3">Submit your idea</h3>
              <p style={{ color: 'var(--text-muted)' }}>Describe your startup in 60 seconds. Target market, business model, and stage.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }} className="w-16 h-16 rounded-full border flex items-center justify-center text-2xl mb-6 shadow-lg font-bold">2</div>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold mb-3">7 AI Personas Attack</h3>
              <p style={{ color: 'var(--text-muted)' }}>Adversarial agents simulate investors, competitors, and customers to find flaws.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }} className="w-16 h-16 rounded-full border flex items-center justify-center text-2xl mb-6 shadow-lg font-bold">3</div>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold mb-3">Get the Failure Report</h3>
              <p style={{ color: 'var(--text-muted)' }}>Identify critical risks and mitigation strategies before writing a single line of code.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 7 Personas */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl md:text-4xl font-bold mb-12 text-center">Meet the Red Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((p, i) => (
            <div key={i} style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }} className="p-6 border rounded-sm flex flex-col items-start text-left">
              <div className="text-4xl mb-4" role="img" aria-label="icon">{p.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-lg font-bold mb-2">{p.name}</h3>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Attacks: {p.attack}</p>
            </div>
          ))}
          <div style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--bg-border)' }} className="p-6 border border-dashed rounded-sm flex flex-col items-center justify-center text-center opacity-50">
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)' }} className="font-bold">...and more</span>
          </div>
        </div>
      </section>

      {/* 4. Sample Report Preview */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--bg-border)' }} className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl md:text-4xl font-bold mb-12 text-center">Intelligence Brief Preview</h2>
          
          <div style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--bg-border)' }} className="border rounded-lg overflow-hidden shadow-2xl text-left">
            <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--bg-border)' }} className="p-4 border-b flex justify-between items-center">
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }} className="text-xs uppercase tracking-wider">{DUMMY_REPORT.id} // CONFIDENTIAL</span>
              <span style={{ color: 'var(--risk-critical)', borderColor: 'var(--risk-critical)' }} className="font-bold border px-2 py-1 text-xs uppercase">OVERALL RISK: {DUMMY_REPORT.overallRisk}</span>
            </div>
            
            <div className="p-6 md:p-8">
              <h3 style={{ fontFamily: 'var(--font-display)' }} className="text-2xl font-bold mb-2">{DUMMY_REPORT.startup.name}</h3>
              <p style={{ color: 'var(--text-secondary)' }} className="mb-8">{DUMMY_REPORT.startup.idea}</p>
              
              <div className="space-y-6">
                {DUMMY_REPORT.personas[0].risks.map((risk, idx) => (
                  <div key={idx} style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--accent-red-dim)' }} className="p-5 border-l-4 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <span style={{ backgroundColor: 'var(--risk-critical)', color: '#fff' }} className="text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">{risk.severity}</span>
                      <h4 style={{ fontFamily: 'var(--font-display)' }} className="font-bold text-lg">{risk.title}</h4>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-3 leading-relaxed">{risk.description}</p>
                    <div className="text-sm bg-black/20 p-3 rounded-sm border border-black/10">
                      <span style={{ color: 'var(--success)' }} className="font-bold uppercase text-xs tracking-wider mr-2">Mitigation:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{risk.mitigation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Footer */}
      <footer style={{ backgroundColor: 'var(--bg-base)', borderTop: '1px solid var(--bg-border)' }} className="py-32 px-4 text-center">
        <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-4xl md:text-5xl font-bold mb-10">Ready to face reality?</h2>
        <Link 
          to="/submit"
          style={{ backgroundColor: 'var(--accent-red)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
          className="inline-block px-10 py-5 text-xl font-bold rounded-sm hover:opacity-90 transition uppercase tracking-wider shadow-lg shadow-red-900/20"
        >
          Run your first Premortem — free
        </Link>
      </footer>

    </div>
  );
}
