import * as Plot from "@observablehq/plot";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const HotMap:React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [gistemp, setGistemp] = useState<any[]>([]);
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
      d3.csv("/gistemp.csv", d3.autoType).then((data) => {
        setGistemp(data);
      });
    }, []);
    // 👀 监听容器尺寸
    useEffect(() => {
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          setSize({ width, height });
        }
      });
  
      if (containerRef.current) {
        observer.observe(containerRef.current);
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
  
      return () => observer.disconnect();
    }, []);
  
    // 📊 绘制图表
    useEffect(() => {
      if (!size.width || !size.height || !containerRef.current || gistemp.length === 0) return;
  
      const chart = Plot.plot({
        color: {scheme: "BuRd"},
        marks: [
          Plot.ruleY([0]),
          Plot.dot(gistemp, {x: "Date", y: "Anomaly", stroke: "Anomaly"}),
          Plot.lineY(gistemp, Plot.windowY(12, {x: "Date", y: "Anomaly"}))
        ]
      });
  
      containerRef.current.innerHTML = "";
      containerRef.current.append(chart);
    }, [size, gistemp]);
  
    return <div ref={containerRef} className="w-full h-full" />;
  }

  export default HotMap;