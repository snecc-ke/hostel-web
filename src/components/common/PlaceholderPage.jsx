import React from 'react';
import { Construction } from 'lucide-react';

function PlaceholderPage({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
        <Construction className="text-blue-600" size={36} />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 max-w-md">{description || 'This page is coming soon.'}</p>
    </div>
  );
}

export default PlaceholderPage;