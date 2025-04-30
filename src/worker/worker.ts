// Web Worker 逻辑：计算鼠标靠近哪条曲线
interface ScaleData {
    domain: [number, number];
    range: [number, number];
  }
  
  interface WorkerData {
    points: [number, number][][];
    xScale: ScaleData;
    yScale: ScaleData;
    mouseX: number;
    mouseY: number;
  }
  
  onmessage = (e: MessageEvent<WorkerData>) => {
    const { points, xScale, yScale, mouseX, mouseY } = e.data;
  
    const scaleX = createLinearScale(xScale);
    const scaleY = createLinearScale(yScale);
  
    let foundIndex: number | null = null;
  
    points.some((data, i) => {
      return data.some(([xv, yv]) => {
        const px = scaleX(xv);
        const py = scaleY(yv);
        const dx = mouseX - px;
        const dy = mouseY - py;
        if (Math.sqrt(dx * dx + dy * dy) < 5) {
          foundIndex = i;
          return true;
        }
        return false;
      });
    });
  
    postMessage(foundIndex);
  };
  
  function createLinearScale({ domain, range }: ScaleData): (val: number) => number {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    const m = (r1 - r0) / (d1 - d0);
    return (v: number) => r0 + (v - d0) * m;
  }
  
  export {};
  