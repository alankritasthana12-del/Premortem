import React from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_REPORT } from '../lib/dummyData';

const personas = [
  { icon:'💼', name:'The Investor',         copy:'Is your market big enough? Can this scale to a venture-scale outcome?' },
  { icon:'🏁', name:'The Competitor',       copy:'What stops an existing player from copying or crushing you tomorrow?' },
  { icon:'🙋', name:'The Customer',         copy:'Do people want this? Will they pay and change their behaviour?' },
  { icon:'⚖️', name:'The Regulator',        copy:'Are there legal or compliance landmines hiding in your model?' },
  { icon:'🔧', name:'The Engineer',         copy:'Can you actually build this? What breaks at scale?' },
  { icon:'📊', name:'The Economist',        copy:'Is the macro timing right? Are market-readiness risks working against you?' },
  { icon:'🧾', name:'The Finance Lead',     copy:'Will you run out of money before finding product-market fit?' },
  { icon:'🪞', name:"The Founder's Mirror", copy:'Are YOU the right person to build this? Domain expertise, network, and grit.' },
];

const stats = [
  { value:'8',   suffix:'',  label:'Expert Perspectives' },
  { value:'50',  suffix:'+', label:'Startup Failure Cases' },
  { value:'30',  suffix:'s', label:'Second Analysis' },
  { value:'100', suffix:'+', label:'Risk Categories' },
];

const steps = [
  { num:'01', icon:'✏️', title:'Describe your idea',      body:'Tell us your startup name, concept, target market, and stage. Takes about 60 seconds.' },
  { num:'02', icon:'👥', title:'8 critics review it',     body:'Eight AI-powered adversarial experts stress-test your concept — including the hardest question: are you the right founder?' },
  { num:'03', icon:'📋', title:'Get your failure report', body:'Every risk ranked by severity with concrete fixes grounded in real startup failures.' },
];

/* Reusable ambient section background */
const sectionGlow = (color = 'rgba(79,114,255,0.06)') => ({
  position: 'absolute', inset: 0, pointerEvents: 'none',
  background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${color} 0%, transparent 70%)`,
});

export default function LandingPage() {
  return (
    <div style={{ background:'var(--bg-base)', color:'var(--text-primary)', fontFamily:'var(--font-body)', paddingTop:64 }}>

      {/* ════════════════ HERO ════════════════ */}
      <section style={{ position:'relative', overflow:'hidden', minHeight:'92vh', display:'flex', flexDirection:'column', justifyContent:'center' }}>

        {/* ── Background: Line grid ── */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(79,114,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(79,114,255,0.08) 1px,transparent 1px)',
          backgroundSize:'72px 72px',
          maskImage:'radial-gradient(ellipse 110% 80% at 50% 0%, black 0%, transparent 85%)',
          WebkitMaskImage:'radial-gradient(ellipse 110% 80% at 50% 0%, black 0%, transparent 85%)',
        }}/>

        {/* ── Background: Large central glow blob ── */}
        <div style={{
          position:'absolute', top:'-25%', left:'50%', transform:'translateX(-50%)',
          width:1000, height:700, borderRadius:'50%', pointerEvents:'none',
          background:'radial-gradient(ellipse, rgba(79,114,255,0.22) 0%, rgba(139,92,246,0.12) 35%, transparent 70%)',
          filter:'blur(60px)',
        }}/>

        {/* ── Background: Cyan orb top-right ── */}
        <div style={{
          position:'absolute', top:'5%', right:'-8%',
          width:400, height:400, borderRadius:'50%', pointerEvents:'none',
          background:'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
          filter:'blur(50px)',
        }}/>

        {/* ── Background: Violet orb bottom-left ── */}
        <div style={{
          position:'absolute', bottom:'0%', left:'-5%',
          width:350, height:350, borderRadius:'50%', pointerEvents:'none',
          background:'radial-gradient(circle, rgba(192,132,252,0.1) 0%, transparent 70%)',
          filter:'blur(50px)',
        }}/>

        {/* ── Background: Horizontal glowing bar ── */}
        <div style={{
          position:'absolute', top:'60%', left:'50%', transform:'translateX(-50%)',
          width:'80%', height:1, pointerEvents:'none',
          background:'linear-gradient(90deg, transparent, rgba(79,114,255,0.25), rgba(139,92,246,0.2), rgba(56,189,248,0.2), transparent)',
        }}/>

        <div className="pm-container" style={{ paddingTop:80, paddingBottom:80, textAlign:'center', position:'relative', zIndex:1 }}>

          {/* ── 3-line Headline ── */}
          <h1 className="pm-h1" style={{ fontSize:'clamp(3rem,6.5vw,5.5rem)', marginBottom:24, lineHeight:1.06 }}>
            Discover why your<br/>
            startup <span className="pm-gradient-text">will fail</span><br/>
            — before you build it.
          </h1>

          {/* Subheadline */}
          <p style={{ color:'var(--text-secondary)', fontSize:17.5, lineHeight:1.8, maxWidth:540, margin:'0 auto 38px', fontWeight:400 }}>
            Describe your startup. Eight AI-powered adversarial experts stress-test it from every critical angle and hand you a prioritised failure report in under 30 seconds.
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
        <div style={{ position:'relative', zIndex:1, borderTop:'1px solid rgba(79,114,255,0.12)', borderBottom:'1px solid rgba(79,114,255,0.12)', background:'rgba(79,114,255,0.03)' }}>
          <div className="pm-container">
            <div className="pm-grid-4" style={{ padding:'28px 0' }}>
              {stats.map((s,i) => (
                <div key={i} style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:40, letterSpacing:'-0.04em', lineHeight:1, marginBottom:6 }}>
                    <span className="pm-gradient-text">{s.value}</span>
                    <span style={{ color:'var(--cyan)', fontSize:24 }}>{s.suffix}</span>
                  </div>
                  <div style={{ color:'var(--text-muted)', fontSize:11, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section style={{ position:'relative', padding:'96px 0', overflow:'hidden' }}>
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
      <section style={{ position:'relative', padding:'96px 0', overflow:'hidden', background:'rgba(79,114,255,0.025)' }}>
        <div style={sectionGlow('rgba(139,92,246,0.07)')}/>
        <div className="pm-container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24, marginBottom:48 }}>
            <div>
              <div className="pm-label">The Review Panel</div>
              <h2 className="pm-h2" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)' }}>
                Eight critics.<br/>Every blind spot covered.
              </h2>
            </div>
            <p style={{ color:'var(--text-secondary)', fontSize:14, maxWidth:280, lineHeight:1.75 }}>
              Each perspective asks a different set of hard questions — so nothing slips through the cracks.
            </p>
          </div>

          <div className="pm-grid-4">
            {personas.map((p,i) => {
              const isLast = i === personas.length - 1;
              return (
                <div key={i} className="pm-card pm-card-hover"
                  style={{
                    padding:22, position:'relative', overflow:'hidden',
                    ...(isLast ? { background:'linear-gradient(135deg,rgba(79,114,255,0.12) 0%,rgba(139,92,246,0.08) 100%)', borderColor:'var(--accent-border)' } : {}),
                  }}
                >
                  {isLast && (
                    <>
                      {/* Special "most important" glow */}
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'var(--accent-gradient)', opacity:0.8 }}/>
                      <div style={{ position:'absolute', top:10, right:12, fontSize:9, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--cyan)', background:'rgba(56,189,248,0.1)', border:'1px solid rgba(56,189,248,0.25)', padding:'2px 8px', borderRadius:999 }}>
                        Key
                      </div>
                    </>
                  )}
                  <div style={{ fontSize:26, marginBottom:14 }}>{p.icon}</div>
                  <div className="pm-h3" style={{ fontSize:14, marginBottom:8 }}>{p.name}</div>
                  <p style={{ color:'var(--text-secondary)', fontSize:12, lineHeight:1.7 }}>{p.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="pm-section-divider"/>

      {/* ════════════════ SAMPLE REPORT ════════════════ */}
      <section id="sample-report" style={{ position:'relative', padding:'96px 0', overflow:'hidden', scrollMarginTop:80 }}>
        <div style={sectionGlow('rgba(79,114,255,0.06)')}/>
        <div className="pm-container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:24, marginBottom:36 }}>
            <div>
              <div className="pm-label">Sample Output</div>
              <h2 className="pm-h2" style={{ fontSize:'clamp(1.8rem,3.5vw,2.8rem)' }}>
                Here's what a real report looks like.
              </h2>
            </div>
            <Link to="/submit" style={{ color:'var(--cyan)', fontSize:14, fontWeight:600, textDecoration:'none', transition:'color 0.2s' }}
              onMouseEnter={e=>e.target.style.color='var(--text-primary)'}
              onMouseLeave={e=>e.target.style.color='var(--cyan)'}
            >
              Generate yours →
            </Link>
          </div>

          {/* Report preview */}
          <div className="pm-card" style={{ overflow:'hidden' }}>
            {/* Top accent bar */}
            <div style={{ height:3, background:'var(--accent-gradient)' }}/>

            {/* Header */}
            <div style={{ padding:32, borderBottom:'1px solid var(--bg-border)' }}>
              <div style={{ display:'flex', gap:28, flexWrap:'wrap', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ flex:1, minWidth:260 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:'5px 14px', borderRadius:999, color:'var(--risk-critical)', background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.25)', letterSpacing:'0.06em', textTransform:'uppercase' }}>High Risk</span>
                    <span style={{ color:'var(--text-muted)', fontSize:12 }}>· {DUMMY_REPORT.createdAt}</span>
                  </div>
                  <h3 className="pm-h2" style={{ fontSize:28, marginBottom:10 }}>{DUMMY_REPORT.startup.name}</h3>
                  <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.75 }}>{DUMMY_REPORT.startup.idea?.slice(0,90)}...</p>
                </div>
                {/* Score */}
                <div style={{ padding:'20px 28px', borderRadius:16, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)', textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:56, color:'var(--risk-critical)', letterSpacing:'-0.05em', lineHeight:1 }}>{DUMMY_REPORT.overallRisk}</div>
                  <div style={{ color:'var(--text-muted)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginTop:6 }}>Risk Score</div>
                </div>
              </div>

              {/* Risk bars */}
              <div style={{ marginTop:28 }}>
                <p style={{ color:'var(--text-muted)', fontSize:10, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:14 }}>Risk Distribution by Persona</p>
                <div style={{ maxWidth:500 }}>
                  {[
                    { name:'The Investor',         pct:100, color:'#f43f5e' },
                    { name:"Founder's Mirror",      pct:88,  color:'#e879f9' },
                    { name:'The Customer',          pct:72,  color:'#fb923c' },
                    { name:'The Competitor',        pct:55,  color:'#fbbf24' },
                    { name:'The Regulator',         pct:35,  color:'#818cf8' },
                  ].map((bar,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                      <span style={{ color:'var(--text-secondary)', fontSize:11, fontWeight:500, width:130, flexShrink:0 }}>{bar.name}</span>
                      <div className="pm-riskbar-track">
                        <div className="pm-riskbar-fill" style={{ width:`${bar.pct}%`, background:`linear-gradient(90deg,${bar.color},${bar.color}88)`, boxShadow:`0 0 8px ${bar.color}55` }}/>
                      </div>
                      <span style={{ color:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)', flexShrink:0, width:28, textAlign:'right' }}>{bar.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Persona preview */}
            <div style={{ padding:32 }}>
              <h4 className="pm-h3" style={{ fontSize:15, marginBottom:20 }}>Adversarial Breakdown</h4>
              <div className="pm-grid-2">
                {/* Live card */}
                <div style={{ borderRadius:14, border:'1px solid var(--bg-border-strong)', background:'var(--bg-elevated)', overflow:'hidden' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px', borderBottom:'1px solid var(--bg-border)' }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:'var(--accent-dim)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
                      {DUMMY_REPORT.personas[0].icon}
                    </div>
                    <span style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>{DUMMY_REPORT.personas[0].name}</span>
                  </div>
                  <div style={{ padding:18 }}>
                    {DUMMY_REPORT.personas[0].risks.slice(0,1).map((risk,ri) => (
                      <div key={ri}>
                        <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:10 }}>
                          <span style={{ fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:999, color:'var(--risk-critical)', background:'rgba(244,63,94,0.1)', border:'1px solid rgba(244,63,94,0.25)', flexShrink:0 }}>{risk.severity}</span>
                          <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>{risk.title}</span>
                        </div>
                        <p style={{ color:'var(--text-secondary)', fontSize:12, lineHeight:1.7, marginBottom:12 }}>{risk.description.slice(0,90)}...</p>
                        <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.18)', display:'flex', gap:10 }}>
                          <svg width="14" height="14" fill="none" stroke="var(--success)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:2 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <p style={{ color:'var(--text-secondary)', fontSize:12, lineHeight:1.65 }}>{risk.mitigation.slice(0,65)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teaser */}
                <div style={{ borderRadius:14, border:'1px solid var(--accent-border)', background:'var(--accent-dim)', display:'flex', alignItems:'center', justifyContent:'center', minHeight:200, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', inset:0, opacity:0.1 }}>
                    {[55,75,40,65].map((w,i)=>(
                      <div key={i} style={{ height:10, borderRadius:6, background:'var(--bg-border-strong)', width:`${w}%`, margin:'12px 16px' }}/>
                    ))}
                  </div>
                  <div style={{ position:'relative', textAlign:'center', padding:28 }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(79,114,255,0.15)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                      <svg width="20" height="20" fill="none" stroke="var(--accent-bright)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>
                    </div>
                    <p style={{ fontWeight:700, fontSize:15, color:'var(--text-primary)', marginBottom:6 }}>+ 7 more critics</p>
                    <p style={{ color:'var(--text-muted)', fontSize:12, marginBottom:18 }}>Each with unique risks & fixes</p>
                    <Link to="/submit" className="pm-btn-primary" style={{ fontSize:12, padding:'9px 20px', borderRadius:9 }}>
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
      <section style={{ position:'relative', padding:'96px 0', overflow:'hidden', background:'rgba(79,114,255,0.03)', textAlign:'center' }}>
        <div style={{ position:'absolute', bottom:'-20%', left:'50%', transform:'translateX(-50%)', width:700, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(79,114,255,0.1) 0%,transparent 65%)', pointerEvents:'none', filter:'blur(40px)' }}/>
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
      <footer style={{ background:'var(--bg-base)', padding:'28px 0' }}>
        <div className="pm-container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:8, background:'var(--accent-gradient)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg>
            </div>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'var(--text-primary)' }}>Premortem</span>
            <span style={{ color:'var(--text-muted)', fontSize:12 }}>· AI-powered failure analysis</span>
          </div>
          <div style={{ display:'flex', gap:24 }}>
            {[{to:'/submit',label:'Analyze'},{to:'/dashboard',label:'My Reports'}].map(({to,label})=>(
              <Link key={to} to={to} style={{ color:'var(--text-muted)', fontSize:13, textDecoration:'none', transition:'color 0.2s' }}
                onMouseEnter={e=>e.target.style.color='var(--text-primary)'}
                onMouseLeave={e=>e.target.style.color='var(--text-muted)'}
              >{label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
