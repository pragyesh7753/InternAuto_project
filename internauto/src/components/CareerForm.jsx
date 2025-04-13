import React from 'react';

function CareerForm({ onClose }) {
  return (
    <div className="bg-gradient-to-br from-yellow-400/95 to-red-600/95 backdrop-blur-lg rounded-xl p-8 w-[400px] max-w-[95vw] relative shadow-2xl border border-white/20">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl transition-colors"
      >
        ×
      </button>
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Career Guidance</h2>
      <p className="text-white text-center">This is the Career Guidance form.</p>
    </div>
  );
}

export default CareerForm;