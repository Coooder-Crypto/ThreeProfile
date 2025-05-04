"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { createPointCloudVisualization } from "@/utils/pointCloudUtils";
import ProjectLink from "./ProjectLink";

const AvatarCard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointCloudInstance, setPointCloudInstance] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let pointCloudInstance: any = null;
    let animationFrameId: number;

    console.log(
      "Creating point cloud visualization for image:",
      "/images/Coooder.jpg"
    );

    const visualization = createPointCloudVisualization(
      container,
      "/images/Coooder.jpg"
    );

    visualization
      .init()
      .then((instance) => {
        console.log("Point cloud visualization initialized successfully");
        pointCloudInstance = instance;
        setPointCloudInstance(instance);

        const handleResize = () => {
          if (!instance) return;

          const width = container.clientWidth;
          const height = container.clientHeight;

          instance.resize(width, height);
        };

        window.addEventListener("resize", handleResize);

        const animate = () => {
          animationFrameId = requestAnimationFrame(animate);

          if (instance) {
            instance.render();
          }
        };

        animate();
      })
      .catch((error: Error) => {
        console.error("Failed to initialize point cloud visualization:", error);
        console.error("Error details:", error.message, error.stack);
      });

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (pointCloudInstance) {
        pointCloudInstance.dispose();
      }

      window.removeEventListener("resize", () => {});
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div className="flex flex-col w-[350px] h-[350px] items-center">
      <div
        ref={containerRef}
        className="w-[350px] h-[350px] rounded-xl overflow-hidden bg-transparent"
        style={{
          boxShadow: "0 10px 30px -10px rgba(145, 94, 255, 0.5)",
        }}
      />
      <ProjectLink url="https://github.com/Coooder-Crypto"/>
    </div>
  );
};

export default AvatarCard;
