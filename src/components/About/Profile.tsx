import AvatarCard from "./AvatarCard";
import { useEffect, useState } from "react";
import Text3D from "./Text3D";

const Profile = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  //TODO 处理屏幕适配，tailwindcss 自带的没法用
  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div
      className="bg-hero-pattern flex h-screen bg-cover bg-center bg-no-repeat"
      style={{
        flexDirection: windowWidth >= 768 ? "row" : "column",
        justifyContent: windowWidth >= 768 ? "center" : "",
        alignItems: windowWidth >= 768 ? "" : "center",
        paddingTop: windowWidth >= 768 ? "80px" : "40px",
      }}
    >
      <AvatarCard />
      <div
        style={{
          textAlign: "center",
          marginLeft: windowWidth >= 768 ? "40px" : "",
        }}
      >
        <div className="w-full">
          <Text3D
            text="Hi, I'm Coooder"
          />
        </div>
        <p className="text-[#dfd9ff] max-w-[400px] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mt-4 max-w-2xl mx-auto break-words">
          Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer Frontend Developer
        </p>
      </div>
    </div>
  );
};

export default Profile;
