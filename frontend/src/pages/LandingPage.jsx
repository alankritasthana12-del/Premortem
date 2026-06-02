import React from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_REPORT } from '../lib/dummyData';

const personas = [
  { icon: '💼', name: 'The Investor',       copy: 'Is your market big enough? Can this actually scale?' },
  { icon: '🏁', name: 'The Competitor',      copy: 'What stops an existing player from copying you tomorrow?' },
  { icon: '🙋', name: 'The Customer',        copy: 'Do people want this? Will they actually pay for it?' },
  { icon: '⚖️',  name: 'The Regulator',      copy: 'Are there legal landmines hiding in your business model?' },
  { icon: '🔧', name: 'The Engineer',        copy: 'Can you actually build this? What breaks at scale?' },
  { icon: '📊', name: 'The Economist',       copy: 'Is the timing right? Are macro trends in your favour?' },
  { icon: '🧾', name: 'The Finance Lead',   copy: 'Will you run out of money before you find product-market fit?' },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: '7 Expert Perspectives',
    body: 'Your idea is reviewed by 7 distinct AI personas — each with a different agenda and a different reason to reject your startup.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'Grounded in Real Failures',
    body: 'Every critique is anchored to documented case studies — WeWork, Quibi, Theranos, and dozens more. Not guesses; precedents.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Actionable Next Steps',
    body: 'You don\'t just get problems — you get specific, prioritised fixes for each risk, so you know exactly what to address first.',
  },
];

const SectionLabel = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-5 h-px" style={{ backgroundColor: 'var(--accent)' }}></div>
    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)', letterSpacing: '0.12em' }}>
      {children}
    </span>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>

      {/* ══════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Subtle radial gradient behind hero */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,107,219,0.12) 0%, transparent 70%)' }}
        />

        <div className="relative max-w-5xl mx-auto px-6 md:px-10 pt-24 pb-28 text-center">

          {/* Eyebrow */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-8 border"
            style={{ backgroundColor: 'var(--accent-dim)', borderColor: 'var(--accent-border)', color: 'var(--accent)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></span>
            Powered by Gemini AI · Grounded in 50+ real startup failures
          </div>

          {/* Headline */}
          <h1
            className="font-bold tracking-tight mb-6 leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            Find out why your startup<br />
            <span style={{ color: 'var(--accent)' }}>will fail</span> — before you build it.
          </h1>

          {/* Subheadline */}
          <p
            className="mx-auto mb-10 leading-relaxed"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '1.125rem',
              maxWidth: '560px',
              lineHeight: '1.75',
            }}
          >
            Describe your startup idea. In under 30 seconds, 7 AI-powered experts
            stress-test it from every critical angle and hand you a prioritised failure report.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/submit"
              id="hero-cta-primary"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-white px-7 py-3.5 rounded-lg transition-all"
              style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--accent-glow)', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
            >
              Analyze My Idea
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              to="/dashboard"
              id="hero-cta-secondary"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-medium px-7 py-3.5 rounded-lg border transition-all"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--bg-border)', backgroundColor: 'transparent' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--bg-border)'; }}
            >
              See a Sample Report
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-xs" style={{ color: 'var(--text-muted)' }}>
            No account needed · Free to use · Takes 60 seconds
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — FOR FOUNDERS LIKE YOU
      ══════════════════════════════════════════════════ */}
      <section className="border-t" style={{ borderColor: 'var(--bg-border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <SectionLabel>Who it's for</SectionLabel>
          <h2
            className="font-semibold mb-14"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', maxWidth: '520px', lineHeight: 1.3 }}
          >
            For founders who want brutal honesty before the market gives it to them.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                headline: 'Before you write a single line of code',
                body: 'Validate your assumptions with adversarial analysis before investing months of engineering time.',
              },
              {
                headline: 'Before you pitch your first investor',
                body: 'Know every objection they will raise — and have a sharp, prepared answer for each one.',
              },
              {
                headline: 'Before you quit your job',
                body: 'Make sure the idea is actually worth the risk. Find the fatal flaws before you are committed.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--bg-border)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-5 text-white"
                  style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                >
                  {i + 1}
                </div>
                <h3
                  className="font-semibold mb-3 leading-snug"
                  style={{ color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '-0.01em' }}
                >
                  {card.headline}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section id="how-it-works" className="border-t" style={{ borderColor: 'var(--bg-border)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <SectionLabel>How it works</SectionLabel>
          <h2
            className="font-semibold mb-14"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3 }}
          >
            Three steps to a complete failure report.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector */}
            <div
              className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px"
              style={{ backgroundColor: 'var(--bg-border)' }}
            ></div>

            {[
              {
                step: '01',
                title: 'Describe your idea',
                body: 'Tell us your startup name, what it does, who it\'s for, and what stage you\'re at. Takes about 60 seconds.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: '7 perspectives review it',
                body: 'Seven AI-powered experts — investors, competitors, customers, regulators — independently evaluate your idea.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Get your failure report',
                body: 'Receive a structured report: every risk ranked by severity, grounded in real-world failures, with concrete fixes.',
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}
                >
                  {item.icon}
                </div>
                <div className="absolute top-3 left-12 ml-3 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {item.step}
                </div>
                <h3
                  className="font-semibold mb-3"
                  style={{ color: 'var(--text-primary)', fontSize: '1.05rem', letterSpacing: '-0.01em' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — 7 PERSPECTIVES
      ══════════════════════════════════════════════════ */}
      <section className="border-t" style={{ borderColor: 'var(--bg-border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <SectionLabel>The review panel</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <h2
              className="font-semibold"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3, maxWidth: '420px' }}
            >
              Seven critics. Every blind spot covered.
            </h2>
            <p className="text-sm leading-relaxed md:text-right" style={{ color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.7 }}>
              Each perspective asks a different set of hard questions — so nothing slips through.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {personas.map((p, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border transition-all duration-200 group cursor-default"
                style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--bg-border)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.backgroundColor = 'var(--accent-dim)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-border)'; e.currentTarget.style.backgroundColor = 'var(--bg-base)'; }}
              >
                <div className="text-2xl mb-4">{p.icon}</div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>{p.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 5 — WHAT YOU GET
      ══════════════════════════════════════════════════ */}
      <section className="border-t" style={{ borderColor: 'var(--bg-border)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <SectionLabel>What you get</SectionLabel>
          <h2
            className="font-semibold mb-14"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3 }}
          >
            A complete failure report, not a vague suggestion list.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i}>
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-border)', color: 'var(--text-secondary)' }}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-semibold mb-3"
                  style={{ color: 'var(--text-primary)', fontSize: '1.05rem', letterSpacing: '-0.01em' }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 6 — SAMPLE REPORT PREVIEW
      ══════════════════════════════════════════════════ */}
      <section className="border-t" style={{ borderColor: 'var(--bg-border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-20">
          <SectionLabel>Sample output</SectionLabel>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <h2
              className="font-semibold"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.3, maxWidth: '400px' }}
            >
              Here's what a report actually looks like.
            </h2>
            <Link
              to="/submit"
              className="text-sm font-medium transition-colors flex-shrink-0"
              style={{ color: 'var(--accent)' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--accent)'}
            >
              Run your own →
            </Link>
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--bg-border)' }}>
            {/* Report Header */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--bg-border)', backgroundColor: 'var(--bg-surface)' }}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ color: '#F87171', backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>High Risk</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>· {DUMMY_REPORT.createdAt}</span>
                  </div>
                  <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                    {DUMMY_REPORT.startup.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: '400px' }}>
                    {DUMMY_REPORT.startup.idea?.slice(0, 90)}...
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl flex-shrink-0" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>
                  <span className="text-4xl font-black tabular-nums leading-none" style={{ color: '#F87171', fontFamily: 'var(--font-display)', letterSpacing: '-0.05em' }}>{DUMMY_REPORT.overallRisk}</span>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Overall Risk</span>
                </div>
              </div>

              {/* Risk Distribution Bar Chart */}
              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Risk Distribution</p>
                <div className="space-y-3 max-w-sm">
                  {[
                    { name: 'The Investor', w: '100%', bg: 'linear-gradient(90deg, #ef4444 0%, #fca5a5 100%)', s: '0 0 12px rgba(239,68,68,0.4)' },
                    { name: 'The Customer', w: '75%', bg: 'linear-gradient(90deg, #f97316 0%, #fdba74 100%)', s: '0 0 12px rgba(249,115,22,0.4)' },
                    { name: 'The Competitor', w: '50%', bg: 'linear-gradient(90deg, #f59e0b 0%, #fcd34d 100%)', s: '0 0 12px rgba(245,158,11,0.4)' },
                  ].map((bar, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[11px] font-medium w-24 truncate" style={{ color: 'var(--text-secondary)' }}>{bar.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-[#1A1A1A] overflow-visible relative">
                        <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: bar.w, background: bar.bg, boxShadow: bar.s }}></div>
                      </div>
                      <span className="text-[10px] font-mono w-8 text-right" style={{ color: 'var(--text-muted)' }}>{bar.w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Persona Grid Preview */}
            <div className="p-6 bg-black">
              <h4 className="text-sm font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Adversarial Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Open persona */}
                <div className="rounded-xl border overflow-hidden h-fit" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
                  <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--bg-border)' }}>
                    <div className="w-8 h-8 rounded flex items-center justify-center text-sm flex-shrink-0" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}>{DUMMY_REPORT.personas[0].icon}</div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{DUMMY_REPORT.personas[0].name}</p>
                  </div>
                  <div className="p-4">
                    {DUMMY_REPORT.personas[0].risks.slice(0, 1).map((risk, i) => (
                      <div key={i}>
                        <div className="flex items-start gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ color: '#F87171', backgroundColor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)' }}>
                            {risk.severity}
                          </span>
                          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{risk.title}</p>
                        </div>
                        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{risk.description.slice(0, 80)}...</p>
                        <div className="p-2.5 rounded flex items-start gap-2" style={{ backgroundColor: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)' }}>
                          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-green-500 mb-0.5">Fix</p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{risk.mitigation.slice(0, 50)}...</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blurred teaser */}
                <div className="relative rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}>
                  <div className="px-4 py-3 opacity-25 pointer-events-none select-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded" style={{ backgroundColor: 'var(--bg-elevated)' }}></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 rounded w-24" style={{ backgroundColor: 'var(--bg-border)' }}></div>
                        <div className="h-2 rounded w-16" style={{ backgroundColor: 'var(--bg-border)' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-end pr-6" style={{ background: 'linear-gradient(to right, transparent, var(--bg-surface) 40%)' }}>
                    <Link to="/submit" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                      + 5 more in your full report →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 7 — FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section className="border-t" style={{ borderColor: 'var(--bg-border)' }}>
        <div className="max-w-3xl mx-auto px-6 md:px-10 py-28 text-center">
          <h2
            className="font-bold mb-5"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.5vw, 3rem)', color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}
          >
            Your competitors are already thinking about your weaknesses.
          </h2>
          <p
            className="mb-10 mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '480px', lineHeight: 1.75 }}
          >
            Run your premortem today. Find the flaws before the market does, and build something that actually survives.
          </p>
          <Link
            to="/submit"
            id="cta-final"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-8 py-4 rounded-lg transition-all"
            style={{ background: 'var(--accent-gradient)', boxShadow: 'var(--accent-glow)', border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Analyze My Startup — Free
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <p className="mt-5 text-xs" style={{ color: 'var(--text-muted)' }}>No sign-up required · Results in under 30 seconds</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="border-t" style={{ borderColor: 'var(--bg-border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-black"
              style={{ background: 'var(--accent)' }}
            >
              P
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Premortem</span>
            <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>· AI-powered startup failure analysis</span>
          </div>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Link to="/submit" className="hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >Analyze</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >My Reports</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
