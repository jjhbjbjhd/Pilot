
import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useEffect, useRef, useState } from "react";
import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./index.css"
import Spreadsheet from "react-spreadsheet";

const HotMap:React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [gistemp, setGistemp] = useState<any[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    d3.csv("/gistemp.csv", d3.autoType).then((data) => {
      setGistemp(data);
    });
  }, []);
  // 👀 监听容器尺寸
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize({ width, height });
    }

    return () => observer.disconnect();
  }, []);

  // 📊 绘制图表
  useEffect(() => {
    if (!size.width || !size.height || !containerRef.current || gistemp.length === 0) return;

    const chart = Plot.plot({
      color: {scheme: "BuRd"},
      marks: [
        Plot.ruleY([0]),
        Plot.dot(gistemp, {x: "Date", y: "Anomaly", stroke: "Anomaly"}),
        Plot.lineY(gistemp, Plot.windowY(12, {x: "Date", y: "Anomaly"}))
      ]
    });

    containerRef.current.innerHTML = "";
    containerRef.current.append(chart);
  }, [size, gistemp]);

  return <div ref={containerRef} className="w-full h-full" />;
}

const TxtTable: React.FC = () => {
  const columnCount = 10;
  const rowCount = 10;

  const columnLabels = Array.from({ length: columnCount }, (_, i) => `${i + 1}`);
  const rowLabels = Array.from({ length: rowCount }, (_, i) => `${i + 1}`);

  const data = [
    [{ value: "Vanilla" }, { value: "Chocolate", readOnly: true }],
    [{ value: "Strawberry" }, { value: "Cookies", readOnly: true }],
    [{ value: "Vanilla" }, { value: "Chocolate", readOnly: true }],
    [{ value: "Strawberry" }, { value: "Cookies", readOnly: true }],
    [{ value: "Vanilla" }, { value: "Chocolate", readOnly: true }],
    [{ value: "Strawberry" }, { value: "Cookies", readOnly: true }],
    [{ value: "Vanilla" }, { value: "Chocolate", readOnly: true }],
    [{ value: "Strawberry" }, { value: "Cookies", readOnly: true }],
    [{ value: "Vanilla" }, { value: "Chocolate", readOnly: true }],
    [{ value: "Strawberry" }, { value: "Cookies", readOnly: true }],
  ];

  return (
    <div className="spreadsheet-container m-1">
      <Spreadsheet
        data={data}
        columnLabels={columnLabels}
        rowLabels={rowLabels}
      />
    </div>
  );
};

const D3Chart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    d3.text("/framework-issues.json").then((text) => {
      const data = JSON.parse(text, (key, value) =>
        /_at$/.test(key) && value ? new Date(value) : value
      );
      setIssues(data);
    });
  }, []);

  // 👀 监听容器尺寸
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize({ width, height });
    }

    return () => observer.disconnect();
  }, []);

  // 📊 绘制图表
  useEffect(() => {
    if (!size.width || !size.height || !containerRef.current || issues.length === 0) return;

    const chart = Plot.plot({
      width: size.width,
      height: size.height,
      color: {legend: true},
      marks: [
        Plot.areaY(
          issues.flatMap((i) =>
            d3
              .utcDays(i.created_at, i.closed_at ?? new Date())
              .map((at) => ({ created_at: i.created_at, at }))
          ),
          Plot.binX(
            
            { y: "count", filter: null },
            {
              x: "at",
              fill: (d : any) => d3.utcWeek(d.created_at) as any,
              reverse: true,
              curve: "step",
              tip: { format: { x: null, z: null } },
              interval: "day"
            } as any
          ),
        )
      ]
    });

    containerRef.current.innerHTML = "";
    containerRef.current.append(chart);
  }, [size, issues]);

  return <div ref={containerRef} className="w-full h-[88%]" />;
};

const D3Chart2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    d3.csv("/brands-2018.csv", d3.autoType).then((data) => {
      setBrands(data);
    });
  }, []);

  // 👀 监听容器尺寸
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize({ width, height });
    }

    return () => observer.disconnect();
  }, []);

  // 📊 绘制图表
  useEffect(() => {
    if (!size.width || !size.height || !containerRef.current || brands.length === 0) return;

    const chart =Plot.plot({
      marginLeft: 90,
      x: { axis: null },
      y: { label: null },
      marks: [
        Plot.barX(brands, {
          x: "value",
          y: "name",
          sort: { y: "x", reverse: true, limit: 10 }
        }),
    
        Plot.text(brands, {
          text: d => `${Math.floor(d.value / 1000)} B`,
          y: "name",
          x: "value",
          textAnchor: "end",
          dx: -3,
          fill: "white"
        })
      ]
    });

    containerRef.current.innerHTML = "";
    containerRef.current.append(chart);
  }, [size, brands]);

  return <div ref={containerRef} className="w-full h-full" />;

  
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard: React.FC = () => {
  const layout = [
    { i: "table1", x: 0, y: 0, w: 2, h: 6, type: "txt" },
    { i: "chart1", x: 2, y: 0, w: 4, h: 8, type: "chart" },

    { i: "chart2", x: 0, y: 0, w: 2, h:6, type: "hotmap" },
    { i: "table2", x: 2, y: 0, w: 4, h:4, type: "ss" },
  ];

  const renderContent = (type: string) => {
    switch (type) {
      case "chart":
        return <D3Chart />;
      case "txt":
        return  <TxtTable />
        case "ss":
          return <D3Chart2 />;
        case "hotmap":
          return  <HotMap />
          
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
};

export default Dashboard;
