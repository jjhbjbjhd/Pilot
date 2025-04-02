import React, { useEffect, useState,useRef } from "react";
import "./index.css"

const Feature: React.FC = () => {
  const initialRotate = 30; 
  const initialTranslateY = -window.innerHeight * 0.35; 
  
  const [rotate, setRotate] = useState(initialRotate);
  const [translateY, setTranslateY] = useState(initialTranslateY);
  const [lastScrollY, setLastScrollY] = useState(0); 
  const featureBoxTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollDelta = scrollPosition - lastScrollY; 

      if (scrollDelta > 0) {
        setRotate((prev) => {
          if(featureBoxTopRef.current){
            
            const top = featureBoxTopRef.current.getBoundingClientRect()?.top
            if(!top) return prev
            if(top < window.innerHeight * 0.6) return Math.max(prev - Math.abs(scrollDelta) / 10, 0)
          }
          return prev
        });
        setTranslateY((prev) => {
          if(featureBoxTopRef.current){
            
            const top = featureBoxTopRef.current.getBoundingClientRect()?.top
            console.log(top,scrollPosition)
            if(!top) return prev
            if(top < window.innerHeight * 0.6) return -initialTranslateY *0.5
          }

          return prev
        });
      } else {
    
        setRotate((prev) => {
          if(featureBoxTopRef.current){
            const top = featureBoxTopRef.current.getBoundingClientRect()?.top
            if(!top) return prev
            if(top > window.innerHeight*0.6) return Math.min(prev + Math.abs(scrollDelta) / 10, initialRotate)

          }
          return prev
        });
        setTranslateY((prev) => {
          if(featureBoxTopRef.current){
            const top = featureBoxTopRef.current.getBoundingClientRect()?.top
            if(!top) return prev
            if(top > window.innerHeight*0.6) return initialTranslateY

          }
          return prev
        });
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
      ref={featureBoxTopRef}
      className="flex flex-col items-center min-h-screen gap-4 font-bold text-base text-white transition-opacity duration-700 relative"
    >
      <div className="bg-[#25223c] items-center text-lg p-4 flex flex-row gap-4 m-10 border-none border-gray-400 rounded-xl bg-[#2E2D3A] h-12 shadow-md shadow-gray-800/30 backdrop-blur-md opacity-70">
        <div className="px-4 py-2 hover:bg-gray-300 transition-all duration-200 cursor-pointer rounded-lg m-o p-0">概览</div>
        <div className="px-4 py-2 hover:bg-gray-300 transition-all duration-200 cursor-pointer rounded-lg m-o p-0">TODO</div>
        <div className="px-4 py-2 hover:bg-gray-300 transition-all duration-200 cursor-pointer rounded-lg m-o p-0">TODO</div>
        <div className="px-4 py-2 hover:bg-gray-300 transition-all duration-200 cursor-pointer rounded-lg m-o p-0">TODO</div>
        <div className="px-4 py-2 hover:bg-gray-300 transition-all duration-200 cursor-pointer rounded-lg m-o p-0">TODO</div>
      </div>

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
