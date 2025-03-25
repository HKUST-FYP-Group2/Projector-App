import { useCallback, useEffect, useState } from "react";
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
  const [cookies] = useCookies(["token", "user_id", "deviceUUID"]);
  const [lastReceivedSettings, setLastReceivedSettings] =
    useState<Settings | null>(null);

  const connectSocket = () => {
    const token = cookies.token;
    const socket = io(VITE_API_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("SyncSetting", {
        device_type: "Projector",
        msg: "connecting to the server",
      });
      console.log("ws connected");
    });

    socket.on("SyncSetting", (data) => {
      console.log("ws", data);
      if (data === null || data.user_id !== cookies["user_id"]) {
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
        if (data.settings) {
          setLastReceivedSettings(data.settings);
          setSettings(data.settings);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("ws disconnected");
    });
  };

  const sendSetting = useCallback(
    (settings: Settings) => {
      if (
        socket &&
        JSON.stringify(settings) !== JSON.stringify(lastReceivedSettings) &&
        cookies["user_id"] &&
        cookies["deviceUUID"]
      ) {
        socket.emit("SyncSetting", {
          user_id: cookies["user_id"],
          device_type: "Projector",
          device_uuid: deviceUUID || cookies["deviceUUID"],
          msg: "UpdateProjectorAppSetting",
          settings: settings,
        });
      }
    },
    [socket, lastReceivedSettings, cookies, deviceUUID],
  );

  const sendLogout = () => {
    if (socket) {
      socket.emit("SyncSetting", {
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
      if (
        socket &&
        JSON.stringify(settingsToSend) !==
          JSON.stringify(lastReceivedSettings) &&
        cookies["user_id"] &&
        cookies["deviceUUID"]
      ) {
        socket.emit("SyncSetting", {
          user_id: cookies["user_id"],
          device_type: "Projector",
          device_uuid: deviceUUID || cookies["deviceUUID"],
          msg: "UpdateProjectorAppSetting",
          settings: settingsToSend,
        });
      }
    }, 500), // 500ms delay - adjust as needed
    [socket, lastReceivedSettings, cookies, deviceUUID],
  );

  useEffect(() => {
    // Only send if settings actually changed
    if (JSON.stringify(settings) !== JSON.stringify(lastReceivedSettings)) {
      debouncedSendSetting(settings);
    }

    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedSendSetting.cancel();
    };
  }, [settings, debouncedSendSetting, lastReceivedSettings]);

  return { connectSocket, socket, sendSetting, sendLogout };
};

export default useWebSocket;
