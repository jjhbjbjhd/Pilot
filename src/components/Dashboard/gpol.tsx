import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useEffect, useRef, useState } from "react";
import { useGpolStore } from "@src/store/gpolStore";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css"
import { Empty } from 'antd';


interface GpolProps {
  data: any;
}

const Gpol: React.FC<GpolProps> = ({data}) => {
  return (
    <div className="w-full h-[95%]">
      <div className="flex flex-row h-full w-full gap-5">
        <Line />
        <Image data={data}/>
      </div>
    </div>

  )
}

const Line: React.FC = () => {
  return <div className="w-full h-full" />;
}

const Image: React.FC<GpolProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<'move' | 'select'>('move');

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const [selectionRect, setSelectionRect] = useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
  }>(null);

  const selectionStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (data && containerRef.current) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = -e.deltaY;

        setScale(prev => {
          const newScale = prev + (delta > 0 ? 0.1 : -0.1);
          return Math.max(1, parseFloat(newScale.toFixed(2)));
        });
      };

      const container = containerRef.current;
      container.addEventListener('wheel', handleWheel, { passive: false });

      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [data]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'move') {
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
    } else if (mode === 'select' && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const startX = (e.clientX - rect.left ) / scale ;
      const startY = (e.clientY - rect.top ) / scale ;
      selectionStart.current = { x: startX, y: startY };
      setSelectionRect(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mode === 'move' && isDragging.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setOffset(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      dragStart.current = { x: e.clientX, y: e.clientY };
    } else if (mode === 'select' && selectionStart.current && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale ;
      const y = (e.clientY - rect.top) / scale;
      const sx = selectionStart.current.x;
      const sy = selectionStart.current.y;

      setSelectionRect({
        x: Math.min(sx, x),
        y: Math.min(sy, y),
        width: Math.abs(x - sx),
        height: Math.abs(y - sy),
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDragging.current = false;
    selectionStart.current = null;

    if (mode === 'select' && selectionRect && imgRef.current) {
  

    }
  };

  const handleDoubleClick = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'move' ? 'select' : 'move'));
    setSelectionRect(null);
  };

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <Empty description={<span style={{ color: 'white' }}>暂无数据</span>} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden"
    >
      <div className="absolute top-0 right-0 z-20 flex items-center gap-2 text-white p-2">
        <button
          onClick={toggleMode}
          title="切换模式"
          className={`p-2 rounded-full ${
            mode === 'select' ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crop">
            <path d="M6 2v14a2 2 0 0 0 2 2h14" />
            <path d="M18 22V8a2 2 0 0 0-2-2H2" />
          </svg>
        </button>
      </div>

      <div
        ref={imgWrapperRef}
        className={`relative w-full h-full transition-transform duration-100 ${
          mode === 'move' ? 'cursor-grab' : 'cursor-crosshair'
        }`}
        style={{
          transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: 'center center',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      >
        <img
          ref={imgRef}
          src={data}
          alt="Heatmap"
          className="absolute top-0 left-0 w-full h-full object-fill"
        />
        <svg
          ref={svgRef}
          className="absolute inset-0 z-10 pointer-events-auto w-full h-full"
        >
          {selectionRect && (
            <rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
              fill="none"
              stroke="red"
              strokeDasharray="4"
              strokeWidth="0.5"
            />
          )}
        </svg>
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