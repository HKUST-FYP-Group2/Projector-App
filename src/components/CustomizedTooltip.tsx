import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import styled from "@emotion/styled";

const CustomizedTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(0, 51, 102, 1)",
    color: "rgba(204, 153, 0, 1)",
    fontSize: 12,
  },
}));

export default CustomizedTooltip;
