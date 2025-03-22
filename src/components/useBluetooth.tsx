import { useEffect, useState } from "react";
import Settings from "./settings.ts";

const useBluetooth = (
  isBluetoothConnected: boolean,
  setIsBluetoothConnected: (value: boolean) => void,
  setSnackbarOpen: (value: boolean) => void,
  setSnackbarMessage: (value: string) => void,
  setSnackbarSeverity: (value: "success" | "error") => void,
  settings: Settings,
  setSettings: (value: Settings) => void,
  videoKeywordsGenerator: () => Promise<void>,
) => {
  const device_name = "Virtual_Window_Control";
  const bluetooth_UUID = "419d7afd-9d84-4387-bdd6-54428c9aabbb";
  const characteristic_uuid = "0f2441e6-7094-4561-b9c3-59f3690eb052";

  const [bluetooth_server, setBluetoothServer] = useState<any>(null);
  const [bluetooth_service_found, setBluetoothServiceFound] =
    useState<any>(null);
  const [characteristic_found, setCharacteristic_found] = useState<any>(null);

  useEffect(() => {
    if (isBluetoothConnected) {
      sendMessage(getMessageString()).then((r) => console.log(r));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  function getMessageString() {
    return (
      "brightness-" +
      settings.brightness.toString() +
      "|" +
      "volume-" +
      settings.sound.volume.toString()
    );
  }

  function isBluetoothAvailable() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!navigator.bluetooth) {
      console.log("Web Bluetooth API is not available in this browser");
      return false;
    }
    console.log("Web Bluetooth API supported in this browser");
    return true;
  }

  async function setupConnection() {
    try {
      console.log("Requesting Bluetooth Device...");
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: device_name }],
        optionalServices: [bluetooth_UUID],
      });

      console.log("Device selected", device);
      device.addEventListener("gattservicedisconnected", onDisconnected);

      const gattServer = await device.gatt.connect();
      setBluetoothServer(gattServer);
      console.log("Connected to GATT Server", gattServer);

      const service = await gattServer.getPrimaryService(bluetooth_UUID);
      setBluetoothServiceFound(service);
      console.log("Service found", service);

      const characteristic =
        await service.getCharacteristic(characteristic_uuid);
      setCharacteristic_found(characteristic);
      setIsBluetoothConnected(true);
      setSnackbarMessage("Remote Control connected successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      console.log("Characteristic found", characteristic);

      characteristic.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicChange,
      );
      await characteristic.startNotifications();
      console.log("Notifications Started.");
      setTimeout(async () => {
        await sendMessage(getMessageString());
      }, 2000);
    } catch (error) {
      console.log("Error:", error);
      setIsBluetoothConnected(false);
      setSnackbarMessage("Failed to connect Remote Control");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  function updateSettings(received: string) {
    const [brightnessPart, volumePart] = received.split("|");
    const brightness = brightnessPart.split("-")[1];
    const volume = volumePart.split("-")[1];
    setSettings({
      ...settings,
      brightness: parseInt(brightness),
      sound: {
        ...settings.sound,
        volume: parseInt(volume),
      },
    });
  }
  function handleCharacteristicChange(event: {
    target: { value: AllowSharedBufferSource | undefined };
  }) {
    const received = new TextDecoder().decode(event.target.value);
    console.log(received);
    if (received === "bgm") {
      videoKeywordsGenerator();
    } else {
      updateSettings(received);
    }
  }

  function onDisconnected(event: { target: { device: { name: any } } }) {
    console.log("Device Disconnected:", event.target.device.name);
    setIsBluetoothConnected(false);
    setupConnection().then(() => setIsBluetoothConnected(false));
  }

  async function disconnect() {
    console.log("Disconnect Device.", characteristic_found);
    if (isBluetoothConnected && characteristic_found) {
      try {
        await characteristic_found.stopNotifications();
        console.log("Notifications Stopped");
        if (bluetooth_server && bluetooth_server.connected) {
          const characteristic =
            await bluetooth_service_found.getCharacteristic(
              characteristic_uuid,
            );
          characteristic.removeEventListener(
            "characteristicvaluechanged",
            handleCharacteristicChange,
          );
          await bluetooth_server.disconnect();
          console.log("Device Disconnected");
          setIsBluetoothConnected(false);
          setSnackbarMessage("Remote Control disconnected");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } else {
          console.log("Bluetooth server is not connected");
          setSnackbarMessage("Failed to disconnect Remote Control");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.log("disconnect err:", error);
        setSnackbarMessage("An Disconnection Error Occur");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else {
      console.log("Bluetooth is not connected.");
      setSnackbarMessage("Bluetooth is not connected");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  async function sendMessage(message: string) {
    try {
      const encoder = new TextEncoder();
      const value = encoder.encode(message);
      characteristic_found.writeValue(value);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  return {
    isBluetoothAvailable,
    setupConnection,
    disconnect,
  };
};

export default useBluetooth;
