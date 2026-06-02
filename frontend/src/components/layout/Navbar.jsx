import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: isLanding ? 'rgba(9,9,14,0.85)' : 'rgba(17,17,24,0.95)',
        borderColor: 'var(--bg-border)',
        backdropFilter: 'blur(12px)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none group">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-black"
            style={{ background: 'var(--accent)' }}
          >
            P
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Premortem
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { to: '/#how-it-works', label: 'How it Works' },
            { to: '/submit', label: 'Analyze Idea' },
            { to: '/dashboard', label: 'My Reports' },
          ].map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.backgroundColor = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.backgroundColor = 'transparent'; }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-3">
          <Link
            to="/submit"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-md transition-all"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--accent)'}
          >
            Analyze My Idea
          </Link>

          {/* Sign-In Placeholder - matching dark theme */}
          <button
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-all border"
            style={{ 
              backgroundColor: 'var(--bg-surface)', 
              color: 'var(--text-primary)',
              borderColor: 'var(--bg-border)'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="hidden sm:inline">Sign in</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
