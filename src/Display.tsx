import { useState, useEffect } from "react";
import useAuth from "./components/useAuth.tsx";
import ReactPlayer from "react-player";
import Clock from "./components/Clock.tsx";
import SettingsBar from "./components/SettingsBar.tsx";
import SettingsPanel from "./components/SettingsPanel.tsx";
import { useNavigate } from "react-router-dom";
import settings_default from "./data/settings.json";

function Display() {
  useAuth();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettingPanel, setShowSettingPanel] = useState(false);
  const [isClosingSettingsPanel, setIsClosingSettingsPanel] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);

  const [settings, setSettings] = useState(settings_default);

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
      sessionStorage.removeItem("session");
      navigate("/login");
    }, 1000); // Match the duration of the fade-out animation
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
  }, [handleLogout]);

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
            className={`w-full h-full object-cover fade-in ${isFadingOut ? "fade-out" : ""}`}
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
          <div className={`absolute bottom-0 right-0 flex `}>
            {settings.clock.showClock && (
              <>
                <div
                  className={`absolute z-30 w-full h-full bg-blue blur opacity-60 fade-in-60`}
                ></div>
                <div className={`z-40 px-5 py-3 w-full h-full select-none`}>
                  <Clock
                    fontStyle={`text-yellow font-bold text-[30px] fade-in`}
                    position={``}
                    clockSettings={settings.clock}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Display;
