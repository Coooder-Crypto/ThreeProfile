'use client';

import React, { useState } from 'react';
import Loading from '@/components/Layout/Loading';

export default function About() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="h-screen w-full overflow-hidden relative pt-16">
      {isLoading && <Loading onLoadingComplete={handleLoadingComplete} />}

      <div className="space-y-6 text-white">
            <p className="text-lg">
              介绍
            </p>
          </div>
    </main>
  );
}
