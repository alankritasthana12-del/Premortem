import React from 'react';
import { useParams } from 'react-router-dom';
import { DUMMY_REPORT } from '../lib/dummyData';
import PersonaCard from '../components/report/PersonaCard';

export default function ReportPage() {
  const { id } = useParams();
  const report = DUMMY_REPORT;

  const getRiskColor = (score) => {
    if (score > 70) return 'border-red-500 text-red-600';
    if (score > 40) return 'border-orange-500 text-orange-600';
    return 'border-green-500 text-green-600';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{report.startup.name} Report</h1>
          <p className="text-gray-500 font-medium">Generated on {report.createdAt}</p>
          {id && <p className="text-xs text-gray-400 mt-2">Report ID: {id}</p>}
        </div>
        
        {/* Risk Score Circle */}
        <div className="mt-4 md:mt-0 flex flex-col items-center">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Overall Risk</span>
          <div className={`w-24 h-24 flex items-center justify-center rounded-full border-4 ${getRiskColor(report.overallRisk)} bg-white shadow-sm`}>
            <span className="text-4xl font-black">{report.overallRisk}</span>
          </div>
        </div>
      </div>

      {/* Personas Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Adversarial Analysis</h2>
        {report.personas.map((persona) => (
          <PersonaCard key={persona.id} persona={persona} />
        ))}
      </div>

      {/* Challenger Path Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Challenger Path</h2>
        <div className="mb-4">
          <span className="font-semibold text-blue-800">Historical Success Rate: </span>
          <span className="text-blue-900 font-bold text-lg bg-blue-100 px-2 py-1 rounded">{report.challengerPath.successRate}</span>
        </div>
        
        <div>
          <h3 className="font-semibold text-blue-800 mb-3">What Worked For Others:</h3>
          <ul className="list-disc pl-5 flex flex-col gap-2 text-blue-900">
            {report.challengerPath.whatWorked.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
