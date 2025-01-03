import { useState } from "react";

const useBluetooth = (
  isBluetoothConnected: boolean,
  setIsBluetoothConnected: (value: boolean) => void,
  setSnackbarOpen: (value: boolean) => void,
  setSnackbarMessage: (value: string) => void,
  setSnackbarSeverity: (value: "success" | "error") => void,
) => {
  const device_name = "Virtual_Window_Control";
  const bluetooth_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
  const characteristic_uuid = "19b10001-e8f2-537e-4f6c-d104768a1214";

  const [bluetooth_server, setBluetoothServer] = useState<any>(null);
  const [bluetooth_service_found, setBluetoothServiceFound] =
    useState<any>(null);
  const [characteristic_found, setCharacteristic_found] = useState<any>(null);

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
    } catch (error) {
      console.log("Error:", error);
      setSnackbarMessage("Failed to connect Remote Control");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  function handleCharacteristicChange(event: {
    target: { value: AllowSharedBufferSource | undefined };
  }) {
    const newValueReceived = new TextDecoder().decode(event.target.value);
    console.log("Value: ", newValueReceived);
  }

  function onDisconnected(event: { target: { device: { name: any } } }) {
    console.log("Device Disconnected:", event.target.device.name);
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
    if (isBluetoothConnected && characteristic_found) {
      try {
        const encoder = new TextEncoder();
        const value = encoder.encode(message);
        characteristic_found.writeValue(value);
        console.log(message);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    } else {
      return false;
    }
  }

  return {
    isBluetoothAvailable,
    setupConnection,
    disconnect,
    sendMessage,
  };
};

export default useBluetooth;
