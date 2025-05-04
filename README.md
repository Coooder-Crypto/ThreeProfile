# Three.js Profile

一个基于 Next.js 和 Three.js 构建的个人作品集网站，展示了多种 3D 可视化效果和交互体验。

## 项目介绍

这是一个使用 Next.js 框架构建的个人作品集网站，结合了 Three.js 实现多种 3D 可视化效果，包括点云头像、3D 地球和 3D 文本等元素。项目采用了现代前端技术栈，包括 React、TypeScript、Tailwind CSS 等，展示了个人信息、项目经历和技术能力。

### 主要功能

- 3D 点云头像展示
- 3D 文本渲染与动画
- 交互式 3D 地球可视化
- 响应式设计，适配不同设备
- 项目时间线展示

## 技术实现

### 核心技术栈

- **前端框架**: Next.js 15.x
- **3D 渲染**: Three.js 0.176.0
- **UI 组件**: React 19.x
- **样式**: Tailwind CSS 4.x
- **动画**: GSAP、Framer Motion
- **类型检查**: TypeScript

### Three.js 实现细节

#### 1. 点云头像 (Point Cloud Avatar)

点云头像是将 2D 图像转换为 3D 点云的可视化效果，实现了图像的立体展示和交互。

**技术实现:**

- 使用 Canvas API 读取图像像素数据
- 基于像素亮度和透明度生成 3D 点云
- 使用自定义着色器 (Shader) 控制点的大小、颜色和渲染效果
- 实现轨道控制 (OrbitControls) 支持交互旋转和缩放

```javascript
// 核心实现逻辑
const createPointCloudFromImage = (imagePath) => {
  // 读取图像数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // 生成点云几何体
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const sizes = [];
  
  // 基于像素数据生成点云
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      
      const alpha = data[i + 3];
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const brightness = (r + g + b) / 3;
      
      // 根据亮度和透明度过滤点
      if (alpha < 128 || brightness < 0.1) continue;
      
      // 计算点的 3D 位置
      const xPos = (x - width / 2) * 0.15; 
      const yPos = (height / 2 - y) * 0.15; 
      const zPos = (brightness - 0.5) * 15; 
      
      positions.push(xPos, yPos, zPos);
      colors.push(r, g, b);
      sizes.push(brightness * 3 + 1.0);
    }
  }
  
  // 创建自定义着色器材质
  const material = new THREE.ShaderMaterial({
    // 顶点着色器和片元着色器定义
    // ...
  });
  
  // 创建点云对象
  const points = new THREE.Points(geometry, material);
};
```

#### 2. 3D 地球 (Earth Visualization)

3D 地球可视化使用了自定义着色器和纹理，实现了地球表面的渲染、光柱标记和位置标签等效果。

**技术实现:**

- 使用球体几何体 (SphereGeometry) 创建地球基础模型
- 应用地球纹理和自定义着色器实现表面效果
- 使用经纬度转换函数 (lon2xyz) 在地球表面精确定位
- 添加光柱和标记点突出显示特定位置
- 实现自动旋转和交互控制

```javascript
// 经纬度转换为 3D 坐标
export const lon2xyz = (R, longitude, latitude) => {
  let lon = longitude * Math.PI / 180; 
  const lat = latitude * Math.PI / 180; 
  lon = -lon; 

  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);

  return new THREE.Vector3(x, y, z);
};

// 地球着色器实现
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
    // 计算边缘发光效果
    float a = pow( bias + scale * abs(dot(vNormal, vPositionNormal)), power );
    
    // 添加扫描线效果
    if(vp.y > time && vp.y < time + 20.0) {
      float t = smoothstep(0.0, 0.8, (1.0 - abs(0.5 - (vp.y - time) / 20.0)) / 3.0);
      gl_FragColor = mix(gl_FragColor, vec4(glowColor, 1.0), t * t);
    }
    
    // 混合发光效果和纹理
    gl_FragColor = mix(gl_FragColor, vec4(glowColor, 1.0), a);
    gl_FragColor = gl_FragColor + texture2D(map, vUv);
  }
`;
```

#### 3. 3D 文本 (Text3D)

3D 文本组件使用 Canvas API 和 Three.js 实现了具有动态光照和动画效果的文本渲染。

**技术实现:**

- 使用 Canvas API 在 2D 画布上渲染文本和渐变效果
- 将画布转换为纹理应用到 3D 平面几何体
- 创建多层文本实现深度和发光效果
- 添加动态光源系统，实现旋转光照效果
- 使用 requestAnimationFrame 实现平滑动画

```javascript
// 创建文本层
const createTextLayer = (zOffset, colorMultiplier, glowIntensity) => {
  // 创建 Canvas 并绘制文本
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // 创建渐变
  const gradient = context.createLinearGradient(0, 0, canvasSize, 0);
  gradient.addColorStop(0, '#ff5c7c');
  gradient.addColorStop(0.3, '#ff9d7c');
  gradient.addColorStop(0.5, '#ffffff');
  gradient.addColorStop(0.7, '#7c9dff');
  gradient.addColorStop(1, '#6e7bff');
  
  // 设置文本样式和绘制
  context.font = `bold ${canvasSize / 10}px Arial, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = gradient;
  context.fillText(text, canvasSize / 2, canvasSize / 6);
  
  // 创建纹理和材质
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.MeshLambertMaterial({
    transparent: true,
    color: new THREE.Color('#ffffff').multiplyScalar(colorMultiplier),
    emissive: new THREE.Color('#ffffff').multiplyScalar(glowIntensity * 0.5),
    map: texture,
  });
  
  // 创建平面几何体并应用材质
  const planeGeometry = new THREE.PlaneGeometry(8, 3);
  const layerMesh = new THREE.Mesh(planeGeometry, material);
  layerMesh.position.z = zOffset;
  
  return layerMesh;
};
```

### 性能优化

- 使用 `requestAnimationFrame` 实现平滑动画
- 实现组件卸载时的资源释放，避免内存泄漏
- 使用 `useRef` 和 `useState` 管理 Three.js 实例
- 响应式设计，根据窗口大小调整渲染分辨率
- 使用 GSAP 实现高性能动画效果

## 项目结构

```
src/
├── app/                  # Next.js 应用页面
│   ├── about/            # 关于页面
│   ├── globals.css       # 全局样式
│   └── layout.tsx        # 布局组件
├── components/           # React 组件
│   ├── About/            # 关于页面组件
│   │   ├── AvatarCard.tsx    # 头像卡片组件
│   │   ├── Profile.tsx       # 个人资料组件
│   │   ├── ProjectCard.tsx   # 项目卡片组件
│   │   ├── ProjectList.tsx   # 项目列表组件
│   │   └── Text3D.tsx        # 3D 文本组件
│   ├── Earth/            # 地球组件
│   │   └── EarthCanvas.tsx   # 地球画布组件
│   └── Layout/           # 布局组件
├── utils/                # 工具函数
│   ├── earthUtils.ts     # 地球可视化工具
│   └── pointCloudUtils.ts # 点云工具
├── assets.ts             # 资源数据
└── types.ts              # TypeScript 类型定义
```

## 安装与运行

```bash
# 安装依赖
npm install
# 或
yarn install
# 或
pnpm install

# 开发模式运行
npm run dev
# 或
yarn dev
# 或
pnpm dev

# 构建项目
npm run build
# 或
yarn build
# 或
pnpm build

# 启动生产服务
npm run start
# 或
yarn start
# 或
pnpm start
```

## 未来计划

- 添加更多交互式 3D 可视化效果
- 优化移动端体验
- 添加暗色/亮色主题切换
- 实现更多自定义着色器效果
- 添加国际化支持

## 许可证

MIT
