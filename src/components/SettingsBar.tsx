import CustomizedTooltip from "./CustomizedTooltip.tsx";
import {
  BluetoothConnectedOutlined as BluetoothConnectedOutlinedIcon,
  BluetoothDisabledOutlined as BluetoothDisabledOutlinedIcon,
  FullscreenExitOutlined as FullscreenExitOutlinedIcon,
  FullscreenOutlined as FullscreenOutlinedIcon,
  Logout as LogoutIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
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
  audioRef: React.RefObject<HTMLAudioElement>;
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
  audioRef,
}: SettingsBarProps) => {
  const [togglePanel, setTogglePanel] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Add an event listener to the audio element to update the state
  useEffect(() => {
    if (!audioRef.current) return;

    const updatePlayingState = () => {
      setIsAudioPlaying(!audioRef.current?.paused);
    };

    audioRef.current.addEventListener("play", updatePlayingState);
    audioRef.current.addEventListener("pause", updatePlayingState);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", updatePlayingState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        audioRef.current.removeEventListener("pause", updatePlayingState);
      }
    };
  }, [audioRef]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        // Fade in
        setIsAudioPlaying(true);
        audioRef.current.volume = 0;
        audioRef.current
          .play()
          .then(() => {
            // Gradually increase volume
            let currentVolume = 0;
            const targetVolume = settings.sound.volume / 100;
            const fadeInterval = setInterval(() => {
              if (!audioRef.current) {
                clearInterval(fadeInterval);
                return;
              }

              currentVolume = Math.min(targetVolume, currentVolume + 0.05);
              audioRef.current.volume = currentVolume;

              if (currentVolume >= targetVolume) {
                clearInterval(fadeInterval);
              }
            }, 50);
          })
          .catch((err) => {
            console.error("Audio err:", err);
          });
      } else {
        // Fade out
        let currentVolume = audioRef.current.volume;
        setIsAudioPlaying(false);
        const fadeInterval = setInterval(() => {
          if (!audioRef.current) {
            clearInterval(fadeInterval);
            return;
          }

          currentVolume = Math.max(0, currentVolume - 0.05);
          audioRef.current.volume = currentVolume;

          if (currentVolume <= 0) {
            clearInterval(fadeInterval);
            audioRef.current.pause();
            audioRef.current.volume = settings.sound.volume / 100;
          }
        }, 50);
      }
    }
  };

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
        <div onClick={toggleAudio} className={`display-buttons-style`}>
          <CustomizedTooltip
            title={`${isAudioPlaying ? "Pause Audio" : "Play Audio"}`}
          >
            {isAudioPlaying ? (
              <PauseIcon fontSize="medium" />
            ) : (
              <PlayArrowIcon fontSize="medium" />
            )}
          </CustomizedTooltip>
        </div>
      </div>
    </div>
  );
};

export default SettingsBar;
