'use client';

import React from 'react';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50 transition-opacity duration-500">
      <div className="relative">
        <img
          src="/loader.gif"
          alt="Loading..."
          loading="eager"
          decoding="sync"
          className="w-40 h-40 opacity-90"
        />
      </div>
    </div>
  );
};

export default Loader;
