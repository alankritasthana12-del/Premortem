import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { submitIdea } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const STEPS = [
  { label:'Reading your submission…',                        duration:2000, phase:'prep',  icon:'📋' },
  { label:'Scoring 10 startup dimensions…',                  duration:3000, phase:'prep',  icon:'📐' },
  { label:'Investor — scale & fundability…',                 duration:3500, phase:'bear',  icon:'💼' },
  { label:'Competitor — replication risk…',                  duration:3000, phase:'bear',  icon:'🏁' },
  { label:'Customer — value & willingness to pay…',          duration:3500, phase:'bear',  icon:'🙋' },
  { label:'Regulator — legal & compliance risk…',            duration:3000, phase:'bear',  icon:'⚖️' },
  { label:'Engineer — technical & build risk…',              duration:3000, phase:'bear',  icon:'🔧' },
  { label:'Economist — macro & timing risk…',                duration:3000, phase:'bear',  icon:'📊' },
  { label:'Finance — runway & burn rate…',                   duration:3000, phase:'bear',  icon:'🧾' },
  { label:'Founder Mirror — team critique…',                 duration:3500, phase:'bear',  icon:'🪞' },
  { label:'Opportunity analyst — why this wins…',           duration:3000, phase:'bull',  icon:'🚀' },
  { label:'Early adopter lens — first customers…',          duration:3000, phase:'bull',  icon:'⭐' },
  { label:'Market optimist — tailwinds & timing…',          duration:3000, phase:'bull',  icon:'📈' },
  { label:'Growth operator — distribution channels…',       duration:3000, phase:'bull',  icon:'⚡' },
  { label:'Benchmarking against real companies…',            duration:2500, phase:'synth', icon:'🔍' },
  { label:'Building your action plan…',                      duration:2000, phase:'synth', icon:'🎯' },
  { label:'Compiling intelligence report…',                  duration:2000, phase:'synth', icon:'📊' },
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

  const phaseColor = { prep:'#64748b', bear:'#f43f5e', bull:'#22c55e', synth:'#fbbf24' };
  const currentPhase = STEPS[step]?.phase || 'prep';
  const bearsDone  = STEPS.filter((s,i) => i < step && s.phase === 'bear').length;
  const bullsDone  = STEPS.filter((s,i) => i < step && s.phase === 'bull').length;
  const totalBears = STEPS.filter(s => s.phase === 'bear').length;
  const totalBulls = STEPS.filter(s => s.phase === 'bull').length;

  return (
    <div style={{ minHeight:'100vh', paddingTop:80, paddingBottom:48, display:'flex', alignItems:'center', justifyContent:'center', padding:'80px 24px 48px', background:'#000', fontFamily:'Inter, sans-serif' }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        {/* Icon */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:28 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.3)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(220,38,38,0.2)' }}>
            <svg width="28" height="28" fill="none" stroke="#dc2626" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .28 2.716-1.262 2.716H4.06c-1.542 0-2.262-1.716-1.261-2.716L4 15.3"/>
            </svg>
          </div>
        </div>

        <h2 style={{ textAlign:'center', fontFamily:'Space Grotesk, sans-serif', fontWeight:800, fontSize:22, color:'#fff', marginBottom:6, letterSpacing:'-0.03em' }}>Analyzing your startup</h2>
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:28 }}>Hold tight — our agents are working hard to stress-test every angle of your idea</p>

        {/* Progress bar */}
        <div style={{ marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>{STEPS[step]?.label}</span>
            <span style={{ color: phaseColor[currentPhase] || '#dc2626', fontSize:12, fontWeight:700 }}>{pct}%</span>
          </div>
          <div style={{ height:4, borderRadius:999, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
            <div style={{
              height:'100%', borderRadius:999, transition:'width 0.3s ease',
              width:`${pct}%`,
              background: currentPhase==='bull'
                ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                : currentPhase==='synth'
                ? 'linear-gradient(90deg, #d97706, #fbbf24)'
                : 'linear-gradient(90deg, #b91c1c, #dc2626)',
              boxShadow: currentPhase==='bull'
                ? '0 0 12px rgba(34,197,94,0.5)'
                : currentPhase==='synth'
                ? '0 0 12px rgba(251,191,36,0.5)'
                : '0 0 12px rgba(220,38,38,0.5)',
            }}/>
          </div>
        </div>

        {/* Step list — windowed: show 5 steps centred on current */}
        {(() => {
          const WINDOW = 5;
          const half   = Math.floor(WINDOW / 2);
          let start    = Math.max(0, step - half);
          let end      = start + WINDOW;
          if (end > STEPS.length) { end = STEPS.length; start = Math.max(0, end - WINDOW); }
          const visible = STEPS.slice(start, end);

          return (
            <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:18, display:'flex', flexDirection:'column', gap:9 }}>
              {/* top fade hint */}
              {start > 0 && (
                <p style={{ textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.2)', margin:'-4px 0 4px', letterSpacing:'0.06em' }}>
                  ··· {start} step{start>1?'s':''} completed
                </p>
              )}

              {visible.map((s, vi) => {
                const i    = start + vi;
                const done = i < step, active = i === step;
                const pc   = phaseColor[s.phase] || '#64748b';
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, opacity: done?0.6:1, transition:'opacity 0.3s' }}>
                    {done ? (
                      <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg width="10" height="10" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                      </div>
                    ) : active ? (
                      <div style={{ width:20, height:20, borderRadius:'50%', background:`${pc}18`, border:`1px solid ${pc}55`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <div style={{ width:7, height:7, borderRadius:'50%', background:pc, animation:'blink 1.5s infinite' }}/>
                      </div>
                    ) : (
                      <div style={{ width:20, height:20, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.1)', flexShrink:0 }}/>
                    )}
                    <span style={{ fontSize:12, fontWeight:active?600:400, transition:'color 0.3s', color: done?'rgba(34,197,94,0.8)':active?'#fff':'rgba(255,255,255,0.25)' }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}

              {/* bottom remaining hint */}
              {end < STEPS.length && (
                <p style={{ textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.2)', margin:'4px 0 -4px', letterSpacing:'0.06em' }}>
                  ··· {STEPS.length - end} more step{STEPS.length-end>1?'s':''} remaining
                </p>
              )}
            </div>
          );
        })()}
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.25)', fontSize:12, marginTop:16 }}>Usually takes 30–60 seconds</p>
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
