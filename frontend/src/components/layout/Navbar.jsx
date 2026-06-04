import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, signInWithGoogle, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isHome   = location.pathname === '/';
  const isActive = (p) => location.pathname === p;

  // Smart scroll handler — scrolls if on home, otherwise navigates then scrolls
  const handleSampleReport = (e) => {
    e.preventDefault();
    if (isHome) {
      const el = document.getElementById('sample-report');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/#sample-report');
      setTimeout(() => {
        const el = document.getElementById('sample-report');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const navLinks = [
    { to: '/submit',    label: 'Analyze Idea' },
    { to: null,         label: 'Sample Report', onClick: handleSampleReport },
    { to: '/dashboard', label: 'My Reports'   },
  ];

  const linkBase = {
    padding: '7px 14px', borderRadius: 9, fontSize: 13.5, fontWeight: 500,
    textDecoration: 'none', transition: 'all 0.2s ease', cursor: 'pointer',
    border: 'none', background: 'transparent', fontFamily: 'var(--font-body)',
    display: 'inline-flex', alignItems: 'center',
  };

  const linkActive = { color: '#ffffff', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.35)' };
  const linkIdle   = { color: 'var(--text-secondary)', background: 'transparent' };

  return (
    <nav
      className="pm-nav"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.6)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        backdropFilter: 'blur(28px)',
      }}
    >
      <div className="pm-nav-inner">

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, textDecoration:'none' }}>
          <svg width="36" height="36" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink:0, filter:'drop-shadow(0 0 10px rgba(220,38,38,0.5))' }}>
            <defs>
              <linearGradient id="navG1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b91c1c"/>
                <stop offset="55%" stopColor="#dc2626"/>
                <stop offset="100%" stopColor="#ef4444"/>
              </linearGradient>
            </defs>
            <rect width="64" height="64" rx="16" fill="url(#navG1)"/>
            <rect width="64" height="64" rx="16" fill="white" fillOpacity="0.05"/>
            <path d="M32 11 L53 47 H11 Z" fill="none" stroke="white" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" opacity="0.95"/>
            <path d="M32 21 L45 43 H19 Z" fill="white" fillOpacity="0.07"/>
            <rect x="30.5" y="27" width="3" height="10" rx="1.5" fill="white"/>
            <circle cx="32" cy="41.5" r="2" fill="white"/>
          </svg>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15.5, color:'var(--text-primary)', letterSpacing:'-0.015em' }}>
            Premortem
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display:'flex', alignItems:'center', gap:2 }}>
          {navLinks.map(({ to, label, onClick }) => {
            const active = to && isActive(to);
            if (onClick) {
              return (
                <button key={label} onClick={onClick}
                  style={{ ...linkBase, ...linkIdle }}
                  onMouseEnter={e => { e.currentTarget.style.color='#ffffff'; e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.background='transparent'; }}
                >
                  {label}
                </button>
              );
            }
            return (
              <Link key={to} to={to}
                style={{ ...linkBase, ...(active ? linkActive : linkIdle) }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color='#ffffff'; e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.background='transparent'; }}}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          {!loading && user ? (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="avatar"
                  style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, border:'2px solid rgba(220,38,38,0.5)' }}
                />
              ) : (
                <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'var(--accent-gradient)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:13, fontWeight:700 }}>
                  {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap:1, maxWidth:130 }}>
                <span style={{ fontSize:12, fontWeight:600, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user.user_metadata?.full_name || 'User'}
                </span>
                <span style={{ fontSize:10, color:'var(--text-muted)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {user.email}
                </span>
              </div>
            </div>
          ) : !loading ? (
            <button onClick={() => signInWithGoogle()}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:10, border:'1px solid var(--bg-border-strong)', background:'rgba(255,255,255,0.04)', color:'var(--text-primary)', fontSize:13, fontWeight:500, cursor:'pointer', transition:'all 0.2s', fontFamily:'var(--font-body)' }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(220,38,38,0.08)'; e.currentTarget.style.borderColor='var(--accent-border)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='var(--bg-border-strong)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in
            </button>
          ) : null}

          <Link to="/submit" className="pm-btn-primary"
            style={{ padding:'9px 20px', fontSize:13, borderRadius:10 }}
          >
            Analyze
            <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
