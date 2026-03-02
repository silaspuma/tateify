'use client';

import React from 'react';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 transition-opacity duration-500">
      <div className="relative">
        <img
          src="/loader.gif"
          alt="Loading..."
          className="w-40 h-40 opacity-90"
        />
      </div>
      <p className="mt-6 text-2xl font-bold text-text/60 animate-pulse">Loading Tateify...</p>
    </div>
  );
};

export default Loader;
