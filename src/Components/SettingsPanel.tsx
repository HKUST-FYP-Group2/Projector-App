import {
  VideoSettingsOutlined as VideoSettingsOutlinedIcon,
  AccountCircle as AccountCircleIcon,
  SettingsBrightness as SettingsBrightnessIcon,
  VolumeUp as VolumeUpIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  LogoutOutlined as LogoutOutlinedIcon,
} from "@mui/icons-material";

interface SettingsPanelProps {
  showSettingPanel: boolean;
  setShowSettingPanel: (value: boolean) => void;
  handleVideoSettings: () => void;
}

const SettingsPanel = ({
  showSettingPanel,
  setShowSettingPanel,
  handleVideoSettings,
}: SettingsPanelProps) => {
  if (!showSettingPanel) return null;

  return (
    <div
      className={`w-full h-full z-10 absolute items-center flex justify-center opacity-90`}
      onClick={() => setShowSettingPanel(false)}
    >
      <div
        className={`w-[700px] h-fit flex flex-col rounded-xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-fit w-full bg-blue-4 text-yellow p-[20px] flex`}>
          <div className={`h-full w-fit flex flex-col`}>
            <div className={`w-full h-fit flex`}>
              <AccountCircleIcon
                style={{ fontSize: "70px" }}
                className={`text-white`}
              />
              <div className={`w-full ml-1 text-white flex items-center`}>
                User Name
              </div>
            </div>

            <div
              className={`settings-panel-left-div`}
              onClick={handleVideoSettings}
            >
              <VideoSettingsOutlinedIcon fontSize="large" />
              <span className={`ml-2`}>Video</span>
            </div>

            <div className={`settings-panel-left-div`}>
              <SettingsBrightnessIcon fontSize="large" />
              <span className={`ml-2`}>Brightness</span>
            </div>

            <div className={`settings-panel-left-div`}>
              <VolumeUpIcon fontSize="large" />
              <span className={`ml-2`}>Volume</span>
            </div>

            <div className={`settings-panel-left-div`}>
              <ScheduleIcon fontSize="large" />
              <span className={`ml-2`}>Clock</span>
            </div>

            <div className={`settings-panel-left-div`}>
              <SettingsIcon fontSize="large" />
              <span className={`ml-2`}>Settings Bar</span>
            </div>

            <div className={`settings-panel-left-div`}>
              <LogoutOutlinedIcon fontSize="large" />
              <span className={`ml-2`}>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
