import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Settings from "./settings.ts";
import { useCookies } from "react-cookie";
import { debounce } from "lodash";

interface WebSocketProps {
  settings: Settings;
  setSettings: (value: Settings) => void;
  deviceUUID: any;
}

const useWebSocket = ({
                        settings,
                        setSettings,
                        deviceUUID,
                      }: WebSocketProps) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null); // Add a ref to track socket
  const [cookies] = useCookies(["token", "user_id", "deviceUUID"]);

  const connectSocket = useCallback(() => {
    const token = cookies.token;
    const userId = cookies.user_id;

    if (!token) {
      console.log("Token not ready, waiting 1s before retrying...");
      setTimeout(connectSocket, 1000);
      return;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create socket connection with current token
    const newSocket = io(VITE_API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    newSocket.on("connect", () => {
      newSocket.emit("SyncSetting", {
        device_type: "Projector",
        msg: "connecting to the server",
      });
      console.log("ws connected");
    });

    newSocket.on("SyncSetting", (data) => {
      console.log("ws", data);

      if (data.user_id !== userId) {
        return;
      }
      if (data.device_type === "Control") {
        if (data.msg === "GetSetting") {
          sendSetting(settings);
        }
        if (data.msg === "SetSetting") {
          setSettings(data.settings);
        }
      }
      if (data.device_type === "Projector") {
        // if (data.settings) {
        //   setLastReceivedSettings(data.settings);
        //   setSettings(data.settings);
        // }
      }
    });

    newSocket.on("disconnect", () => {
      console.log("ws disconnected");
    });

    setSocket(newSocket);
    socketRef.current = newSocket;
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.token, cookies.user_id, VITE_API_URL]);


  const sendSetting = useCallback(
      (settings: Settings) => {
        const currentSocket = socketRef.current; // Access the ref's current value
        if (
            currentSocket &&
            cookies["user_id"] &&
            cookies["deviceUUID"]
        ) {
          currentSocket.emit("SyncSetting", {
            user_id: cookies["user_id"],
            device_type: "Projector",
            device_uuid: deviceUUID || cookies["deviceUUID"],
            msg: "UpdateProjectorAppSetting",
            settings: settings,
          });
        }
      },
      [cookies, deviceUUID], // Remove socket from dependencies
  );

  const sendLogout = () => {
    const currentSocket = socketRef.current;
    if (currentSocket) {
      currentSocket.emit("SyncSetting", {
        user_id: cookies["user_id"],
        device_type: "Projector",
        device_uuid: deviceUUID || cookies["deviceUUID"],
        msg: "Logout",
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSendSetting = useCallback(
      debounce((settingsToSend: Settings) => {
        const currentSocket = socketRef.current;
        if (
            currentSocket &&
            cookies["user_id"] &&
            cookies["deviceUUID"]
        ) {
          currentSocket.emit("SyncSetting", {
            user_id: cookies["user_id"],
            device_type: "Projector",
            device_uuid: deviceUUID || cookies["deviceUUID"],
            msg: "UpdateProjectorAppSetting",
            settings: settingsToSend,
          });
        }
      }, 500),
      [cookies, deviceUUID], // Dependencies remain the same
  );

  // Add this function to useWebSocket.tsx
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      console.log("Disconnecting WebSocket...");
      socketRef.current.off("SyncSetting"); // Remove specific listener
      socketRef.current.off("connect");
      socketRef.current.off("disconnect");
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
  }, []);

  useEffect(() => {
    if (JSON.stringify(settings)) {
      debouncedSendSetting(settings);
    }
    return () => {
      debouncedSendSetting.cancel();
    };
  }, [settings, debouncedSendSetting]);

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return { connectSocket, socket, sendSetting, sendLogout, disconnectSocket };
};

export default useWebSocket;
