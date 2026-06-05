import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitIdea } from '../lib/api';

const STEPS = [
  { label:'Reading your submission...',               phase:'init'  },
  { label:'Scoring 10 startup dimensions...',         phase:'init'  },
  { label:'Investor — scale & fundability...',        phase:'bears' },
  { label:'Competitor — replication risk...',         phase:'bears' },
  { label:'Customer — willingness to pay...',         phase:'bears' },
  { label:'Regulator — legal & compliance...',        phase:'bears' },
  { label:'Engineer — technical & build risk...',     phase:'bears' },
  { label:'Economist — macro & timing risk...',       phase:'bears' },
  { label:'Finance — runway & burn rate...',          phase:'bears' },
  { label:'Founder Mirror — team critique...',        phase:'bears' },
  { label:'Opportunity analyst — why this wins...',   phase:'bulls' },
  { label:'Early adopter lens — first customers...',  phase:'bulls' },
  { label:'Market optimist — tailwinds & timing...',  phase:'bulls' },
  { label:'Growth operator — distribution...',        phase:'bulls' },
  { label:'Benchmarking against real companies...',   phase:'synth' },
  { label:'Building your action plan...',             phase:'synth' },
  { label:'Compiling intelligence report...',         phase:'synth' },
];

const phaseColor = { init:'#38bdf8', bears:'#f43f5e', bulls:'#22c55e', synth:'#fbbf24' };

function LoadingScreen({ step, currentPhase }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100);
  const pc  = phaseColor[currentPhase] || '#f43f5e';

  const WINDOW = 5;
  const half   = Math.floor(WINDOW / 2);
  let start    = Math.max(0, step - half);
  let end      = start + WINDOW;
  if (end > STEPS.length) { end = STEPS.length; start = Math.max(0, end - WINDOW); }
  const visible = STEPS.slice(start, end);

  return (
    <div style={{
      minHeight:'100vh', background:'#000', color:'#fff',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'flex-start', paddingTop:80, paddingBottom:40,
      padding:'80px 20px 40px', fontFamily:'Inter, sans-serif', boxSizing:'border-box',
    }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Icon */}
      <div style={{
        width:60, height:60, borderRadius:18,
        background:'rgba(220,38,38,0.12)', border:'1px solid rgba(220,38,38,0.3)',
        display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, flexShrink:0,
      }}>
        <svg width="26" height="26" fill="none" stroke="#f87171" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
        </svg>
      </div>

      {/* Title */}
      <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:800, fontSize:'clamp(20px,5vw,24px)', margin:'0 0 8px', letterSpacing:'-0.03em', textAlign:'center' }}>
        Analyzing your startup
      </h2>

      {/* Subtitle */}
      <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, margin:'0 0 24px', textAlign:'center', maxWidth:300, lineHeight:1.6 }}>
        Hold tight — our agents are stress-testing every angle of your idea
      </p>

      {/* Progress bar */}
      <div style={{ width:'100%', maxWidth:360, marginBottom:20, flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>
            {STEPS[step]?.label || 'Finalizing...'}
          </span>
          <span style={{ fontSize:11, fontWeight:700, color:pc, flexShrink:0, marginLeft:8 }}>{pct}%</span>
        </div>
        <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:999, overflow:'hidden' }}>
          <div style={{
            height:'100%', borderRadius:999, transition:'width 0.4s ease',
            width:`${pct}%`,
            background: currentPhase==='bulls'
              ? 'linear-gradient(90deg,#16a34a,#22c55e)'
              : currentPhase==='synth'
              ? 'linear-gradient(90deg,#d97706,#fbbf24)'
              : 'linear-gradient(90deg,#b91c1c,#f43f5e)',
            boxShadow:`0 0 10px ${pc}60`,
          }}/>
        </div>
      </div>

      {/* Step list — windowed 5 steps */}
      <div style={{
        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:14, padding:'14px 16px', display:'flex', flexDirection:'column', gap:8,
        width:'100%', maxWidth:360, flexShrink:0,
      }}>
        {start > 0 && (
          <p style={{ textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.2)', margin:0, letterSpacing:'0.06em' }}>
            ··· {start} step{start>1?'s':''} done
          </p>
        )}
        {visible.map((s, vi) => {
          const i    = start + vi;
          const done = i < step, active = i === step;
          const sc   = phaseColor[s.phase] || '#64748b';
          return (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, opacity:done?0.55:1, transition:'opacity 0.3s' }}>
              {done ? (
                <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.35)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="9" height="9" fill="none" stroke="#22c55e" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                </div>
              ) : active ? (
                <div style={{ width:18, height:18, borderRadius:'50%', background:`${sc}18`, border:`1px solid ${sc}55`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:sc, animation:'blink 1.5s infinite' }}/>
                </div>
              ) : (
                <div style={{ width:18, height:18, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.1)', flexShrink:0 }}/>
              )}
              <span style={{ fontSize:12, fontWeight:active?600:400, color:done?'rgba(34,197,94,0.8)':active?'#fff':'rgba(255,255,255,0.25)', lineHeight:1.3 }}>
                {s.label}
              </span>
            </div>
          );
        })}
        {end < STEPS.length && (
          <p style={{ textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.2)', margin:0, letterSpacing:'0.06em' }}>
            ··· {STEPS.length - end} more step{STEPS.length-end>1?'s':''} remaining
          </p>
        )}
      </div>

      <p style={{ color:'rgba(255,255,255,0.2)', fontSize:11, marginTop:16, textAlign:'center' }}>Usually takes 30–60 seconds</p>
    </div>
  );
}

const FIELDS = [
  { name:'name',        label:'Startup Name',              hint:'What is your startup called?',                         placeholder:'e.g. Airbnb, Dropbox, Stripe',                          type:'input'    },
  { name:'idea',        label:'What does it do?',          hint:'Explain your startup and the problem it solves.',      placeholder:'e.g. We help landlords manage short-term rentals…',     type:'textarea', rows:4 },
  { name:'market',      label:'Who is it for?',            hint:'Describe your target customer — be specific.',         placeholder:'e.g. First-time landlords in metro cities',              type:'input'    },
  { name:'model',       label:'How do you make money?',    hint:'Describe your revenue model.',                         placeholder:'e.g. 15% commission on every booking',                  type:'input'    },
  { name:'competitors', label:'Who are your competitors?', hint:'Who else is solving this problem?',                    placeholder:'e.g. Airbnb, Vrbo, local property management agencies', type:'input'    },
];

const STAGES = [
  { value:'Idea',      label:'💡 Idea',      sub:'Concept, no product yet'  },
  { value:'Prototype', label:'🛠 Prototype', sub:'Working demo'              },
  { value:'MVP',       label:'🚀 MVP',       sub:'Early users or revenue'    },
  { value:'Growth',    label:'📈 Growth',    sub:'Scaling'                   },
];

export default function SubmitPage() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm]       = useState({ name:'', idea:'', market:'', model:'', competitors:'', stage:'' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(0);
  const [currentPhase, setCurrentPhase] = useState('init');

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim())            e.name        = 'Required';
    if (!form.idea.trim())            e.idea        = 'Required';
    if (form.idea.trim().length < 30) e.idea        = 'Please give at least a sentence (30+ chars)';
    if (!form.market.trim())          e.market      = 'Required';
    if (!form.model.trim())           e.model       = 'Required';
    if (!form.competitors.trim())     e.competitors = 'Required';
    if (!form.stage)                  e.stage       = 'Please select your stage';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setStep(0); setCurrentPhase('init');

    const interval = setInterval(() => {
      setStep(prev => {
        const next = prev + 1;
        if (next < STEPS.length - 1) {
          setCurrentPhase(STEPS[next].phase);
          return next;
        }
        return prev;
      });
    }, 3500);

    try {
      const result = await submitIdea(form);
      clearInterval(interval);
      setStep(STEPS.length - 1);
      setTimeout(() => navigate('/report', { state: { report: result } }), 500);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen step={step} currentPhase={currentPhase}/>;

  if (isMobile) {
    return (
      <div style={{ minHeight:'100vh', background:'#000', color:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center', fontFamily:'Inter, sans-serif' }}>
        <div style={{ width:80, height:80, borderRadius:20, background:'rgba(220,38,38,0.1)', border:'1px solid rgba(220,38,38,0.3)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, position:'relative' }}>
          <svg width="40" height="40" fill="none" stroke="#f43f5e" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/>
          </svg>
          <style>{`
            @keyframes pulse-glow { 0% { box-shadow:0 0 0 rgba(220,38,38,0); } 50% { box-shadow:0 0 20px rgba(220,38,38,0.4); } 100% { box-shadow:0 0 0 rgba(220,38,38,0); } }
          `}</style>
          <div style={{ position:'absolute', inset:-1, borderRadius:20, animation:'pulse-glow 2s infinite' }}/>
        </div>
        <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontSize:24, fontWeight:800, marginBottom:12, letterSpacing:'-0.02em' }}>Desktop Required</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:14, lineHeight:1.7, maxWidth:320, marginBottom:32 }}>
          Premortem intelligence reports contain dense data, multi-column adversarial breakdowns, and detailed charts that are best viewed on a larger screen. 
          <br/><br/>
          Please switch to your laptop or desktop to analyze your startup.
        </p>
        <button onClick={() => navigate(-1)} className="pm-btn-primary" style={{ padding:'12px 28px', fontSize:14 }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="pm-page">
      <style>{`
        /* ── SubmitPage Mobile ── */
        @media (max-width: 600px) {
          .sp-card { padding: 22px 18px !important; }
          .sp-heading { margin-bottom: 28px !important; }
          .sp-heading h1 { font-size: 1.75rem !important; }
          .sp-heading p  { font-size: 14px !important; }
          .sp-stage-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .sp-stage-btn  { padding: 10px 12px !important; }
          .sp-submit-btn { font-size: 15px !important; padding: 13px !important; }
          .pm-input      { font-size: 16px !important; } /* prevent iOS zoom */
        }
        @media (max-width: 380px) {
          .sp-stage-grid { grid-template-columns: 1fr !important; }
        }
        input.pm-input:focus, textarea.pm-input:focus, select.pm-input:focus {
          border-color: var(--accent); box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
        }
      `}</style>

      <div className="pm-container" style={{ paddingTop:'clamp(32px,6vw,48px)', paddingBottom:80, position:'relative', maxWidth:700 }}>

        {/* Heading */}
        <div className="sp-heading" style={{ textAlign:'center', marginBottom:40 }}>
          <div className="pm-label">AI Premortem</div>
          <h1 className="pm-h1" style={{ fontSize:'clamp(1.8rem,4.5vw,3.2rem)', marginBottom:14 }}>
            Stress-test your startup idea
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'clamp(14px,2.5vw,16px)', maxWidth:440, margin:'0 auto', lineHeight:1.7 }}>
            12 AI agents will analyze your startup and surface every risk — before you waste months building the wrong thing.
          </p>
        </div>

        {/* Card */}
        <div style={{ maxWidth:620, margin:'0 auto' }}>
          <div className="pm-card sp-card" style={{ padding:36, position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'var(--accent-gradient)', borderRadius:'14px 14px 0 0' }}/>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:22 }}>

              {FIELDS.map(({ name, label, hint, placeholder, type, rows }) => (
                <div key={name}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-primary)', marginBottom:5, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                    {label}
                  </label>
                  {hint && <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:7, lineHeight:1.5 }}>{hint}</p>}
                  {type === 'textarea' ? (
                    <textarea
                      name={name} value={form[name]}
                      onChange={e => { setForm(f=>({...f,[name]:e.target.value})); setErrors(er=>({...er,[name]:''})); }}
                      placeholder={placeholder} rows={rows || 3}
                      className="pm-input" style={{ minHeight:90 }}
                    />
                  ) : (
                    <input
                      name={name} value={form[name]}
                      onChange={e => { setForm(f=>({...f,[name]:e.target.value})); setErrors(er=>({...er,[name]:''})); }}
                      placeholder={placeholder} className="pm-input"
                    />
                  )}
                  {errors[name] && <p style={{ color:'var(--risk-critical)', fontSize:11, marginTop:5 }}>{errors[name]}</p>}
                </div>
              ))}

              {/* Stage */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'var(--text-primary)', marginBottom:5, letterSpacing:'0.06em', textTransform:'uppercase' }}>
                  Current Stage
                </label>
                <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:10, lineHeight:1.5 }}>Where are you in your journey?</p>
                <div className="sp-stage-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                  {STAGES.map(({ value, label, sub }) => (
                    <button
                      key={value} type="button"
                      onClick={() => { setForm(f=>({...f,stage:value})); setErrors(er=>({...er,stage:''})); }}
                      className="sp-stage-btn"
                      style={{
                        padding:'12px 14px', borderRadius:10,
                        border:`1px solid ${form.stage===value ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        background: form.stage===value ? 'rgba(220,38,38,0.1)' : 'rgba(255,255,255,0.03)',
                        color: form.stage===value ? 'var(--text-primary)' : 'var(--text-secondary)',
                        cursor:'pointer', textAlign:'left', transition:'all 0.2s', fontFamily:'var(--font-body)',
                      }}
                    >
                      <div style={{ fontSize:13, fontWeight:form.stage===value?700:500 }}>{label}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:2 }}>{sub}</div>
                    </button>
                  ))}
                </div>
                {errors.stage && <p style={{ color:'var(--risk-critical)', fontSize:11, marginTop:5 }}>{errors.stage}</p>}
              </div>

              <button
                type="submit"
                className="pm-btn-primary sp-submit-btn"
                style={{ width:'100%', justifyContent:'center', fontSize:15, padding:'14px', marginTop:6 }}
              >
                Analyze My Idea
                <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
