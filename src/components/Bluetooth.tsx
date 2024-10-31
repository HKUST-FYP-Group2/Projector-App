import React, { useState } from "react";

const BluetoothComponent: React.FC = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<BluetoothDevice | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const requestBluetoothDevices = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service"], // Add any other services you need
      });
      console.log("Device found:", device);
      setDevices((prevDevices) => [...prevDevices, device]);
      setError(null);
    } catch (err) {
      console.error("Error requesting Bluetooth device:", err);
      setError("Failed to connect to Bluetooth device");
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      const server = await device.gatt?.connect();
      console.log("Connected to device:", device);
      setSelectedDevice(device);
      setError(null);
    } catch (err) {
      console.error("Error connecting to Bluetooth device:", err);
      setError("Failed to connect to Bluetooth device");
    }
  };

  return (
    <div>
      <button onClick={requestBluetoothDevices}>
        Scan for Bluetooth Devices
      </button>
      {devices.length > 0 && (
        <ul>
          {devices.map((device, index) => (
            <li key={index}>
              {device.name || "Unnamed Device"}
              <button onClick={() => connectToDevice(device)}>Connect</button>
            </li>
          ))}
        </ul>
      )}
      {selectedDevice && <p>Connected to: {selectedDevice.name}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default BluetoothComponent;
