import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitIdea } from '../lib/api';

export default function SubmitPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    idea: '',
    market: '',
    model: '',
    competitors: '',
    stage: 'Idea'
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const report = await submitIdea(formData);
      navigate(`/report/${report.id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--bg-surface)',
    borderColor: 'var(--bg-border)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)'
  };

  return (
    <div className="p-8 max-w-2xl mx-auto my-12">
      <h1 style={{ fontFamily: 'var(--font-display)' }} className="text-3xl font-bold mb-10 uppercase tracking-widest text-center border-b border-gray-800 pb-4">Submit Intelligence</h1>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 border bg-black/20" style={{ borderColor: 'var(--accent-red-dim)' }}>
          <div style={{ borderTopColor: 'var(--accent-red)' }} className="animate-spin rounded-full h-16 w-16 border-4 border-transparent mb-8"></div>
          <p style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }} className="text-sm uppercase tracking-widest animate-pulse">Running Adversarial Simulations...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col">
            <label htmlFor="name" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">01 // Target Designation (Startup Name)</label>
            <input 
              type="text" id="name" name="name" value={formData.name} onChange={handleChange} required 
              style={inputStyle}
              className="border p-4 rounded-sm focus:outline-none focus:border-red-500"
              placeholder="e.g. NestMate"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="idea" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">02 // Operational Directive (Startup Idea)</label>
            <textarea 
              id="idea" name="idea" value={formData.idea} onChange={handleChange} required rows={4}
              style={inputStyle}
              className="border p-4 rounded-sm focus:outline-none focus:border-red-500"
              placeholder="Describe the mechanics of the operation..."
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="market" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">03 // Engagement Zone (Target Market)</label>
            <input 
              type="text" id="market" name="market" value={formData.market} onChange={handleChange} required 
              style={inputStyle}
              className="border p-4 rounded-sm focus:outline-none focus:border-red-500"
              placeholder="Who are the targets?"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="model" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">04 // Resource Extraction (Revenue Model)</label>
            <input 
              type="text" id="model" name="model" value={formData.model} onChange={handleChange} required 
              style={inputStyle}
              className="border p-4 rounded-sm focus:outline-none focus:border-red-500"
              placeholder="How is capital acquired?"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="competitors" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">05 // Hostile Entities (Main Competitors)</label>
            <input 
              type="text" id="competitors" name="competitors" value={formData.competitors} onChange={handleChange} required 
              style={inputStyle}
              className="border p-4 rounded-sm focus:outline-none focus:border-red-500"
              placeholder="Known hostiles in the sector..."
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="stage" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }} className="mb-3 text-xs uppercase tracking-wider">06 // Current Readiness (Stage)</label>
            <select 
              id="stage" name="stage" value={formData.stage} onChange={handleChange} required
              style={inputStyle}
              className="border p-4 rounded-sm focus:outline-none focus:border-red-500"
            >
              <option value="Idea">Idea Phase</option>
              <option value="Validation">Active Validation</option>
              <option value="Building">Construction</option>
              <option value="Live">Live Operations</option>
            </select>
          </div>

          <button 
            type="submit" 
            style={{ backgroundColor: 'var(--accent-red)', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            className="p-5 mt-6 text-xl font-bold uppercase tracking-widest hover:opacity-90 transition border border-red-900 shadow-lg shadow-red-900/20"
          >
            Initiate Stress Test
          </button>
        </form>
      )}
    </div>
  );
}
