import AvatarCard from "./AvatarCard";
import { useEffect, useState } from "react";

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
      className="ml-[40px]"
        style={{
          textAlign: "center",
          marginLeft: windowWidth >= 768 ? "40px" : "",
        }}
      >
        <h1 className="font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px]">
          Hi, I'm <span className="text-[#915EFF]">Coooder</span>
        </h1>
        <p className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mt-4">
          Frontend Developer
        </p>
      </div>
    </div>
  );
};

export default Profile;
