import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { submitIdea } from '../lib/api';

// ─── Loading Progress Steps ───────────────────────────────────────────────────
const LOADING_STEPS = [
  { label: 'Reading your submission...', duration: 2500 },
  { label: 'Reviewing your market and competition...', duration: 4000 },
  { label: 'Investor perspective: checking fundability and scale...', duration: 5000 },
  { label: 'Customer perspective: evaluating value and pricing...', duration: 4500 },
  { label: 'Technical perspective: assessing feasibility...', duration: 4000 },
  { label: 'Financial perspective: modelling runway risks...', duration: 4000 },
  { label: 'Cross-referencing real startup failure cases...', duration: 4000 },
  { label: 'Compiling your failure report...', duration: 3000 },
];

function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(4);

  useEffect(() => {
    let elapsed = 0;
    const total = LOADING_STEPS.reduce((s, step) => s + step.duration, 0);
    let stepIdx = 0;

    const interval = setInterval(() => {
      elapsed += 120;
      const pct = Math.min(Math.round((elapsed / total) * 100), 96);
      setProgress(pct);

      let cumulative = 0;
      for (let i = 0; i < LOADING_STEPS.length; i++) {
        cumulative += LOADING_STEPS[i].duration;
        if (elapsed < cumulative) {
          if (i !== stepIdx) {
            stepIdx = i;
            setCurrentStep(i);
          }
          break;
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}
    >
      <div className="w-full max-w-md">

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8"
          style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
        >
          <svg className="w-7 h-7" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .28 2.716-1.262 2.716H4.06c-1.542 0-2.262-1.716-1.261-2.716L4 15.3" />
          </svg>
        </div>

        {/* Headline */}
        <h2
          className="text-center font-semibold mb-2"
          style={{ color: 'var(--text-primary)', fontSize: '1.25rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}
        >
          Analyzing your startup
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>
          7 perspectives are reviewing your idea right now
        </p>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {LOADING_STEPS[currentStep]?.label}
            </span>
            <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--accent)' }}>
              {progress}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
            <div
              className="h-full rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%`, backgroundColor: 'var(--accent)', boxShadow: '0 0 10px rgba(124,107,219,0.5)' }}
            />
          </div>
        </div>

        {/* Step List */}
        <div
          className="rounded-xl border p-4 space-y-3"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
        >
          {LOADING_STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={i} className="flex items-center gap-3">
                {done ? (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.3)' }}
                  >
                    <svg className="w-3 h-3" style={{ color: '#4ADE80' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                ) : active ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: '1px solid var(--accent-border)' }}>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></div>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ border: '1px solid var(--bg-border)' }}></div>
                )}
                <span
                  className="text-xs"
                  style={{
                    color: done ? '#4ADE80' : active ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: active ? '500' : '400',
                    transition: 'color 0.3s',
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
          This usually takes 20 – 40 seconds
        </p>
      </div>
    </div>
  );
}

// ─── Field definitions ────────────────────────────────────────────────────────
const FIELDS = [
  {
    name: 'name',
    label: 'Startup Name',
    hint: 'What is your startup called?',
    placeholder: 'e.g. Airbnb, Dropbox, Stripe',
    type: 'input',
  },
  {
    name: 'idea',
    label: 'What does it do?',
    hint: 'Explain what your startup does and the problem it solves — in plain English.',
    placeholder: 'e.g. We help landlords manage short-term rental properties without needing an agency. Landlords list their property, we handle pricing, bookings, and guest support...',
    type: 'textarea',
    rows: 4,
  },
  {
    name: 'market',
    label: 'Who is it for?',
    hint: 'Describe your target customer — be specific.',
    placeholder: 'e.g. First-time landlords in metro cities who own 1–3 properties and lack the time to self-manage',
    type: 'input',
  },
  {
    name: 'model',
    label: 'How do you make money?',
    hint: 'Describe your revenue model.',
    placeholder: 'e.g. 15% commission on every booking, charged to the landlord',
    type: 'input',
  },
  {
    name: 'competitors',
    label: 'Who are your main competitors?',
    hint: 'Who else is solving this problem, directly or indirectly?',
    placeholder: 'e.g. Airbnb, Vrbo, local property management agencies',
    type: 'input',
  },
];

const STAGE_OPTIONS = [
  { value: 'Idea',       label: 'Idea — I have a concept but no product yet' },
  { value: 'Validation', label: 'Validation — I am talking to potential customers' },
  { value: 'Building',   label: 'Building — I am actively developing the product' },
  { value: 'Live',       label: 'Live — The product is launched and running' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SubmitPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', idea: '', market: '', model: '', competitors: '', stage: 'Idea',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ── handleSubmit — untouched logic ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await submitIdea(formData);
      const history = JSON.parse(localStorage.getItem('premortem_history') || '[]');
      history.unshift(result);
      localStorage.setItem('premortem_history', JSON.stringify(history));
      navigate(`/report/${result.id}`, { state: { report: result, isNew: true } });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  const inputBase = {
    backgroundColor: 'var(--bg-elevated)',
    border: '1px solid var(--bg-border)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    borderRadius: '8px',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    width: '100%',
    padding: '10px 14px',
    outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-12 pb-24">

        {/* Page Header */}
        <div className="mb-10">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm mb-6 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </Link>

          <h1
            className="font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}
          >
            Analyze your startup
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65 }}>
            Fill in the details below. The more honest and specific you are, the more useful your report will be.
          </p>
        </div>

        {/* Layout: Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Form (2/3) ── */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">

            {FIELDS.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block font-medium mb-1.5 text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {field.label}
                </label>
                {field.hint && (
                  <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', lineHeight: 1.55 }}>{field.hint}</p>
                )}
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    rows={field.rows}
                    placeholder={field.placeholder}
                    style={{ ...inputBase, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--bg-border)'}
                  />
                ) : (
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    style={inputBase}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--bg-border)'}
                  />
                )}
              </div>
            ))}

            {/* Stage */}
            <div>
              <label htmlFor="stage" className="block font-medium mb-1.5 text-sm" style={{ color: 'var(--text-primary)' }}>
                What stage are you at?
              </label>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)', lineHeight: 1.55 }}>
                Be honest — this affects the type of risks we highlight.
              </p>
              <select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                required
                style={{ ...inputBase, cursor: 'pointer' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--bg-border)'}
              >
                {STAGE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="analyze-btn"
              className="w-full flex items-center justify-center gap-2 font-semibold text-sm text-white py-3.5 rounded-lg transition-all mt-2"
              style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--accent-glow)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .28 2.716-1.262 2.716H4.06c-1.542 0-2.262-1.716-1.261-2.716L4 15.3" />
              </svg>
              Analyze My Startup
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Takes 20–40 seconds · Results are private to you
            </p>
          </form>

          {/* ── Sidebar (1/3) ── */}
          <div className="space-y-5 lg:sticky lg:top-20">

            {/* What our AI looks at */}
            <div
              className="rounded-xl border p-5"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
            >
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                What the analysis covers
              </h3>
              <ul className="space-y-3">
                {[
                  'Is your market large enough to build a real business?',
                  'Can competitors copy or kill you quickly?',
                  'Will real customers actually pay for this?',
                  'Are there legal or regulatory risks hiding in your model?',
                  'Can the product be built and does it scale?',
                  'Is the timing right, or is the market not ready?',
                  'Will you run out of money before finding traction?',
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip */}
            <div
              className="rounded-xl border p-5"
              style={{ backgroundColor: 'var(--accent-dim)', borderColor: 'var(--accent-border)' }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--accent)' }}>💡 Tip for better results</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Describe your idea as if you're explaining it to a smart friend who has never heard of it. Avoid buzzwords like "disruptive" or "revolutionary" — specific details give a better analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
