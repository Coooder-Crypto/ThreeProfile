import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import html2canvas from 'html2canvas';

// Data for the Earth visualization
const earthData = [
  {
    name: '北京',
    N: 39.904211,
    E: 116.407395,
  }
];

// 转换球面坐标
export const lon2xyz = (R: number, longitude: number, latitude: number): THREE.Vector3 => {
  let lon = longitude * Math.PI / 180; 
  const lat = latitude * Math.PI / 180; 
  lon = -lon; 


  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);

  return new THREE.Vector3(x, y, z);
};

export const createEarthVisualization = (container: HTMLElement) => {

  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(0, 30, -250);
  
  const renderer = new THREE.WebGLRenderer({
    alpha: true, // 透明
    antialias: true, // 抗锯齿
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  
  const controls = new OrbitControls(camera as any, renderer.domElement);
  controls.autoRotateSpeed = 3;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = true;
  controls.minDistance = 100;
  controls.maxDistance = 300;
  controls.enablePan = false;
  
  const group = new THREE.Group();
  group.name = "group";
  group.scale.set(0, 0, 0);
  
  const earthGroup = new THREE.Group();
  group.add(earthGroup);
  earthGroup.name = "EarthGroup";
  
  scene.add(group);
  
  const textureLoader = new THREE.TextureLoader();
  const textures: Record<string, THREE.Texture> = {};
  
  const textureFiles = [
    { name: 'earth', url: '/images/earth.jpg' },
    { name: 'light_column', url: '/images/light_column.png' },
    { name: 'glow', url: '/images/glow.png' },
    { name: 'aperture', url: '/images/aperture.png' },
    { name: 'gradient', url: '/images/gradient.png' },
  ];
  
  const loadTextures = () => {
    return Promise.all(
      textureFiles.map(file => {
        return new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            file.url, 
            (texture) => {
              textures[file.name] = texture;
              resolve(texture);
            },
            undefined,
            (error) => {
              console.error(`Error loading texture ${file.url}:`, error);
              reject(error);
            }
          );
        });
      })
    );
  };
  
  // Create Earth
  const createEarth = () => {
    const earthRadius = 50;
    
    const earth_geometry = new THREE.SphereGeometry(
      earthRadius,
      50,
      50
    );
    
    const uniforms = {
      glowColor: {
        value: new THREE.Color(0x0cd1eb),
      },
      scale: {
        type: "f",
        value: -1.0,
      },
      bias: {
        type: "f",
        value: 1.0,
      },
      power: {
        type: "f",
        value: 3.3,
      },
      time: {
        type: "f",
        value: 100,
      },
      isHover: {
        value: false,
      },
      map: {
        value: textures.earth,
      },
    };
    
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vp;
      varying vec3 vPositionNormal;
      void main(void){
        vUv = uv;
        vNormal = normalize( normalMatrix * normal );
        vp = position;
        vPositionNormal = normalize(( modelViewMatrix * vec4(position, 1.0) ).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;
    
    const fragmentShader = `
      uniform vec3 glowColor;
      uniform float bias;
      uniform float power;
      uniform float time;
      varying vec3 vp;
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      uniform float scale;
      uniform sampler2D map;
      varying vec2 vUv;

      void main(void){
        float a = pow( bias + scale * abs(dot(vNormal, vPositionNormal)), power );
        if(vp.y > time && vp.y < time + 20.0) {
          float t =  smoothstep(0.0, 0.8,  (1.0 - abs(0.5 - (vp.y - time) / 20.0)) / 3.0  );
          gl_FragColor = mix(gl_FragColor, vec4(glowColor, 1.0), t * t );
        }
        gl_FragColor = mix(gl_FragColor, vec4( glowColor, 1.0 ), a);
        gl_FragColor = gl_FragColor + texture2D( map, vUv );
      }
    `;
    
    const earth_material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
    
    earth_material.needsUpdate = true;
    const earth = new THREE.Mesh(earth_geometry, earth_material);
    earth.name = "earth";
    earthGroup.add(earth);

    gsap.to(group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: "Quadratic",
    });
    
    return {
      scene,
      camera,
      renderer,
      controls,
      group,
      earthGroup,
      earth,
      isRotation: true,
      
      async init() {
        const markupPoint = new THREE.Group();
        markupPoint.name = "markupPoint";
      
        const punctuationMaterial = new THREE.MeshBasicMaterial({
          color: 0x3892ff,
          transparent: true,
          depthWrite: false,
        });
        
        for (const location of earthData) {
          const radius = earthRadius;
          const lon = location.E;
          const lat = location.N;
          
          const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            punctuationMaterial
          );
          const coord = lon2xyz(radius * 1.001, lon, lat);
          const size = radius * 0.05;
          mesh.scale.set(size, size, size);
          mesh.position.set(coord.x, coord.y, coord.z);
          const coordVec3 = new THREE.Vector3(coord.x, coord.y, coord.z).normalize();
          const meshNormal = new THREE.Vector3(0, 0, 1);
          mesh.quaternion.setFromUnitVectors(meshNormal, coordVec3);
          markupPoint.add(mesh);
          
          const lightPillarGroup = new THREE.Group();
          const height = radius * 0.3;
          const pillarGeometry = new THREE.PlaneGeometry(radius * 0.05, height);
          pillarGeometry.rotateX(Math.PI / 2);
          pillarGeometry.translate(0, 0, height / 2);
          const pillarMaterial = new THREE.MeshBasicMaterial({
            map: textures.light_column,
            color: 0xe4007f,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          const pillarMesh = new THREE.Mesh(pillarGeometry, pillarMaterial);
          lightPillarGroup.add(pillarMesh, pillarMesh.clone().rotateZ(Math.PI / 2));
          const sphereCoord = lon2xyz(radius, lon, lat);
          lightPillarGroup.position.set(sphereCoord.x, sphereCoord.y, sphereCoord.z);
          const pillarCoordVec3 = new THREE.Vector3(sphereCoord.x, sphereCoord.y, sphereCoord.z).normalize();
          lightPillarGroup.quaternion.setFromUnitVectors(meshNormal, pillarCoordVec3);
          markupPoint.add(lightPillarGroup);
        }
        
        earthGroup.add(markupPoint);
        
        // Create position labels
        await this.createPositionLabels(earthRadius, earth);

        const loading = document.getElementById('loading');
        if (loading) {
          loading.classList.add('out');
        }
      },
      
      async createPositionLabels(radius: number, earth: THREE.Mesh) {
        for (const location of earthData) {
          const p = lon2xyz(radius * 1.001, location.E, location.N);
          
          const div = document.createElement('div');
          div.className = 'fire-div';
          div.textContent = location.name;
          
          const shareContent = document.getElementById('html2canvas');
          if (shareContent) {
            shareContent.innerHTML = '';
            shareContent.appendChild(div);
            
            try {
              const canvas = await html2canvas(shareContent, {
                backgroundColor: null,
                scale: 6,
              });
              
              const dataURL = canvas.toDataURL('image/png');
              
              const labelTexture = new THREE.TextureLoader().load(dataURL);
              
              const material = new THREE.SpriteMaterial({
                map: labelTexture,
                transparent: true,
              });
              
              const sprite = new THREE.Sprite(material);
              const len = 5 + (location.name.length - 2) * 2;
              sprite.scale.set(len, 3, 1);
              sprite.position.set(p.x * 1.1, p.y * 1.1, p.z * 1.1);
              earth.add(sprite);
            } catch (error) {
              console.error('Error creating label:', error);
            }
          }
        }
      },
      
      
      render() {
        if (this.isRotation) {
          this.earthGroup.rotation.y += 0.002; 
        }
        
        renderer.render(scene, camera);
      },
      
      dispose() {
        renderer.dispose();
        
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  };
  
  return new Promise<any>((resolve, reject) => {
    loadTextures()
      .then(() => {
        const earth = createEarth();
        earth.init()
          .then(() => {
            resolve(earth);
          })
          .catch(error => {
            console.error("Error initializing Earth:", error);
            reject(error);
          });
      })
      .catch(error => {
        console.error("Error loading textures:", error);
        reject(error);
      });
  });
};
