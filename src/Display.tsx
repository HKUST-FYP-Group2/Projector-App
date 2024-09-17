import { useState, useEffect } from "react";
import useAuth from "./Components/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import CustomizedTooltip from "./Components/CustomizedTooltip.tsx";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import VideoSettingsOutlinedIcon from "@mui/icons-material/VideoSettingsOutlined";
import BluetoothDisabledOutlinedIcon from "@mui/icons-material/BluetoothDisabledOutlined";
import BluetoothConnectedOutlinedIcon from "@mui/icons-material/BluetoothConnectedOutlined";
import ReactPlayer from "react-player";

function Display() {
  useAuth();
  const navigate = useNavigate();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [togglePanel, setTogglePanel] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  //disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  //logout function
  function handleLogout() {
    localStorage.removeItem("session");
    navigate("/login");
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
    <div className={`bg-blue w-screen h-screen text-white`}>
      <div className={`w-full h-full absolute`}>
        {isPlaying && (
          <ReactPlayer
            url="https://youtu.be/3c-rhqg4nuY?si=hLoVJSOIA22a6eEG"
            className="w-full h-full"
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
            className={`w-full h-full object-cover`}
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
