import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('premortem_history') || '[]');
    setHistory(saved);
  }, []);

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to purge all historical intelligence?")) {
      localStorage.removeItem('premortem_history');
      setHistory([]);
    }
  };

  const getRiskColor = (score) => {
    if (score > 70) return 'var(--risk-critical)';
    if (score > 40) return 'var(--risk-high)';
    return 'var(--success)';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-12">
      <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }} className="text-3xl font-bold uppercase tracking-widest mb-2">Command Center</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="font-mono uppercase text-xs tracking-wider">Historical Intelligence Records</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red-dim)', fontFamily: 'var(--font-mono)' }}
            className="text-xs uppercase tracking-widest px-4 py-2 border hover:bg-red-900/20 transition"
          >
            Purge History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center p-16 border border-dashed border-gray-800 rounded-sm mt-12">
          <p style={{ color: 'var(--text-secondary)' }} className="mb-8 font-mono uppercase text-sm tracking-wider">No adversarial records found.</p>
          <Link to="/submit" style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }} className="uppercase text-sm hover:underline tracking-widest transition">Initiate New Stress Test</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((report) => (
            <div 
              key={report.id}
              onClick={() => navigate(`/report/${report.id}`, { state: { report } })}
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-border)' }}
              className="border p-6 rounded-sm cursor-pointer hover:border-gray-500 transition group"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 style={{ fontFamily: 'var(--font-display)' }} className="text-xl font-bold uppercase tracking-wider group-hover:text-white transition truncate pr-2">{report.startup?.name || 'Unknown'}</h2>
                <div 
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2"
                  style={{ borderColor: getRiskColor(report.overallRisk), color: getRiskColor(report.overallRisk), fontFamily: 'var(--font-display)' }}
                >
                  <span className="text-sm font-bold">{report.overallRisk}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="text-xs uppercase tracking-widest truncate">
                  <span style={{ color: 'var(--text-muted)' }}>ID:</span> {report.id}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="text-xs uppercase tracking-widest truncate">
                  <span style={{ color: 'var(--text-muted)' }}>Date:</span> {report.createdAt}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="text-xs uppercase tracking-widest truncate mt-2">
                  <span style={{ color: 'var(--text-muted)' }}>Market:</span> {report.startup?.market || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
