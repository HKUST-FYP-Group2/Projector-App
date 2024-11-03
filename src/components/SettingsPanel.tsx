import {
  VideoSettingsOutlined as VideoSettingsOutlinedIcon,
  AccountCircle as AccountCircleIcon,
  SettingsBrightness as SettingsBrightnessIcon,
  VolumeUp as VolumeUpIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  LogoutOutlined as LogoutOutlinedIcon,
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import LeftPanelItem from ".//SettingsPanelLeft.tsx";
import RightPanelContent from ".//SettingsPanelRight.tsx";
import Settings from "../data/settings.ts";

interface SettingsPanelProps {
  showSettingPanel: boolean;
  setShowSettingPanel: (value: boolean) => void;
  isClosingSettingsPanel: boolean;
  setIsClosingSettingsPanel: (value: boolean) => void;
  handleVideoSettings: () => void;
  settings: Settings;
  setSettings: (value: Settings) => void;
  userStatus?: { username: string };
  setSnackbarOpen: (value: boolean) => void;
  setSnackbarMessage: (value: string) => void;
  setSnackbarSeverity: (value: "success" | "error") => void;
}

const SettingsPanel = ({
  showSettingPanel,
  setShowSettingPanel,
  isClosingSettingsPanel,
  setIsClosingSettingsPanel,
  handleVideoSettings,
  settings,
  setSettings,
  userStatus,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
}: SettingsPanelProps) => {
  const [selectedItem, setSelectedItem] = useState<string>("Video");

  const items = useMemo(
    () => [
      { icon: VideoSettingsOutlinedIcon, label: "Video" },
      { icon: SettingsBrightnessIcon, label: "Brightness" },
      { icon: VolumeUpIcon, label: "Volume" },
      { icon: ScheduleIcon, label: "Clock" },
      { icon: SettingsIcon, label: "Settings Bar" },
      { icon: LogoutOutlinedIcon, label: "Keymap" },
    ],
    [],
  );

  useEffect(() => {
    if (isClosingSettingsPanel) {
      setTimeout(() => {
        setShowSettingPanel(false);
        setIsClosingSettingsPanel(false);
      }, 290);
    }
  }, [
    isClosingSettingsPanel,
    showSettingPanel,
    setShowSettingPanel,
    setIsClosingSettingsPanel,
  ]);

  //keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setSelectedItem((prevSelectedItem) => {
        const currentIndex = items.findIndex(
          (item) => item.label === prevSelectedItem,
        );
        if (event.key === "ArrowUp") {
          const newIndex = (currentIndex - 1 + items.length) % items.length;
          return items[newIndex].label;
        } else if (event.key === "ArrowDown") {
          const newIndex = (currentIndex + 1) % items.length;
          return items[newIndex].label;
        }
        return prevSelectedItem;
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [items]);

  if (!showSettingPanel) return null;

  return (
    <div
      className={`w-full h-full z-10 absolute items-center flex justify-center opacity-90`}
      onClick={() => setIsClosingSettingsPanel(true)}
    >
      <div
        className={`w-[700px] h-fit flex flex-col rounded-xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`h-fit w-full bg-blue text-white p-[20px] flex ${isClosingSettingsPanel ? "fade-out-short" : "fade-in-short"}`}
        >
          <div className={`h-full w-[30%] flex flex-col z-10`}>
            <div className={`w-full h-fit flex`}>
              <AccountCircleIcon
                style={{ fontSize: "70px" }}
                className={`text-white`}
              />
              <div className={`w-full ml-1 text-white flex items-center`}>
                {userStatus?.username || "User"}
              </div>
            </div>
            {items.map((item) => (
              <LeftPanelItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                isSelected={selectedItem === item.label}
                onClick={() => setSelectedItem(item.label)}
              />
            ))}
          </div>
          <RightPanelContent
            selectedItem={selectedItem}
            handleVideoSettings={handleVideoSettings}
            settings={settings}
            setSettings={setSettings}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
