import React, { useState, useEffect } from "react";
import author1 from "@src/icons/img-1.avif";
import author2 from "@src/icons/img-2.avif";
import author3 from "@src/icons/img-3.avif";
import author4 from "@src/icons/img-4.avif";
import author5 from "@src/icons/img-5.avif";
import author6 from "@src/icons/author.png";

const authors = [
  { img: author1, desc: "介绍1" },
  { img: author2, desc: "介绍2" },
  { img: author3, desc: "介绍3" },
  { img: author4, desc: "介绍4" },
  { img: author5, desc: "介绍5" },
  { img: author6, desc: "Shengwei.Liu" },
];

const Author: React.FC = () => {
  const [rotation, setRotation] = useState(0); 
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); 
  const radius = 240; 
  const speed = 0.12; 

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (hoveredIndex === null) {
        setRotation((prev) => prev + speed);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredIndex]);

  return (
    <div className="relative h-screen flex items-center justify-center bg-black text-white">
      {/* 中心 Meet Our Team */}
      <div className="absolute text-center text-2xl font-bold">
        <span>Meet Our Team!</span>
        <p className="text-sm opacity-70">Creative minds shaping the future</p>
      </div>

      {/* 旋转头像 */}
      {authors.map((author, index) => {
        const angle = (index * 360) / authors.length + rotation; // 计算角度
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        const isHovered = hoveredIndex === index;

        return (
            <div
                key={index}
                className="absolute flex flex-row items-center transition-transform duration-500 ease-out gap-4"
                style={{
                transform: `translate(${x}px, ${y}px)`, // 头像沿轨道旋转
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                {/* 头像 */}
                <div
                className={`rounded-full transition-all duration-500 ${
                    isHovered
                    ? "scale-150 border-4  shadow-lg "
                    : "scale-100 border-2 "
                }`}
                style={{
                    width: isHovered ? "120px" : "100px",
                    height: isHovered ? "120px" : "100px",
                    transform: `rotate(${rotation *0.005}deg)`, // 头像保持正向
                    transition: "transform 0.3s ease-out, scale 0.3s ease-out",
                }}
                >
                <img src={author.img} className="w-full h-full rounded-full object-cover" />
                </div>

                {/* 介绍文本 */}
                <div
                    className={`text-sm opacity-0 transition-opacity duration-300 ${
                        isHovered ? "opacity-100" : ""
                    }`}
                >
                    {author.desc}
                </div>
          </div>
        );
      })}
        
        <div className="fixed bottom-0 left-0 w-full text-center bg-black text-white py-2 text-sm opacity-20 m-1 p-1">
            <span>CopyRight © 2025 Shengwei.Liu. All rights reserved.</span>
        </div>

    </div>
  );
};

export default Author;
