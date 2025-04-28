import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useEffect, useRef, useMemo} from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css"
import { useWebSocketStore } from "@src/store/websocketStore";
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

interface ConsoleProps {
  messages: string[];
}

interface TableProps {
  data: string;
}

const MAX_MESSAGES = 500;

const TxtTable: React.FC<TableProps> = ({ data }) => {
  console.log("渲染啦！！！！！！！！！")
  if (!data) return null;

  const parsed = JSON.parse(data);
  const rowsData = parsed.data || [];

  const rows = rowsData.map((item: any, index: number) => ({
    id: index,
    ...item,
    lowImage: item.image?.[1] || '',
    highImage: item.image?.[2] || ''
  }));

  const columns = [
    { field: 'project_name', headerName: '项目名', width: 100 },
    { field: 's_time', headerName: '积分时间', width: 100 },
    { field: 'resp_avg', headerName: '平均响应时间', width: 150 },
    { field: 'resp_rate_precent', headerName: '响应率不均匀性', width: 160 },
    { field: 'noise_avg', headerName: '平均噪声电压', width: 140 },
    { field: 'sign_avg', headerName: '平均信号电压', width: 140 },
    { field: 'resp_rate_avg', headerName: '平均响应率', width: 140 },
    { field: 'fixed_noise', headerName: '固定图像噪声', width: 140 },
    { field: 'netd', headerName: 'NETD', width: 100 },
    { field: 'bad_pixes', headerName: '电平坏点', width: 100 },
    { field: 'bad_pixes_resp_rate', headerName: '响应率坏点', width: 120 },
    { field: 'bad_pixes_netd', headerName: 'NETD坏点', width: 100 },
    { field: 'bad_pixes_noise', headerName: '噪声坏点', width: 100 },
    { field: 'bad_pixes_number', headerName: '无效像元数', width: 120 },
    { field: 'bad_pixes_rate', headerName: '无效像元率', width: 120 },
    { field: 'detect_rate_avg', headerName: '平均探测率', width: 120 },
    {field:'p_1',headerName:"PXIe4144",width:120},
    { field: 'p_2', headerName: 'PXIe4141', width: 120 },
    { field: 'blind', headerName: '盲元簇信息', width: 120 },
    {
      field: 'lowImage',
      headerName: '低温电平图',
      width: 100,
      
      renderCell: (params:any) =>
        params.value ? (
          <img src={params.value} alt="Low" style={{ width: 50, height: 50 }} />
        ) : (
          '无图'
        ),
    },
    {
      field: 'highImage',
      headerName: '高温电平图',
      width: 100,
      renderCell: (params:any) =>
        params.value ? (
          <img src={params.value} alt="High" style={{ width: 50, height: 50 }} />
        ) : (
          '无图'
        ),
    },
  ];

  return (
  <Box sx={{ height: "95%", width: '100%' }}>
    <DataGrid
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      hideFooter // 去掉分页
      checkboxSelection 
      sx={{
        '& .MuiDataGrid-cell': {
          userSelect: 'text', // 允许用户选中单元格文字
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          userSelect: 'text', // 允许用户选中表头文字
        },
      }}
    />
  </Box>

  );
};

const MemoizedTxtTable = React.memo(({ data }: { data: any }) => {
  return <TxtTable data={data} />;
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});



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
        { i: "table", x: 0, y: 0, w: 3.5, h: 8.5, type: "table" },
        { i: "console", x: 4, y: 0, w: 2.5, h: 8.5, type: "console" },
      ];
    
    const messages = useWebSocketStore((state) => state.messages);
    const dataList = messages.filter((value) => {
      if (typeof value === 'object' && value !== null) return true;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return typeof parsed === 'object' && parsed !== null;
        } catch {
          return false;
        }
      }
      return false;
    });
    
    const info = messages.filter((value) => {
      if (typeof value !== 'string') return false;
      try {
        JSON.parse(value);
        return false; 
      } catch {
        return true; 
      }
    });

    const data = dataList[dataList.length - 1];

    const renderContent = (type: string) => {
    switch (type) {
        case "console":
            return <Console messages={info}/>;
        case "table":
            return <MemoizedTxtTable data={data} />;
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