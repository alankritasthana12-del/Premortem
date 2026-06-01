import React from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ReportPage() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">ReportPage {id && `(ID: ${id})`}</h1>
      <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
    </div>
  );
}
