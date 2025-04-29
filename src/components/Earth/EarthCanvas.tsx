'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { createEarthVisualization } from '@/utils/earthUtils';

const EarthCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [earthInstance, setEarthInstance] = useState<any>(null);
  
  // 初始化
  useEffect(() => {
    if (!containerRef.current) return;
    
  
    const container = containerRef.current;
    let earthInstance: any = null;
    let animationFrameId: number;
    
    createEarthVisualization(container)
      .then(earth => {
        earthInstance = earth;
        setEarthInstance(earth);
        
        const handleResize = () => {
          if (!earth) return;
          
          const width = window.innerWidth;
          const height = window.innerHeight;
          
          earth.renderer.setSize(width, height);
          earth.camera.aspect = width / height;
          earth.camera.updateProjectionMatrix();
        };
        
        window.addEventListener('resize', handleResize);
        
        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          
          if (earth) {
            earth.controls.update();
            earth.render();
          }
        };
        
        animate();
      })
      .catch(error => {
        console.error("Failed to initialize Earth visualization:", error);
      });
    
    return () => {

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (earthInstance) {
        earthInstance.dispose();
      }
    };
  }, []);
  
  // 放大出现效果
  useEffect(() => {
    if (!containerRef.current) return;
    
    gsap.to(containerRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
    });

    if (earthInstance && earthInstance.earth) {
      earthInstance.earth.isRotation = true;
    }
  }, [earthInstance]);
  
  return (
    <div 
      id="earth-canvas" 
      ref={containerRef}
    />
  );
};

export default EarthCanvas;
