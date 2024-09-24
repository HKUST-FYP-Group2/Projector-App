import CustomizedTooltip from "./CustomizedTooltip.tsx";
import {
  BluetoothConnectedOutlined as BluetoothConnectedOutlinedIcon,
  BluetoothDisabledOutlined as BluetoothDisabledOutlinedIcon,
  FullscreenExitOutlined as FullscreenExitOutlinedIcon,
  FullscreenOutlined as FullscreenOutlinedIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ControlBarProps {
  isFullScreen: boolean;
  handleFullScreen: () => void;
  setShowSettingPanel: (value: boolean) => void;
  setIsFadingOut: (value: boolean) => void;
}

const SettingsBar = ({
  isFullScreen,
  handleFullScreen,
  setShowSettingPanel,
  setIsFadingOut,
}: ControlBarProps) => {
  const navigate = useNavigate();
  const [togglePanel, setTogglePanel] = useState(false);

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
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);

  return (
    <div
      className={`absolute flex bottom-2 left-0 z-20 opacity-50 hover:opacity-100 pl-2 pt-10 pr-10 `}
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
            <LogoutIcon fontSize="medium" />
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
          onClick={() => setShowSettingPanel(true)}
          className={`display-buttons-style`}
        >
          <CustomizedTooltip title={`Settings`}>
            <SettingsIcon fontSize="medium" />
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
  );
};

export default SettingsBar;
