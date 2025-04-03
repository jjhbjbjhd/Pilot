
import starryImage from "@src/icons/bg-earth.webp"; 
import { useEffect,useState } from "react";
import "./index.css";
import { Button } from 'antd';
import { motion } from "framer-motion";

interface WaveTextProps {
    text: string;
    delay?: number;
}

const WaveText: React.FC<WaveTextProps> = ({ text, delay = 0 }) => {
    return (
      <div className="text-7xl font-bold italic tracking-tight flex overflow-hidden">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: delay + index * 0.1, // 逐个字母延迟
              duration: 0.6,
              ease: "easeOut",
            }}
            className="inline-block text-6xl font-bold italic tracking-tight"
          >
            {char === " " ? "\u00A0" : char} {/* 确保空格正常显示 */}
          </motion.span>
        ))}
      </div>
    );
  };

const Info: React.FC = () => {
    const [opacity, setOpacity] = useState(1);
    useEffect(() => {
        const generateStars = (selector: string, count: number) => {
            const container = document.querySelector(selector);
            if (container) {
                for (let i = 0; i < count; i++) {
                    const star = document.createElement("div");
                    star.className = "star";
                    star.style.setProperty("--x", Math.random().toString());
                    star.style.setProperty("--y", Math.random().toString());
                    star.style.setProperty("--size", (Math.random() * 2 + 1) + "px");
                    star.style.setProperty("--blur", Math.random() * 1 + "px");
                    star.style.setProperty("--color", getRandomColor());

                    const delay = Math.random() * 30 + "s";
                    star.style.animationDelay = `-${delay}`; 

                    container.appendChild(star);
                }
            }
        };

        const getRandomColor = () => {
            const brightColors = ["#ff5555", "#ffcc00", "#ffff55", "#33ff33", "#33ccff", "#6666ff", "#cc33ff"];
            return brightColors[Math.floor(Math.random() * brightColors.length)];
        };

        generateStars("#stars", 40);
        generateStars("#stars2", 40);
        generateStars("#stars3", 40);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
          const scrollTop = window.scrollY; // 获取滚动位置
          const maxFadeHeight = window.innerHeight * 0.9; 
          setOpacity(1 - Math.min(scrollTop / maxFadeHeight, 1)); // 动态调整透明度
        };
    
        window.addEventListener("scroll", handleScroll);
    
        // 清理事件监听
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

    return (
        <div className="about-info relative" style={{ 
            opacity ,
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%)",
            maskImage: "linear-gradient(to bottom, rgba(0, 0, 0, 1) 95%, rgba(0, 0, 0, 0) 100%)",
            }}>
           
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>

            <div className="flex flex-col items-center justify-center min-h-screen gap-4 font-bold text-base text-white transition-opacity duration-700 gap-10">
                <div className="flex items-center gap-2">
                    <Button style={{ backgroundColor: "#ffb224",color: "black",borderRadius: "30px",border: "none",padding: "10px 20px",fontWeight: "bold",transition: "all 0.3s ease"}}>
                        News
                    </Button>
                    <span>ToolHub 工具库已上线 — — 此刻起,跬步千里！</span>
                </div>

                <div className="flex  gap-2">
                    <span className="text-4xl">ToolHub</span>
                    <div>
                        <span className="text-xs text-black border border-yellow-400 px-1 py-1 rounded-md bg-yellow-300 font-bold">Client</span>
                    </div>  
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                    <WaveText text="Built for you" delay={0} />
                    <WaveText text="the Super Individual" delay={0.5} />
                </div>
               

                <div className="flx-col  font-bold  tracking-tight">
                    <div>在 ToolHub 中将你的 工作 中工具汇聚一处：根据个性化需求灵活</div>
                    <div>定制智能助手功能，解决问题，提升生产, 探索未来工作模式</div>
                </div>
            </div>
       

            <img
                src={starryImage}
                alt="Starry Night"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full  object-cover  transition-opacity duration-700"
            />
        </div>
    );
};

export default Info;

