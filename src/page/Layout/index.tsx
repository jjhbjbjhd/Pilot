import React, { useState } from "react";
import contentComponents from "@src/components/Dashboard";
import Toolbar from "@src/components/Toolbar";
import ToolsHub from "./Tools";
import "./index.css";
import { Splitter  } from "antd";
import DocumentPopover from "@src/components/Popover/document";
import { message } from "antd";
import { useWebSocketStore } from "@src/store/websocketStore";
import { invoke } from "@tauri-apps/api/core";
import { useGpolStore } from "@src/store/gpolStore";
// import { decode as b64decode } from 'base64-arraybuffer';


const Core: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState("default");

  const handleComponentChange = (componentName: string) => {
    setSelectedComponent(componentName);
  };

  const [visible, setVisible] = useState(false);
  
  // 管理按钮背景颜色
  const [active, setActive] = useState<string | null>(null);

  // 处理按钮点击事件
  const handleClick = (button: string) => {
    if (active === button) {
      // 如果点击的是当前按钮，切换Popover的显示状态
      setVisible(!visible);
      setActive(null);
    } else {
      // 如果点击的是其他按钮，设置为该按钮，并显示Popover
      setActive(button);
      setVisible(true);

    }
  };
  const { setGpolData } = useGpolStore();

  const { sendMessage, isConnected } = useWebSocketStore((state) => state);

  const runTask = async () => {
    const popoverData = getPopoverData(); // 假设这个函数可以获取 Popover 中的数据
    if (selectedComponent === "default") {
      message.warning("请选择工具");
    } else if (selectedComponent === "dailyTastDataSummary") {
      // 如果选中了 summary 组件
  
      if (popoverData) {
        // 将数据通过 WebSocket 发送到后端
        if (isConnected) {
          sendMessage({type:"task",payload:{job:popoverData}} );
          message.success("任务已启动！");
        }
        
      } else {
        message.error("没有选择有效的数据进行任务启动");
      }
    }else if(selectedComponent === 'gpol'){
        try {
          const raw = popoverData.folder_path;
          const folder_path = raw ? JSON.parse(raw) : [];
          const path_list = folder_path.flatMap((item: any) =>
            !item.disabled ? [item.path] : []
          );
          

          if (path_list.length===0){
            return message.info("请选择一个带有gpol数据的文件夹");
          }
  

          const gpol_analysis_data = await invoke("run_gpol", {pathList:path_list} );
          setGpolData(gpol_analysis_data);
        } catch (err) {
          message.info("请选择一个带有gpol数据的文件夹");
        }
    } else {
      message.warning("请选择合适的工具");
    }
  };

  const getPopoverData = () => {
    const savedFolders = localStorage.getItem("savedFolders");
    const showTimeFilter = localStorage.getItem("showTimeFilter");
    const showFolderFilter = localStorage.getItem("timeFilterRange");
    
    return {
      folder_path: savedFolders,
      filter: showTimeFilter,
      time_filter_range: showFolderFilter
    }

  };

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
              <div className="flex flex-row w-[95%] text-white items-center justify-start m-4">
                {/* 左侧图标，居中对齐 */}
                <div className="text-4xl flex items-center justify-center mr-4 flex-shrink-0">
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

              <div className="flex flex-row w-[95%] text-white items-center justify-start m-4 space-x-2">
                <div>🌐<span>Public</span></div>
                <span>By</span>
                <img className="w-6 h-6 rounded-full ml-2" src="https://avatars.githubusercontent.com/u/67071682?v=4" alt="" />
                <span>ShengWei.Liu</span>
                <span>✏️</span>
                <span>Edited Nov 24</span>
                <span>⭐️</span>
                <span>2 stars</span>
              </div>

              {contentComponents[selectedComponent]}
              
            </div>

            <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 flex flex-col gap-3">

              {/* Document Button */}
              <div className="relative">
                <div
                  onClick={() => handleClick("document")}
                  className={`rounded-full p-2 shadow-md cursor-pointer ${
                    active === "document" ? "bg-gray-800" : "hover:bg-gray-800 "
                  }`}
                >
                  🗃️
                </div>

                {active === "document" && visible && (
                  <div className="absolute right-full top-1/2 -translate-y-1/4 mr-2 p-2 bg-gray-800 text-white rounded-md shadow-lg">
                    <DocumentPopover />
                  </div>
                )}
              </div>

              {/* Search Button */}
              <div className="relative">
                <div
                  onClick={runTask}
                  className={`rounded-full p-2 shadow-md cursor-pointer ${
                    active === "search" ? "bg-gray-800" : "hover:bg-gray-800 "
                  }`}
                >
                  ▶️
                </div>

                {active === "search" && visible && (
                   <div className="absolute right-full mr-2 p-2 bg-gray-800 text-white rounded-md shadow-lg">
                  </div>
                )}
              </div>

              {/* Settings Button */}
              <div className="relative">
                <div
                  onClick={() => handleClick("settings")}
                  className={`rounded-full p-2 shadow-md cursor-pointer ${
                    active === "settings" ? "bg-gray-800" : "hover:bg-gray-800 "
                  }`}
                >
                  📷
                </div>

                {active === "settings" && visible && (
                   <div className="absolute right-full mr-2 p-2 bg-gray-800 text-white rounded-md shadow-lg">
                  </div>
                )}
              </div>

              {/* Ideas Button */}
              <div className="relative">
                <div
                  onClick={() => handleClick("ideas")}
                  className={`rounded-full p-2 shadow-md cursor-pointer ${
                    active === "ideas" ? "bg-gray-800" : "hover:bg-gray-800 "
                  }`}
                >
                  💡
                </div>

                {active === "ideas" && visible && (
                   <div className="absolute right-full mr-2 p-2 bg-gray-800 text-white rounded-md shadow-lg">
                  </div>
                )}
              </div>
            </div>

          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  );
};

export default Core;
