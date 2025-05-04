"use client";

import React, { useState } from "react";
import Loading from "@/components/Layout/Loading";
import ProjectList from "@/components/About/ProjectList";
import Profile from "@/components/About/Profile";

export default function About() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="bg-[#050816] text-white mt-[60px]">
      {isLoading && <Loading onLoadingComplete={handleLoadingComplete} />}

      <Profile />

      <ProjectList />
    </div>
  );
}
