import { useState, useEffect } from "react";
import InfoNavigation from "@components/Navigation";
import Info from "./Info";
import Feacture from "./Feature";
import Hub from "./Hub";
import Author from "./Author";

const About: React.FC = () => {
  // 当前选中的 section
  const [activeSection, setActiveSection] = useState<string>("about");

  // 滚动时更新 activeSection
  const handleScroll = () => {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
        setActiveSection(section.id);
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 点击按钮时更新 activeSection 并滚动
  const scrollToSection = (id: string) => {
    setActiveSection(id); // 立即更新选中状态
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex bg-[#000000] m-0 p-0">
      {/* 页面内容 */}
      <div className="flex-grow p-0">
        <section id="about" className="min-h-screen text-white">
          <Info />
        </section>

        <section id="feature" className="min-h-screen text-white">
          <Feacture />
        </section>

        <section id="hub" className="min-h-screen text-white">
          <Hub />
        </section>

        <section id="contact" className="min-h-screen text-white">
          <Author />
        </section>
      </div>

      {/* 右侧导航栏 */}
      <InfoNavigation activeSection={activeSection} onScrollToSection={scrollToSection} />
    </div>
  );
};

export default About;
