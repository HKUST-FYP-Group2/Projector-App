interface SettingsPanelRightProps {
  selectedItem: string;
  clockSettings: {
    showClock: boolean;
    showSecond: boolean;
    hour12: boolean;
  };
  setClockSettings: (settings: {
    showClock: boolean;
    showSecond: boolean;
    hour12: boolean;
  }) => void;
  handleVideoSettings: () => void;
}

const SettingsPanelRight = ({
  selectedItem,
  clockSettings,
  setClockSettings,
  handleVideoSettings,
}: SettingsPanelRightProps) => {
  return (
    <div className={`ml-4 p-2 overflow-hidden flex-col flex w-[70%]`}>
      <div className={`text-center font-bold text-3xl `}>{selectedItem}</div>
      <div className={`mt-2`}>
        {selectedItem === "Video" && (
          <div>
            <input
              type="checkbox"
              checked={clockSettings.showClock}
              onChange={handleVideoSettings}
            />
            Image
          </div>
        )}
        {selectedItem === "Clock" && (
          <div>
            <div>
              <input
                type="checkbox"
                checked={clockSettings.showClock}
                onChange={(e) =>
                  setClockSettings({
                    ...clockSettings,
                    showClock: e.target.checked,
                  })
                }
              />
              Show Clock
            </div>
            <div>
              <input
                type="checkbox"
                checked={clockSettings.showSecond}
                onChange={(e) =>
                  setClockSettings({
                    ...clockSettings,
                    showSecond: e.target.checked,
                  })
                }
              />
              Show Second
            </div>
            <div>
              <input
                type="checkbox"
                checked={clockSettings.hour12}
                onChange={(e) =>
                  setClockSettings({
                    ...clockSettings,
                    hour12: e.target.checked,
                  })
                }
              />
              12 Hour Format
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPanelRight;
