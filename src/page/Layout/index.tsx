import React, { useState } from "react";
import consoleComponents from "@src/components/Console";
import contentComponents from "@src/components/Content";
import settingComponents from "@src/components/Setting";
import headerComponents from "@src/components/Header";
import Toolbar from "@src/components/Toolbar";
import { BarChart } from 'lucide-react';
import ToolsHub from "./Tools";
import "./index.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Splitter } from "antd";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Divider } from 'antd';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Core: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState("default");

  const handleComponentChange = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  const layout = [
    { i: "1", x: 0, y: 0, w: 4, h: 2 },
    { i: "4", x: 10, y: 0, w: 2, h: 2 },
    { i: "5", x: 0, y: 2, w: 2, h: 2 },
    { i: "6", x: 2, y: 2, w: 2, h: 4 },
    { i: "7", x: 8, y: 2, w: 4, h: 2 },
    { i: "8", x: 0, y: 4, w: 2, h: 2 },
    { i: "9", x: 4, y: 4, w: 4, h: 2 },
    { i: "10", x: 8, y: 4, w: 2, h: 2 },
    { i: "11", x: 10, y: 4, w: 2, h: 2 },
  ];

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="fixed top-0 left-0 w-full z-50 bg-black">
        <Toolbar />
      </div>
      <div className="h-full pt-10">
        <Splitter>
          <Splitter.Panel defaultSize="25%" min="20%" max="50%">
            <ToolsHub onComponentChange={handleComponentChange} />
          </Splitter.Panel>

          <Splitter.Panel>
           
            <div className="relative h-full w-full bg-black px-4 py-2 overflow-y-auto">
              <div className="flex flex-row w-full text-white items-center justify-start m-4">
                {/* 左侧图标，居中对齐 */}
                <div className="text-4xl flex items-center justify-center mr-4">
                  📊
                </div>

                {/* 右侧文本内容，调整间距 */}
                <div>
                  <h1 className="text-2xl font-bold mb-1">Observable</h1> {/* 更紧凑的标题间距 */}
                  <p className="text-gray-300 text-xs m-0">The end-to-end solution for building and hosting</p> {/* 更紧凑的文本 */}
                  <p className="text-gray-300 text-xs m-0">better data apps, dashboards, and reports.</p>
                </div>

                {/* 右侧按钮 */}
                <div className="ml-auto flex space-x-2 items-end mr-4">
                  {/* Fork 按钮 */}
                  <button className="flex items-center bg-gray-700 text-white p-2 rounded-sm hover:bg-gray-600">
                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12H3m0 0l4-4m-4 4l4 4m11-4h7m0 0l-4-4m4 4l-4 4" />
                    </svg>
                    Fork
                  </button>

                  {/* 收藏按钮 */}
                  <button className="flex items-center bg-gray-700 text-white p-2 rounded-sm hover:bg-gray-600">
                    ⭐️
                  </button>
                </div>
              </div>

              <div className="flex flex-row w-full text-white items-center justify-start m-4 space-x-2">
                <div>🌐<span>Public</span></div>
                <span>By</span>
                <img className="w-6 h-6 rounded-full ml-2" src="https://avatars.githubusercontent.com/u/67071682?v=4" alt="" />
                <span>ShengWei.Liu</span>
                <span>✏️</span>
                <span>Edited Nov 24</span>
                <span>⭐️</span>
                <span>2 stars</span>
              </div>

              <Divider dashed={true} style={{ color: 'white', borderColor: 'white' }}>内容</Divider>


              <ResponsiveGridLayout
                className="layout m-8"
                layouts={{ lg: layout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
                margin={[8, 8]}
           
              >
                {layout.map((item) => (
                  <div key={item.i} className="bg-gray-100 rounded shadow p-2">
                    <span>Item {item.i}</span>
                  </div>
                ))}
              </ResponsiveGridLayout>
            </div>

            <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 flex flex-col gap-3">
              <div className="rounded-full p-2 shadow-md hover:bg-gray-600 cursor-pointer">🛠️</div>
              <div className="rounded-full p-2 shadow-md hover:bg-gray-600 cursor-pointer">📄</div>
              <div className="rounded-full p-2 shadow-md hover:bg-gray-600 cursor-pointer">🔍</div>
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 flex gap-4">
              <div className="rounded-full p-2 shadow-md hover:bg-gray-600 cursor-pointer">⚙️</div>
              <div className="rounded-full p-2 shadow-md hover:bg-gray-600 cursor-pointer">📊</div>
              <div className="rounded-full p-2 shadow-md hover:bg-gray-600 cursor-pointer">💡</div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
};

export default Core;
