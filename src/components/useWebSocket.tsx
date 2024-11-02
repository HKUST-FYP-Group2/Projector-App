import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const VITE_WS_ENDPOINT = "http://127.0.0.1:5000";

  useEffect(() => {
    const newSocket = io(VITE_WS_ENDPOINT);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket.io connection opened");
      setIsConnected(true);
    });

    newSocket.on("message", (data: string) => {
      console.log("Socket.io message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.io connection closed");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
    });

    return () => {
      newSocket.close();
    };
  }, [VITE_WS_ENDPOINT]);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit("message", message);
    } else {
      console.error("Socket.io is not connected");
    }
  };

  return { messages, isConnected, sendMessage };
};

export default useWebSocket;
