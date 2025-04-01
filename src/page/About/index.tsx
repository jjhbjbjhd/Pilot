import { useState, useEffect } from "react";

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
    <div className="flex">
      {/* 页面内容 */}
      <div className="flex-grow p-8">
        <section id="about" className="my-32">
          <h1 className="text-3xl font-bold mb-4">About Page</h1>
          <p>This is the about page.</p>
        </section>
        <section id="services" className="my-32">
          <h1 className="text-3xl font-bold mb-4">Services</h1>
          <p>These are the services we provide.</p>
        </section>
        <section id="contact" className="my-32">
          <h1 className="text-3xl font-bold mb-4">Contact</h1>
          <p>Get in touch with us!</p>
        </section>
      </div>

      {/* 右侧导航栏 */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 p-4">
        <div className="flex flex-col gap-4">
          {["about", "services", "contact"].map((id) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`py-2 px-4 rounded transition ${
                activeSection === id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
