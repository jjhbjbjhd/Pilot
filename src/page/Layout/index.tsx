import React, { useState, useRef } from "react";
import Toolbar from "@components/Toolbar";

const Core: React.FC = () => {
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);

  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const leftDragRef = useRef<HTMLDivElement | null>(null);
  const rightDragRef = useRef<HTMLDivElement | null>(null);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  // Mouse event to handle left panel dragging
  const handleMouseDownLeft = (e: React.MouseEvent) => {
    setIsDraggingLeft(true);
    // Prevent text selection
    e.preventDefault();
  };

  const handleMouseMoveLeft = (e: MouseEvent) => {
    if (isDraggingLeft) {
      const deltaX = e.movementX;
      setLeftPanelWidth((prevWidth) => {
        if (prevWidth + deltaX >  window.innerWidth * 0.4) {
          return window.innerWidth * 0.4;
        }
        return prevWidth + deltaX});
    }
  };

  const handleMouseUpLeft = () => {
    setIsDraggingLeft(false);
  };

  // Mouse event to handle right panel dragging
  const handleMouseDownRight = (e: React.MouseEvent) => {
    setIsDraggingRight(true);
    // Prevent text selection
    e.preventDefault();
  };

  const handleMouseMoveRight = (e: MouseEvent) => {
    if (isDraggingRight) {
      const deltaX = -e.movementX;
      setRightPanelWidth((prevWidth) => {
        if (prevWidth + deltaX >  window.innerWidth * 0.4) {
            return window.innerWidth * 0.4;
        }
        return prevWidth + deltaX

      });
    }
  };

  const handleMouseUpRight = () => {
    setIsDraggingRight(false);
  };

  // Attach event listeners when dragging starts
  React.useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener("mousemove", handleMouseMoveLeft);
      document.addEventListener("mousemove", handleMouseMoveRight);
      document.addEventListener("mouseup", handleMouseUpLeft);
      document.addEventListener("mouseup", handleMouseUpRight);
    } else {
      document.removeEventListener("mousemove", handleMouseMoveLeft);
      document.removeEventListener("mousemove", handleMouseMoveRight);
      document.removeEventListener("mouseup", handleMouseUpLeft);
      document.removeEventListener("mouseup", handleMouseUpRight);
    }

    return () => {
      // Clean up event listeners when the component is unmounted or dragging ends
      document.removeEventListener("mousemove", handleMouseMoveLeft);
      document.removeEventListener("mousemove", handleMouseMoveRight);
      document.removeEventListener("mouseup", handleMouseUpLeft);
      document.removeEventListener("mouseup", handleMouseUpRight);
    };
  }, [isDraggingLeft, isDraggingRight]);

  return (
    <div className="h-screen flex flex-col bg-black">
      <Toolbar />

      <div className="flex flex-row text-white flex-grow">
        {/* Left panel */}
        <div
          ref={leftPanelRef}
          className=" border-r border-white "
          style={{ minWidth: `300px`, width: `${leftPanelWidth}px` }}
        >
          1
        </div>

        {/* Left draggable bar */}
        <div
          ref={leftDragRef}
            className="w-px bg-transparent cursor-col-resize  hover:w-1 hover:bg-gray-500"
          onMouseDown={handleMouseDownLeft}
        />

        {/* Right part of the layout */}
        <div className="flex flex-col flex-grow">
          <div className=" border-b border-white p-2">头部</div>
          <div className="flex flex-row flex-grow">
            <div className=" border border-white flex-1">
                2
            </div>

            {/* Right draggable bar */}
            <div
              ref={rightDragRef}
            className="w-px bg-transparent cursor-col-resize hover:w-1 hover:bg-gray-500"
              onMouseDown={handleMouseDownRight}
            />

            {/* Right panel */}
            <div
              className=" border-l border-white "
              ref={rightPanelRef}
              style={{ minWidth: `300px`, width: `${rightPanelWidth}px` }}
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
