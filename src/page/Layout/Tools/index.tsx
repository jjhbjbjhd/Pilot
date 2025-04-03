import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Collapse } from "antd";
import { DownOutlined, UpOutlined, RollbackOutlined, DatabaseOutlined, BugOutlined, BarChartOutlined, ToolOutlined } from "@ant-design/icons";
import type { GetProps } from "antd";
import "./index.css";


type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
const { Panel } = Collapse;

const toolCategories = [
  {
    title: "分析",
    icon: <DatabaseOutlined />,
    tools: [
      { title: "数据清洗", description: "处理和清理数据集", icon: <ToolOutlined /> },
      { title: "数据可视化", description: "生成图表和报告", icon: <BarChartOutlined /> },
    ],
  },
  {
    title: "测试",
    icon: <BugOutlined />,
    tools: [
      { title: "自动化测试", description: "运行自动化测试脚本", icon: <ToolOutlined /> },
      { title: "性能测试", description: "检测系统性能", icon: <BarChartOutlined /> },
    ],
  },
  {
    title: "汇报",
    icon: <BarChartOutlined />,
    tools: [
      { title: "日报生成", description: "自动生成每日报告", icon: <ToolOutlined /> },
      { title: "月报管理", description: "创建和管理月报", icon: <BarChartOutlined /> },
    ],
  },
  {
    title: "其他",
    icon: <ToolOutlined />,
    tools: [
      { title: "工具A", description: "一些有用的工具", icon: <ToolOutlined /> },
      { title: "工具B", description: "更多实用工具", icon: <BarChartOutlined /> },
    ],
  },
];

const ToolsHub: React.FC = () => {
  const navigate = useNavigate();
  const onSearch: SearchProps["onSearch"] = (value) => console.log(value);
  const [activeKeys, setActiveKeys] = useState<string[]>(toolCategories.map((_, index) => index.toString()));

  const togglePanel = (key: string) => {
    setActiveKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (

    <div className="flex flex-col items-center w-full h-full p-4 overflow-hidden">
      <div className="flex items-center justify-between w-full mb-6">
        <h1 className="text-lg font-semibold">ToolHub</h1>
        <button
          className="group w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800"
          onClick={() => navigate(`/`)}
        >
          <RollbackOutlined  className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="w-full pb-4">
        <Search placeholder="搜索助手" onSearch={onSearch} className="search-bar" />
      </div>

      <div className="flex flex-row w-[85%] h-20 mb-10 w-full justify-center items-center text-white text-1xl font-bold bg-[#2a2a2a] rounded-lg">
        <div>Enjoy You Work 🎉🎉</div>
      </div>


      <div className="w-full flex-1 max-h-[60vh] overflow-y-auto m-0 p-0">
        <Collapse 
          activeKey={activeKeys} 
          className="w-full border-none bg-transparent"
        >
          {toolCategories.map((category, index) => {
            const key = index.toString();
            const isOpen = activeKeys.includes(key);

            return (
              <Panel
                key={key}
                showArrow={false}
                className="border-none"
                header={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3" id="collapse_item">
                   
                      <span className="text-base font-medium">{category.title}</span>
                    </div>

                    <button onClick={() => togglePanel(key)} className="text-white">
                      {isOpen ? <UpOutlined /> : <DownOutlined />}
                    </button>
                  </div>
                }
              >
                <div className="space-y-2">
                  {category.tools.map((tool, toolIndex) => (
                    <div
                      key={toolIndex}
                      className="flex items-center  text-white rounded-lg p-2 hover:bg-[#2a2a2a]"
                    >
                      <div className="text-xl text-white mr-3">{tool.icon}</div>

                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{tool.title}</span>
                        <span className="text-xs text-gray-400">{tool.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
};

export default ToolsHub;
