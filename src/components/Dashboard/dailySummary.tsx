import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useEffect, useRef, useState } from "react";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css"
import Spreadsheet from "react-spreadsheet";


const TxtTable: React.FC = () => {
    const columnCount = 10;
  
    const columnLabels = Array.from({ length: columnCount }, (_, i) => `${i + 1}`);
    const rowLabels = ["项目名","GPOL","VDDA","VDDAO","VDD","VR","VDDL","SUBPV","VCOM","积分时间",
        "平均响应时间","响应率不均匀性","平均噪声电压","平均信号电压","平均响应率","固定图像噪声",
        "NETD","电平坏点","响应率坏点","NETD坏点","噪声坏点","无效像元数","无效像元率","平均探测率",
        "全区域盲元簇","低温电平","高温电平"
    ];
  
  
    return (
      <div className="spreadsheet-container ml-6">
        <Spreadsheet
          data={[]}
          columnLabels={columnLabels}
          rowLabels={rowLabels}
        />
      </div>
    );
  };


const Console = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <div className="text-sm text-gray-500">Console Output</div>
                    <div className="mt-2 text-sm text-gray-900">
                        <pre>dddddddd</pre>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const VContent = () => {
    const layout = [
        { i: "table", x: 0, y: 0, w: 8, h: 6, type: "table" },
        { i: "console", x: 0, y: 0, w: 8, h: 6, type: "console" },
      ];
    
    const renderContent = (type: string) => {
    switch (type) {
        case "console":
            return <Console />;
        case "table":
            return  <TxtTable />
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
    
}

export default VContent