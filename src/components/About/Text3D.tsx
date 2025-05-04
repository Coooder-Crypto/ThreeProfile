'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Text3DProps {
  text: string;
}

const Text3D: React.FC<Text3DProps> = ({
  text,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const textMeshRef = useRef<THREE.Mesh | null>(null);
  const lightRigRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const { clientWidth: w, clientHeight: h } = containerRef.current;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.z = 7; 
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.3)); 

    const lightRig = new THREE.Group();
    const palette = [0xff5c7c, 0x68ff91, 0x6e7bff];
    palette.forEach((c, i) => {
      const l = new THREE.PointLight(c, 1.8, 25); 
      const angle = (i / palette.length) * Math.PI * 2;
      l.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, 2);
      lightRig.add(l);
    });
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1.0, 30, Math.PI / 6, 0.5, 1);
    spotLight.position.set(0, 5, 10);
    scene.add(spotLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0); 
    rimLight.position.set(0, 0, -5);
    scene.add(rimLight);
    
    scene.add(lightRig);
    lightRigRef.current = lightRig;

    const createTextMesh = () => {
  
      const textGroup = new THREE.Group();
      scene.add(textGroup);
      
      const createTextLayer = (zOffset: number, colorMultiplier: number, glowIntensity: number = 0) => {
     
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return null;
        
        const canvasSize = 1024;
        canvas.width = canvasSize;
        canvas.height = canvasSize / 3;
        
        const gradient = context.createLinearGradient(0, 0, canvasSize, 0);
        gradient.addColorStop(0, '#ff5c7c');
        gradient.addColorStop(0.3, '#ff9d7c');
        gradient.addColorStop(0.5, '#ffffff');
        gradient.addColorStop(0.7, '#7c9dff');
        gradient.addColorStop(1, '#6e7bff');
        
        context.fillStyle = 'rgba(0, 0, 0, 0)'; 
        context.fillRect(0, 0, canvasSize, canvasSize / 3);
        
        context.shadowColor = 'rgba(255, 255, 255, 0.6)';
        context.shadowBlur = 10;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        
        context.font = `bold ${canvasSize / 10}px Arial, sans-serif`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = gradient;
        context.fillText(text, canvasSize / 2, canvasSize / 6); 
        
        if (zOffset === 0) { 
          context.globalCompositeOperation = 'overlay';
          context.fillStyle = 'rgba(255, 255, 255, 0.1)';
          for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvasSize;
            const y = Math.random() * (canvasSize / 3);
            const size = Math.random() * 2 + 1;
            context.fillRect(x, y, size, size);
          }
          context.globalCompositeOperation = 'source-over';
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        
        const material = new THREE.MeshLambertMaterial({
          transparent: true,
          color: new THREE.Color('#ffffff').multiplyScalar(colorMultiplier),
          emissive: new THREE.Color('#ffffff').multiplyScalar(glowIntensity * 0.5), 
          map: texture,
        });
        
        const planeGeometry = new THREE.PlaneGeometry(8, 3);
      
        const layerMesh = new THREE.Mesh(planeGeometry, material);
        layerMesh.position.z = zOffset;
        
        return layerMesh;
      };
      
      const mainLayer = createTextLayer(0, 1.0, 0.2);
      
      const backLayer = createTextLayer(-0.1, 0.6, 0);
      
      if (mainLayer) textGroup.add(mainLayer);
      if (backLayer) textGroup.add(backLayer);
      
      textMeshRef.current = mainLayer;

      const backingGeometry = new THREE.PlaneGeometry(8.2, 3.2);
      const backingMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color('#222222'),
        emissive: new THREE.Color('#000000'), 
      });
      const backingMesh = new THREE.Mesh(backingGeometry, backingMaterial);
      backingMesh.position.z = -0.56; 
      textGroup.add(backingMesh);
      
      const edgeGeometry = new THREE.PlaneGeometry(8.3, 0.05);
      const edgeMaterial = new THREE.MeshBasicMaterial({
        color: 0x6e7bff,
        transparent: true,
        opacity: 0.7,
      });
      
      const topEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
      topEdge.position.y = 1.6;
      topEdge.position.z = -0.24;
      textGroup.add(topEdge);
      
      const bottomEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
      bottomEdge.position.y = -1.6;
      bottomEdge.position.z = -0.24;
      textGroup.add(bottomEdge);
      
      return textGroup;
    };
    
    createTextMesh();

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (lightRigRef.current) {
        lightRigRef.current.rotation.z += 0.01;
      }
      
      const time = Date.now() * 0.001;
      
      if (textMeshRef.current && textMeshRef.current.parent) {

        textMeshRef.current.parent.position.y = Math.sin(time * 0.5) * 0.1 + 0.1; 
        
        textMeshRef.current.parent.rotation.y = Math.sin(time * 0.3) * 0.25;
        textMeshRef.current.parent.rotation.x = Math.sin(time * 0.4) * 0.12;
        
        const edges = textMeshRef.current.parent.children.filter(
          child => child instanceof THREE.Mesh && 
          child.geometry instanceof THREE.PlaneGeometry &&
          child.geometry.parameters.width > 8 &&
          child.geometry.parameters.height < 0.1
        );
        
        edges.forEach((edge, i) => {
          if (edge instanceof THREE.Mesh) {
            edge.material.opacity = 0.5 + Math.sin(time * 1.2 + i) * 0.3;
          }
        });
      }
      
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement && containerRef.current?.removeChild(rendererRef.current.domElement);
      }
    };
  }, [text]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[200px] flex items-center justify-center"
    />
  );
};

export default Text3D;
