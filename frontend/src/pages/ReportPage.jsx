import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';

const SEV_STYLE = {
  CRITICAL:{ color:'#f43f5e', bg:'rgba(244,63,94,0.12)',  border:'rgba(244,63,94,0.3)'  },
  HIGH:    { color:'#fb923c', bg:'rgba(251,146,60,0.12)', border:'rgba(251,146,60,0.3)' },
  MEDIUM:  { color:'#fbbf24', bg:'rgba(251,191,36,0.12)', border:'rgba(251,191,36,0.3)' },
  LOW:     { color:'#64748b', bg:'rgba(100,116,139,0.1)', border:'rgba(100,116,139,0.2)' },
};

function SevBadge({ severity }) {
  const s = severity?.toUpperCase();
  const st = SEV_STYLE[s] || SEV_STYLE.LOW;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:999, border:`1px solid ${st.border}`, background:st.bg, color:st.color, fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', flexShrink:0 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:st.color, boxShadow:`0 0 4px ${st.color}`, flexShrink:0 }}/>
      {severity}
    </span>
  );
}

function PersonaCard({ persona }) {
  const rank = { CRITICAL:4, HIGH:3, MEDIUM:2, LOW:1 };
  const max = persona.risks?.reduce((a,r)=>Math.max(a,rank[r.severity?.toUpperCase()]||1),0)||1;
  const ac = max===4?'#ff4757':max===3?'#ff7f3f':max===2?'#ffc048':'#9191a8';

  return (
    <div style={{ background:'var(--bg-surface)', border:'1px solid var(--bg-border)', borderRadius:16, overflow:'hidden', boxShadow:'var(--shadow-card)' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', borderBottom:'1px solid var(--bg-border)', background:'rgba(255,255,255,0.02)' }}>
        <div style={{ width:38, height:38, borderRadius:12, flexShrink:0, background:`${ac}15`, border:`1px solid ${ac}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
          {persona.icon}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'var(--text-primary)', margin:0, letterSpacing:'-0.01em' }}>{persona.name}</p>
          <p style={{ color:'var(--text-muted)', fontSize:11, margin:0 }}>{persona.risks?.length||0} risks identified</p>
        </div>
        <div style={{ width:4, height:32, borderRadius:999, background:`linear-gradient(180deg,${ac},${ac}44)`, boxShadow:`0 0 8px ${ac}60`, flexShrink:0 }}/>
      </div>
      {/* Risks */}
      {persona.risks?.map((risk,i) => (
        <div key={i} style={{ padding:20, borderBottom: i < persona.risks.length-1 ? '1px solid var(--bg-border)' : 'none' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
            <SevBadge severity={risk.severity}/>
            <p style={{ fontWeight:600, fontSize:14, color:'var(--text-primary)', margin:0, lineHeight:1.4, letterSpacing:'-0.01em' }}>{risk.title}</p>
          </div>
          <p style={{ color:'var(--text-secondary)', fontSize:13, lineHeight:1.75, marginBottom:14 }}>{risk.description}</p>
          <div style={{ padding:'12px 14px', borderRadius:12, background:'rgba(52,211,153,0.06)', border:'1px solid rgba(52,211,153,0.18)', display:'flex', gap:10 }}>
            <svg width="15" height="15" fill="none" stroke="var(--success)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:2 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--success)', marginBottom:4 }}>Suggested Fix</p>
              <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.75 }}>{risk.mitigation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ReportPage() {
  const location = useLocation();
  const report   = location.state?.report;

  if (!report) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'var(--bg-base)', fontFamily:'var(--font-body)' }}>
        <div style={{ textAlign:'center', maxWidth:380 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'var(--bg-elevated)', border:'1px solid var(--bg-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
            <svg width="26" height="26" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, color:'var(--text-primary)', marginBottom:8 }}>Report not found</h2>
          <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.7, marginBottom:24 }}>This link has expired. Open it from your reports dashboard.</p>
          <Link to="/dashboard" className="pm-btn-primary" style={{ display:'inline-flex' }}>Go to My Reports</Link>
        </div>
      </div>
    );
  }

  const risk       = report.overallRisk || 0;
  const riskLabel  = risk>70?'High Risk':risk>40?'Medium Risk':'Lower Risk';
  const riskColor  = risk>70?'#f43f5e':risk>40?'#fbbf24':'#34d399';
  const riskGlow   = risk>70?'rgba(244,63,94,0.25)':risk>40?'rgba(251,191,36,0.2)':'rgba(52,211,153,0.2)';

  const personaScores = (report.personas||[]).map(p=>{
    const rank={CRITICAL:4,HIGH:3,MEDIUM:2,LOW:1};
    const max=p.risks?.reduce((a,r)=>Math.max(a,rank[r.severity?.toUpperCase()]||1),0)||1;
    return { name:p.name.replace('The ',''), score:max, pct:max===4?100:max===3?75:max===2?50:25 };
  }).sort((a,b)=>b.score-a.score);

  const barColors=['#f43f5e','#fb923c','#fbbf24','#818cf8','#38bdf8','#34d399','#64748b'];

  return (
    <div style={{ minHeight:'100vh', paddingTop:64, background:'var(--bg-base)', color:'var(--text-primary)', fontFamily:'var(--font-body)' }}>
      {/* Ambient glow */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:`radial-gradient(ellipse 60% 40% at 50% -5%,${riskGlow} 0%,transparent 65%)`, opacity:0.5 }}/>

      {/* Breadcrumb */}
      <div style={{ position:'fixed', top:64, left:0, right:0, zIndex:50, background:'rgba(9,9,15,0.9)', borderBottom:'1px solid var(--bg-border)', backdropFilter:'blur(20px)' }}>
        <div className="pm-container" style={{ height:40, display:'flex', alignItems:'center', gap:10 }}>
          <Link to="/dashboard" style={{ color:'var(--text-muted)', fontSize:12, textDecoration:'none', display:'flex', alignItems:'center', gap:5, transition:'color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
            My Reports
          </Link>
          <svg width="13" height="13" fill="none" stroke="var(--bg-border-strong)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
          <span style={{ color:'var(--text-secondary)', fontSize:12 }}>{report.startup?.name} · {new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
        </div>
      </div>

      <div className="pm-container" style={{ paddingTop:56, paddingBottom:96, position:'relative' }}>

        {/* Header grid */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr)', gap:20, marginBottom:20 }}>

          {/* Info card */}
          <div className="pm-card" style={{ padding:28, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', padding:'5px 14px', borderRadius:999, color:riskColor, background:`${riskColor}15`, border:`1px solid ${riskColor}35` }}>{riskLabel}</span>
                <span style={{ color:'var(--text-muted)', fontSize:12, fontFamily:'var(--font-mono)' }}>{report.createdAt}</span>
              </div>
              <h1 style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'clamp(2rem,4vw,3rem)', letterSpacing:'-0.04em', color:'var(--text-primary)', marginBottom:14, lineHeight:1.05 }}>
                {report.startup?.name}
              </h1>
              <p style={{ color:'var(--text-secondary)', fontSize:15, lineHeight:1.75, maxWidth:520 }}>{report.startup?.idea}</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginTop:24, paddingTop:20, borderTop:'1px solid var(--bg-border)' }}>
              {[['Target Market',report.startup?.market],['Revenue Model',report.startup?.model],['Current Stage',report.startup?.stage]].map(([label,val])=>(
                <div key={label}>
                  <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:4 }}>{label}</p>
                  <p style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)', lineHeight:1.5 }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk score card */}
          <div className="pm-card" style={{ padding:28, display:'flex', flexDirection:'column' }}>
            <div style={{ marginBottom:24 }}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Overall Risk Score</p>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4 }}>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:72, color:riskColor, letterSpacing:'-0.06em', lineHeight:1, textShadow:`0 0 30px ${riskGlow}` }}>{risk}</span>
                <span style={{ fontSize:20, fontWeight:700, color:'var(--text-muted)', marginBottom:8 }}>/100</span>
              </div>
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:14 }}>Risk by Persona</p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {personaScores.map((p,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ color:'var(--text-secondary)', fontSize:11, fontWeight:500, flexShrink:0, width:72, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.name}</span>
                    <div className="pm-riskbar-track">
                      <div className="pm-riskbar-fill" style={{ width:`${p.pct}%`, background:`linear-gradient(90deg,${barColors[i]||'#7c6ff7'},${barColors[i]||'#7c6ff7'}88)`, boxShadow:`0 0 8px ${barColors[i]||'#7c6ff7'}60` }}/>
                    </div>
                    <span style={{ color:'var(--text-muted)', fontSize:10, fontFamily:'var(--font-mono)', flexShrink:0, width:26, textAlign:'right' }}>{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Historical precedents */}
        {report?.challengerPath && (
          <div className="pm-card" style={{ padding:28, marginBottom:20 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, letterSpacing:'-0.02em', color:'var(--text-primary)', marginBottom:24, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:10, background:'var(--accent-dim)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="15" height="15" fill="none" stroke="var(--accent-bright)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
              </div>
              Historical Precedents
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'200px 1fr', gap:32 }}>
              <div style={{ paddingRight:32, borderRight:'1px solid var(--bg-border)' }}>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:8 }}>Survival Rate</p>
                <p style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:52, color:'var(--accent-bright)', letterSpacing:'-0.04em', marginBottom:6 }}>{report.challengerPath.successRate||'—'}</p>
                <p style={{ color:'var(--text-secondary)', fontSize:13, lineHeight:1.6 }}>Of comparable startups survive beyond 3 years.</p>
              </div>
              <div>
                <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:16 }}>What tends to work in this space</p>
                <ul style={{ listStyle:'none', padding:0, margin:0, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {report.challengerPath.whatWorked?.map((item,i)=>(
                    <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, color:'var(--text-secondary)', fontSize:13, lineHeight:1.65 }}>
                      <svg width="15" height="15" fill="none" stroke="var(--success)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:2 }}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Adversarial breakdown */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, letterSpacing:'-0.025em', color:'var(--text-primary)', margin:0 }}>Adversarial Breakdown</h2>
          <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:999, border:'1px solid var(--bg-border-strong)', background:'var(--bg-elevated)', color:'var(--text-muted)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
            {report.personas?.length||0} Perspectives
          </span>
        </div>
        <div className="pm-columns-2">
          {report.personas?.map((persona,i)=>(
            <div key={i} className="pm-col-item">
              <PersonaCard persona={persona}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
