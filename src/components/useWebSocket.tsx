import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Settings from "./settings.ts";
import { useCookies } from "react-cookie";
import { debounce } from "lodash";

interface WebSocketProps {
  settings: Settings;
  setSettings: (value: Settings) => void;
  deviceUUID: any;
    setSnackbarOpen: (value: boolean) => void;
    setSnackbarMessage: (value: string) => void;
    setSnackbarSeverity: (value: string) => void;
}

const useWebSocket = ({
                        settings,
                        setSettings,
                        deviceUUID,
                        setSnackbarOpen,
                        setSnackbarMessage,
                        setSnackbarSeverity
                      }: WebSocketProps) => {
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null); // Add a ref to track socket
  const [cookies] = useCookies(["token", "user_id", "deviceUUID", "stream_key"]);

  const connectSocket = () => {
    const token = cookies.token;

    if (!token) {
      setTimeout(connectSocket, 5000);
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

    newSocket.on("disconnect", () => {
      console.log("ws disconnected");
    });

    setSocket(newSocket);
    socketRef.current = newSocket;
  }


  const sendSetting = (s:any) => {
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
          settings: s,
        });
      }
  }

  useEffect(() => {
    if (socket) {
      const handleSyncSetting = (data: { user_id: any; device_type: string; msg: string; settings: Settings; }) => {
        console.log("ws", data);

        if (data.user_id != cookies.user_id) {
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

        if (data.device_type === "Camera") {
          if (data.msg === "StartStreaming") {
            handleSnackBar("Streaming Enabled, Buffering......", "success");
            setTimeout(()=>{
              setSettings({
                ...settings,
                video: {
                  show_video: true,
                  video_url: `https://virtualwindow.cam/hls/${cookies.stream_key}/index.m3u8`
                },

              });
            },5000)
          }

          if(data.msg === "StopStreaming"){
            handleSnackBar("Streaming Disabled", "error");
          }
        }
      };

      socket.on("SyncSetting", handleSyncSetting);

      // Clean up
      return () => {
        socket.off("SyncSetting", handleSyncSetting);
      };
    }
  }, [socket, settings, cookies.user_id, sendSetting, setSettings]);


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

  function handleSnackBar(message: string, severity: string) {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }

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

  return { connectSocket, socket, sendSetting, sendLogout, disconnectSocket };
};

export default useWebSocket;
