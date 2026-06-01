import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">LandingPage</h1>
      <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
    </div>
  );
}
