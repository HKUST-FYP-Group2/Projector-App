import { useState, useEffect } from "react";
import useAuth from "./Components/useAuth.tsx";
import ReactPlayer from "react-player";
import Clock from "./Components/Clock.tsx";
import SettingsBar from "./Components/SettingsBar.tsx";
import SettingsPanel from "./Components/SettingsPanel.tsx";

function Display() {
  useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettingPanel, setShowSettingPanel] = useState(false);

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

  return (
    <div className={`bg-blue w-screen h-screen text-white `}>
      <div className={`absolute bottom-0 right-0 flex`}>
        <div
          className={`absolute z-30 w-full h-full bg-blue blur opacity-60`}
        ></div>
        <div className={`z-40 px-5 py-3 w-full h-full select-none`}>
          <Clock
            fontStyle={`text-yellow font-bold text-[40px]`}
            position={``}
          />
        </div>
      </div>

      <div className={`w-full h-full absolute z-0`}>
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

      {showSettingPanel && (
        <SettingsPanel
          showSettingPanel={showSettingPanel}
          setShowSettingPanel={setShowSettingPanel}
          handleVideoSettings={handleVideoSettings}
        />
      )}

      <SettingsBar
        isFullScreen={isFullScreen}
        handleFullScreen={handleFullScreen}
        showSettingPanel={showSettingPanel}
        setShowSettingPanel={setShowSettingPanel}
        setIsFadingOut={setIsFadingOut}
      />
    </div>
  );
}

export default Display;
