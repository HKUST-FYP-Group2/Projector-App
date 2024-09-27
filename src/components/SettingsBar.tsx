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

interface ControlBarProps {
  handleLogout: () => void;
  isFullScreen: boolean;
  handleFullScreen: () => void;
  showSettingPanel: boolean;
  setShowSettingPanel: (value: boolean) => void;
  setIsClosingSettingsPanel: (value: boolean) => void;
  isBluetoothConnected: boolean;
  setIsBluetoothConnected: (value: boolean) => void;
}

const SettingsBar = ({
  handleLogout,
  isFullScreen,
  handleFullScreen,
  showSettingPanel,
  setShowSettingPanel,
  setIsClosingSettingsPanel,
  isBluetoothConnected,
  setIsBluetoothConnected,
}: ControlBarProps) => {
  const [togglePanel, setTogglePanel] = useState(false);

  //TODO: Bluetooth Settings
  function handleBluetoothSettings() {
    setIsBluetoothConnected(!isBluetoothConnected);
  }

  return (
    <div
      className={`absolute flex bottom-2 left-0 z-20 opacity-50 hover:opacity-100 pl-2 pt-10 pr-10 ${showSettingPanel ? `opacity-100` : ``} `}
      onMouseOver={() => {
        setTogglePanel(true);
      }}
      onMouseLeave={() => {
        setTogglePanel(false);
      }}
    >
      <div
        className={`flex rounded-xl pt-1 pb-1 pr-2 pl-2 ${togglePanel || showSettingPanel ? `bg-blue bg-opacity-60 text-gold` : `bg-transparent text-white`}`}
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
          onClick={() => {
            if (showSettingPanel) {
              setIsClosingSettingsPanel(true);
            } else {
              setShowSettingPanel(true);
            }
          }}
          className={`display-buttons-style ${showSettingPanel ? `text-yellow-1` : ``}`}
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
