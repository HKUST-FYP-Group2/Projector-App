import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { TransitionProps } from "@mui/material/transitions";
import Slide, { SlideProps } from "@mui/material/Slide";

interface CustomizedSnackBarProps {
  snackbarMessage: string;
  snackbarSeverity: "success" | "error";
  snackbarOpen: boolean;
  setSnackbarOpen: (value: boolean) => void;
}

const CustomizedSnackBar = ({
  snackbarMessage,
  snackbarSeverity,
  snackbarOpen,
  setSnackbarOpen,
}: CustomizedSnackBarProps) => {
  const backgroundColor =
    snackbarSeverity === "success" ? "#003366" : "#7c2348";
  const iconColor = "#faa61a";

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const [snackbarTransition] = useState<{
    Transition: React.ComponentType<
      TransitionProps & {
        children: React.ReactElement<any, any>;
      }
    >;
  }>({
    Transition: SlideTransition,
  });

  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="down" />;
  }

  return (
    <Snackbar
      open={snackbarOpen}
      onClose={handleSnackbarClose}
      autoHideDuration={2000}
      TransitionComponent={snackbarTransition.Transition}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity={snackbarSeverity}
        sx={{
          width: "100%",
          backgroundColor: backgroundColor,
          color: iconColor,
          "& .MuiAlert-icon": {
            color: iconColor,
          },
        }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackBar;
