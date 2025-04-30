'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  
  return (
    <nav className="fixed top-0 left-0 w-full h-[60px] bg-opacity-30 backdrop-blur-md bg-[#010826] z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 h-full flex items-center justify-center border-b">        
        <div className="flex gap-[20px]">
          <Link 
            href="/" 
            className={`text-white hover:text-[#0cd1eb] no-underline transition-colors ${
              pathname === '/' ? 'border-b-2 border-[#0cd1eb]' : ''
            }`}
          >
            首页
          </Link>
          <Link 
            href="/about" 
            className={`text-white hover:text-[#0cd1eb] no-underline transition-colors ${
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
