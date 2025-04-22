import "./App.css";
import AppRouter from "./route";
import { useEffect } from "react";
import { useWebSocketStore } from "./store/websocketStore";

function App() {
  const connect = useWebSocketStore((s) => s.connect); 
  useEffect(() => {
    connect('ws://127.0.0.1:8080');
  }, []);

  // useEffect(() => {
  //   const handler = (e: MouseEvent) => e.preventDefault();
  //   window.addEventListener("contextmenu", handler);
  //   return () => {
  //     window.removeEventListener("contextmenu", handler);
  //   };
  // }, []);

  return <AppRouter />;
}

export default App;
