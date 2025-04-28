import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Menu } from 'antd';
import { useGpolStore } from "@src/store/gpolStore";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css"
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { Empty } from 'antd';

import {
  ZoomInOutlined,
  RedoOutlined,
  EditOutlined,
  DownOutlined,
} from '@ant-design/icons';

interface GpolProps {
  data: any;
}

const Gpol: React.FC<GpolProps> = ({data}) => {
  const menu = (
    <Menu
      items={[
        { label: '类型1', key: '1' },
        { label: '类型2', key: '2' },
        { label: '类型3', key: '3' },
      ]}
    />
  );

  const darkButtonClass = 'bg-gray-800 text-white border-none hover:bg-gray-800';

  return (
    <div className="h-[85%]">
      <div className="flex flex-row h-full gap-5">
        <Line />
        <Image data={data}/>
      </div>

      <div className="flex flex-row gap-4 p-2 justify-between">
        {/* 左侧的按钮 */}
        <div className="flex flex-row gap-4 p-2 items-center justify-start">
          <Button icon={<EditOutlined />} className={darkButtonClass} />
          <Dropdown overlay={menu}>
            <Button icon={<DownOutlined />} className={darkButtonClass}>样本类型</Button>
          </Dropdown>
        </div>

        {/* 右侧的按钮 */}
        <div className="flex flex-row gap-4 p-2 items-center justify-end">
          <Button icon={<ZoomInOutlined />} className={darkButtonClass} />
          <Button icon={<RedoOutlined />} className={darkButtonClass} />
        </div>
      </div>
    </div>

  )
}

const Line: React.FC = () => {
  return <div className="w-full h-full" />;
}


const Image: React.FC<GpolProps> = ({ data }) => {
  const plotRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [plotSize, setPlotSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!data || !data.vs || !plotRef.current) return;

    const width = data.vs[0].length;
    const height = data.vs.length;
    const pixels = data.vs.flat();

    const plot = Plot.plot({
      margin: 4,
      axis: null,
      aspectRatio: 1,
      color: {
        scheme: "greys",
        domain: d3.extent(pixels),
      },
      marks: [Plot.raster(pixels, { width, height })],
    });

    plotRef.current.innerHTML = '';
    plotRef.current.appendChild(plot);
    const initialWidth = plotRef.current.offsetWidth;
    const initialHeight = plotRef.current.offsetHeight;
    setPlotSize({ width: initialWidth, height: initialHeight });

  }, [data]);

  // ResizeObserver 用于在容器大小变化时更新 plotSize
  useEffect(() => {
    if (!plotRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setPlotSize({
          width,
          height
        });
      }
    });

    observer.observe(plotRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let startX = 0;
    let startY = 0;
    let rect: SVGRectElement | null = null;

    const onMouseDown = (e: MouseEvent) => {
      if (!svgRef.current) return;
      const bounds = svgRef.current.getBoundingClientRect();
      startX = e.clientX - bounds.left;
      startY = e.clientY - bounds.top;

      // ⚠️ 删除上一个虚线框
      const old = svgRef.current.querySelector('rect');
      if (old) svgRef.current.removeChild(old);

      // 新建虚线框
      rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(startX));
      rect.setAttribute("y", String(startY));
      rect.setAttribute("width", "0");
      rect.setAttribute("height", "0");
      rect.setAttribute("stroke", "red");
      rect.setAttribute("stroke-dasharray", "4");
      rect.setAttribute("fill", "none");
      svgRef.current.appendChild(rect);

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!rect || !svgRef.current) return;
      const bounds = svgRef.current.getBoundingClientRect();
      const currX = e.clientX - bounds.left;
      const currY = e.clientY - bounds.top;

      const x = Math.min(currX, startX);
      const y = Math.min(currY, startY);
      const width = Math.abs(currX - startX);
      const height = Math.abs(currY - startY);

      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", String(width));
      rect.setAttribute("height", String(height));
    };

    const onMouseUp = () => {
      if (rect && data && data.vs) {
        const x0 = Math.round(parseFloat(rect.getAttribute("x")!));
        const y0 = Math.round(parseFloat(rect.getAttribute("y")!));
        const width = Math.round(parseFloat(rect.getAttribute("width")!));
        const height = Math.round(parseFloat(rect.getAttribute("height")!));
        const x1 = x0 + width;
        const y1 = y0 + height;

        // 👉 映射到数据索引
        const rowStart = Math.floor(y0 / plotSize.height * data.vs.length);
        const rowEnd = Math.floor(y1 / plotSize.height * data.vs.length);
        const colStart = Math.floor(x0 / plotSize.width * data.vs[0].length);
        const colEnd = Math.floor(x1 / plotSize.width * data.vs[0].length);

        console.log("选中的数据索引：", { rowStart, rowEnd, colStart, colEnd });
      }

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    svg.addEventListener("mousedown", onMouseDown);
    return () => {
      svg.removeEventListener("mousedown", onMouseDown);
    };
  }, [plotSize]);

  if (!data || !data.vs) {
    return (
      <div className="w-full h-[98%] flex items-center justify-center bg-black">
        <Empty description={<span style={{ color: 'white' }}>暂无数据</span>} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[98%] flex items-center justify-center overflow-auto">
      <div className="relative">
        <div ref={plotRef} />
        <svg
          ref={svgRef}
          className="absolute inset-0 z-10 pointer-events-auto"
          width={plotSize.width}
          height={plotSize.height}
        />
      </div>
    </div>
  );
};


const ResponsiveGridLayout = WidthProvider(Responsive);

const GPOL = React.memo(() => {

    const layout = [
        { i: "down", x: 0, y: 0, w: 8, h: 8, type: "gpol" },
      ];
    
    const { gpolData } = useGpolStore();
    
    const renderContent = (type: string) => {
    switch (type) {
        case "gpol":
            return  <Gpol data={gpolData}/>
        default:
            return <div>Unknown</div>;
    }
    };


    return (
        <ResponsiveGridLayout
          className="layout m-8"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
          rowHeight={60}
          margin={[8, 8]}
          draggableHandle=".drag-handle"
        >
          {layout.map((item) => (
            <div
              key={item.i}
              className="rounded-xl shadow-md hover:shadow-lg transition p-0 overflow-hidden border border-white/40 text-gray-400 relative"
            >
              <div className="drag-handle absolute bottom-1 left-1 cursor-move text-white text-xs">
                ⠿
              </div>
              {renderContent(item.type)}
            </div>
          ))}
        </ResponsiveGridLayout>
    );
    
});

export default GPOL