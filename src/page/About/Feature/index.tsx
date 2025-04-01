import React, { useEffect, useState } from "react";
import "./index.css"

const Feature: React.FC = () => {
  const initialRotate = 30; 
  const initialTranslateY = -window.innerHeight * 0.35; 
  
  const [rotate, setRotate] = useState(initialRotate);
  const [translateY, setTranslateY] = useState(initialTranslateY);
  const [lastScrollY, setLastScrollY] = useState(0); 

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollDelta = scrollPosition - lastScrollY; 

      if (scrollDelta > 0) {
        setRotate((prev) => Math.max(prev - Math.abs(scrollDelta) / 10, 0));
        setTranslateY((prev) => Math.min((prev + Math.abs(scrollDelta) ), window.innerHeight * 0.15));
      } else {
      
        setRotate((prev) => Math.min(prev + Math.abs(scrollDelta) / 10, initialRotate));
        setTranslateY((prev) => Math.max((prev - Math.abs(scrollDelta) / 5)-window.innerHeight * 0.3, initialTranslateY));
      }

      setLastScrollY(scrollPosition);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div
      id="feature_box"
      className="flex flex-col items-center min-h-screen gap-4 font-bold text-base text-white transition-opacity duration-700 relative"
    >
      <div className="text-2xl p-4">button</div>
      <div
        className={`bg-[#000000] flex flex-col justify-center items-center w-4/5 h-4/5 absolute transform -translate-x-1/2 z-10 rounded-lg 
        ${rotate === 0 ? "glow-border" : ""}`} 
        style={{
          transform: `perspective(700px) rotate3d(1, 0, 0, ${rotate}deg) translateY(${translateY}px)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.2s ease-out",
          border: rotate === 0 ? "2px solid rgba(236, 231, 247, 0.8)" : "1px solid rgba(255, 255, 255, 0.5)", 
          boxShadow: rotate === 0 ? "0 0 10px rgba(248, 173, 173, 0.8)" : "none", 
          filter: rotate === 0 ? "drop-shadow(0 0 25px rgba(250, 249, 250, 0.8))" : "none", 
        }}
      >
        TODOING
      </div>
    </div>
  );
};

export default Feature;
