'use client';

import React, { useState } from 'react';
import EarthCanvas from '@/components/Earth/EarthCanvas';
import Loading from '@/components/Layout/Loading';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="h-screen w-full overflow-hidden relative pt-16">
      {isLoading && <Loading onLoadingComplete={handleLoadingComplete} />}
      
      <div className="flex items-center justify-center h-full">
        <EarthCanvas />
      </div>
    </main>
  );
}
