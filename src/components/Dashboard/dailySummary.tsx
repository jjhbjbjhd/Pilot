import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useEffect, useRef, useMemo} from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css"
import Spreadsheet from "react-spreadsheet";
import { useWebSocketStore } from "@src/store/websocketStore";

interface ConsoleProps {
  messages: string[];
}

const MAX_MESSAGES = 500;

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


  const Console: React.FC<ConsoleProps> = ({ messages }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const visibleMessages = useMemo(() => {
      if (messages.length > MAX_MESSAGES) {
        return messages.slice(-MAX_MESSAGES);
      }
      return messages;
    }, [messages]);

    useEffect(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, [visibleMessages]);

    return (
      <div className="flex flex-col h-full">
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-black text-white-400 p-4 text-sm font-mono">
          <div className=" text-gray-300 px-4 py-2 border-b border-gray-700 text-xs mb-4 justify-center items-center flex gap-1">
            <div>👨‍💻 作者: shengwei.Liu </div>
            <div>🏢 公司: 常州爱毕赛思光电技术有限公司</div>
            <div>📅 版本: v0.1.0</div>
          </div>
          {visibleMessages.map((msg, index) => (
            <div
            key={index}
            className="truncate overflow-hidden whitespace-nowrap gap-2"
          >
            {msg}
          </div>
          ))}
        </div>
      </div>
    );
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const VContent = () => {
    const layout = [
        { i: "table", x: 0, y: 0, w: 8, h: 6, type: "table" },
        { i: "console", x: 0, y: 0, w: 8, h: 6, type: "console" },
      ];
    
    const messages = useWebSocketStore((state) => state.messages);

    const renderContent = (type: string) => {
    switch (type) {
        case "console":
            return <Console messages={messages}/>;
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

const extractProgress = (msg: string): number | null => {
  try {
    const parsed = JSON.parse(msg);
    if (parsed.progress && typeof parsed.progress === "number") {
      return parsed.progress;
    }
  } catch {
    const match = msg.match(/(\d{1,3})%/);
    if (match) return parseInt(match[1]);
  }
  return null;
};

export default VContent