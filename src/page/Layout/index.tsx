import React, { useState, useRef } from "react";
import Toolbar from "@src/components/Toolbar";
import ToolsHub from "./Tools";

const Core: React.FC = () => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(window.innerWidth * 0.25);
  const [rightPanelWidth, setRightPanelWidth] = useState(window.innerWidth * 0.25);
  const [midPanelHeight, setMidPanelHeight] = useState(window.innerHeight * 0.7);

  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const leftDragRef = useRef<HTMLDivElement | null>(null);
  const rightDragRef = useRef<HTMLDivElement | null>(null);
  const midDragRef = useRef<HTMLDivElement | null>(null);
  const midPanelRef = useRef<HTMLDivElement | null>(null);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const [isDraggingMid, setIsDraggingMid] = useState(false);

  const handleMouseDownMid = (e: React.MouseEvent) => {
    setIsDraggingMid(true);
    e.preventDefault();
  }
  const handleMouseMoveMid = (e: MouseEvent) => {
    if (isDraggingMid) {
      const deltaY = e.movementY;
      setMidPanelHeight((prevHeight) => Math.min(prevHeight + deltaY, window.innerHeight * 0.7));
    }
  }
  const handleMouseUpMid = () => setIsDraggingMid(false);

  const handleMouseDownLeft = (e: React.MouseEvent) => {
    setIsDraggingLeft(true);
    e.preventDefault();
  };

  const handleMouseMoveLeft = (e: MouseEvent) => {
    if (isDraggingLeft) {
      const deltaX = e.movementX;
      setLeftPanelWidth((prevWidth) => Math.min(prevWidth + deltaX, window.innerWidth * 0.4));
    }
  };

  const handleMouseUpLeft = () => setIsDraggingLeft(false);

  const handleMouseDownRight = (e: React.MouseEvent) => {
    setIsDraggingRight(true);
    e.preventDefault();
  };

  const handleMouseMoveRight = (e: MouseEvent) => {
    if (isDraggingRight) {
      const deltaX = -e.movementX;
      setRightPanelWidth((prevWidth) => Math.min(prevWidth + deltaX, window.innerWidth * 0.4));
    }
  };

  const handleMouseUpRight = () => setIsDraggingRight(false);

  React.useEffect(() => {
    if (isDraggingLeft || isDraggingRight || isDraggingMid) {
      document.addEventListener("mousemove", handleMouseMoveLeft);
      document.addEventListener("mousemove", handleMouseMoveRight);
      document.addEventListener("mouseup", handleMouseUpLeft);
      document.addEventListener("mouseup", handleMouseUpRight);
      document.addEventListener("mousemove", handleMouseMoveMid);
      document.addEventListener("mouseup", handleMouseUpMid);
    } else {
      document.removeEventListener("mousemove", handleMouseMoveLeft);
      document.removeEventListener("mousemove", handleMouseMoveRight);
      document.removeEventListener("mouseup", handleMouseUpLeft);
      document.removeEventListener("mouseup", handleMouseUpRight);
      document.removeEventListener("mousemove", handleMouseMoveMid);
      document.removeEventListener("mouseup", handleMouseUpMid);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMoveLeft);
      document.removeEventListener("mousemove", handleMouseMoveRight);
      document.removeEventListener("mouseup", handleMouseUpLeft);
      document.removeEventListener("mouseup", handleMouseUpRight);
      document.removeEventListener("mousemove", handleMouseMoveMid);
      document.removeEventListener("mouseup", handleMouseUpMid);
    };
  }, [isDraggingLeft, isDraggingRight, isDraggingMid]);

  return (
    <div className="h-screen flex flex-col bg-black">
      <Toolbar />
      <div className="flex flex-row text-white flex-grow">
        <div
          ref={leftPanelRef}
          className="shadow-sm border-r border-gray-200/30 m-0 p-0"
          style={{ minWidth: `${window.innerWidth * 0.2}px`, width: `${leftPanelWidth}px` }}
        >
          <ToolsHub />
        </div>
        <div
          ref={leftDragRef}
          className="w-0.5 bg-[#00000] hover:bg-gray-300 hover:w-1 cursor-col-resize"
          onMouseDown={handleMouseDownLeft}
        />
        <div className="flex flex-col flex-grow">
          <div className="shadow-xs border-b border-gray-200/30 p-2">头部</div>
          <div className="flex flex-row flex-grow">
            <div className="border-none border-gray-200/30 flex-1">

              <div
                ref={midPanelRef}
                style={{ minHeight: `${window.innerWidth * 0.025}px` , height: `${midPanelHeight}px` }}>内容</div>
              <div className="h-0.5 bg-[#00000] hover:bg-gray-300 hover:h-1 cursor-row-resize" ref={midDragRef} onMouseDown={handleMouseDownMid} />
              <div className="border-t border-gray-200/30 p-2">console</div>
            
            </div>
            <div
              ref={rightDragRef}
              className="w-0.5 bg-[#00000] hover:bg-gray-300 hover:w-1 cursor-col-resize"
              onMouseDown={handleMouseDownRight}
            />
            <div
              className="shadow-sm border-l border-gray-200/30"
              ref={rightPanelRef}
              style={{ minWidth: `${window.innerWidth * 0.2}px`, width: `${rightPanelWidth}px` }}
            >
              3
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Core;
