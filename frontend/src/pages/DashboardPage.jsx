import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const getRisk = (score) => {
  if (score>70) return { label:'High Risk',   color:'#f43f5e', bg:'rgba(244,63,94,0.1)',   border:'rgba(244,63,94,0.25)'  };
  if (score>40) return { label:'Medium Risk',  color:'#fbbf24', bg:'rgba(251,191,36,0.1)',  border:'rgba(251,191,36,0.25)' };
  return            { label:'Lower Risk',   color:'#34d399', bg:'rgba(52,211,153,0.1)', border:'rgba(52,211,153,0.25)' };
};
const TIER_COLOR = { A:'#22c55e', B:'#86efac', C:'#fbbf24', D:'#fb923c', F:'#f43f5e' };
const getTier = (report) => {
  if (report.startupTier) return report.startupTier;
  const s = report.successProbability;
  if (!s) return null;
  return s>=40?'A':s>=25?'B':s>=12?'C':s>=5?'D':'F';
};

export default function DashboardPage() {
  const [history,  setHistory]  = useState([]);
  const [fetching, setFetching] = useState(true);
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const load = async () => {
        setFetching(true);
        try {
          const BASE = import.meta.env.VITE_API_URL||'https://premortem-backend.onrender.com';
          const res = await fetch(`${BASE}/analyze/history/${user.id}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          setHistory(!data||data.length===0
            ? JSON.parse(localStorage.getItem('premortem_history')||'[]')
            : data.map(d=>d.report_payload||d.report_data));
        } catch {
          setHistory(JSON.parse(localStorage.getItem('premortem_history')||'[]'));
        } finally { setFetching(false); }
      };
      load();
    } else if (!loading) { setFetching(false); setHistory([]); }
  },[user,loading]);

  const clearHistory = async () => {
    if (!window.confirm('Clear all saved reports? This cannot be undone.')) return;
    if (user) await supabase.from('reports').delete().eq('user_id',user.id);
    localStorage.removeItem('premortem_history');
    setHistory([]);
  };

  return (
    <div style={{ minHeight:'100vh', paddingTop:64, background:'var(--bg-base)', color:'var(--text-primary)', fontFamily:'var(--font-body)' }}>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 70% 40% at 50% -5%,rgba(220,38,38,0.07) 0%,transparent 65%)' }}/>

      <div className="pm-container" style={{ paddingTop:48, paddingBottom:96, position:'relative' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:24, marginBottom:40, flexWrap:'wrap' }}>
          <div>
            <div className="pm-label">My Reports</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'clamp(1.8rem,3vw,2.4rem)', letterSpacing:'-0.035em', lineHeight:1.15, color:'var(--text-primary)', margin:'0 0 6px' }}>
              {user ? `${user.user_metadata?.full_name?.split(' ')[0]||'Your'}'s Dashboard` : 'My Reports'}
            </h1>
            <p style={{ color:'var(--text-secondary)', fontSize:14 }}>
              {fetching ? 'Loading your reports…'
               : history.length===0 ? 'No analyses saved yet.'
               : `${history.length} analysis${history.length===1?'':'es'} saved to your account`}
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:8 }}>
            {history.length>0 && (
              <button onClick={clearHistory} style={{ fontSize:12, fontWeight:500, padding:'8px 14px', borderRadius:10, border:'1px solid var(--bg-border)', background:'transparent', color:'var(--text-muted)', cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--font-body)' }}
                onMouseEnter={e=>{e.currentTarget.style.color='#ff4757';e.currentTarget.style.borderColor='rgba(255,71,87,0.3)';}}
                onMouseLeave={e=>{e.currentTarget.style.color='var(--text-muted)';e.currentTarget.style.borderColor='var(--bg-border)';}}
              >Clear all</button>
            )}
            <Link to="/submit" className="pm-btn-primary" style={{ padding:'10px 20px', fontSize:14 }}>
              <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              New Analysis
            </Link>
          </div>
        </div>

        {/* States */}
        {loading||fetching ? (
          <div style={{ paddingTop:120, paddingBottom:120, display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', border:'2px solid var(--accent)', borderTopColor:'transparent', animation:'spinSlow 0.8s linear infinite' }}/>
            <p style={{ color:'var(--text-muted)', fontSize:14 }}>Loading your reports…</p>
          </div>

        ) : !user ? (
          <div style={{ background:'var(--bg-surface)', border:'1px solid var(--bg-border)', borderRadius:24, padding:'clamp(40px,8vw,80px) clamp(20px,5vw,40px)', textAlign:'center', maxWidth:520, margin:'0 auto' }}>
            <div style={{ width:60, height:60, borderRadius:18, background:'var(--accent-dim)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
              <svg width="28" height="28" fill="none" stroke="var(--accent-bright)" strokeWidth="1.75" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, color:'var(--text-primary)', marginBottom:10, letterSpacing:'-0.02em' }}>Sign in to view your history</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.75, maxWidth:360, margin:'0 auto 28px' }}>Your stress tests are saved securely to your account. Sign in to access your failure reports anytime.</p>
            <button
              onClick={()=>signInWithGoogle(window.location.pathname)}
              style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'12px 24px', borderRadius:12, border:'1px solid var(--bg-border-strong)', background:'rgba(255,255,255,0.04)', color:'var(--text-primary)', fontSize:14, fontWeight:600, cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--font-body)' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.borderColor='var(--accent-border)';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.borderColor='var(--bg-border-strong)';}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

        ) : history.length===0 ? (
          <div style={{ background:'var(--bg-surface)', border:'2px dashed var(--bg-border-strong)', borderRadius:24, padding:'clamp(40px,8vw,80px) clamp(20px,5vw,40px)', textAlign:'center' }}>
            <div style={{ width:60, height:60, borderRadius:18, background:'var(--bg-elevated)', border:'1px solid var(--bg-border-strong)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
              <svg width="28" height="28" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>
            </div>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:'var(--text-primary)', marginBottom:8 }}>No reports yet</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:14, lineHeight:1.7, marginBottom:24 }}>Run your first startup analysis and it will appear here.</p>
            <Link to="/submit" className="pm-btn-primary">
              Analyze my startup
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </Link>
          </div>

        ) : (
          /* Grid */
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(300px,100%),1fr))', gap:18 }}>
            {history.map((report,idx)=>{
              const risk=getRisk(report.overallRisk||0);
              const rankMap={CRITICAL:4,HIGH:3,MEDIUM:2,LOW:1};
              return (
                <div
                  key={report.id||idx}
                  onClick={()=>navigate(`/report/${report.id}`,{state:{report}})}
                  className="pm-card pm-card-hover"
                  style={{ padding:22, position:'relative', overflow:'hidden', cursor:'pointer' }}
                >
                  {/* Subtle hover glow */}
                  <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 0%,${risk.bg.replace('0.1','0.06')} 0%,transparent 70%)`, pointerEvents:'none', opacity:0, transition:'opacity 0.3s' }}
                    onMouseEnter={e=>e.target.style.opacity=1}
                  />

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:999, color:risk.color, background:risk.bg, border:`1px solid ${risk.border}`, letterSpacing:'0.06em', textTransform:'uppercase' }}>{risk.label}</span>
                      {/* Tier badge */}
                      {getTier(report) && (
                        <span style={{ fontSize:11, fontWeight:800, padding:'3px 9px', borderRadius:8, color:TIER_COLOR[getTier(report)]||'#64748b', background:`${TIER_COLOR[getTier(report)]||'#64748b'}18`, border:`1px solid ${TIER_COLOR[getTier(report)]||'#64748b'}40`, letterSpacing:'0.05em' }}>Tier {getTier(report)}</span>
                      )}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      {report.successProbability != null && (
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:1 }}>Success</div>
                          <div style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:17, color:'#22c55e', letterSpacing:'-0.03em', lineHeight:1 }}>{report.successProbability}%</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:1 }}>Risk</div>
                        <div style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:900, fontSize:17, color:risk.color, letterSpacing:'-0.03em', lineHeight:1 }}>{report.overallRisk||0}</div>
                      </div>
                    </div>
                  </div>

                  <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, color:'var(--text-primary)', marginBottom:6, letterSpacing:'-0.015em', lineHeight:1.3 }}>
                    {report.startup?.name||'Unnamed Startup'}
                  </h2>
                  <p className="pm-clamp-2" style={{ color:'var(--text-secondary)', fontSize:12, lineHeight:1.7, marginBottom:16 }}>
                    {report.startup?.idea||report.startup?.market||'—'}
                  </p>

                  {/* Mini risk bars — bears only */}
                  {report.personas && (
                    <div style={{ display:'flex', gap:3, height:5, marginBottom:16 }}>
                      {report.personas.filter(p=>p.stance==='bear'||!p.stance).slice(0,8).map((p,pi)=>{
                        const sev=p.risks?.reduce((a,r)=>Math.max(a,rankMap[r.severity?.toUpperCase()]||1),0)||1;
                        const c=sev===4?'#f43f5e':sev===3?'#fb923c':sev===2?'#fbbf24':'rgba(255,255,255,0.1)';
                        return <div key={pi} style={{ flex:1, borderRadius:999, background:c, boxShadow:sev>2?`0 0 6px ${c}80`:'' }}/>;
                      })}
                    </div>
                  )}

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:14, borderTop:'1px solid var(--bg-border)' }}>
                    <span style={{ color:'var(--text-muted)', fontSize:11 }}>{report.createdAt||'Recent'}</span>
                    <span style={{ color:'var(--accent-bright)', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                      View report
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
