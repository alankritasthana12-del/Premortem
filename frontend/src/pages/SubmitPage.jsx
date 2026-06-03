import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { submitIdea } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const STEPS = [
  { label:'Reading your submission…',                  duration:2000 },
  { label:'Reviewing market & competition…',            duration:3500 },
  { label:'Investor: checking scale & fundability…',    duration:4500 },
  { label:'Customer: evaluating value & pricing…',      duration:4000 },
  { label:'Engineer: assessing technical risk…',        duration:3500 },
  { label:'Finance: modelling runway & burn…',          duration:3500 },
  { label:'Founder\'s Mirror: challenging the team…',   duration:4000 },
  { label:'Cross-referencing real failure cases…',      duration:3500 },
  { label:'Compiling your failure report…',             duration:2500 },
];

function LoadingScreen() {
  const [step, setStep]   = useState(0);
  const [pct,  setPct]    = useState(2);

  useEffect(() => {
    let elapsed = 0, si = 0;
    const total = STEPS.reduce((a,s)=>a+s.duration,0);
    const iv = setInterval(()=>{
      elapsed += 120;
      setPct(Math.min(Math.round(elapsed/total*100),96));
      let c = 0;
      for (let i=0;i<STEPS.length;i++) { c+=STEPS[i].duration; if(elapsed<c){if(i!==si){si=i;setStep(i);}break;} }
    },120);
    return ()=>clearInterval(iv);
  },[]);

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'var(--bg-base)', fontFamily:'var(--font-body)' }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        {/* Icon */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:32 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:'var(--accent-dim)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="30" height="30" fill="none" stroke="var(--accent-bright)" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .28 2.716-1.262 2.716H4.06c-1.542 0-2.262-1.716-1.261-2.716L4 15.3"/>
            </svg>
          </div>
        </div>

        <h2 style={{ textAlign:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:22, color:'var(--text-primary)', marginBottom:6, letterSpacing:'-0.02em' }}>Analyzing your startup</h2>
        <p style={{ textAlign:'center', color:'var(--text-secondary)', fontSize:14, marginBottom:32 }}>8 adversarial perspectives reviewing your idea</p>

        {/* Progress bar */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ color:'var(--text-secondary)', fontSize:12 }}>{STEPS[step]?.label}</span>
            <span style={{ color:'var(--accent-bright)', fontSize:12, fontWeight:700 }}>{pct}%</span>
          </div>
          <div className="pm-progress-track">
            <div className="pm-progress-fill" style={{ width:`${pct}%` }}/>
          </div>
        </div>

        {/* Step list */}
        <div style={{ background:'var(--bg-surface)', border:'1px solid var(--bg-border)', borderRadius:16, padding:20, display:'flex', flexDirection:'column', gap:12 }}>
          {STEPS.map((s,i) => {
            const done=i<step, active=i===step;
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                {done ? (
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(46,204,113,0.15)', border:'1px solid rgba(46,204,113,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="10" height="10" fill="none" stroke="var(--success)" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  </div>
                ) : active ? (
                  <div style={{ width:20, height:20, borderRadius:'50%', background:'var(--accent-dim)', border:'1px solid var(--accent-border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:'var(--accent)', animation:'blink 1.5s infinite' }}/>
                  </div>
                ) : (
                  <div style={{ width:20, height:20, borderRadius:'50%', border:'1px solid var(--bg-border-strong)', flexShrink:0 }}/>
                )}
                <span style={{ fontSize:12, color: done?'var(--success)':active?'var(--text-primary)':'var(--text-muted)', fontWeight:active?500:400, transition:'color 0.3s' }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:12, marginTop:16 }}>Usually takes 20–40 seconds</p>
      </div>
    </div>
  );
}

const FIELDS = [
  { name:'name',        label:'Startup Name',              hint:'What is your startup called?',                              placeholder:'e.g. Airbnb, Dropbox, Stripe',                 type:'input' },
  { name:'idea',        label:'What does it do?',          hint:'Explain your startup and the problem it solves.',           placeholder:'e.g. We help landlords manage short-term rental properties without needing an agency…', type:'textarea', rows:4 },
  { name:'market',      label:'Who is it for?',            hint:'Describe your target customer — be specific.',              placeholder:'e.g. First-time landlords in metro cities who own 1–3 properties',  type:'input' },
  { name:'model',       label:'How do you make money?',    hint:'Describe your revenue model.',                             placeholder:'e.g. 15% commission on every booking',           type:'input' },
  { name:'competitors', label:'Who are your competitors?', hint:'Who else is solving this problem, directly or indirectly?', placeholder:'e.g. Airbnb, Vrbo, local property management agencies', type:'input' },
];
const STAGES = [
  { value:'Idea',       label:'Idea — I have a concept but no product yet' },
  { value:'Validation', label:'Validation — I am talking to potential customers' },
  { value:'Building',   label:'Building — I am actively developing the product' },
  { value:'Live',       label:'Live — The product is launched and running' },
];

export default function SubmitPage() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [loading, setLoading]   = useState(false);
  const [formData, setFormData] = useState({ name:'', idea:'', market:'', model:'', competitors:'', stage:'Idea' });
  const [focused, setFocused]   = useState(null);

  const handle = (e) => setFormData(p=>({...p,[e.target.name]:e.target.value}));

  const submit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const payload = { ...formData };
      if (user) payload.user_id = user.id;
      const result = await submitIdea(payload);
      const hist = JSON.parse(localStorage.getItem('premortem_history')||'[]');
      hist.unshift(result);
      localStorage.setItem('premortem_history', JSON.stringify(hist));
      navigate(`/report/${result.id}`,{ state:{ report:result } });
    } catch(err) { console.error(err); setLoading(false); }
  };

  if (loading) return <LoadingScreen/>;

  const inputStyle = (name) => ({
    width:'100%', padding:'11px 14px',
    background: focused===name ? 'var(--bg-overlay)' : 'var(--bg-elevated)',
    border:`1px solid ${focused===name ? 'var(--accent)' : 'var(--bg-border-strong)'}`,
    boxShadow: focused===name ? 'var(--accent-glow-sm)' : 'none',
    borderRadius:10, color:'var(--text-primary)', fontFamily:'var(--font-body)',
    fontSize:14, lineHeight:1.6, outline:'none', transition:'all 0.2s',
    resize:'vertical',
  });

  return (
    <div style={{ minHeight:'100vh', paddingTop:64, background:'var(--bg-base)', color:'var(--text-primary)', fontFamily:'var(--font-body)' }}>
      {/* ambient */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse 70% 50% at 50% -10%,rgba(124,111,247,0.08) 0%,transparent 65%)' }}/>

      <div className="pm-container" style={{ paddingTop:48, paddingBottom:96, position:'relative' }}>

        {/* Back link */}
        <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--text-muted)', fontSize:12, textDecoration:'none', marginBottom:32, transition:'color 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.color='var(--text-primary)'}
          onMouseLeave={e=>e.currentTarget.style.color='var(--text-muted)'}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          Back to home
        </Link>

        <div className="pm-label">Stress Test</div>
        <h1 className="pm-h1" style={{ fontSize:'clamp(1.9rem,3.5vw,2.8rem)', marginBottom:12 }}>Analyze your startup</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:16, lineHeight:1.75, maxWidth:480, marginBottom:40 }}>
          The more honest and specific you are, the sharper your report will be.
        </p>

        {/* 2-col layout */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr)', gap:28, alignItems:'start' }}>

          {/* Form */}
          <form onSubmit={submit}>
            <div className="pm-card" style={{ padding:28, marginBottom:16 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
                {FIELDS.map(f=>(
                  <div key={f.name}>
                    <label style={{ display:'block', fontWeight:600, fontSize:14, color:'var(--text-primary)', marginBottom:4 }}>{f.label}</label>
                    {f.hint && <p style={{ color:'var(--text-muted)', fontSize:12, lineHeight:1.6, marginBottom:8 }}>{f.hint}</p>}
                    {f.type==='textarea'
                      ? <textarea name={f.name} value={formData[f.name]} onChange={handle} required rows={f.rows} placeholder={f.placeholder} style={inputStyle(f.name)} onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused(null)}/>
                      : <input type="text" name={f.name} value={formData[f.name]} onChange={handle} required placeholder={f.placeholder} style={inputStyle(f.name)} onFocus={()=>setFocused(f.name)} onBlur={()=>setFocused(null)}/>
                    }
                  </div>
                ))}
                <div>
                  <label style={{ display:'block', fontWeight:600, fontSize:14, color:'var(--text-primary)', marginBottom:4 }}>What stage are you at?</label>
                  <p style={{ color:'var(--text-muted)', fontSize:12, lineHeight:1.6, marginBottom:8 }}>Be honest — this affects the type of risks we highlight.</p>
                  <select name="stage" value={formData.stage} onChange={handle} required style={{ ...inputStyle('stage'), cursor:'pointer' }} onFocus={()=>setFocused('stage')} onBlur={()=>setFocused(null)}>
                    {STAGES.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" className="pm-btn-primary" style={{ width:'100%', justifyContent:'center', padding:'15px 28px', fontSize:15 }}>
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .28 2.716-1.262 2.716H4.06c-1.542 0-2.262-1.716-1.261-2.716L4 15.3"/></svg>
              Analyze My Startup
            </button>
            <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:12, marginTop:10 }}>Takes 20–40 seconds · Results stay private</p>
          </form>

          {/* Sidebar */}
          <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:80 }}>
            {/* Coverage */}
            <div className="pm-card" style={{ padding:22 }}>
              <p style={{ fontWeight:600, fontSize:14, color:'var(--text-primary)', fontFamily:'var(--font-display)', marginBottom:16 }}>What the analysis covers</p>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:10 }}>
                {['Is your market large enough?','Can competitors copy or kill you?','Will customers actually pay?','Are there legal landmines?','Can the product be built & scaled?','Is the macro timing right?','Will you run out of money first?'].map((pt,i)=>(
                  <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, color:'var(--text-secondary)', fontSize:12, lineHeight:1.65 }}>
                    <svg width="15" height="15" fill="none" stroke="var(--accent-bright)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:1 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            {/* Tip */}
            <div style={{ background:'var(--accent-dim)', border:'1px solid var(--accent-border)', borderRadius:16, padding:20 }}>
              <p style={{ fontWeight:700, fontSize:12, color:'var(--accent-bright)', marginBottom:8 }}>💡 Tip for better results</p>
              <p style={{ color:'var(--text-secondary)', fontSize:12, lineHeight:1.75 }}>
                Describe your idea as if you're explaining it to a smart friend who has never heard of it. Specific details produce sharper analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
