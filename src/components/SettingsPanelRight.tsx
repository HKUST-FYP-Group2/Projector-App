import Slider from "@mui/material/Slider";
import Switch from "@mui/material/Switch";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import BrightnessHighIcon from "@mui/icons-material/BrightnessHigh";
import Settings from "../data/settings.ts";
import { createTheme, ThemeProvider } from "@mui/material/styles";

interface SettingsPanelRightProps {
  selectedItem: string;
  handleVideoSettings: () => void;
  settings: Settings;
  setSettings: (value: Settings) => void;
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
  handleVideoSettings,
  settings,
  setSettings,
}: SettingsPanelRightProps) => {
  return (
    <ThemeProvider theme={theme}>
      <div className={`ml-4 p-2 overflow-hidden flex-col flex w-[70%]`}>
        <div className={`text-center font-bold text-3xl select-none`}>
          {selectedItem}
        </div>
        <div className={`mt-5`}>
          {selectedItem === "Video" && (
            <div>
              <input type="checkbox" onChange={handleVideoSettings} />
              Image
            </div>
          )}
          {selectedItem === "Clock" && (
            <div className={`w-full h-full flex flex-col items-center`}>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Show Clock</span>
                <Switch
                  checked={settings.clock.showClock}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clock: { ...settings.clock, showClock: e.target.checked },
                    })
                  }
                  color={`primary`}
                  className={`mr-0 ml-auto`}
                />
              </div>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Show Second</span>
                <Switch
                  checked={settings.clock.showSecond}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clock: {
                        ...settings.clock,
                        showSecond: e.target.checked,
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
                  checked={settings.clock.hour12}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clock: { ...settings.clock, hour12: e.target.checked },
                    })
                  }
                  color={`primary`}
                  className={`mr-0 ml-auto`}
                />
              </div>
              <div className={`settings-panel-switch-container`}>
                <span className={`mt-[7px]`}>Font Size</span>
                <Slider
                  value={settings.clock.fontSize}
                  onChange={(_, value) =>
                    setSettings({
                      ...settings,
                      clock: {
                        ...settings.clock,
                        fontSize: Number(value),
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
            </div>
          )}
          {selectedItem === "Brightness" && (
            <div
              className={`w-full h-full flex items-center justify-center mt-2 `}
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
                    min={0}
                    max={100}
                    style={{ width: "100%" }}
                    color="primary"
                  />
                </div>
                <BrightnessHighIcon />
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SettingsPanelRight;
