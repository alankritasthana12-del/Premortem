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

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Your Startup Idea</h1>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Analyzing your startup idea...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-semibold">1. Startup Name</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
              className="border border-gray-300 p-2 rounded bg-white text-gray-900"
              placeholder="e.g. NestMate"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="idea" className="mb-1 font-semibold">2. Startup Idea</label>
            <textarea 
              id="idea"
              name="idea"
              value={formData.idea}
              onChange={handleChange}
              required 
              rows={3}
              className="border border-gray-300 p-2 rounded bg-white text-gray-900"
              placeholder="Describe what your startup does..."
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="market" className="mb-1 font-semibold">3. Target Market</label>
            <input 
              type="text" 
              id="market"
              name="market"
              value={formData.market}
              onChange={handleChange}
              required 
              className="border border-gray-300 p-2 rounded bg-white text-gray-900"
              placeholder="Who are your customers?"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="model" className="mb-1 font-semibold">4. Revenue Model</label>
            <input 
              type="text" 
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required 
              className="border border-gray-300 p-2 rounded bg-white text-gray-900"
              placeholder="How do you make money?"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="competitors" className="mb-1 font-semibold">5. Main Competitors</label>
            <input 
              type="text" 
              id="competitors"
              name="competitors"
              value={formData.competitors}
              onChange={handleChange}
              required 
              className="border border-gray-300 p-2 rounded bg-white text-gray-900"
              placeholder="Who are you competing against?"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="stage" className="mb-1 font-semibold">6. Current Stage</label>
            <select 
              id="stage"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded bg-white text-gray-900"
            >
              <option value="Idea">Idea</option>
              <option value="Validation">Validation</option>
              <option value="Building">Building</option>
              <option value="Live">Live</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition mt-4"
          >
            Stress Test My Startup
          </button>
        </form>
      )}
    </div>
  );
}
