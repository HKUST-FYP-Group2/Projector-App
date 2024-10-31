import { useEffect, useRef, useState } from "react";

const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const VITE_WS_ENDPOINT = "ws://localhost:80";

  useEffect(() => {
    ws.current = new WebSocket(VITE_WS_ENDPOINT);
    console.log(VITE_WS_ENDPOINT);

    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, [VITE_WS_ENDPOINT]);

  const sendMessage = (message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.error("WebSocket is not open");
    }
  };

  return { messages, isConnected, sendMessage };
};

export default useWebSocket;
