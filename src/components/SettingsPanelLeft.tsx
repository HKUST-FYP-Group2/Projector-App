import { SvgIconComponent } from "@mui/icons-material";

interface SettingsPanelLeftProps {
  icon: SvgIconComponent;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const SettingsPanelLeft = ({
  icon: Icon,
  label,
  isSelected,
  onClick,
}: SettingsPanelLeftProps) => (
  <div
    className={`settings-panel-left-div ${isSelected ? "bg-blue-3" : ""}`}
    onClick={onClick}
  >
    <Icon fontSize="large" />
    <span className={`ml-2`}>{label}</span>
  </div>
);

export default SettingsPanelLeft;
