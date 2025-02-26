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
import Settings from "./settings.ts";

interface SettingsBarProps {
  handleLogout: () => void;
  isFullScreen: boolean;
  handleFullScreen: () => void;
  showSettingPanel: boolean;
  setShowSettingPanel: (value: boolean) => void;
  setIsClosingSettingsPanel: (value: boolean) => void;
  isBluetoothConnected: boolean;
  settings: Settings;
  handleBluetoothSettings: () => void;
}

const SettingsBar = ({
  handleLogout,
  isFullScreen,
  handleFullScreen,
  showSettingPanel,
  setShowSettingPanel,
  setIsClosingSettingsPanel,
  isBluetoothConnected,
  settings,
  handleBluetoothSettings,
}: SettingsBarProps) => {
  const [togglePanel, setTogglePanel] = useState(false);

  if (!settings.settings_bar.show_settings_bar) return null;

  return (
    <div
      className={`absolute flex bottom-2 left-0 z-20 opacity-70 hover:opacity-100 pl-2 pt-[200px] pr-[200px] ${showSettingPanel ? `visible` : ``} `}
      onMouseOver={() => {
        setTogglePanel(true);
      }}
      onMouseLeave={() => {
        setTogglePanel(false);
      }}
    >
      <div
        className="flex rounded-xl pt-1 pb-1 pr-2 pl-2 "
        style={{
          color:
            togglePanel || showSettingPanel
              ? settings.settings_bar.hover_icon_color
              : settings.settings_bar.default_color,
          backgroundColor:
            togglePanel || showSettingPanel
              ? `${settings.settings_bar.hover_background_color}ac` // Assuming hover_background_color is in hex format
              : "transparent",
        }}
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
