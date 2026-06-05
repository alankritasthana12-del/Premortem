import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

/* ─── Severity / Impact colour maps ─────────────────────────────────── */
const SEV = {
  CRITICAL:{ color:'#f43f5e', bg:'rgba(244,63,94,0.12)',  border:'rgba(244,63,94,0.3)'  },
  HIGH:    { color:'#fb923c', bg:'rgba(251,146,60,0.12)', border:'rgba(251,146,60,0.3)' },
  MEDIUM:  { color:'#fbbf24', bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.3)' },
  LOW:     { color:'#64748b', bg:'rgba(100,116,139,0.1)', border:'rgba(100,116,139,0.2)' },
};
const IMP = {
  HIGH:   { color:'#22c55e', bg:'rgba(34,197,94,0.1)',   border:'rgba(34,197,94,0.3)'   },
  MEDIUM: { color:'#38bdf8', bg:'rgba(56,189,248,0.1)',  border:'rgba(56,189,248,0.3)'  },
  LOW:    { color:'#94a3b8', bg:'rgba(148,163,184,0.1)', border:'rgba(148,163,184,0.2)' },
};
const TIER_COLOR = { S:'#f59e0b', A:'#22c55e', B:'#86efac', C:'#fbbf24', D:'#fb923c', F:'#f43f5e' };

/* ─── Arc Gauge (SVG) ────────────────────────────────────────────────── */
function ArcGauge({ value = 0, label, color, size = 120 }) {
  const r = 46, cx = 60, cy = 60;
  const startAngle = -220, endAngle = 40; // total arc = 260°
  const range = endAngle - startAngle;
  const angle  = startAngle + (value / 100) * range;
  const toRad  = d => (d * Math.PI) / 180;
  const arcPath = (a1, a2, r) => {
    const x1 = cx + r * Math.cos(toRad(a1));
    const y1 = cy + r * Math.sin(toRad(a1));
    const x2 = cx + r * Math.cos(toRad(a2));
    const y2 = cy + r * Math.sin(toRad(a2));
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  return (
    <div style={{ textAlign:'center' }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        {/* Track */}
        <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" strokeLinecap="round"/>
        {/* Fill */}
        <path d={arcPath(startAngle, angle, r)} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 6px ${color}88)` }}/>
        {/* Value */}
        <text x={cx} y={cy - 4} textAnchor="middle" fill={color}
          style={{ fontSize:22, fontWeight:900, fontFamily:'Space Grotesk, sans-serif', letterSpacing:'-0.04em' }}>
          {value}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="rgba(255,255,255,0.35)"
          style={{ fontSize:9, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em' }}>
          /100
        </text>
      </svg>
      <p style={{ margin:0, marginTop:4, fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.55)', letterSpacing:'0.08em', textTransform:'uppercase' }}>
        {label}
      </p>
    </div>
  );
}

/* ─── Dimension Bar ──────────────────────────────────────────────────── */
function DimBar({ dim, isRisk }) {
  const pct = (dim.score / 10) * 100;
  const color = isRisk
    ? (dim.score >= 7 ? '#f43f5e' : dim.score >= 5 ? '#fb923c' : dim.score >= 3 ? '#fbbf24' : '#22c55e')
    : (dim.score >= 7 ? '#22c55e' : dim.score >= 5 ? '#86efac' : dim.score >= 3 ? '#fbbf24' : '#f43f5e');
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{dim.name}</span>
          <span style={{
            fontSize:9, fontWeight:700, letterSpacing:'0.08em', padding:'2px 7px', borderRadius:999,
            background: isRisk ? 'rgba(244,63,94,0.1)' : 'rgba(34,197,94,0.1)',
            color: isRisk ? '#f87171' : '#86efac', border: isRisk ? '1px solid rgba(244,63,94,0.2)' : '1px solid rgba(34,197,94,0.2)',
          }}>
            {isRisk ? 'RISK' : 'STRENGTH'}
          </span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Confidence pill */}
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontFamily:'JetBrains Mono, monospace' }}>
            {dim.confidence}% confidence
          </span>
          <span style={{ fontSize:16, fontWeight:900, color, fontFamily:'Space Grotesk, sans-serif', letterSpacing:'-0.03em', minWidth:24, textAlign:'right' }}>
            {dim.score}<span style={{ fontSize:11, opacity:0.5 }}>/10</span>
          </span>
        </div>
      </div>
      {/* Bar */}
      <div style={{ height:6, borderRadius:999, background:'rgba(255,255,255,0.06)', overflow:'hidden', marginBottom:6 }}>
        <div style={{
          height:'100%', borderRadius:999, width:`${pct}%`,
          background:`linear-gradient(90deg, ${color}88, ${color})`,
          boxShadow:`0 0 8px ${color}60`,
          transition:'width 0.8s ease',
        }}/>
      </div>
      {/* Reasoning */}
      <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.65 }}>{dim.reasoning}</p>
    </div>
  );
}

/* ─── Bear Risk Item ─────────────────────────────────────────────────── */
function BearRiskItem({ risk, isLast }) {
  const s = SEV[risk.severity?.toUpperCase()] || SEV.LOW;
  return (
    <div style={{
      padding:'18px 20px',
      borderRight: isLast ? 'none' : '1px solid var(--bg-border)',
      display:'flex', flexDirection:'column', gap:10,
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
        <span style={{
          display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, flexShrink:0,
          border:`1px solid ${s.border}`, background:s.bg, color:s.color,
          fontSize:9, fontWeight:800, letterSpacing:'0.09em', textTransform:'uppercase', marginTop:2,
        }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:s.color, boxShadow:`0 0 4px ${s.color}` }}/>
          {risk.severity}
        </span>
        <p style={{ fontWeight:700, fontSize:13, color:'#fff', margin:0, lineHeight:1.45 }}>{risk.title}</p>
      </div>
      <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12, lineHeight:1.75, margin:0, flex:1 }}>{risk.description}</p>
      <div style={{ padding:'10px 12px', borderRadius:10, background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.18)', display:'flex', gap:8 }}>
        <svg width="13" height="13" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:1 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <p style={{ fontSize:9, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'#22c55e', marginBottom:3 }}>Fix</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.7, margin:0 }}>{risk.mitigation}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Bull Opportunity Item ──────────────────────────────────────────── */
function BullOppItem({ opp, isLast }) {
  const s = IMP[opp.impact?.toUpperCase()] || IMP.MEDIUM;
  return (
    <div style={{
      padding:'18px 20px',
      borderRight: isLast ? 'none' : '1px solid var(--bg-border)',
      display:'flex', flexDirection:'column', gap:10,
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
        <span style={{
          display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:999, flexShrink:0,
          border:`1px solid ${s.border}`, background:s.bg, color:s.color,
          fontSize:9, fontWeight:800, letterSpacing:'0.09em', textTransform:'uppercase', marginTop:2,
        }}>
          {opp.impact} IMPACT
        </span>
        <p style={{ fontWeight:700, fontSize:13, color:'#fff', margin:0, lineHeight:1.45 }}>{opp.title}</p>
      </div>
      <p style={{ color:'rgba(255,255,255,0.55)', fontSize:12, lineHeight:1.75, margin:0, flex:1 }}>{opp.description}</p>
      <div style={{ padding:'10px 12px', borderRadius:10, background:'rgba(56,189,248,0.06)', border:'1px solid rgba(56,189,248,0.2)', display:'flex', gap:8 }}>
        <svg width="13" height="13" fill="none" stroke="#38bdf8" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:1 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
        </svg>
        <div>
          <p style={{ fontSize:9, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'#38bdf8', marginBottom:3 }}>How to Capture</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.7, margin:0 }}>{opp.how}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Persona Card ───────────────────────────────────────────────────── */
function PersonaCard({ persona, index, isBull }) {
  const items  = isBull ? (persona.opportunities || []) : (persona.risks || []);
  const rows   = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));

  // Accent color
  let ac;
  if (isBull) {
    ac = '#22c55e';
  } else {
    const rank = { CRITICAL:4, HIGH:3, MEDIUM:2, LOW:1 };
    const max  = (persona.risks||[]).reduce((a,r) => Math.max(a, rank[r.severity?.toUpperCase()]||1), 0) || 1;
    ac = max===4?'#f43f5e':max===3?'#fb923c':max===2?'#fbbf24':'#64748b';
  }

  return (
    <div style={{ background:'var(--bg-surface)', border:`1px solid ${ac}20`, borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-card)' }}>
      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', gap:12, padding:'14px 20px',
        background: isBull
          ? 'linear-gradient(90deg, rgba(34,197,94,0.07) 0%, transparent 60%)'
          : `linear-gradient(90deg, ${ac}08 0%, transparent 60%)`,
        borderBottom:`1px solid ${ac}20`,
      }}>
        <div style={{
          width:24, height:24, borderRadius:7, flexShrink:0,
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'JetBrains Mono, monospace', fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)',
        }}>
          {String(index+1).padStart(2,'0')}
        </div>
        <div style={{
          width:36, height:36, borderRadius:10, flexShrink:0,
          background: isBull ? 'rgba(34,197,94,0.12)' : `${ac}12`,
          border: isBull ? '1px solid rgba(34,197,94,0.3)' : `1px solid ${ac}30`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:18,
        }}>
          {persona.icon}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:13.5, color:'#fff', margin:0, letterSpacing:'-0.01em' }}>{persona.name}</p>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:11, margin:0 }}>
            {isBull ? `${items.length} opportunit${items.length!==1?'ies':'y'} identified` : `${items.length} risk${items.length!==1?'s':''} identified`}
          </p>
        </div>
        <div style={{ width:4, height:32, borderRadius:999, flexShrink:0, background:`linear-gradient(180deg, ${isBull?'#22c55e':ac}, ${isBull?'#22c55e':ac}44)`, boxShadow:`0 0 8px ${isBull?'#22c55e':ac}60` }}/>
      </div>
      {/* Content rows */}
      {rows.map((pair, ri) => (
        <div key={ri} style={{ display:'grid', gridTemplateColumns: pair.length===2 ? '1fr 1fr' : '1fr', borderTop: ri===0?'none':'1px solid var(--bg-border)' }}>
          {pair.map((item, ii) => (
            isBull
              ? <BullOppItem key={ii} opp={item} isLast={ii===pair.length-1||pair.length===1}/>
              : <BearRiskItem key={ii} risk={item} isLast={ii===pair.length-1||pair.length===1}/>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Report Page ───────────────────────────────────────────────── */
export default function ReportPage() {
  const location = useLocation();
  const report   = location.state?.report;
  const [activeTab, setActiveTab] = useState('bears'); // 'bears' | 'bulls'

  if (!report) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'#000', fontFamily:'Inter, sans-serif' }}>
        <div style={{ textAlign:'center', maxWidth:380 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'#111', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <svg width="26" height="26" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
          </div>
          <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:22, color:'#fff', marginBottom:8 }}>Report not found</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:14, lineHeight:1.7, marginBottom:24 }}>This link has expired. Open it from your reports dashboard.</p>
          <Link to="/dashboard" className="pm-btn-primary" style={{ display:'inline-flex' }}>Go to My Reports</Link>
        </div>
      </div>
    );
  }

  /* ── Derived values ── */
  const isNew        = !!report.dimensions;
  const risk         = report.overallRisk || 0;
  const succ         = report.successProbability || (100 - risk);
  const ventScale    = report.ventureScale || report.venturePotential || report.ventureProbability || Math.round(succ / 3);
  const vent         = ventScale; // alias for gauges
  const opp          = report.opportunityScore || 0;
  const bizQuality   = report.businessQuality || 0;
  const unicornProb  = report.unicornProbability || 0;
  const mCeiling     = report.marketCeiling || null;
  const tier         = report.startupTier || (succ>=40?'A':succ>=25?'B':succ>=12?'C':succ>=5?'D':'F');
  const tc           = TIER_COLOR[tier] || '#64748b';
  const tierLabel    = { S:'Category-Defining', A:'Elite', B:'Strong', C:'Promising', D:'Risky', F:'High Risk' }[tier] || 'Unknown';
  const successCat   = report.successCategory || null;

  const mCeilColor   = { Massive:'#f59e0b', High:'#a78bfa', Medium:'#38bdf8', Low:'#64748b' };
  const mCeilLabel   = mCeiling?.label || (mCeiling?.score >= 80 ? 'Massive' : mCeiling?.score >= 60 ? 'High' : mCeiling?.score >= 40 ? 'Medium' : 'Low');

  const riskColor = risk>70?'#f43f5e':risk>40?'#fb923c':'#22c55e';
  const riskGlow  = risk>70?'rgba(244,63,94,0.18)':risk>40?'rgba(251,146,60,0.15)':'rgba(34,197,94,0.15)';

  // Split personas — case-insensitive, also use id prefix as fallback
  const isBearPersona = (p) => {
    if (!p) return false;
    const stance = (p.stance || '').toLowerCase();
    const id     = (p.id    || '').toLowerCase();
    if (stance === 'bear') return true;
    if (stance === 'bull') return false;
    // fallback: if no stance, check id prefix
    if (id.startsWith('bear_')) return true;
    if (id.startsWith('bull_')) return false;
    // last fallback: no stance and no id prefix = old format bear
    return !p.stance;
  };
  const bears = (report.personas||[]).filter(p => isBearPersona(p));
  const bulls  = (report.personas||[]).filter(p => !isBearPersona(p) && ((p.stance||'').toLowerCase()==='bull' || (p.id||'').toLowerCase().startsWith('bull_')));

  // Dimensions split
  const positiveDims = (report.dimensions||[]).filter((_,i) => i < 6);
  const riskDims     = (report.dimensions||[]).filter((_,i) => i >= 6);

  // Old format bar scores
  const oldBarColors=['#f43f5e','#fb923c','#fbbf24','#f87171','#e5e7eb','#34d399','#6b7280','#dc2626'];
  const personaScores = bears.map(p=>{
    const rank={CRITICAL:4,HIGH:3,MEDIUM:2,LOW:1};
    const max=p.risks?.reduce((a,r)=>Math.max(a,rank[r.severity?.toUpperCase()]||1),0)||1;
    return { name:p.name.replace('The ',''), score:max, pct:max===4?100:max===3?75:max===2?50:25 };
  }).sort((a,b)=>b.score-a.score);

  return (
    <div style={{ minHeight:'100vh', paddingTop:64, background:'#000', color:'#fff', fontFamily:'Inter, sans-serif' }}>
      <style>{`
        @media (max-width: 700px) {
          .rp-4col { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .rp-3col { grid-template-columns: 1fr !important; }
          .rp-2col { grid-template-columns: 1fr !important; }
          .rp-fixed-col { grid-template-columns: 1fr !important; }
          .rp-benchrow { flex-direction: column !important; align-items: flex-start !important; }
          .rp-section-header { flex-wrap: wrap !important; }
          .rp-scorecard { max-width: 100% !important; grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .rp-4col { grid-template-columns: 1fr 1fr !important; gap: 6px !important; }
        }
      `}</style>
      {/* Ambient glow */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:`radial-gradient(ellipse 70% 40% at 50% -5%, ${riskGlow} 0%, transparent 65%)` }}/>

      {/* Breadcrumb bar */}
      <div style={{ position:'fixed', top:64, left:0, right:0, zIndex:50, background:'rgba(0,0,0,0.92)', borderBottom:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(20px)' }}>
        <div className="pm-container" style={{ height:40, display:'flex', alignItems:'center', gap:10 }}>
          <Link to="/dashboard" style={{ color:'rgba(255,255,255,0.4)', fontSize:12, textDecoration:'none', display:'flex', alignItems:'center', gap:5, transition:'color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='#fff'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
            My Reports
          </Link>
          <svg width="13" height="13" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
          <span style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>{report.startup?.name} · {report.createdAt}</span>
        </div>
      </div>

      <div className="pm-container" style={{ paddingTop:52, paddingBottom:96, position:'relative' }}>

        {/* ══════════ HEADER ══════════ */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', margin:0 }}>
                Intelligence Report
              </p>
              <h1 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:'clamp(1.8rem,4vw,3rem)', letterSpacing:'-0.04em', color:'#fff', margin:0, lineHeight:1.05 }}>
                {report.startup?.name}
              </h1>
            </div>
            {/* Tier pill — text only, no letter badge */}
            <span style={{
              marginTop:4, display:'inline-flex', alignItems:'center', gap:6,
              padding:'5px 14px', borderRadius:999, flexShrink:0,
              border:`1px solid ${tc}40`, background:`${tc}12`,
              fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:12,
              color:tc, letterSpacing:'0.04em', textTransform:'uppercase',
            }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:tc, boxShadow:`0 0 6px ${tc}` }}/>
              Tier {tier} · {tierLabel}
            </span>
            {/* Success Category badge */}
            {successCat && (
              <span style={{
                marginTop:4, display:'inline-flex', alignItems:'center', gap:5,
                padding:'5px 12px', borderRadius:999, flexShrink:0,
                border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)',
                fontFamily:'Inter, sans-serif', fontWeight:600, fontSize:11,
                color:'rgba(255,255,255,0.6)', letterSpacing:'0.01em',
              }}>
                {successCat === 'Category Creator' ? '🌎' :
                 successCat === 'Potential Unicorn' ? '🦄' :
                 successCat === 'Venture-Scale Opportunity' ? '🚀' :
                 successCat === 'Strong Venture Startup' ? '📈' :
                 successCat === 'Niche SaaS' ? '📦' :
                 successCat === 'Strong Vertical Business' ? '🏾' :
                 successCat === 'Local Business' ? '📍' : '🏡'}
                {' '}{successCat}
              </span>
            )}
          </div>

          {/* Executive summary */}
          {report.executiveSummary && (
            <div style={{ padding:'16px 20px', borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', marginBottom:20 }}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', margin:'0 0 8px' }}>Executive Summary</p>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.8)', lineHeight:1.75, margin:0 }}>{report.executiveSummary}</p>
            </div>
          )}

          {/* Startup metadata */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:12 }}>
            {[['Target Market',report.startup?.market],['Revenue Model',report.startup?.model],['Current Stage',report.startup?.stage]].map(([label,val])=>val&&(
              <div key={label} style={{ padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', margin:'0 0 4px' }}>{label}</p>
                <p style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.75)', margin:0 }}>{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ 4 GAUGES ══════════ */}
        <div className="rp-4col" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:16 }}>
          {[
            { value:opp,  label:'Opportunity',        color:'#38bdf8',  card:'rgba(56,189,248,0.05)',  border:'rgba(56,189,248,0.15)' },
            { value:succ, label:'Success Probability', color:'#22c55e',  card:'rgba(34,197,94,0.05)',   border:'rgba(34,197,94,0.12)'  },
            { value:vent, label:'Venture Scale',        color:'#a78bfa',  card:'rgba(167,139,250,0.05)', border:'rgba(167,139,250,0.15)'},
            { value:risk, label:'Threat Level',         color:risk>70?'#f43f5e':risk>40?'#fb923c':'#22c55e', card:'rgba(244,63,94,0.05)', border:'rgba(244,63,94,0.12)' },
          ].map(({value,label,color,card,border}) => (
            <div key={label} style={{ padding:'20px 12px', borderRadius:16, background:card, border:`1px solid ${border}`, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
              <ArcGauge value={value} label={label} color={color} size={100}/>
            </div>
          ))}
        </div>

        {/* ══════════ VENTURE PROFILE PANEL ══════════ */}
        {isNew && (
          <div className="rp-4col" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>

            {/* Business Quality */}
            <div style={{ padding:'16px 18px', borderRadius:14, background:'rgba(34,197,94,0.04)', border:'1px solid rgba(34,197,94,0.15)' }}>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', margin:'0 0 6px' }}>Business Quality</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:32, color:'#22c55e', letterSpacing:'-0.04em', lineHeight:1 }}>{bizQuality || '—'}</span>
                {bizQuality > 0 && <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>/100</span>}
              </div>
              <p style={{ margin:'6px 0 0', fontSize:10, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>
                {bizQuality >= 80 ? 'Excellent company potential' : bizQuality >= 60 ? 'Good business fundamentals' : bizQuality >= 40 ? 'Viable with improvements' : 'Needs significant work'}
              </p>
            </div>

            {/* Market Ceiling */}
            <div style={{ padding:'16px 18px', borderRadius:14, background:'rgba(245,158,11,0.04)', border:'1px solid rgba(245,158,11,0.15)' }}>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', margin:'0 0 6px' }}>Market Ceiling</p>
              {mCeiling ? (
                <>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:32, color: mCeilColor[mCeilLabel] || '#f59e0b', letterSpacing:'-0.04em', lineHeight:1 }}>{mCeiling.score}</span>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>/100</span>
                  </div>
                  <span style={{ display:'inline-block', marginTop:6, padding:'2px 10px', borderRadius:999, fontSize:10, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase',
                    color: mCeilColor[mCeilLabel] || '#f59e0b',
                    background: `${mCeilColor[mCeilLabel] || '#f59e0b'}15`,
                    border: `1px solid ${mCeilColor[mCeilLabel] || '#f59e0b'}40`
                  }}>{mCeilLabel}</span>
                </>
              ) : (
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:28, color:'rgba(255,255,255,0.2)' }}>—</span>
              )}
            </div>

            {/* Venture Scale */}
            <div style={{ padding:'16px 18px', borderRadius:14, background:'rgba(167,139,250,0.04)', border:'1px solid rgba(167,139,250,0.15)' }}>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', margin:'0 0 6px' }}>Venture Scale</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:32, color:'#a78bfa', letterSpacing:'-0.04em', lineHeight:1 }}>{vent || '—'}</span>
                {vent > 0 && <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>/100</span>}
              </div>
              <p style={{ margin:'6px 0 0', fontSize:10, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>
                {vent >= 75 ? 'Can return a venture fund' : vent >= 55 ? 'Strong venture potential' : vent >= 35 ? 'Moderate venture case' : 'Better as a lifestyle / niche business'}
              </p>
            </div>

            {/* Unicorn Probability */}
            <div style={{ padding:'16px 18px', borderRadius:14, background:'rgba(245,158,11,0.04)', border:'1px solid rgba(245,158,11,0.15)' }}>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', margin:'0 0 6px' }}>Unicorn Probability</p>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:32, color:'#f59e0b', letterSpacing:'-0.04em', lineHeight:1 }}>{unicornProb || '—'}</span>
                {unicornProb > 0 && <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontWeight:600 }}>%</span>}
              </div>
              <p style={{ margin:'6px 0 0', fontSize:10, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>
                {unicornProb >= 50 ? '$1B+ outcome possible' : unicornProb >= 25 ? 'Real but uncertain path to unicorn' : unicornProb >= 10 ? 'Unlikely but not impossible' : 'Not a typical unicorn path'}
              </p>
            </div>

          </div>
        )}

        {/* ══════════ 10 DIMENSIONS ══════════ */}
        {isNew && (
          <div style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:18, color:'#fff', margin:0, letterSpacing:'-0.02em' }}>Due Diligence Scorecard</h2>
              <span style={{ fontSize:10, padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>10 Dimensions</span>
            </div>
            <div className="rp-scorecard" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {/* Opportunity dims (first 6) */}
              <div style={{ padding:'20px 22px', borderRadius:14, background:'rgba(56,189,248,0.04)', border:'1px solid rgba(56,189,248,0.15)' }}>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#38bdf8', margin:'0 0 16px', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'#38bdf8', boxShadow:'0 0 6px #38bdf8' }}/>
                  Opportunity Factors
                </p>
                {positiveDims.map((d,i) => <DimBar key={i} dim={d} isRisk={false}/>)}
              </div>
              {/* Risk dims (last 4) */}
              <div style={{ padding:'20px 22px', borderRadius:14, background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.12)' }}>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#f87171', margin:'0 0 16px', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:'#f87171', boxShadow:'0 0 6px #f87171' }}/>
                  Execution Risk Factors
                </p>
                {riskDims.map((d,i) => <DimBar key={i} dim={d} isRisk={true}/>)}
              </div>
            </div>
          </div>
        )}

        {/* Old format bar chart (fallback) */}
        {!isNew && (
          <div style={{ padding:24, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', marginBottom:24 }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:16 }}>Risk by Persona</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {personaScores.map((p,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:500, flexShrink:0, width:80, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
                  <div className="pm-riskbar-track">
                    <div className="pm-riskbar-fill" style={{ width:`${p.pct}%`, background:`linear-gradient(90deg,${oldBarColors[i]||'#dc2626'},${oldBarColors[i]||'#dc2626'}88)`, boxShadow:`0 0 8px ${oldBarColors[i]||'#dc2626'}60` }}/>
                  </div>
                  <span style={{ color:'rgba(255,255,255,0.3)', fontSize:10, fontFamily:'JetBrains Mono, monospace', flexShrink:0, width:30, textAlign:'right' }}>{p.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ STRENGTHS + WEAKNESSES ══════════ */}
        {isNew && report.strengths?.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
            <div style={{ padding:'20px 22px', borderRadius:14, background:'rgba(34,197,94,0.04)', border:'1px solid rgba(34,197,94,0.12)' }}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#22c55e', margin:'0 0 14px' }}>Top Strengths</p>
              {report.strengths.map((s,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
                  <span style={{ width:20, height:20, borderRadius:6, background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:10, color:'#22c55e', fontWeight:800 }}>✓</span>
                  <p style={{ margin:0, fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.55 }}>{s}</p>
                </div>
              ))}
            </div>
            <div style={{ padding:'20px 22px', borderRadius:14, background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.12)' }}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#f87171', margin:'0 0 14px' }}>Top Weaknesses</p>
              {report.weaknesses.map((w,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
                  <span style={{ width:20, height:20, borderRadius:6, background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:10, color:'#f87171', fontWeight:800 }}>✗</span>
                  <p style={{ margin:0, fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.55 }}>{w}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ BEAR / BASE / BULL SCENARIOS ══════════ */}
        {isNew && report.scenarios && (
          <div style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:18, color:'#fff', margin:0, letterSpacing:'-0.02em' }}>Outcome Scenarios</h2>
              <span style={{ fontSize:10, padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>Bear · Base · Bull</span>
            </div>
            <div className="rp-3col" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
              {[
                {
                  key:'bear', label:'Bear Case', icon:'🐻',
                  color:'#f43f5e', bg:'rgba(244,63,94,0.06)', border:'rgba(244,63,94,0.2)',
                  tagBg:'rgba(244,63,94,0.12)', tagBorder:'rgba(244,63,94,0.3)',
                },
                {
                  key:'base', label:'Base Case', icon:'⚖️',
                  color:'#fbbf24', bg:'rgba(251,191,36,0.06)', border:'rgba(251,191,36,0.2)',
                  tagBg:'rgba(251,191,36,0.12)', tagBorder:'rgba(251,191,36,0.3)',
                },
                {
                  key:'bull', label:'Bull Case', icon:'🐂',
                  color:'#22c55e', bg:'rgba(34,197,94,0.06)', border:'rgba(34,197,94,0.2)',
                  tagBg:'rgba(34,197,94,0.12)', tagBorder:'rgba(34,197,94,0.3)',
                },
              ].map(({ key, label, icon, color, bg, border, tagBg, tagBorder }) => {
                const s = report.scenarios[key];
                if (!s) return null;
                return (
                  <div key={key} style={{ padding:'20px 20px', borderRadius:14, background:bg, border:`1px solid ${border}`, position:'relative', overflow:'hidden' }}>
                    {/* Top accent line */}
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${color}88, ${color}, ${color}88)` }}/>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:18 }}>{icon}</span>
                        <span style={{ fontSize:11, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', color }}>{label}</span>
                      </div>
                      {/* Probability pill */}
                      <span style={{ fontSize:13, fontWeight:900, padding:'3px 10px', borderRadius:999, background:tagBg, border:`1px solid ${tagBorder}`, color, fontFamily:'Space Grotesk, sans-serif', letterSpacing:'-0.02em' }}>
                        {s.probability}%
                      </span>
                    </div>
                    {s.title && (
                      <p style={{ fontWeight:700, fontSize:13, color:'#fff', margin:'0 0 8px', lineHeight:1.4 }}>{s.title}</p>
                    )}
                    <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>{s.description}</p>
                  </div>
                );
              })}
            </div>
            {/* Probability bar */}
            {report.scenarios.bear && report.scenarios.base && report.scenarios.bull && (
              <div style={{ marginTop:12, padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', flexShrink:0 }}>Probability distribution</span>
                <div style={{ flex:1, height:8, borderRadius:999, overflow:'hidden', display:'flex', gap:2 }}>
                  <div style={{ width:`${report.scenarios.bear.probability}%`, height:'100%', background:'linear-gradient(90deg,#b91c1c,#f43f5e)', borderRadius:'999px 0 0 999px' }}/>
                  <div style={{ width:`${report.scenarios.base.probability}%`, height:'100%', background:'linear-gradient(90deg,#d97706,#fbbf24)' }}/>
                  <div style={{ width:`${report.scenarios.bull.probability}%`, height:'100%', background:'linear-gradient(90deg,#16a34a,#22c55e)', borderRadius:'0 999px 999px 0' }}/>
                </div>
                <div style={{ display:'flex', gap:12, flexShrink:0 }}>
                  {[{label:'Bear',color:'#f43f5e',pct:report.scenarios.bear.probability},{label:'Base',color:'#fbbf24',pct:report.scenarios.base.probability},{label:'Bull',color:'#22c55e',pct:report.scenarios.bull.probability}].map(x=>(
                    <span key={x.label} style={{ fontSize:10, color:x.color, fontWeight:700 }}>{x.label} {x.pct}%</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ BENCHMARK ══════════ */}
        {isNew && report.benchmark && (
          <div style={{ marginBottom:24, padding:'22px 24px', borderRadius:14, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, #dc2626, #f87171, #dc2626)' }}/>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', margin:'0 0 8px' }}>Benchmark Comparison</p>
            <div style={{ display:'flex', alignItems:'flex-start', gap:20, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:200 }}>
                <p style={{ fontSize:22, fontWeight:900, color:'#fff', fontFamily:'Space Grotesk, sans-serif', letterSpacing:'-0.03em', margin:'0 0 4px' }}>
                  Most resembles <span style={{ color:'var(--accent-bright)' }}>{report.benchmark.mostResembles}</span>
                </p>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.7, margin:0 }}>{report.benchmark.reasoning}</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0, minWidth:220 }}>
                {report.benchmark.analogs?.map((a,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:8, background: a.outcome==='success'?'rgba(34,197,94,0.07)':'rgba(244,63,94,0.07)', border: a.outcome==='success'?'1px solid rgba(34,197,94,0.2)':'1px solid rgba(244,63,94,0.2)' }}>
                    <span style={{ fontSize:14 }}>{a.outcome==='success'?'🚀':'💥'}</span>
                    <div>
                      <p style={{ fontWeight:700, fontSize:12, color: a.outcome==='success'?'#86efac':'#f87171', margin:0 }}>{a.company}</p>
                      <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', margin:0 }}>{a.similarity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ ADVERSARIAL BREAKDOWN ══════════ */}
        <div style={{ marginBottom:24 }}>
          {/* Section header + tab toggle */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:18, color:'#fff', margin:0, letterSpacing:'-0.02em' }}>
                Adversarial Breakdown
              </h2>
              <span style={{ fontSize:10, padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                {bears.length + bulls.length} Perspectives
              </span>
            </div>
            {/* Bears vs Bulls toggle */}
            {bulls.length > 0 && (
              <div style={{ display:'flex', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:10, padding:4, gap:4 }}>
                {[
                  { id:'bears', label:`🐻 Bears  (${bears.length})`, color:'#f87171', bg:'rgba(244,63,94,0.12)', border:'rgba(244,63,94,0.3)' },
                  { id:'bulls', label:`🐂 Bulls  (${bulls.length})`, color:'#22c55e', bg:'rgba(34,197,94,0.12)',  border:'rgba(34,197,94,0.3)'  },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding:'7px 18px', borderRadius:7, border:'none', cursor:'pointer',
                      fontFamily:'Inter, sans-serif', fontWeight:700, fontSize:12, letterSpacing:'0.01em',
                      transition:'all 0.2s',
                      background: activeTab===tab.id ? tab.bg : 'transparent',
                      color:      activeTab===tab.id ? tab.color : 'rgba(255,255,255,0.4)',
                      boxShadow:  activeTab===tab.id ? `0 0 12px ${tab.color}30` : 'none',
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Persona cards */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {(activeTab==='bears' ? bears : bulls).map((persona, i) => (
              <PersonaCard key={persona.id||i} persona={persona} index={i} isBull={activeTab==='bulls'}/>
            ))}
          </div>
        </div>

        {/* ══════════ CRITICAL FAILURE MODES + SUCCESS PATHS ══════════ */}
        {isNew && (report.criticalFailureModes?.length > 0 || report.successPaths?.length > 0) && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
            {/* Failure modes */}
            {report.criticalFailureModes?.length > 0 && (
              <div style={{ padding:'20px 22px', borderRadius:14, background:'rgba(244,63,94,0.04)', border:'1px solid rgba(244,63,94,0.12)' }}>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#f87171', margin:'0 0 14px', display:'flex', alignItems:'center', gap:8 }}>
                  <span>💀</span> Critical Failure Modes
                </p>
                {report.criticalFailureModes.map((fm,i) => (
                  <div key={i} style={{ marginBottom:14, paddingBottom:14, borderBottom: i<report.criticalFailureModes.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:9, fontWeight:800, padding:'2px 8px', borderRadius:999, background:`rgba(${fm.probability==='HIGH'?'244,63,94':fm.probability==='MEDIUM'?'251,146,60':'251,191,36'},0.12)`, color: fm.probability==='HIGH'?'#f87171':fm.probability==='MEDIUM'?'#fb923c':'#fbbf24', border:`1px solid rgba(${fm.probability==='HIGH'?'244,63,94':fm.probability==='MEDIUM'?'251,146,60':'251,191,36'},0.25)`, letterSpacing:'0.08em' }}>{fm.probability} PROB</span>
                      <p style={{ margin:0, fontWeight:700, fontSize:13, color:'#fff' }}>{fm.mode}</p>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.65 }}>{fm.description}</p>
                  </div>
                ))}
              </div>
            )}
            {/* Success paths */}
            {report.successPaths?.length > 0 && (
              <div style={{ padding:'20px 22px', borderRadius:14, background:'rgba(34,197,94,0.04)', border:'1px solid rgba(34,197,94,0.12)' }}>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#22c55e', margin:'0 0 14px', display:'flex', alignItems:'center', gap:8 }}>
                  <span>🎯</span> Most Likely Success Paths
                </p>
                {report.successPaths.map((sp,i) => (
                  <div key={i} style={{ marginBottom:14, paddingBottom:14, borderBottom: i<report.successPaths.length-1?'1px solid rgba(255,255,255,0.06)':'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ width:20, height:20, borderRadius:6, background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:10, color:'#22c55e', fontWeight:800 }}>{i+1}</span>
                      <p style={{ margin:0, fontWeight:700, fontSize:13, color:'#fff' }}>{sp.path}</p>
                    </div>
                    <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.65 }}>{sp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════ ACTION PLAN ══════════ */}
        {isNew && report.actionPlan && (
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:18, color:'#fff', margin:'0 0 16px', letterSpacing:'-0.02em', display:'flex', alignItems:'center', gap:10 }}>
              Action Plan
              <span style={{ fontSize:10, padding:'3px 10px', borderRadius:999, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                4 Horizons
              </span>
            </h2>
            <div className="rp-4col" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
              {[
                { key:'immediate',    label:'This Week',  icon:'⚡', color:'#f43f5e', bg:'rgba(244,63,94,0.06)',   border:'rgba(244,63,94,0.15)' },
                { key:'thirtyDays',   label:'30 Days',    icon:'📅', color:'#fb923c', bg:'rgba(251,146,60,0.06)',  border:'rgba(251,146,60,0.15)' },
                { key:'ninetyDays',   label:'90 Days',    icon:'🎯', color:'#fbbf24', bg:'rgba(251,191,36,0.06)',  border:'rgba(251,191,36,0.15)' },
                { key:'twelveMonths', label:'12 Months',  icon:'🚀', color:'#22c55e', bg:'rgba(34,197,94,0.06)',   border:'rgba(34,197,94,0.15)' },
              ].map(({ key, label, icon, color, bg, border }) => (
                <div key={key} style={{ padding:'18px 16px', borderRadius:14, background:bg, border:`1px solid ${border}` }}>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color, margin:'0 0 12px', display:'flex', alignItems:'center', gap:6 }}>
                    <span>{icon}</span> {label}
                  </p>
                  {(report.actionPlan[key]||[]).map((action,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:10 }}>
                      <span style={{ width:18, height:18, borderRadius:5, background:`${color}20`, border:`1px solid ${color}40`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:9, color, fontWeight:800, marginTop:1 }}>{i+1}</span>
                      <p style={{ margin:0, fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:1.55 }}>{action}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ HISTORICAL PRECEDENTS (old field) ══════════ */}
        {report.challengerPath && (
          <div style={{ padding:'22px 24px', borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="rp-fixed-col" style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:28 }}>
              <div style={{ paddingRight:28, borderRight:'1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:6 }}>Survival Rate</p>
                <p style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:48, color:'#f87171', letterSpacing:'-0.04em', marginBottom:4 }}>{report.challengerPath.successRate||'—'}</p>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, lineHeight:1.6 }}>Of comparable startups survive beyond 3 years.</p>
              </div>
              <div>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:14 }}>What tends to work</p>
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {report.challengerPath.whatWorked?.map((item,i) => (
                    <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, color:'rgba(255,255,255,0.55)', fontSize:13, lineHeight:1.6 }}>
                      <svg width="13" height="13" fill="none" stroke="#22c55e" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:3 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
