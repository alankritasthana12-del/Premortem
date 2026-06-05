import React from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_REPORT } from '../lib/dummyData';

const personas = [
  { icon:'💼', name:'The Investor',         copy:'Is your market big enough? Can this scale to a venture-scale outcome?' },
  { icon:'🏁', name:'The Competitor',        copy:'What stops an existing player from copying or crushing you tomorrow?' },
  { icon:'🙋', name:'The Customer',          copy:'Do people want this? Will they pay and change their behaviour?' },
  { icon:'⚖️', name:'The Regulator',         copy:'Are there legal or compliance landmines hiding in your model?' },
  { icon:'🔧', name:'The Engineer',          copy:'Can you actually build this? What breaks at scale?' },
  { icon:'📊', name:'The Economist',         copy:'Is the macro timing right? Are market-readiness risks working against you?' },
  { icon:'🧾', name:'The Finance Lead',      copy:'Will you run out of money before finding product-market fit?' },
  { icon:'🪞', name:"The Founder's Mirror",  copy:'Are YOU the right person to build this? Domain expertise, network, and grit.' },
  { icon:'🚀', name:'The Bull Investor',     copy:'Why could this become a massive company? What would excite a top-tier VC?' },
  { icon:'⭐', name:'The Early Adopter',     copy:'Why would your first 100 customers genuinely love this product?' },
  { icon:'📈', name:'The Market Optimist',   copy:'What tailwinds, emerging trends, and timing advantages favour this startup?' },
  { icon:'⚡', name:'The Growth Operator',   copy:'What distribution channels, viral loops, or growth levers unlock scale?' },
];

const stats = [
  { value:'12',  suffix:'',  label:'Expert Perspectives' },
  { value:'50',  suffix:'+', label:'Startup Failure Cases' },
  { value:'30',  suffix:'s', label:'Second Analysis' },
  { value:'100', suffix:'+', label:'Risk Categories' },
];

const steps = [
  { num:'01', icon:'✏️', title:'Describe your idea',       body:'Tell us your startup name, concept, target market, and stage. Takes about 60 seconds.' },
  { num:'02', icon:'👥', title:'12 agents debate it',      body:'8 adversarial bears stress-test every weakness. 4 optimistic bulls argue every strength. You get a balanced, honest verdict.' },
  { num:'03', icon:'📋', title:'Get your failure report',  body:'Scored across 10 dimensions with survival probability, benchmark comparisons, and a concrete action plan.' },
];

/* Reusable ambient section background */
const sectionGlow = (color = 'rgba(220,38,38,0.06)') => ({
  position: 'absolute', inset: 0, pointerEvents: 'none',
  background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${color} 0%, transparent 70%)`,
});

export default function LandingPage() {
  return (
    <div style={{ background:'var(--bg-base)', color:'var(--text-primary)', fontFamily:'var(--font-body)', paddingTop:64 }}>
      <style>{`
        /* ── LandingPage Mobile ── */
        @media (max-width: 600px) {
          .lp-hero-cta { flex-direction: column !important; align-items: stretch !important; }
          .lp-hero-cta a, .lp-hero-cta button { text-align: center !important; justify-content: center !important; }
          .lp-stats-grid { grid-template-columns: 1fr 1fr !important; gap: 0 !important; }
          .lp-stats-grid > div { border-bottom: 1px solid rgba(255,255,255,0.06); }
          .lp-sample-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .lp-sample-gauges { justify-content: flex-start !important; gap: 8px !important; }
          .lp-sample-gauges > div { min-width: 44px !important; padding: 8px 10px !important; }
          .lp-scorecard-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
          .lp-scorecard-row { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .lp-scorecard-row span:first-child { width: auto !important; }
          .lp-persona-preview { grid-template-columns: 1fr !important; }
          .lp-critics-section h2 { font-size: 1.5rem !important; }
          .lp-cta-section h2 { font-size: 1.6rem !important; }
          .lp-cta-section br { display: none; }
          .lp-footer-links { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
        @media (max-width: 420px) {
          .lp-sample-gauges { flex-wrap: wrap !important; }
        }
      `}</style>

      {/* ════════════════ HERO ════════════════ */}
      <section style={{ position:'relative', overflow:'hidden', minHeight:'92vh', display:'flex', flexDirection:'column', justifyContent:'center' }}>

        {/* ── Background: Line grid ── */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
          backgroundSize:'72px 72px',
          maskImage:'radial-gradient(ellipse 110% 80% at 50% 0%, black 0%, transparent 85%)',
          WebkitMaskImage:'radial-gradient(ellipse 110% 80% at 50% 0%, black 0%, transparent 85%)',
        }}/>

        {/* ── Background: Central red glow ── */}
        <div style={{
          position:'absolute', top:'-25%', left:'50%', transform:'translateX(-50%)',
          width:1000, height:700, borderRadius:'50%', pointerEvents:'none',
          background:'radial-gradient(ellipse, rgba(220,38,38,0.18) 0%, rgba(185,28,28,0.08) 35%, transparent 70%)',
          filter:'blur(60px)',
        }}/>

        {/* ── Background: White orb top-right ── */}
        <div style={{
          position:'absolute', top:'5%', right:'-8%',
          width:400, height:400, borderRadius:'50%', pointerEvents:'none',
          background:'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)',
          filter:'blur(50px)',
        }}/>

        {/* ── Background: Dark red orb bottom-left ── */}
        <div style={{
          position:'absolute', bottom:'0%', left:'-5%',
          width:350, height:350, borderRadius:'50%', pointerEvents:'none',
          background:'radial-gradient(circle, rgba(185,28,28,0.12) 0%, transparent 70%)',
          filter:'blur(50px)',
        }}/>

        {/* ── Background: Red glowing bar ── */}
        <div style={{
          position:'absolute', top:'60%', left:'50%', transform:'translateX(-50%)',
          width:'80%', height:1, pointerEvents:'none',
          background:'linear-gradient(90deg, transparent, rgba(220,38,38,0.3), rgba(239,68,68,0.2), transparent)',
        }}/>

        <div className="pm-container" style={{ paddingTop:'clamp(48px,8vw,80px)', paddingBottom:'clamp(48px,8vw,80px)', textAlign:'center', position:'relative', zIndex:1 }}>

          {/* ── Eyebrow pill ── */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'7px 16px', borderRadius:999, marginBottom:28,
            border:'1px solid rgba(220,38,38,0.35)',
            background:'rgba(220,38,38,0.08)',
          }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#f43f5e', boxShadow:'0 0 8px rgba(244,63,94,0.8)', flexShrink:0 }}/>
            <span style={{ color:'var(--accent-bright)', fontSize:11.5, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase' }}>
              12 AI Agents · Real-time Analysis
            </span>
          </div>

          {/* ── 3-line Headline ── */}
          <h1 className="pm-h1" style={{ fontSize:'clamp(3rem,6.5vw,5.5rem)', marginBottom:24, lineHeight:1.06 }}>
            Discover why your<br/>
            startup <span className="pm-gradient-text">will fail</span><br/>
            — before you build it.
          </h1>

          {/* Subheadline */}
          <p style={{ color:'var(--text-secondary)', fontSize:'clamp(15px,2.5vw,17.5px)', lineHeight:1.8, maxWidth:540, margin:'0 auto 38px', fontWeight:400 }}>
            Describe your startup. Twelve AI agents — 8 adversarial critics and 4 optimists — stress-test it from every angle and deliver a prioritised failure report in under 60 seconds.
          </p>

          {/* CTA row */}
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:18 }}>
            <Link to="/submit" className="pm-btn-primary" style={{ fontSize:15.5, padding:'14px 34px', borderRadius:14 }}>
              Analyze My Startup — Free
              <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
              </svg>
            </Link>
            <Link to="/dashboard" className="pm-btn-ghost" style={{ fontSize:15.5, padding:'14px 28px', borderRadius:14 }}>
              View Dashboard
            </Link>
          </div>
          <p style={{ color:'var(--text-muted)', fontSize:12, letterSpacing:'0.02em' }}>
            No sign-up required · 100% free · Results in under 30 seconds
          </p>
        </div>

        {/* Stats strip */}
        <div style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(255,255,255,0.07)', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'rgba(255,255,255,0.02)' }}>
          <div className="pm-container">
            <div className="lp-stats-grid pm-grid-4" style={{ padding:'24px 0' }}>
              {stats.map((s,i) => (
                <div key={i} style={{ textAlign:'center', padding:'8px 0' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(28px,6vw,40px)', letterSpacing:'-0.04em', lineHeight:1, marginBottom:4 }}>
                    <span className="pm-gradient-text">{s.value}</span>
                    <span style={{ color:'var(--cyan)', fontSize:'clamp(18px,4vw,24px)' }}>{s.suffix}</span>
                  </div>
                  <div style={{ color:'var(--text-muted)', fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section style={{ position:'relative', padding:'clamp(48px,8vw,96px) 0', overflow:'hidden' }}>
        <div style={sectionGlow('rgba(56,189,248,0.05)')}/>
        <div className="pm-container">
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div className="pm-label">How it works</div>
            <h2 className="pm-h2" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)' }}>
              Three steps to a complete failure report.
            </h2>
          </div>
          <div className="pm-grid-3">
            {steps.map((step,i) => (
              <div key={i} className="pm-card pm-card-hover" style={{ padding:30, position:'relative' }}>
                {/* Glow accent line at top */}
                <div style={{ position:'absolute', top:0, left:24, right:24, height:2, borderRadius:999, background:'var(--accent-gradient)', opacity:0.5 }}/>
                <span style={{ position:'absolute', top:20, right:20, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>{step.num}</span>
                <div style={{ width:50, height:50, borderRadius:14, marginBottom:22, background:'var(--accent-dim)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>
                  {step.icon}
                </div>
                <h3 className="pm-h3" style={{ fontSize:16, marginBottom:10 }}>{step.title}</h3>
                <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.75 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="pm-section-divider"/>

      {/* ════════════════ 8 CRITICS ════════════════ */}
      <section style={{ position:'relative', padding:'clamp(48px,8vw,96px) 0', overflow:'hidden', background:'rgba(255,255,255,0.015)' }}>
        <div style={sectionGlow('rgba(220,38,38,0.06)')}/>
        <div className="pm-container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24, marginBottom:48 }}>
            <div>
              <div className="pm-label">The Review Panel</div>
              <h2 className="pm-h2" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)' }}>
                8 Bears attack.<br/>4 Bulls defend.<br/> You get the truth.
              </h2>
            </div>
            <p style={{ color:'var(--text-secondary)', fontSize:14, maxWidth:300, lineHeight:1.75 }}>
              8 adversarial bears find every way your startup can fail. 4 optimistic bulls argue every reason it can win. The debate gives you the full picture.
            </p>
          </div>

          <div className="pm-grid-4">
            {personas.map((p,i) => (
              <div key={i} className="pm-card pm-card-hover" style={{ padding:22 }}>
                <div style={{ fontSize:26, marginBottom:14 }}>{p.icon}</div>
                <div className="pm-h3" style={{ fontSize:14, marginBottom:8 }}>{p.name}</div>
                <p style={{ color:'var(--text-secondary)', fontSize:12, lineHeight:1.7 }}>{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="pm-section-divider"/>

      {/* ════════════════ SAMPLE REPORT ════════════════ */}
      <section id="sample-report" style={{ position:'relative', padding:'clamp(48px,8vw,96px) 0', overflow:'hidden', scrollMarginTop:80 }}>
        <div style={sectionGlow('rgba(79,114,255,0.06)')}/>
        <div className="pm-container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24, marginBottom:36 }}>
            <div>
              <div className="pm-label">Sample Output</div>
              <h2 className="pm-h2" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)' }}>
                Here's what a real report looks like.
              </h2>
            </div>
            <Link to="/submit" style={{ color:'var(--accent-bright)', fontSize:14, fontWeight:600, textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='var(--text-primary)'}
              onMouseLeave={e=>e.target.style.color='var(--accent-bright)'}
            >
              Generate yours →
            </Link>
          </div>

          {/* Report preview */}
          <div className="pm-card" style={{ overflow:'hidden' }}>
            {/* Top accent bar */}
            <div style={{ height:3, background:'var(--accent-gradient)' }}/>

            {/* Header */}
            <div style={{ padding:28, borderBottom:'1px solid var(--bg-border)' }}>
              <div style={{ display:'flex', gap:20, flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ flex:1, minWidth:240 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:999, color:'#f43f5e', background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.25)', letterSpacing:'0.06em', textTransform:'uppercase' }}>High Risk</span>
                    <span style={{ width:32, height:32, borderRadius:9, background:'rgba(251,191,36,0.12)', border:'1px solid rgba(251,191,36,0.3)', display:'inline-flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:'#fbbf24' }}>C</span>
                    <span style={{ color:'var(--text-muted)', fontSize:12 }}>· {DUMMY_REPORT.createdAt}</span>
                  </div>
                  <h3 className="pm-h2" style={{ fontSize:24, marginBottom:8 }}>{DUMMY_REPORT.startup.name}</h3>
                  <p style={{ color:'var(--text-secondary)', fontSize:13, lineHeight:1.75 }}>{DUMMY_REPORT.startup.idea?.slice(0,80)}...</p>
                </div>
              {/* 4 mini gauges */}
                <div className="lp-sample-gauges" style={{ display:'flex', gap:10, flexShrink:0, flexWrap:'wrap', justifyContent:'flex-end' }}>
                  {[
                    { label:'Opp.',    value:58, color:'#38bdf8' },
                    { label:'Success', value:22, color:'#22c55e' },
                    { label:'Venture', value:31, color:'#a78bfa' },
                    { label:'Threat',  value:72, color:'#f43f5e' },
                  ].map(g => (
                    <div key={g.label} style={{ textAlign:'center', padding:'10px 12px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', minWidth:52 }}>
                      <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:22, color:g.color, letterSpacing:'-0.04em', lineHeight:1 }}>{g.value}</div>
                      <div style={{ color:'var(--text-muted)', fontSize:9, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginTop:4 }}>{g.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Venture Profile strip */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10, marginTop:18 }}>
                {[
                  { label:'Business Quality', value:'68', suffix:'/100', color:'#22c55e', note:'Good business fundamentals' },
                  { label:'Market Ceiling',   value:'42', suffix:'/100', color:'#38bdf8', badge:'Medium', badgeColor:'#38bdf8' },
                  { label:'Venture Scale',    value:'31', suffix:'/100', color:'#a78bfa', note:'Better as a niche business' },
                  { label:'Unicorn Prob.',    value:'4',  suffix:'%',    color:'#f59e0b', note:'Not a typical unicorn path' },
                ].map(p => (
                  <div key={p.label} style={{ padding:'11px 13px', borderRadius:10, background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ fontSize:8, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', margin:'0 0 4px' }}>{p.label}</p>
                    <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:20, color:p.color, letterSpacing:'-0.03em', lineHeight:1 }}>{p.value}</span>
                      <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)', fontWeight:600 }}>{p.suffix}</span>
                    </div>
                    {p.badge ? (
                      <span style={{ display:'inline-block', marginTop:4, padding:'1px 7px', borderRadius:999, fontSize:8, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', color:p.badgeColor, background:`${p.badgeColor}15`, border:`1px solid ${p.badgeColor}35` }}>{p.badge}</span>
                    ) : (
                      <p style={{ margin:'3px 0 0', fontSize:8, color:'rgba(255,255,255,0.3)', lineHeight:1.4 }}>{p.note}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Dimension bars */}
              <div style={{ marginTop:18 }}>
                <p style={{ color:'var(--text-muted)', fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>Due Diligence Scorecard</p>
                <div className="lp-scorecard-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px 24px', maxWidth:'100%' }}>
                  {[
                    { name:'Market Opportunity',  score:6, color:'#22c55e' },
                    { name:'Execution Complexity', score:7, color:'#f43f5e', risk:true },
                    { name:'Problem Severity',     score:5, color:'#86efac' },
                    { name:'Competition Risk',     score:8, color:'#f87171', risk:true },
                    { name:'Monetization',         score:4, color:'#fbbf24' },
                    { name:'Technical Risk',       score:5, color:'#fb923c', risk:true },
                  ].map((d,i) => (
                    <div key={i} className="lp-scorecard-row" style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ color:'var(--text-secondary)', fontSize:10, width:120, flexShrink:0 }}>{d.name}</span>
                      <div style={{ flex:1, height:5, borderRadius:999, background:'rgba(255,255,255,0.06)', overflow:'hidden', minWidth:40 }}>
                        <div style={{ height:'100%', width:`${d.score*10}%`, borderRadius:999, background:`linear-gradient(90deg,${d.color}88,${d.color})`, boxShadow:`0 0 6px ${d.color}50` }}/>
                      </div>
                      <span style={{ color:d.color, fontSize:10, fontFamily:'var(--font-mono)', flexShrink:0, fontWeight:700 }}>{d.score}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Persona preview */}
            <div style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
                <h4 className="pm-h3" style={{ fontSize:14, margin:0 }}>Adversarial Breakdown</h4>
                {/* Bears/Bulls toggle preview */}
                <div style={{ display:'flex', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:8, padding:3, gap:3 }}>
                  {[{ label:'Bears (8)', color:'#f87171', active:true },{ label:'Bulls (4)', color:'#22c55e', active:false }].map(t=>(
                    <span key={t.label} style={{ padding:'4px 12px', borderRadius:6, fontSize:11, fontWeight:700, color:t.active?t.color:'rgba(255,255,255,0.35)', background:t.active?`${t.color}15`:'transparent' }}>{t.label}</span>
                  ))}
                </div>
              </div>
              {/* Scenario outcome pills */}
              <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
                {[
                  { label:'Bear Case', pct:55, color:'#f43f5e', bg:'rgba(244,63,94,0.08)', border:'rgba(244,63,94,0.2)' },
                  { label:'Base Case', pct:35, color:'#fbbf24', bg:'rgba(251,191,36,0.08)', border:'rgba(251,191,36,0.2)' },
                  { label:'Bull Case', pct:10, color:'#22c55e', bg:'rgba(34,197,94,0.08)', border:'rgba(34,197,94,0.2)' },
                ].map(sc => (
                  <div key={sc.label} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:8, background:sc.bg, border:`1px solid ${sc.border}` }}>
                    <span style={{ fontSize:11, fontWeight:700, color:sc.color }}>{sc.label}</span>
                    <span style={{ fontSize:12, fontWeight:900, color:sc.color, fontFamily:'Space Grotesk, sans-serif' }}>{sc.pct}%</span>
                  </div>
                ))}
              </div>
              <div className="lp-persona-preview pm-grid-2">
                {/* Live card */}
                <div style={{ borderRadius:14, border:'1px solid var(--bg-border-strong)', background:'var(--bg-elevated)', overflow:'hidden' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid var(--bg-border)' }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>
                      {DUMMY_REPORT.personas[0].icon}
                    </div>
                    <span style={{ fontWeight:700, fontSize:13, color:'var(--text-primary)' }}>{DUMMY_REPORT.personas[0].name}</span>
                  </div>
                  <div style={{ padding:16 }}>
                    {DUMMY_REPORT.personas[0].risks.slice(0,1).map((risk,ri) => (
                      <div key={ri}>
                        <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8 }}>
                          <span style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:999, color:'var(--risk-critical)', background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.25)', flexShrink:0 }}>{risk.severity}</span>
                          <span style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)' }}>{risk.title}</span>
                        </div>
                        <p style={{ color:'var(--text-secondary)', fontSize:11, lineHeight:1.7, marginBottom:10 }}>{risk.description.slice(0,85)}...</p>
                        <div style={{ padding:'8px 12px', borderRadius:9, background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.18)', display:'flex', gap:8 }}>
                          <svg width="12" height="12" fill="none" stroke="var(--success)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:1 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <p style={{ color:'var(--text-secondary)', fontSize:11, lineHeight:1.65 }}>{risk.mitigation.slice(0,60)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teaser */}
                <div style={{ borderRadius:14, border:'1px solid var(--accent-border)', background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:200, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, opacity:0.08 }}>
                    {[55,75,40,65].map((w,i)=>(
                      <div key={i} style={{ height:8, borderRadius:6, background:'var(--bg-border-strong)', width:`${w}%`, margin:'10px 14px' }}/>
                    ))}
                  </div>
                  <div style={{ position:'relative', textAlign:'center', padding:24 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(220,38,38,0.12)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                      <svg width="18" height="18" fill="none" stroke="var(--accent-bright)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>
                    </div>
                    <p style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)', marginBottom:5 }}>+ 11 more perspectives</p>
                    <p style={{ color:'var(--text-muted)', fontSize:11, marginBottom:16 }}>8 critics · 4 optimists · full debate</p>
                    <Link to="/submit" className="pm-btn-primary" style={{ fontSize:12, padding:'8px 18px', borderRadius:8 }}>
                      Analyze my startup
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="pm-section-divider"/>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section style={{ position:'relative', padding:'clamp(48px,8vw,96px) 0', overflow:'hidden', background:'rgba(220,38,38,0.02)', textAlign:'center' }}>
        <div style={{ position:'absolute', bottom:'-20%', left:'50%', transform:'translateX(-50%)', width:700, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(220,38,38,0.12) 0%,transparent 65%)', pointerEvents:'none', filter:'blur(40px)' }}/>
        <div className="pm-container" style={{ position:'relative', zIndex:1 }}>
          <h2 className="pm-h2" style={{ fontSize:'clamp(2rem,4.5vw,3.5rem)', marginBottom:20 }}>
            Your competitors are already thinking<br/>
            <span className="pm-gradient-text">about your weaknesses.</span>
          </h2>
          <p style={{ color:'var(--text-secondary)', fontSize:17, maxWidth:480, margin:'0 auto 36px', lineHeight:1.8 }}>
            Run your premortem today. Find the fatal flaws before the market does, and build something that actually survives.
          </p>
          <Link to="/submit" className="pm-btn-primary" style={{ fontSize:16, padding:'16px 40px', borderRadius:14 }}>
            Analyze My Startup — It's Free
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
          <p style={{ color:'var(--text-muted)', fontSize:12, marginTop:16 }}>No sign-up required · Free · 60 seconds</p>
        </div>
      </section>

      {/* Footer */}
      <div className="pm-section-divider"/>
      <footer style={{ background:'var(--bg-base)', padding:'clamp(28px,5vw,44px) 0', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="pm-container">
          {/* Top row */}
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:32, marginBottom:32 }}>
            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:30, height:30, borderRadius:9, background:'var(--accent-gradient)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 12px rgba(220,38,38,0.3)' }}>
                  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>
                </div>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, color:'var(--text-primary)' }}>Premortem AI</span>
              </div>
              <p style={{ color:'var(--text-muted)', fontSize:13, lineHeight:1.7, maxWidth:240, margin:0 }}>
                AI-powered startup failure analysis. Find the fatal flaws before the market does.
              </p>
            </div>
            {/* Links */}
            <div style={{ display:'flex', gap:48, flexWrap:'wrap' }}>
              <div>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', margin:'0 0 14px' }}>Product</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[{to:'/submit',label:'Analyze Idea'},{to:'/dashboard',label:'My Reports'}].map(({to,label})=>(
                    <Link key={to} to={to} style={{ color:'var(--text-secondary)', fontSize:13, textDecoration:'none', transition:'color 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                      onMouseLeave={e=>e.currentTarget.style.color='var(--text-secondary)'}
                    >{label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom bar */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <p style={{ color:'rgba(255,255,255,0.2)', fontSize:12, margin:0 }}>© 2025 Premortem AI · Built for founders who think ahead</p>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px rgba(34,197,94,0.6)' }}/>
              <span style={{ color:'rgba(255,255,255,0.25)', fontSize:11 }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
