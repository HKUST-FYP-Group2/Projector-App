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
  const [cookies] = useCookies(["token"]);
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
      socket.emit("SyncSetting", { device_type: "Projector" });
      console.log("ws connected");
    });

    socket.on("SyncSetting", (data) => {
      if (data?.settings) {
        console.log("Received settings", data.settings);
        setLastReceivedSettings(data.settings);
        setSettings(data.settings);
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
        JSON.stringify(settings) !== JSON.stringify(lastReceivedSettings)
      ) {
        socket.emit("SyncSetting", {
          device_type: "Projector",
          device_uuid: deviceUUID,
          settings: settings,
        });
      }
    },
    [socket, lastReceivedSettings],
  );

  useEffect(() => {
    sendSetting(settings);
  }, [sendSetting, settings]);

  return { connectSocket, socket, sendSetting };
};

export default useWebSocket;
