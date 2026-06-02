import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto text-center mt-32 border border-dashed border-gray-800 rounded-sm">
      <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }} className="text-3xl font-bold uppercase tracking-widest mb-4">Command Center</h1>
      <p style={{ color: 'var(--text-secondary)' }} className="mb-8 font-mono uppercase text-sm tracking-wider">Dashboard module offline.</p>
      <Link to="/" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }} className="uppercase text-sm hover:underline tracking-widest transition">&lt; Return to Base</Link>
    </div>
  );
}
