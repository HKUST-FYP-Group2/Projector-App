import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import RefreshIcon from "@mui/icons-material/Refresh";
import Settings from "./settings.ts";
import defaultSettings from "../../settings.json";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import searchForSoundsByKeywords from "./searchForSoundsByKeywords.tsx";

interface SettingsPanelRightProps {
  selectedItem: string;
  settings: Settings;
  setSettings: (value: Settings) => void;
  setSnackbarOpen: (value: boolean) => void;
  setSnackbarMessage: (value: string) => void;
  setSnackbarSeverity: (value: "success" | "error") => void;
  videoKeywordsGenerator: () => Promise<void>;
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
  videoKeywordsGenerator,
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
                <span className={`mt-[7px]`}>Streaming</span>
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
                <span>Streaming URL</span>
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
                    className={`mt-1.5`}
                  />
                </div>
                <BrightnessHighIcon />
              </div>
            </div>
          )}
          {selectedItem === "Sound" && (
            <div className={`w-full h-fit flex flex-col items-center`}>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Original Streaming Sound</span>
                <Switch
                  checked={settings.sound.mode === "original"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      sound: {
                        ...settings.sound,
                        mode: e.target.checked ? "original" : "auto",
                      },
                    })
                  }
                  color={`primary`}
                  className={`mr-0 ml-auto`}
                />
              </div>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Volume</span>
                <Slider
                  value={settings.sound.volume}
                  onChange={(_, value) =>
                    setSettings({
                      ...settings,
                      sound: { ...settings.sound, volume: value as number },
                    })
                  }
                  min={0}
                  max={100}
                  color={`primary`}
                  style={{ width: "70%" }}
                  className={`mr-3 ml-auto mt-1.5`}
                />
              </div>
              {settings.sound.mode!=="original" && (
                <>
                  <div
                    className={`settings-panel-switch-container`}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span>Keywords: &nbsp;</span>
                    <span>
                      {settings.sound.mode === "manual"? "Manual": settings.sound.keywords?.length > 0
                        ? settings.sound.keywords.slice(-2).join(", ")
                        : "None"}
                    </span>
                    <span
                      className={`mr-0 ml-auto cursor-pointer text-gold hover:text-yellow`}
                      onClick={() => videoKeywordsGenerator()}
                    >
                      <RefreshIcon />
                    </span>
                  </div>

                  <div
                    className={`bg-blue-3 px-3 py-2 rounded flex flex-col mt-2 w-[80%]`}
                  >
                    <span className="mb-1">Sound URL:</span>
                    <div className="flex w-full">
                      <span
                        className={`break-all flex-1 hover:underline hover:text-yellow cursor-pointer`}
                        style={{ wordBreak: "break-all" }}
                        onClick={() => {
                          if (settings.sound.sound_url) {
                            window.open(settings.sound.sound_url, "_blank");
                          }
                        }}
                      >
                        {settings.sound.sound_url}
                      </span>
                      <span
                        className={`flex-shrink-0 cursor-pointer text-gold hover:text-yellow ml-2`}
                        onClick={() => {
                          if (settings.sound.keywords != null) {
                            searchForSoundsByKeywords(
                                settings.sound.keywords?.slice(-2),
                                setSettings,
                                settings,
                                setSnackbarOpen,
                                setSnackbarMessage,
                                setSnackbarSeverity,
                             ).then(r => console.log(r));
                          }
                        }}
                      >
                        <RefreshIcon />
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div
                className={`settings-panel-switch-container cursor-pointer hover:bg-yellow`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    sound: {
                      ...defaultSettings.sound,
                    },
                  })
                }
              >
                <span className={`mt-[7px]`}>Reset Default</span>
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
                  className={`mr-3 ml-auto mt-1.5`}
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
