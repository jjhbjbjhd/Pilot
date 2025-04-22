import { useEffect, useRef, useState, useCallback } from "react";

const useWebSocket = (url: string) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let pingInterval: any;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);

      // // Ping 保活
      pingInterval = setInterval(() => {
        socket.send(JSON.stringify({ type: "ping" }));
        console.log("📢 Ping sent");
      }, 10000);
    };

    socket.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onerror = (err) => {
      console.error("❌ WebSocket error", err);
      setError("WebSocket error");
    };

    socket.onclose = () => {
      console.warn("🔌 WebSocket disconnected");
      setIsConnected(false);
      if (pingInterval) clearInterval(pingInterval);
    };

    return () => {
      if (pingInterval) clearInterval(pingInterval);
      socket.close();
    };
  }, [url]);

  const sendMessage = useCallback((msgObj: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const json = JSON.stringify(msgObj);
      socketRef.current.send(json);
    } else {
      console.warn("⚠️ WebSocket not connected, cannot send");
    }
  }, []);

  return {
    messages,
    isConnected,
    error,
    sendMessage,
  };
};

export default useWebSocket;
