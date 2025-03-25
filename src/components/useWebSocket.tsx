import React, { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Settings from "./settings.ts";
import { useCookies } from "react-cookie";

interface WebSocketProps {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
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
          console.log(settings);
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
      console.log("Send settings check:", cookies["user_id"], cookies["deviceUUID"]);
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

  useEffect(() => {
    sendSetting(settings);
  }, [sendSetting, settings]);

  return { connectSocket, socket, sendSetting, sendLogout };
};

export default useWebSocket;
