import { useState, useEffect, useRef } from "react";
import useAuth from "./components/useAuth.tsx";
import ReactPlayer from "react-player";
import Clock from "./components/Clock.tsx";
import SettingsBar from "./components/SettingsBar.tsx";
import SettingsPanel from "./components/SettingsPanel.tsx";
import ConfirmWindow from "./components/ConfirmWindow.tsx";
import settings_default from "./data/settings.json";
import useBluetooth from "./components/useBluetooth.tsx";
import CustomizedSnackBar from "./components/CustomizedSnackBar.tsx";
import videoFile from "../public/2-2-4k.mp4"; // Import the video file

interface DisplayProps {
  userStatus?: any;
  setUserStatus: (value: any) => void;
}

function Display({ userStatus, setUserStatus }: DisplayProps) {
  const { loginStatus, handleLogout } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettingPanel, setShowSettingPanel] = useState(false);
  const [isClosingSettingsPanel, setIsClosingSettingsPanel] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isConfirmLogoutWindowShown, setIsConfirmLogoutWindowShown] =
    useState(false);
  const [isConfirmBluetoothWindowShown, setIsConfirmBluetoothWindowShown] =
    useState(false);
  let confirmDisconnect = false;
  const [settings, setSettings] = useState(settings_default);
  const videoRef = useRef<HTMLDivElement>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  useEffect(() => {
    loginStatus().then((r) => setUserStatus(r));
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

  //TODO: Video Settings
  function handleVideoSettings() {
    setIsPlaying(!isPlaying);
  }

  const { isBluetoothAvailable, setupConnection, disconnect, sendMessage } =
    useBluetooth(
      isBluetoothConnected,
      setIsBluetoothConnected,
      setSnackbarOpen,
      setSnackbarMessage,
      setSnackbarSeverity,
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
      <div
        className={`absolute top-0 right-0 w-[100px] h-[100px] text-black z-50 opacity-100`}
      >
        <textarea id="messageInput" className="w-full h-[70%]"></textarea>
        <button
          className="w-full h-[30%] bg-blue text-white"
          onClick={() => {
            const message = (
              document.getElementById("messageInput") as HTMLTextAreaElement
            ).value;
            sendMessage(message);
          }}
        >
          Send
        </button>
      </div>

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
        {isPlaying && (
          <ReactPlayer
            url={videoFile}
            className="react-player-cover"
            playing
            loop
            muted
            width="100%"
            height="100%"
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        )}
        {!isPlaying && (
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
            handleVideoSettings={handleVideoSettings}
            settings={settings}
            setSettings={setSettings}
            userStatus={userStatus}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
            sendMessage={sendMessage}
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
