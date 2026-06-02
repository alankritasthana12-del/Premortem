import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

const CircularProgress = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smoothly animate the progress fill on component mount
    const timer = setTimeout(() => setProgress(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - (progress / 100) * circumference;

  let color = '#10B981'; // Safe Green
  let glow = 'rgba(16, 185, 129, 0.4)';
  if (score > 40) {
    color = '#F59E0B'; // Amber Warning
    glow = 'rgba(245, 158, 11, 0.4)';
  }
  if (score > 70) {
    color = '#EF4444'; // Critical Red
    glow = 'rgba(239, 68, 68, 0.5)';
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-40 h-40">
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#1E293B"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>{progress}</span>
        <span className="text-[10px] text-[#94A3B8] font-mono uppercase tracking-widest mt-1">Threat Level</span>
      </div>
    </div>
  );
};

export default function ReportPage() {
  const { id } = useParams();
  const location = useLocation();
  const report = location.state?.report;

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-red-500 flex items-center justify-center font-mono">
        <div className="border border-red-900 p-8 bg-red-950/20 text-center max-w-md">
          <h2 className="text-xl mb-4 uppercase tracking-widest font-bold">Error: Link Severed</h2>
          <p className="text-sm text-red-400">No report payload detected in memory buffer. The session may have expired.</p>
          <Link to="/dashboard" className="inline-block mt-8 text-white hover:text-red-400 transition">&lt; Return to Command Center</Link>
        </div>
      </div>
    );
  }

  const getSeverityStyles = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500 text-white animate-pulse border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]';
      case 'HIGH':
        return 'bg-[#F59E0B] text-black border-amber-400';
      case 'MEDIUM':
        return 'bg-[#475569] text-white border-slate-400';
      case 'LOW':
        return 'bg-[#1E293B] text-slate-300 border-slate-600';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200 p-4 md:p-8 pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Navigation Control */}
        <div className="mb-10">
          <Link to="/dashboard" className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] hover:text-white transition flex items-center gap-2 w-max border border-transparent hover:border-[#334155] p-2 rounded-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Command Center
          </Link>
        </div>

        {/* Top Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Designation Block */}
          <div className="lg:col-span-2 border border-[#1E293B] bg-[#0F172A] p-8 md:p-10 rounded-sm relative overflow-hidden shadow-xl shadow-black/40">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
            <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {report.startup.name}
                </h1>
                <p className="text-[#94A3B8] font-mono text-sm tracking-widest uppercase">
                  Target Designation // {id || report.id}
                </p>
              </div>
              <div className="md:text-right bg-[#0B0F19] border border-[#1E293B] px-4 py-3 rounded-sm flex-shrink-0">
                <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-1">Generated On</p>
                <p className="text-white font-mono text-sm">{report.createdAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#1E293B]">
              <div>
                <p className="text-xs text-[#94A3B8] font-mono uppercase tracking-widest mb-2">Engagement Zone</p>
                <p className="text-sm font-semibold text-slate-200">{report.startup.market}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8] font-mono uppercase tracking-widest mb-2">Readiness Stage</p>
                <p className="text-sm font-semibold text-white">{report.startup.stage}</p>
              </div>
            </div>
          </div>

          {/* Radial Threat Gauge */}
          <div className="border border-[#1E293B] bg-[#0F172A] p-8 rounded-sm flex flex-col items-center justify-center shadow-xl shadow-black/40">
            <h2 className="text-[#94A3B8] font-mono text-sm uppercase tracking-widest mb-8 text-center">Aggregate Risk Profile</h2>
            <CircularProgress score={report.overallRisk || 0} />
          </div>
        </div>

        {/* The Challenger Path Component */}
        {report?.challengerPath && (
          <div className="mb-20 border border-[#1E293B] bg-[#0F172A] rounded-sm overflow-hidden shadow-xl shadow-black/40">
            <div className="bg-[#1E293B]/40 px-6 md:px-8 py-5 border-b border-[#1E293B] flex items-center gap-3">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              <h2 className="text-xl font-bold uppercase tracking-widest text-white" style={{ fontFamily: 'var(--font-display)' }}>The Challenger Path</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#1E293B]">
              {/* Survival Metric */}
              <div className="p-8 md:p-10 flex flex-col items-center justify-center bg-indigo-950/10 text-center">
                <span className="text-[#94A3B8] font-mono text-xs uppercase tracking-widest mb-6">Historical Survival Prob.</span>
                <span className="text-6xl font-black text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">{report.challengerPath.successRate || "Unknown"}</span>
              </div>
              
              {/* Known Successes List */}
              <div className="col-span-2 p-8 md:p-10 bg-[#0B0F19]">
                <span className="text-[#94A3B8] font-mono text-xs uppercase tracking-widest mb-6 block">Known Operational Precedents</span>
                {report.challengerPath.whatWorked && report.challengerPath.whatWorked.length > 0 ? (
                  <ul className="space-y-5">
                    {report.challengerPath.whatWorked.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-0.5 bg-emerald-950/50 p-1.5 rounded-sm border border-emerald-800/50 flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-slate-300 leading-relaxed text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic text-sm">No historical precedent data available in the knowledge graph.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="mb-12 flex items-center gap-6 opacity-80">
          <div className="h-px bg-[#1E293B] flex-grow"></div>
          <h2 className="text-2xl font-bold uppercase tracking-widest text-white flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Adversarial Vectors
          </h2>
          <div className="h-px bg-[#1E293B] flex-grow"></div>
        </div>

        {/* Persona Grid */}
        {report?.personas && report.personas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {report.personas.map((persona) => (
              <div key={persona.id || persona.name} className="border border-[#1E293B] bg-[#0F172A] rounded-sm flex flex-col overflow-hidden shadow-xl shadow-black/50 hover:border-[#334155] transition duration-300">
                
                {/* Header */}
                <div className="bg-[#1E293B]/30 px-6 py-5 border-b border-[#1E293B] flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                  <div className="bg-[#0B0F19] w-12 h-12 flex items-center justify-center rounded-sm border border-[#334155] text-2xl shadow-inner z-10 flex-shrink-0">
                    {persona.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider leading-tight z-10">{persona.name}</h3>
                </div>

                {/* Body Content */}
                <div className="flex-grow flex flex-col">
                  {persona.risks && persona.risks.map((risk, idx) => (
                    <div key={idx} className="flex flex-col flex-grow">
                      
                      {/* Risk Header */}
                      <div className="p-6 pb-5">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-bold text-white text-base leading-relaxed">{risk.title}</h4>
                          <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm border flex-shrink-0 ${getSeverityStyles(risk.severity)}`}>
                            {risk.severity}
                          </span>
                        </div>
                      </div>

                      {/* Analysis Block */}
                      <div className="bg-[#0B0F19] px-6 py-5 border-t border-[#1E293B] relative">
                        <div className="absolute top-6 left-0 w-1 h-8 bg-[#334155] rounded-r-sm"></div>
                        <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                          Analysis
                        </span>
                        <p className="text-slate-300 text-sm leading-relaxed">{risk.description}</p>
                      </div>

                      {/* Mitigation Block */}
                      <div className="bg-emerald-950/10 px-6 py-5 border-t border-[#1E293B] relative flex-grow">
                        <div className="absolute top-6 left-0 w-1 h-8 bg-emerald-700/60 rounded-r-sm"></div>
                        <span className="text-xs font-mono text-emerald-500/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                          Countermeasure
                        </span>
                        <p className="text-slate-200 text-sm leading-relaxed">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-16 border border-dashed border-[#334155] rounded-sm bg-[#0F172A]">
            <p className="text-[#94A3B8] font-mono uppercase tracking-widest text-sm">No adversarial vectors detected.</p>
          </div>
        )}

      </div>
    </div>
  );
}
