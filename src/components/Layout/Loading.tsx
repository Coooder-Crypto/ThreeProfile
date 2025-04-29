import React, { useEffect } from 'react';

interface LoadingProps {
  onLoadingComplete: () => void;
}

const Loading: React.FC<LoadingProps> = ({ onLoadingComplete }) => {

  // 加载动画
  useEffect(() => {
    const timer = setTimeout(() => {
      const loadingElement = document.getElementById('loading');
      if (loadingElement) {
        loadingElement.classList.add('out');
        
        setTimeout(() => {
          onLoadingComplete();
        }, 500); 
      }
    }, 2000); 
    
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);
  
  return (
    <div id="loading">
      <div className="sk-chase">
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
      <div className="text-[#409EFF] tracking-wider">Loading</div>
    </div>
  );
};

export default Loading;
