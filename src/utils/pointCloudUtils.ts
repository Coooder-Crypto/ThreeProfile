import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const createPointCloudVisualization = (container: HTMLElement, imagePath: string) => {
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50); 
  
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 50;
  controls.maxDistance = 200;
  controls.enablePan = false;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.5;
  
  const group = new THREE.Group();
  scene.add(group);
  
  const createPointCloudFromImage = (imagePath: string): Promise<THREE.Points> => {
    return new Promise((resolve, reject) => {
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      
      console.log("Loading image from path:", imagePath);
      
      img.onload = () => {
        console.log("Image loaded successfully:", imagePath, "Dimensions:", img.width, "x", img.height);
 
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const geometry = new THREE.BufferGeometry();
        const positions: number[] = [];
        const colors: number[] = [];
        const sizes: number[] = [];
        
        const step = 2; 
        const width = imageData.width;
        const height = imageData.height;
        
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const i = (y * width + x) * 4;
            
            const alpha = data[i + 3];
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;
            const brightness = (r + g + b) / 3;
            
            if (alpha < 128 || brightness < 0.1) continue;
            
            const xPos = (x - width / 2) * 0.15; 
            const yPos = (height / 2 - y) * 0.15; 
            const zPos = (brightness - 0.5) * 15; 
            
            positions.push(xPos, yPos, zPos);
            colors.push(r, g, b);
            sizes.push(brightness * 3 + 1.0); 
          }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        
        const material = new THREE.ShaderMaterial({
          uniforms: {
            pointSize: { value: 2.0 }, 
            time: { value: 0.0 }
          },
          vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            uniform float pointSize;
            
            void main() {
              vColor = color;
              
              vec3 pos = position;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * pointSize * (30.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
              
              gl_FragColor = vec4(vColor, 1.0);
            }
          `,
          transparent: true,
          vertexColors: true,
        });
        
        const points = new THREE.Points(geometry, material);
        points.name = 'imagePointCloud';
        group.add(points);
        
        resolve(points);
      };
      
      img.onerror = (error) => {
        console.error("Failed to load image:", imagePath, error);
        reject(new Error(`Failed to load image: ${imagePath} - ${error}`));
      };
      
      img.src = imagePath;
    });
  };
  
  const clock = new THREE.Clock();
  
  return {
    scene,
    camera,
    renderer,
    controls,
    group,
    
    async init() {
      console.log("Initializing point cloud visualization for image:", imagePath);
      try {
        await createPointCloudFromImage(imagePath);
        console.log("Point cloud visualization initialized successfully");
        return this;
      } catch (error) {
        console.error('Error creating point cloud:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        throw error;
      }
    },
    
    render() {
      const time = clock.getElapsedTime();
      
      const pointCloud = group.getObjectByName('imagePointCloud') as THREE.Points;
      if (pointCloud && pointCloud.material instanceof THREE.ShaderMaterial) {
        pointCloud.material.uniforms.time.value = time;
      }
      
      controls.update();
      renderer.render(scene, camera);
    },
    
    resize(width: number, height: number) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    },
    
    dispose() {
      renderer.dispose();
      
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
    }
  };
};
