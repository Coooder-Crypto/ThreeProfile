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
      className="flex border-b relative"
      style={{
        flexDirection: windowWidth >= 768 ? "row" : "column",
        justifyContent: windowWidth >= 768 ? "center" : "",
        alignItems: windowWidth >= 768 ? "" : "center",
        paddingTop: windowWidth >= 768 ? "80px" : "40px",
        minHeight: windowWidth >= 768 ? "calc(100vh - 100px)" : "auto",
        paddingBottom: windowWidth < 768 ? "40px" : "0",
      }}
    >
      <AvatarCard />
      <div
        className="text-center flex flex-col items-center p-0"
        style={{
          marginLeft: windowWidth >= 768 ? "40px" : "",
          maxWidth: windowWidth >= 768 ? "500px" : windowWidth >= 480 ? "450px" : "90%",
          padding: windowWidth < 480 ? "0 15px" : "0",
        }}
      >
        <div className="w-full">
          <Text3D text="Hi, I'm Coooder 👋" />
        </div>
        <div 
          className="text-[#dfd9ff] font-medium break-words"
          style={{
            fontSize: windowWidth >= 480 ? "16px" : "15px",
            lineHeight: windowWidth >= 480 ? "1.6" : "1.5",
          }}
        >
          <p className="mb-2">
            🎓 嗨！我是张岩，北邮研一在读~ 曾参与多个校内项目、企业实习与 Web3
            开发。
          </p>

          <p className="mb-2">
            🛠️ React + Next.js + Tailwind CSS ❤️
            热爱前端世界，不断探索技术新知。
          </p>

          <p className="mb-2">
            🌐 近两年深度参与多个 Web3 远程项目开发。🔋
            自驱力强，解决问题能力突出，能高效完成各类开发任务。
          </p>

          <p>
            ✨
            期待一份能够提供更多成长空间的前端实习机会，希望在专业团队中汲取经验，获得更多技术指导与反馈
            (●'◡'●)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
