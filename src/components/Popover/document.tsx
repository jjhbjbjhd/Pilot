import React, { useEffect, useState, useRef } from "react";
import {
  FolderOpenOutlined,
  DeleteOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  List,
  Tooltip,
  Switch,
  message,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { open } from "@tauri-apps/plugin-dialog"; // ✅ 引入 Tauri Dialog

const { RangePicker } = DatePicker;

interface FolderItem {
  path: string;
  disabled: boolean;
}

const STORAGE_KEY = "savedFolders";
const TIME_FILTER_KEY = "showTimeFilter";
const DATE_RANGE_KEY = "timeFilterRange";

const DocumentPopover: React.FC = () => {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const didInit = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: FolderItem[] = JSON.parse(stored);
        setFolders(parsed);
      } catch {
        console.error("加载本地文件夹失败");
      }
    }

    const savedSwitch = localStorage.getItem(TIME_FILTER_KEY);
    if (savedSwitch === "true") {
      setShowTimeFilter(true);
    }

    const savedRange = localStorage.getItem(DATE_RANGE_KEY);
    if (savedRange) {
      try {
        const parsed = JSON.parse(savedRange);
        if (Array.isArray(parsed) && parsed.length === 2) {
          setDateRange(parsed as [dayjs.Dayjs, dayjs.Dayjs]);
        }
      } catch {
        console.error("时间范围解析失败");
      }
    }
  }, []);

  useEffect(() => {
    if (didInit.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
    } else {
      didInit.current = true;
    }
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(TIME_FILTER_KEY, showTimeFilter.toString());
  }, [showTimeFilter]);

  useEffect(() => {
    if (dateRange) {
      localStorage.setItem(DATE_RANGE_KEY, JSON.stringify(dateRange));
    }
  }, [dateRange]);

  // ✅ 替代原来的 handleFolderSelect
  const handleTauriFolderOpen = async () => {
    try {
      const selected = await open({
        multiple: false,
        directory: true, // ✅ 只选文件夹
      });

      if (!selected || typeof selected !== "string") return;

      const folderPath = selected;

      if (folders.some((folder) => folder.path === folderPath)) {
        message.warning("该文件夹已添加");
        return;
      }

      setFolders((prev) => [...prev, { path: folderPath, disabled: false }]);
    } catch (err) {
      console.error("选择文件夹失败:", err);
    }
  };

  const removeFolder = (path: string) => {
    setFolders(folders.filter((folder) => folder.path !== path));
  };

  const toggleDisable = (path: string) => {
    setFolders(
      folders.map((folder) =>
        folder.path === path
          ? { ...folder, disabled: !folder.disabled }
          : folder
      )
    );
  };

  return (
    <div className="w-80 max-h-[35rem] overflow-y-auto p-4 bg-black text-white rounded-lg shadow-xl">
      <h2 className="text-lg font-bold mb-3">📁 文件夹管理</h2>

      <Button
        icon={<FolderAddOutlined />}
        onClick={handleTauriFolderOpen} // ✅ 使用新方法
        type="primary"
        block
        className="mb-4"
      >
        选择本地文件夹
      </Button>

      <List
        itemLayout="horizontal"
        dataSource={folders}
        locale={{ emptyText: "暂无文件夹" }}
        renderItem={(folder) => (
          <List.Item
            className="rounded-md px-3 py-2 mb-2 hover:bg-gray-800"
            actions={[
              <Tooltip title={folder.disabled ?  "禁用":"启用" } key="toggle">
                <Switch
                  checked={folder.disabled}
                  onChange={() => toggleDisable(folder.path)}
                  size="small"
                />
              </Tooltip>,
              <Tooltip title="删除" key="delete">
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  onClick={() => removeFolder(folder.path)}
                />
              </Tooltip>,
            ]}
          >
            <div className="flex items-center space-x-2 w-full overflow-hidden">
              <FolderOpenOutlined className="text-blue-400 text-lg flex-shrink-0" />
              <span
                className={`text-sm ${
                  folder.disabled ? "text-gray-400 line-through" : ""
                } truncate`}
                title={folder.path}
                style={{
                  maxWidth: "160px",
                  display: "inline-block",
                  color: "white",
                }}
              >
                {folder.path}
              </span>
            </div>
          </List.Item>
        )}
      />

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">启用时间筛选</span>
          <Switch
            checked={showTimeFilter}
            onChange={setShowTimeFilter}
            size="small"
          />
        </div>

        {showTimeFilter && (
          <RangePicker
            className="w-full"
            style={{ backgroundColor: "white", borderRadius: 4 }}
            format="YYYY-MM-DD"
            value={
              dateRange
                ? [
                    dayjs(dateRange[0], "YYYY-MM-DD"),
                    dayjs(dateRange[1], "YYYY-MM-DD"),
                  ]
                : undefined
            }
            onChange={(dateStrings) => {
              if (dateStrings && dateStrings[0] && dateStrings[1]) {
                setDateRange([dayjs(dateStrings[0]), dayjs(dateStrings[1])]);
              } else {
                setDateRange(null);
                localStorage.removeItem(DATE_RANGE_KEY);
              }
            }}
            allowClear
            placeholder={["开始日期", "结束日期"]}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentPopover;
