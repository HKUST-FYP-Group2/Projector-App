import { useState, useEffect, useRef } from "react";
import useAuth from "./components/useAuth.tsx";
import ReactPlayer from "react-player";
import Clock from "./components/Clock.tsx";
import SettingsBar from "./components/SettingsBar.tsx";
import SettingsPanel from "./components/SettingsPanel.tsx";
import ConfirmWindow from "./components/ConfirmWindow.tsx";
import settings_default from "../settings.json";
import useBluetooth from "./components/useBluetooth.tsx";
import CustomizedSnackBar from "./components/CustomizedSnackBar.tsx";
import useWebSocket from "./components/useWebSocket.tsx";
import { useCookies } from "react-cookie";

interface DisplayProps {
  userStatus?: any;
  setUserStatus: (value: any) => void;
  deviceUUID?: any;
  setDeviceUUID?: (value: any) => void;
}

function Display({ userStatus, setUserStatus, deviceUUID, setDeviceUUID }: DisplayProps) {
  const { loginStatus, handleLogout } = useAuth();
  const [settings, setSettings] = useState(settings_default);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showSettingPanel, setShowSettingPanel] = useState(false);
  const [isClosingSettingsPanel, setIsClosingSettingsPanel] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isConfirmLogoutWindowShown, setIsConfirmLogoutWindowShown] =
    useState(false);
  const [isConfirmBluetoothWindowShown, setIsConfirmBluetoothWindowShown] =
    useState(false);
  let confirmDisconnect = false;
  const videoRef = useRef<HTMLDivElement>(null);
  const [cookies] = useCookies(["deviceUUID"]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const { connectSocket } = useWebSocket({
    settings,
    setSettings,
    deviceUUID
  });

  useEffect(() => {
    loginStatus().then((r) => setUserStatus(r));
    connectSocket();
    if(deviceUUID==null){
      if (setDeviceUUID) {
        setDeviceUUID(cookies.deviceUUID);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  // Fullscreen function
  function handleFullScreen() {
    const element = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    } else {
      element.requestFullscreen().then(() => setIsFullScreen(true));
    }
  }

  const { isBluetoothAvailable, setupConnection, disconnect } = useBluetooth(
    isBluetoothConnected,
    setIsBluetoothConnected,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
    settings,
    setSettings,
  );

  //Bluetooth Settings
  async function handleBluetoothSettings() {
    if (!isBluetoothAvailable()) {
      setSnackbarOpen(true);
      setSnackbarMessage("Bluetooth is not available on this device");
      setSnackbarSeverity("error");
      return;
    }
    if (isBluetoothConnected) {
      if (confirmDisconnect) {
        await disconnect();
        confirmDisconnect = false;
      } else {
        setIsConfirmBluetoothWindowShown(true);
      }
    } else {
      await setupConnection();
    }
  }

  //logout function
  const logoutFromDisplay = () => {
    setIsFadingOut(true);

    if (isBluetoothConnected) {
      confirmDisconnect = true;
      (async () => {
        await handleBluetoothSettings();
      })();
    }
    setTimeout(() => {
      handleLogout().then((r) => setUserStatus(r));
    }, 800);
  };

  //keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "q") {
        setIsClosingSettingsPanel(true);
      }
      if (event.key === "l") {
        logoutFromDisplay();
      }
      if (event.key === "f") {
        handleFullScreen();
      }
      if (event.key === "s") {
        setShowSettingPanel(true);
      }
      if (event.key === "c") {
        setSettings({
          ...settings,
          clock: { ...settings.clock, show_clock: !settings.clock.show_clock },
        });
      }
      if (event.key === "b") {
        (async () => {
          await handleBluetoothSettings();
        })();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`bg-blue w-screen h-screen text-white`}
      style={{ filter: `brightness(${settings.brightness}%)` }}
    >
      {/*<div*/}
      {/*  className={`absolute top-0 right-0 w-[100px] h-[100px] text-black z-50 opacity-100`}*/}
      {/*>*/}
      {/*  <textarea id="messageInput" className="w-full h-[70%]"></textarea>*/}
      {/*  <button*/}
      {/*    className="w-full h-[30%] bg-blue text-white"*/}
      {/*    onClick={() => {*/}
      {/*      const message = (*/}
      {/*        document.getElementById("messageInput") as HTMLTextAreaElement*/}
      {/*      ).value;*/}
      {/*      sendMessage(message);*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    Send*/}
      {/*  </button>*/}
      {/*</div>*/}

      <div
        ref={videoRef}
        className={`w-full h-full absolute z-10 bg-blue ${isFadingOut ? "fade-in" : "fade-out"}`}
        onAnimationEnd={() => {
          if (videoRef.current) {
            if (isFadingOut) {
              videoRef.current.style.opacity = "100";
            } else {
              videoRef.current.style.opacity = "0";
            }
          }
        }}
      ></div>

      <div className={`w-full h-full absolute z-0 flex`}>
        {settings.video.show_video && (
            <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
              <ReactPlayer
                  url={settings.video.video_url}
                  playing
                  muted
                  controls={true}
                  width="calc(100% + 10px)"  // Compensate for left crop
                  height="200%"
                  style={{
                    position: "absolute",
                    top: "-300px",
                    left: "-10px",  // Crop left by 10px
                    overflow: 'hidden'
                  }}
                  forceHLS={true}
              />
            </div>

        )}
        {!settings.video.show_video && (
          <img
            src={`https://join.hkust.edu.hk/sites/default/files/2020-06/hkust.jpg`}
            className={`w-full bg-blue h-full object-cover`}
            alt={`image`}
          />
        )}
      </div>

      {!isFadingOut && (
        <>
          <SettingsPanel
            showSettingPanel={showSettingPanel}
            setShowSettingPanel={setShowSettingPanel}
            isClosingSettingsPanel={isClosingSettingsPanel}
            setIsClosingSettingsPanel={setIsClosingSettingsPanel}
            settings={settings}
            setSettings={setSettings}
            userStatus={userStatus}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />

          <SettingsBar
            handleLogout={() => {
              setIsConfirmLogoutWindowShown(true);
            }}
            isFullScreen={isFullScreen}
            handleFullScreen={handleFullScreen}
            showSettingPanel={showSettingPanel}
            setShowSettingPanel={setShowSettingPanel}
            setIsClosingSettingsPanel={setIsClosingSettingsPanel}
            isBluetoothConnected={isBluetoothConnected}
            settings={settings}
            handleBluetoothSettings={handleBluetoothSettings}
          />

          <Clock settings={settings} />

          <ConfirmWindow
            message="Are you sure you want to logout?"
            onConfirm={logoutFromDisplay}
            onCancel={() => {
              setIsConfirmLogoutWindowShown(false);
            }}
            isConfirmWindowShown={isConfirmLogoutWindowShown}
          />

          <ConfirmWindow
            message="Are you sure you want to disconnect the Remote Control?"
            onConfirm={() => {
              confirmDisconnect = true;
              handleBluetoothSettings().then(() => {
                setIsConfirmBluetoothWindowShown(false);
              });
            }}
            onCancel={() => {
              setIsConfirmBluetoothWindowShown(false);
            }}
            isConfirmWindowShown={isConfirmBluetoothWindowShown}
          />

          <CustomizedSnackBar
            snackbarMessage={snackbarMessage}
            snackbarSeverity={snackbarSeverity}
            snackbarOpen={snackbarOpen}
            setSnackbarOpen={setSnackbarOpen}
          />
        </>
      )}
    </div>
  );
}

export default Display;
