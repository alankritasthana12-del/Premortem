import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';

// ─── Severity Badge ───────────────────────────────────────────────────────────
const SeverityBadge = ({ severity }) => {
  const s = severity?.toUpperCase();
  const styles = {
    CRITICAL: { color: 'var(--risk-critical)', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
    HIGH:     { color: 'var(--risk-high)',     bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
    MEDIUM:   { color: 'var(--risk-medium)',   bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
    LOW:      { color: 'var(--text-secondary)',bg: 'var(--bg-elevated)',   border: 'var(--bg-border)' },
  };
  const st = styles[s] || styles.LOW;
  return (
    <span
      className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex-shrink-0"
      style={{ color: st.color, backgroundColor: st.bg, border: `1px solid ${st.border}` }}
    >
      {severity}
    </span>
  );
};

// ─── Signup Modal ─────────────────────────────────────────────────────────────
const SignupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div 
        className="relative w-full max-w-sm rounded-2xl border p-8 shadow-2xl"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 mx-auto" style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
          <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Save Your Report</h3>
        <p className="text-sm text-center mb-8" style={{ color: 'var(--text-secondary)' }}>
          Sign in to save this analysis to your history. If you leave without saving, this link will expire.
        </p>
        
        <button
          onClick={onClose} // Mocking successful sign in by just closing for now
          className="w-full flex items-center justify-center gap-3 text-sm font-semibold px-4 py-3 rounded-lg transition-all border mb-3"
          style={{ 
            backgroundColor: 'var(--bg-elevated)', 
            color: 'var(--text-primary)',
            borderColor: 'var(--bg-border)'
          }}
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <button onClick={onClose} className="w-full text-xs font-medium text-center hover:underline" style={{ color: 'var(--text-muted)' }}>
          Continue without saving
        </button>
      </div>
    </div>
  );
};

// ─── Persona Card (Fully Expanded) ────────────────────────────────────────────
const ExpandedPersonaCard = ({ persona }) => {
  return (
    <div
      className="rounded-xl border overflow-hidden h-fit"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 border-b" style={{ borderColor: 'var(--bg-border)' }}>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
        >
          {persona.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-base leading-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {persona.name}
          </p>
        </div>
      </div>

      {/* Risks */}
      <div className="divide-y" style={{ borderColor: 'var(--bg-border)' }}>
        {persona.risks?.map((risk, i) => (
          <div key={i} className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <SeverityBadge severity={risk.severity} />
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {risk.title}
              </p>
            </div>
            
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {risk.description}
            </p>

            {/* Suggested Fix (Always visible) */}
            <div
              className="p-3.5 rounded-lg border flex items-start gap-3"
              style={{ backgroundColor: 'rgba(34,197,94,0.06)', borderColor: 'rgba(34,197,94,0.15)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--success)' }}>Suggested Fix</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {risk.mitigation}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Report Page ─────────────────────────────────────────────────────────
export default function ReportPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const report = location.state?.report;
  const isNew = location.state?.isNew;
  
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (isNew) {
      // Small delay for dramatic effect after loading
      const t = setTimeout(() => setShowSignup(true), 800);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>
        <div className="text-center max-w-sm">
          <h2 className="font-bold mb-2 text-xl" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Report not found</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>This link has expired. Open it from your history.</p>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-lg font-semibold text-sm" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>Go to My Reports</Link>
        </div>
      </div>
    );
  }

  const risk = report.overallRisk || 0;
  const riskLabel = risk > 70 ? 'High Risk' : risk > 40 ? 'Medium Risk' : 'Lower Risk';
  const riskColor = risk > 70 ? 'var(--risk-critical)' : risk > 40 ? 'var(--risk-medium)' : 'var(--success)';

  // Calculate highest risk per persona for the bar chart
  const personaScores = report.personas?.map(p => {
    let maxScore = 1; // LOW
    p.risks?.forEach(r => {
      const s = r.severity?.toUpperCase();
      if (s === 'CRITICAL') maxScore = 4;
      else if (s === 'HIGH' && maxScore < 4) maxScore = 3;
      else if (s === 'MEDIUM' && maxScore < 3) maxScore = 2;
    });
    return { name: p.name, score: maxScore };
  }) || [];

  // Sort by score descending (highest risk first)
  personaScores.sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />

      {/* ── Slim top bar ─────────────────────────────── */}
      <div className="sticky top-0 z-40 border-b" style={{ backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'var(--bg-border)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/dashboard" className="text-xs font-semibold hover:text-white transition-colors flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
              My Reports
            </Link>
            <span style={{ color: 'var(--bg-border)' }}>/</span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{id.slice(0,8).toUpperCase()}</span>
          </div>
          <button onClick={() => setShowSignup(true)} className="text-xs font-semibold px-3 py-1.5 rounded border hover:bg-white/5 transition-colors" style={{ color: 'var(--text-primary)', borderColor: 'var(--bg-border)' }}>
            Save Report
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10 pb-24">
        
        {/* ══ HEADER DASHBOARD ══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Main Info Card */}
          <div className="lg:col-span-2 rounded-2xl border p-8 flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: riskColor, backgroundColor: `${riskColor}22`, border: `1px solid ${riskColor}44` }}>
                  {riskLabel}
                </span>
                <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{report.createdAt}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>
                {report.startup?.name}
              </h1>
              <p className="text-base mb-8 max-w-xl" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {report.startup?.idea}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 border-t pt-5" style={{ borderColor: 'var(--bg-border)' }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Target Market</p>
                <p className="text-sm font-medium truncate">{report.startup?.market}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Revenue Model</p>
                <p className="text-sm font-medium truncate">{report.startup?.model}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Current Stage</p>
                <p className="text-sm font-medium truncate">{report.startup?.stage}</p>
              </div>
            </div>
          </div>

          {/* Risk Graph / Score Card */}
          <div className="rounded-2xl border p-8 flex flex-col" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Overall Risk</p>
                <p className="text-6xl font-black tabular-nums leading-none" style={{ color: riskColor, fontFamily: 'var(--font-display)', letterSpacing: '-0.05em' }}>{risk}</p>
              </div>
              <p className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>/100</p>
            </div>

            {/* Risk Distribution Bar Chart */}
            <div className="flex-1 flex flex-col justify-end gap-3 mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Risk by Persona</p>
              {personaScores.map((p, idx) => {
                const width = p.score === 4 ? '100%' : p.score === 3 ? '75%' : p.score === 2 ? '50%' : '25%';
                // Shiny modern gradients instead of flat crayons
                const bg = p.score === 4 ? 'linear-gradient(90deg, #ef4444 0%, #fca5a5 100%)' 
                         : p.score === 3 ? 'linear-gradient(90deg, #f97316 0%, #fdba74 100%)' 
                         : p.score === 2 ? 'linear-gradient(90deg, #f59e0b 0%, #fcd34d 100%)' 
                         : 'linear-gradient(90deg, #94a3b8 0%, #cbd5e1 100%)';
                const shadow = p.score === 4 ? '0 0 12px rgba(239,68,68,0.4)'
                             : p.score === 3 ? '0 0 12px rgba(249,115,22,0.4)'
                             : p.score === 2 ? '0 0 12px rgba(245,158,11,0.4)'
                             : 'none';
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-[11px] font-medium w-24 truncate" style={{ color: 'var(--text-secondary)' }} title={p.name}>{p.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#1A1A1A] overflow-visible relative">
                      <div className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000" style={{ width, background: bg, boxShadow: shadow }}></div>
                    </div>
                    <span className="text-[10px] font-mono w-8 text-right" style={{ color: 'var(--text-muted)' }}>{width}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══ SURVIVAL PATH ══════════════════════════════════════════════════════ */}
        {report?.challengerPath && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-5" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>Historical Precedents</h2>
            <div className="rounded-2xl border p-8 grid grid-cols-1 md:grid-cols-4 gap-8" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
              <div className="md:col-span-1 border-r-0 md:border-r border-b md:border-b-0 pb-6 md:pb-0 md:pr-6" style={{ borderColor: 'var(--bg-border)' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Survival Rate</p>
                <p className="text-5xl font-black mb-2" style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '-0.04em' }}>{report.challengerPath.successRate || '—'}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>Of comparable startups survive beyond 3 years.</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>What tends to work in this space</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.challengerPath.whatWorked?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ══ MASONRY GRID OF PERSONAS ══════════════════════════════════════════════ */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            Adversarial Breakdown
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--bg-border)', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>7 Perspectives</span>
          </h2>
          
          <div className="columns-1 md:columns-2 gap-6 space-y-6">
            {report?.personas?.map((persona, i) => (
              <div key={i} className="break-inside-avoid">
                <ExpandedPersonaCard persona={persona} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
