import { useState, useEffect } from "react";
import useAuth from "./Components/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import CustomizedTooltip from "./Components/CustomizedTooltip.tsx";
import {
  LogoutOutlined as LogoutOutlinedIcon,
  FullscreenOutlined as FullscreenOutlinedIcon,
  FullscreenExitOutlined as FullscreenExitOutlinedIcon,
  VideoSettingsOutlined as VideoSettingsOutlinedIcon,
  BluetoothDisabledOutlined as BluetoothDisabledOutlinedIcon,
  BluetoothConnectedOutlined as BluetoothConnectedOutlinedIcon,
} from "@mui/icons-material";
import ReactPlayer from "react-player";
import Clock from "./Components/Clock.tsx";

function Display() {
  useAuth();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [togglePanel, setTogglePanel] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

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

  //logout function
  function handleLogout() {
    setIsFadingOut(true);
    setTimeout(() => {
      sessionStorage.removeItem("session");
      navigate("/login");
    }, 1000); // Match the duration of the fade-out animation
  }

  //TODO: Bluetooth Settings
  function handleBluetoothSettings() {
    setIsBluetoothConnected(!isBluetoothConnected);
  }

  //TODO: Video Settings
  function handleVideoSettings() {
    setIsPlaying(!isPlaying);
  }

  // Fullscreen function
  function handleFullScreen() {
    const element = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    } else {
      element.requestFullscreen().then(() => setIsFullScreen(true));
    }
  }

  return (
    <div className={`bg-blue w-screen h-screen text-white `}>
      <div className={`w-full h-full absolute`}>
        <div className={`absolute bottom-0 right-0 flex`}>
          <div
            className={`absolute z-30 w-full h-full bg-blue blur opacity-50`}
          ></div>
          <div className={`z-40 px-5 py-3 w-full h-full select-none`}>
            <Clock
              fontStyle={`text-yellow font-bold text-[40px]`}
              position={``}
            />
          </div>
        </div>

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
      <div
        className={`absolute flex bottom-2 left-0 opacity-50 hover:opacity-100 pl-2 pt-10 pr-10 `}
        onMouseOver={() => {
          setTogglePanel(true);
        }}
        onMouseLeave={() => {
          setTogglePanel(false);
        }}
      >
        <div
          className={`flex rounded-xl pt-1 pb-1 pr-2 pl-2 ${togglePanel ? `bg-blue bg-opacity-60 text-gold` : `bg-transparent text-white`}`}
        >
          <div onClick={handleLogout} className={`display-buttons-style`}>
            <CustomizedTooltip title={`Logout`}>
              <LogoutOutlinedIcon fontSize="medium" />
            </CustomizedTooltip>
          </div>
          <div
            onClick={handleBluetoothSettings}
            className={`display-buttons-style`}
          >
            <CustomizedTooltip
              title={
                isBluetoothConnected
                  ? `Remote Control Connected`
                  : `Remote Control Not Connected`
              }
              key={isBluetoothConnected ? `connected` : `unconnected`}
            >
              {isBluetoothConnected ? (
                <BluetoothConnectedOutlinedIcon fontSize="medium" />
              ) : (
                <BluetoothDisabledOutlinedIcon fontSize="medium" />
              )}
            </CustomizedTooltip>
          </div>
          <div
            onClick={handleVideoSettings}
            className={`display-buttons-style`}
          >
            <CustomizedTooltip title={`Video Settings`}>
              <VideoSettingsOutlinedIcon fontSize="medium" />
            </CustomizedTooltip>
          </div>
          <div onClick={handleFullScreen} className={`display-buttons-style`}>
            <CustomizedTooltip
              title={`${isFullScreen ? `Exit Fullscreen` : `Fullscreen`}`}
            >
              {isFullScreen ? (
                <FullscreenExitOutlinedIcon fontSize="medium" />
              ) : (
                <FullscreenOutlinedIcon fontSize="medium" />
              )}
            </CustomizedTooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Display;
