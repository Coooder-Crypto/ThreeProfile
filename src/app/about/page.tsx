'use client';

import React, { useState } from 'react';
import Loading from '@/components/Layout/Loading';
import ProjectList from '@/components/About/ProjectList';

export default function About() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white pt-16 pb-20">
      {isLoading && <Loading onLoadingComplete={handleLoadingComplete} />}
      
      {/* Hero Section */}
      <section className="py-20 px-4 h-[80vh]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Hi, I'm <span className="text-[#915EFF]">Coooder</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#dfd9ff]">
            I develop 3D visuals, user interfaces and web applications
          </p>
        </div>
      </section>
      
     <ProjectList />
    </main>
  );
}
