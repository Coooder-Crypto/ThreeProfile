'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className="fixed top-0 left-0 w-full bg-opacity-30 backdrop-blur-md bg-[#010826] z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-white">
          <span className="text-[#0cd1eb]">3D</span> Profile
        </div>
        
        <div className="flex space-x-6">
          <Link 
            href="/" 
            className={`text-white hover:text-[#0cd1eb] transition-colors ${
              pathname === '/' ? 'border-b-2 border-[#0cd1eb]' : ''
            }`}
          >
            首页
          </Link>
          <Link 
            href="/about" 
            className={`text-white hover:text-[#0cd1eb] transition-colors ${
              pathname === '/about' ? 'border-b-2 border-[#0cd1eb]' : ''
            }`}
          >
            介绍
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
