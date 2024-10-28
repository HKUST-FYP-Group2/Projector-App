import { useState, useEffect, useRef } from "react";
import useAuth from "./components/useAuth.tsx";
import ReactPlayer from "react-player";
import Clock from "./components/Clock.tsx";
import SettingsBar from "./components/SettingsBar.tsx";
import SettingsPanel from "./components/SettingsPanel.tsx";
import settings_default from "./data/settings.json";

interface DisplayProps {
  userStatus?: any;
  setUserStatus: (value: any) => void;
}

function Display({ userStatus, setUserStatus }: DisplayProps) {
  const { loginStatus, logout } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettingPanel, setShowSettingPanel] = useState(false);
  const [isClosingSettingsPanel, setIsClosingSettingsPanel] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [settings, setSettings] = useState(settings_default);
  const videoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    loginStatus().then((r) => setUserStatus(r));
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

  //logout function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function handleLogout() {
    setIsFadingOut(true);
    setTimeout(() => {
      logout();
    }, 800); // Match the duration of the fade-out animation
  }

  //keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "q") {
        setIsClosingSettingsPanel(true);
      }
      if (event.key === "l") {
        handleLogout();
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
          clock: { ...settings.clock, showClock: !settings.clock.showClock },
        });
      }
      if (event.key === "b") {
        setIsBluetoothConnected(
          (prevIsBluetoothConnected) => !prevIsBluetoothConnected,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleLogout, settings]);

  return (
    <div
      className={`bg-blue w-screen h-screen text-white`}
      style={{ filter: `brightness(${settings.brightness}%)` }}
    >
      <div className={`w-full h-full absolute z-0 flex`}>
        {isPlaying && (
          <ReactPlayer
            url="https://youtu.be/3c-rhqg4nuY?si=hLoVJSOIA22a6eEG"
            className={`w-full h-full fade-in ${isFadingOut ? "fade-out" : ""}`}
            playing
            loop
            muted
            width="100%"
            height="100%"
          />
        )}
        {!isPlaying && (
          <img
            src={`https://join.hkust.edu.hk/sites/default/files/2020-06/hkust.jpg`}
            className={`w-full bg-blue h-full object-cover fade-in ${isFadingOut ? "fade-out" : ""}`}
            ref={videoRef}
            onAnimationEnd={() => {
              if (isFadingOut && videoRef.current) {
                videoRef.current.style.opacity = "0";
              }
            }}
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
          />
          <SettingsBar
            handleLogout={handleLogout}
            isFullScreen={isFullScreen}
            handleFullScreen={handleFullScreen}
            showSettingPanel={showSettingPanel}
            setShowSettingPanel={setShowSettingPanel}
            setIsClosingSettingsPanel={setIsClosingSettingsPanel}
            isBluetoothConnected={isBluetoothConnected}
            setIsBluetoothConnected={setIsBluetoothConnected}
          />
          <Clock settings={settings} />
        </>
      )}
    </div>
  );
}

export default Display;
