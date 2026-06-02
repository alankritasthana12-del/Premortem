import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--bg-border)', fontFamily: 'var(--font-mono)' }} className="p-4 flex gap-6 text-sm uppercase tracking-wider sticky top-0 z-50">
      <Link to="/" style={{ color: 'var(--text-primary)' }} className="font-bold mr-4 flex items-center gap-2">
        <span style={{ color: 'var(--accent-red)' }}>//</span> PREMORTEM
      </Link>
      <Link to="/submit" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition">Submit</Link>
      <Link to="/report/rpt_001" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition">Report</Link>
      <Link to="/dashboard" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition">Dashboard</Link>
      <Link to="/auth" style={{ color: 'var(--text-secondary)' }} className="hover:text-white transition">Auth</Link>
    </nav>
  );
}
