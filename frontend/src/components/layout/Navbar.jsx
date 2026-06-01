import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-100 flex gap-4">
      <Link to="/" className="text-blue-500 hover:underline">Home</Link>
      <Link to="/submit" className="text-blue-500 hover:underline">Submit</Link>
      <Link to="/report/123" className="text-blue-500 hover:underline">Report</Link>
      <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
      <Link to="/auth" className="text-blue-500 hover:underline">Auth</Link>
    </nav>
  );
}
