import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false); // Mock auth state
  const navigate = useNavigate();

  useEffect(() => {
    // Check mock auth (could be from localStorage or context in real app)
    // For now, we'll assume not signed in initially to show the wall.
    // If you want to bypass this for testing, set to true.
    const mockAuth = localStorage.getItem('mock_auth') === 'true';
    setIsSignedIn(mockAuth);

    if (mockAuth) {
      const saved = JSON.parse(localStorage.getItem('premortem_history') || '[]');
      setHistory(saved);
    }
  }, []);

  const handleSignIn = () => {
    localStorage.setItem('mock_auth', 'true');
    setIsSignedIn(true);
    const saved = JSON.parse(localStorage.getItem('premortem_history') || '[]');
    setHistory(saved);
  };

  const clearHistory = () => {
    if (window.confirm('Clear all saved reports? This cannot be undone.')) {
      localStorage.removeItem('premortem_history');
      setHistory([]);
    }
  };

  const getRiskLabel = (score) => {
    if (score > 70) return { label: 'High Risk', color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' };
    if (score > 40) return { label: 'Medium Risk', color: '#FB923C', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.2)' };
    return { label: 'Lower Risk', color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' };
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-12 pb-24">

        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-10">
          <div>
            <h1
              className="font-bold mb-1.5"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2rem)', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              My Reports
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {history.length === 0 ? 'No analyses saved yet.' : `${history.length} analysis${history.length === 1 ? '' : 'es'} saved`}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mt-1">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => e.target.style.color = 'var(--text-secondary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >
                Clear all
              </button>
            )}
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2.5 rounded-lg transition-all"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--accent)'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Analysis
            </Link>
          </div>
        </div>

        {/* Empty / Auth State */}
        {!isSignedIn ? (
          <div
            className="rounded-2xl border py-24 text-center max-w-2xl mx-auto"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
              <svg className="w-7 h-7" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Sign in to view history</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 32px' }}>
              Your past stress tests are saved securely to your account. Sign in to access your previous failure reports.
            </p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-3 text-sm font-semibold px-6 py-3.5 rounded-lg transition-all border"
              style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)', borderColor: 'var(--bg-border)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>
        ) : history.length === 0 ? (
          <div
            className="rounded-xl border py-20 text-center"
            style={{ borderColor: 'var(--bg-border)', borderStyle: 'dashed', backgroundColor: 'var(--bg-surface)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--bg-border)' }}
            >
              <svg className="w-7 h-7" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
              </svg>
            </div>
            <h2 className="font-semibold mb-2 text-base" style={{ color: 'var(--text-primary)' }}>No reports yet</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              Run your first startup analysis to see it appear here.
            </p>
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-all"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--accent)'}
            >
              Analyze my startup
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {history.map((report) => {
              const risk = getRiskLabel(report.overallRisk || 0);
              return (
                <div
                  key={report.id}
                  onClick={() => navigate(`/report/${report.id}`, { state: { report } })}
                  className="rounded-xl border p-5 cursor-pointer transition-all duration-200 group"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.backgroundColor = 'var(--accent-dim)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-border)'; e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; }}
                >
                  {/* Risk badge + Score */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ color: risk.color, backgroundColor: risk.bg, border: `1px solid ${risk.border}` }}
                    >
                      {risk.label}
                    </span>
                    <span className="text-2xl font-black tabular-nums" style={{ color: risk.color, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
                      {report.overallRisk}
                      <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>/100</span>
                    </span>
                  </div>

                  {/* Startup name */}
                  <h2
                    className="font-semibold mb-1 leading-snug group-hover:text-white transition-colors"
                    style={{ color: 'var(--text-primary)', fontSize: '1rem', letterSpacing: '-0.01em' }}
                  >
                    {report.startup?.name || 'Unnamed Startup'}
                  </h2>

                  {/* Idea snippet */}
                  <p
                    className="text-xs mb-4 leading-relaxed line-clamp-2"
                    style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}
                  >
                    {report.startup?.idea || report.startup?.market || '—'}
                  </p>

                  {/* Footer meta */}
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--bg-border)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{report.createdAt}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                      View report →
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
