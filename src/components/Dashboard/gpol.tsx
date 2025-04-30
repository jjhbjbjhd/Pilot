import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useEffect, useRef, useState } from "react";
import { useGpolStore } from "@src/store/gpolStore";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css"
import { Empty } from 'antd';
import * as d3 from 'd3';
import { Move, MousePointerClick } from 'lucide-react';
import { invoke } from "@tauri-apps/api/core";


interface GpolProps {
  data:any
}

interface GpolResult {
  path: string;
  vs: number[][];
}


interface HeatmapProps {
  data:GpolResult;
  onSelect?: (selection: {
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
  }) => void;
}

interface GpolPointChannel {
  x: number;
  y: number;
  values: number[]; // 所有通道的值
}

interface GpolSliceResult {
  width: number;
  height: number;
  m: number;
  points: GpolPointChannel[];
  point: number[],
}

const Heatmap: React.FC<HeatmapProps> = ({ data, onSelect }) => {
  if (!data) {return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <Empty style={{ color: 'white' }} />
    </div>
  );};
  

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<'select' | 'move'>('select');
  const [selection, setSelection] = useState<null | { x: number; y: number; w: number; h: number }>(null);
  const selectionStart = useRef<{ x: number; y: number } | null>(null);

  const originalWidth = data.vs[0].length;
  const originalHeight = data.vs.length;

  const colorScale = d3.scaleLinear<string>()
    .domain([d3.min(data.vs.flat()) ?? 0, d3.max(data.vs.flat()) ?? 1])
    .range(['black', 'white']);

  const render = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = originalWidth;
    canvas.height = originalHeight;

    const pixelWidth = canvas.width / originalWidth;
    const pixelHeight = canvas.height / originalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < originalHeight; y++) {
      for (let x = 0; x < originalWidth; x++) {
        const value = data.vs[y][x];
        ctx.fillStyle = colorScale(value);
        ctx.fillRect(
          x * pixelWidth,
          y * pixelHeight,
          pixelWidth,
          pixelHeight
        );
      }
    }
  };

  const drawOverlay = () => {
    const canvas = overlayRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !selection) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.strokeRect(selection.x, selection.y, selection.w, selection.h);
  };

  useEffect(() => {
    render();
  }, [data]);

  useEffect(() => {
    drawOverlay();
  }, [selection]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'select' && overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      selectionStart.current = { x, y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === 'select' && selectionStart.current && overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const sx = selectionStart.current.x;
      const sy = selectionStart.current.y;

      setSelection({
        x: Math.min(sx, x),
        y: Math.min(sy, y),
        w: Math.abs(x - sx),
        h: Math.abs(y - sy),
      });
    }
  };

  const handleMouseUp = () => {
    if (selection && onSelect && containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();

      const pixelWidth = width / originalWidth;
      const pixelHeight = height / originalHeight;

      const xStart = Math.floor(selection.x / pixelWidth);
      const xEnd = Math.floor((selection.x + selection.w) / pixelWidth);
      const yStart = Math.floor(selection.y / pixelHeight);
      const yEnd = Math.floor((selection.y + selection.h) / pixelHeight);

      onSelect({
        xStart: Math.max(0, Math.min(originalWidth - 1, xStart)),
        xEnd: Math.max(0, Math.min(originalWidth - 1, xEnd)),
        yStart: Math.max(0, Math.min(originalHeight - 1, yStart)),
        yEnd: Math.max(0, Math.min(originalHeight - 1, yEnd)),
      });
    }

    selectionStart.current = null;
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'select' ? 'move' : 'select'));
    setSelection(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center bg-black p-1 overflow-hidden"
    >
      {/* Mode toggle icon */}
      <div className="absolute top-0 right-0 z-20 bg-black/40 rounded-full p-1">
        <button
          onClick={toggleMode}
          className="text-white hover:bg-white/20 p-1 rounded transition"
          title={mode === 'select' ? '选择模式' : '移动模式'}
        >
          {mode === 'select' ? <MousePointerClick size={12} /> : <Move size={12} />}
        </button>
      </div>

      {/* Main heatmap and overlay */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <canvas
        ref={overlayRef}
        className="absolute top-0 left-0 w-full h-full z-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: mode === 'select'
            ? 'url("/white-crosshair.svg") 16 16, crosshair'
            : 'default',
        }}
      />
    </div>
  );
};

const Gpol: React.FC<GpolProps> = ({data}) => {
  const { setGpolPoints } = useGpolStore();
  return (
    <div className="w-full h-[95%] p-4">
      <Heatmap data={data}  onSelect={async ({ xStart, xEnd, yStart, yEnd }) => {
        const range = [xStart, xEnd,yStart, yEnd ];
        const gpol_data = await invoke<GpolSliceResult>("get_gpol", { range, path: data.path });
        setGpolPoints(gpol_data); // 设置到 store 中
      }} />
    </div>

  )
}

const downsample = (points: number[], values: number[], step: number) => {
  const sampled: [number, number][] = [];
  for (let i = 0; i < points.length; i += step) {
    sampled.push([points[i], values[i]]);
  }
  return sampled;
};

const Line: React.FC = () => {
  const { gpolPoints } = useGpolStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!wrapperRef.current || !canvasRef.current || !svgRef.current) return;
  
    const container = wrapperRef.current;
    const canvas = canvasRef.current;
    const svg = d3.select(svgRef.current);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
  
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    canvas.width = width;
    canvas.height = height;
    svg.selectAll("*").remove();
  
    // Provide default data if empty
    const hasData = gpolPoints?.points?.length && gpolPoints?.point?.length;
    const defaultX = d3.range(0, 10, 1);
    const defaultY = d3.range(0, 10, 1);
  
    const x = d3.scaleLinear()
      .domain(hasData ? d3.extent(gpolPoints.point) as [number, number] : [0, 10])
      .range([0, innerWidth]);
  
    const allValues = hasData ? gpolPoints.points.flatMap(p => p.values) : defaultY;
    const y = d3.scaleLinear()
      .domain([d3.min(allValues) ?? 0, d3.max(allValues) ?? 1])
      .nice()
      .range([innerHeight, 0]);
  
    // Axis
    const axisGroup = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    axisGroup.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(10)); // more ticks
  
    axisGroup.append("g")
      .call(d3.axisLeft(y).ticks(10)); // more ticks
  
    if (!hasData) return;
  
    const { point, points } = gpolPoints;
    const color = d3.scaleSequential(d3.interpolateViridis).domain([0, points.length]);
    const step = Math.ceil(point.length / 300);
    const downsampledPoints = points.map(p => downsample(point, p.values, step));
  
    ctx.save();
    ctx.translate(margin.left, margin.top);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  
    downsampledPoints.forEach((data, i) => {
      ctx.beginPath();
      ctx.strokeStyle = hoveredIndex === i ? 'red' : color(i);
      ctx.lineWidth = hoveredIndex === i ? 2.5 : 1;
      data.forEach(([xv, yv], idx) => {
        const px = x(xv);
        const py = y(yv);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.globalAlpha = hoveredIndex === null || hoveredIndex === i ? 1 : 0.1;
      ctx.stroke();
    });
  
    ctx.restore();
  
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - margin.left;
      const mouseY = e.clientY - rect.top - margin.top;
  
      workerRef.current?.postMessage({
        points: downsampledPoints,
        xScale: { domain: x.domain(), range: x.range() },
        yScale: { domain: y.domain(), range: y.range() },
        mouseX,
        mouseY,
      });
    };
  
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gpolPoints, hoveredIndex]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../worker/worker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e: MessageEvent) => {
      setHoveredIndex(e.data);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="w-full h-[95%] relative">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <svg ref={svgRef} className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none" />
    </div>
  );
};

const ResponsiveGridLayout = WidthProvider(Responsive);

const GPOL = React.memo(() => {

    const layout = [
        { i: "down", x: 0, y: 0, w: 8, h: 8, type: "gpol" },
        { i: "up", x: 0, y: 0, w: 8, h: 8, type: "line" },
      ];
    
    const { gpolData } = useGpolStore();
    
    const renderContent = (type: string) => {
    switch (type) {
        case "gpol":
            return  <Gpol data={gpolData}/>
        case "line":
            return <Line />;
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
              className="rounded-xl shadow-md hover:shadow-lg transition p-0  border border-white/40 text-gray-400 relative"
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