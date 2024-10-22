interface Settings {
  brightness: number;
  clock: {
    showClock: boolean;
    showSecond: boolean;
    hour12: boolean;
    fontSize: number;
    fontColor: string;
    backgroundColor: string;
  };
}

export default Settings;
