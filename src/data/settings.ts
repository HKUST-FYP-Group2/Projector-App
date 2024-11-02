interface Settings {
  brightness: number;
  clock: {
    show_clock: boolean;
    show_second: boolean;
    hour_12: boolean;
    font_size: number;
    font_color: string;
    background_color: string;
  };
  settings_bar: {
    show_settings_bar: boolean;
    default_color: string;
    hover_background_color: string;
    hover_icon_color: string;
  };
}

export default Settings;
