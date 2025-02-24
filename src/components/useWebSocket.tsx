import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const VITE_WS_ENDPOINT = "http://localhost:8080";

  useEffect(() => {
    const newSocket = io(VITE_WS_ENDPOINT, {
      transports: ["websocket"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const message = (callback: (data: any) => void) => {
    socket?.on("message", callback);
  };

  return {
    socket,
    isConnected,
    message,
  };
};

export default useWebSocket;
