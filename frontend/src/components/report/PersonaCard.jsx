import React from 'react';

export default function PersonaCard({ persona }) {
  const getSeverityColor = (severity) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-gray-400 text-white';
      default: return 'bg-gray-200 text-black';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white mb-6">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <span className="text-4xl" role="img" aria-label="icon">{persona.icon}</span>
        <h2 className="text-2xl font-bold text-gray-800">{persona.name}</h2>
      </div>
      
      <div className="flex flex-col gap-6">
        {persona.risks.map((risk, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-2 py-1 rounded ${getSeverityColor(risk.severity)}`}>
                {risk.severity}
              </span>
              <h3 className="text-xl font-semibold text-gray-800">{risk.title}</h3>
            </div>
            
            <div className="pl-4 border-l-4 border-gray-200 mt-2 flex flex-col gap-3">
              <div>
                <span className="font-semibold text-gray-700 block mb-1">Description: </span>
                <span className="text-gray-600 block">{risk.description}</span>
              </div>
              <div>
                <span className="font-semibold text-green-700 block mb-1">Mitigation: </span>
                <span className="text-gray-600 italic block">{risk.mitigation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
