import { create } from "zustand";

interface WebSocketState {
  messages: string[];
  isConnected: boolean;
  error: string | null;
  sendMessage: (msg: any) => void;
  connect: (url: string) => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => {
  let socket: WebSocket | null = null;
  let pingInterval: any = null;

  return {
    messages: [],
    isConnected: false,
    error: null,
    sendMessage: (msgObj) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msgObj));
      } else {
        console.warn("WebSocket not connected");
      }
    },
    connect: (url) => {
      if (socket) {
        socket.close();
      }

      socket = new WebSocket(url);

      socket.onopen = () => {
        set({ isConnected: true });
        pingInterval = setInterval(() => {
          socket?.send(JSON.stringify({ type: "ping" }));
        }, 10000);
      };

      socket.onmessage = (event) => {
        try {
            const parsed = JSON.parse(event.data);
            if (parsed?.msg === "pong") {
              return; 
            }
        } catch (error) {
            set((state) => ({
                messages: [...state.messages, event.data].slice(-500),
            }));
        }
      };

      socket.onerror = () => {
        set({ error: "WebSocket error" });
      };

      socket.onclose = () => {
        clearInterval(pingInterval);
        set({ isConnected: false });
      };
    },
  };
});

