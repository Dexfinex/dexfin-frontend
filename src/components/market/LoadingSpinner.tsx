import React from 'react';


export const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 rounded-full border-white/10 border-t-blue-500 animate-spin"></div>
        <p className="text-lg font-medium text-white/80">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;