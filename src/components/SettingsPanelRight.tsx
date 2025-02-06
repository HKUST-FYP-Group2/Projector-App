import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import Settings from "../data/settings.ts";
import defaultSettings from "../data/settings.json";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface SettingsPanelRightProps {
  selectedItem: string;
  settings: Settings;
  setSettings: (value: Settings) => void;
  setSnackbarOpen: (value: boolean) => void;
  setSnackbarMessage: (value: string) => void;
  setSnackbarSeverity: (value: "success" | "error") => void;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#996600",
    },
  },
});

const SettingsPanelRight = ({
  selectedItem,
  settings,
  setSettings,
  setSnackbarOpen,
  setSnackbarMessage,
  setSnackbarSeverity,
}: SettingsPanelRightProps) => {
  return (
    <ThemeProvider theme={theme}>
      <div className={`ml-4 p-2 overflow-hidden flex-col flex w-[70%]`}>
        <div className={`text-center font-bold text-3xl select-none`}>
          {selectedItem}
        </div>
        <div
          className={`mt-3 h-[300px] overflow-y-auto py-2 scrollbar scrollbar-thumb-blue-3 scrollbar-track-blue`}
        >
          {selectedItem === "Video" && (
            <div className={`w-full h-fit flex flex-col items-center`}>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Show Video</span>
                <Switch
                  checked={settings.video.show_video}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      video: {
                        ...settings.video,
                        show_video: e.target.checked,
                      },
                    })
                  }
                  color={`primary`}
                  className={`mr-0 ml-auto`}
                />
              </div>
              <div
                className={`settings-panel-switch-container`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <span>Video Url</span>
                <input
                  type="textarea"
                  value={settings.video.video_url}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      video: {
                        ...settings.video,
                        video_url: e.target.value,
                      },
                    })
                  }
                  className={`mr-0 ml-2 w-auto bg-transparent border-[1px] rounded px-1`}
                  style={{ flexGrow: 1 }}
                />
              </div>
              <div
                className={`settings-panel-switch-container cursor-pointer hover:bg-yellow`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    video: {
                      ...defaultSettings.video,
                    },
                  })
                }
              >
                <span className={`mt-[7px]`}>Reset Default</span>
              </div>
            </div>
          )}
          {selectedItem === "Brightness" && (
            <div
              className={`w-full h-fit flex items-center justify-center mt-2 `}
            >
              <div
                className={`flex w-fit items-center justify-center bg-blue-3 rounded px-2 text-white`}
              >
                <Brightness2Icon />
                <div className={`w-[250px] ml-3 mr-6 mt-1 `}>
                  <Slider
                    value={settings.brightness}
                    onChange={(_, value) =>
                      setSettings({ ...settings, brightness: value as number })
                    }
                    min={20}
                    max={100}
                    style={{ width: "100%" }}
                    color="primary"
                  />
                </div>
                <BrightnessHighIcon />
              </div>
            </div>
          )}
          {selectedItem === "Clock" && (
            <div className={`w-full h-fit flex flex-col items-center`}>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Show Clock</span>
                <Switch
                  checked={settings.clock.show_clock}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clock: {
                        ...settings.clock,
                        show_clock: e.target.checked,
                      },
                    })
                  }
                  color={`primary`}
                  className={`mr-0 ml-auto`}
                />
              </div>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Show Second</span>
                <Switch
                  checked={settings.clock.show_second}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clock: {
                        ...settings.clock,
                        show_second: e.target.checked,
                      },
                    })
                  }
                  color={`primary`}
                  className={`mr-0 ml-auto`}
                />
              </div>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>12-Hour Format</span>
                <Switch
                  checked={settings.clock.hour_12}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clock: { ...settings.clock, hour_12: e.target.checked },
                    })
                  }
                  color={`primary`}
                  className={`mr-0 ml-auto`}
                />
              </div>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Font Size</span>
                <Slider
                  value={settings.clock.font_size}
                  onChange={(_, value) =>
                    setSettings({
                      ...settings,
                      clock: {
                        ...settings.clock,
                        font_size: Number(value),
                      },
                    })
                  }
                  min={10}
                  max={100}
                  color={`primary`}
                  style={{ width: "70%" }}
                  className={`mr-3 ml-auto`}
                />
              </div>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Font Color</span>
                <input
                  type="color"
                  value={settings.clock.font_color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clock: {
                        ...settings.clock,
                        font_color: e.target.value,
                      },
                    })
                  }
                  className={`mr-0 ml-auto mt-1.5`}
                />
              </div>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Background Color</span>
                <input
                  type="color"
                  value={settings.clock.background_color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clock: {
                        ...settings.clock,
                        background_color: e.target.value,
                      },
                    })
                  }
                  className={`mr-0 ml-auto mt-1.5`}
                />
              </div>
              <div
                className={`settings-panel-switch-container cursor-pointer hover:bg-yellow`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    clock: {
                      ...defaultSettings.clock,
                    },
                  })
                }
              >
                <span className={`mt-[7px]`}>Reset Default</span>
              </div>
            </div>
          )}
          {selectedItem === "Settings Bar" && (
            <div className={`w-full h-fit flex flex-col items-center`}>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Show Settings Bar</span>
                <Switch
                  checked={settings.settings_bar.show_settings_bar}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      settings_bar: {
                        ...settings.settings_bar,
                        show_settings_bar: e.target.checked,
                      },
                    });
                    if (!e.target.checked) {
                      setSnackbarOpen(true);
                      setSnackbarMessage(
                        "Settings Bar is hidden, press 's' to show the settings panel.",
                      );
                      setSnackbarSeverity("error");
                    }
                  }}
                  color={`primary`}
                  className={`mr-0 ml-auto`}
                />
              </div>

              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Default Color</span>
                <input
                  type="color"
                  value={settings.settings_bar.default_color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      settings_bar: {
                        ...settings.settings_bar,
                        default_color: e.target.value,
                      },
                    })
                  }
                  className={`mr-0 ml-auto mt-1.5`}
                />
              </div>

              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Hover Background Color</span>
                <input
                  type="color"
                  value={settings.settings_bar.hover_background_color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      settings_bar: {
                        ...settings.settings_bar,
                        hover_background_color: e.target.value,
                      },
                    })
                  }
                  className={`mr-0 ml-auto mt-1.5`}
                />
              </div>

              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Hover Icon Color</span>
                <input
                  type="color"
                  value={settings.settings_bar.hover_icon_color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      settings_bar: {
                        ...settings.settings_bar,
                        hover_icon_color: e.target.value,
                      },
                    })
                  }
                  className={`mr-0 ml-auto mt-1.5`}
                />
              </div>

              <div
                className={`settings-panel-switch-container cursor-pointer hover:bg-yellow`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    settings_bar: {
                      ...defaultSettings.settings_bar,
                    },
                  })
                }
              >
                <span className={`mt-[7px]`}>Reset Default</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SettingsPanelRight;
