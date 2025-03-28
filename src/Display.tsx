import React, { useEffect, useRef, useState } from "react";
import useAuth from "./components/useAuth.tsx";
import ReactPlayer from "react-player";
import Clock from "./components/Clock.tsx";
import SettingsBar from "./components/SettingsBar.tsx";
import SettingsPanel from "./components/SettingsPanel.tsx";
import ConfirmWindow from "./components/ConfirmWindow.tsx";
import useBluetooth from "./components/useBluetooth.tsx";
import CustomizedSnackBar from "./components/CustomizedSnackBar.tsx";
import useWebSocket from "./components/useWebSocket.tsx";
import generateVideoKeywords from "./components/generateVideoKeywords.tsx";
import { useCookies } from "react-cookie";
import Settings from "./components/settings.ts";
import { debounce } from "lodash";

interface DisplayProps {
  userStatus?: any;
  setUserStatus: (value: any) => void;
  deviceUUID?: any;
  setDeviceUUID?: (value: any) => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

function Display({
  userStatus,
  setUserStatus,
  deviceUUID,
  setDeviceUUID,
  settings,
  setSettings,
}: DisplayProps) {
  const {
    handleLogout,
    checkIsLoggedIn,
    getDeviceUUID,
    putUserSettings,
    getUserSettings,
  } = useAuth();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showSettingPanel, setShowSettingPanel] = useState(false);
  const [isClosingSettingsPanel, setIsClosingSettingsPanel] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [isConfirmLogoutWindowShown, setIsConfirmLogoutWindowShown] =
    useState(false);
  const [isConfirmBluetoothWindowShown, setIsConfirmBluetoothWindowShown] =
    useState(false);
  let confirmDisconnect = false;
  const videoRef = useRef<HTMLDivElement>(null);
  const [cookies, setCookie] = useCookies(["deviceUUID"]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );
  const playerRef = useRef<ReactPlayer>(null);
  const [initBuffer, setInitBuffer] = useState(0);
  const videoKeywordsGenerator = generateVideoKeywords({
    playerRef,
    settings,
    setSettings,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
  });

  const { connectSocket, sendLogout } = useWebSocket({
    settings,
    setSettings,
    deviceUUID,
  });

  useEffect(() => {
    //save user status and device uuid in cookie
    checkIsLoggedIn().then((r) => setUserStatus(r));
    if (!deviceUUID && setDeviceUUID) {
      if (!cookies.deviceUUID) {
        const uuid = getDeviceUUID();
        setCookie("deviceUUID", uuid, { path: "/" });
        setDeviceUUID(uuid);
      } else {
        setDeviceUUID(cookies.deviceUUID);
      }
    }

    getUserSettings().then((res) => {
      console.log("userStatus", res);
      if (!res || res.status === 400) {
        putUserSettings(settings).then((res) => {
          console.log("putUserSettings", res);
        });
      } else {
        if (res.data.settings) {
          setSettings(res.data.settings);
        }
      }
    });

    //socket
    connectSocket();

    //full screen
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save settings to server with debounce
  const debouncedPutSettings = useRef(
    debounce((settingsToSave) => {
      putUserSettings(settingsToSave).then((res) => {
        console.log("Settings saved:", res);
      });
    }, 1000),
  ).current;

  // Save settings when they change
  useEffect(() => {
    debouncedPutSettings(settings);

    return () => {
      debouncedPutSettings.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // Fullscreen function
  function handleFullScreen() {
    const element = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => setIsFullScreen(false));
    } else {
      element.requestFullscreen().then(() => setIsFullScreen(true));
    }
  }

  const { isBluetoothAvailable, setupConnection, disconnect } = useBluetooth(
    isBluetoothConnected,
    setIsBluetoothConnected,
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
    settings,
    setSettings,
    videoKeywordsGenerator,
  );

  //Bluetooth Settings
  async function handleBluetoothSettings() {
    if (!isBluetoothAvailable()) {
      setSnackbarOpen(true);
      setSnackbarMessage("Bluetooth is not available on this device");
      setSnackbarSeverity("error");
      return;
    }
    if (isBluetoothConnected) {
      if (confirmDisconnect) {
        await disconnect();
        confirmDisconnect = false;
      } else {
        setIsConfirmBluetoothWindowShown(true);
      }
    } else {
      await setupConnection();
    }
  }

  //logout function
  const logoutFromDisplay = () => {
    setIsFadingOut(true);
    sendLogout();
    if (isBluetoothConnected) {
      confirmDisconnect = true;
      (async () => {
        await handleBluetoothSettings();
      })();
    }
    setTimeout(() => {
      handleLogout().then((r) => setUserStatus(r));
    }, 800);
  };

  //keyboard listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "q") {
        setIsClosingSettingsPanel(true);
      }
      if (event.key === "l") {
        logoutFromDisplay();
      }
      if (event.key === "f") {
        handleFullScreen();
      }
      if (event.key === "s") {
        setShowSettingPanel(true);
      }
      if (event.key === "c") {
        setSettings({
          ...settings,
          clock: { ...settings.clock, show_clock: !settings.clock.show_clock },
        });
      }
      if (event.key === "b") {
        (async () => {
          await handleBluetoothSettings();
        })();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setInitBuffer(0);
  }, [settings.video.video_url]);

  //audio
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    // handle audio fading
    const setupAudioFade = () => {
      if (!audioRef.current || !settings.sound.sound_url) return;

      // Reset audio element
      audioRef.current.volume = settings.sound.volume / 100;
      audioRef.current.currentTime = 0;

      // Set up listeners for fading
      audioRef.current.addEventListener("timeupdate", handleSimpleFade);
      audioRef.current.addEventListener("ended", handleSimpleLoop);

      // Try to play
      audioRef.current.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
    };

    // Clean up previous audio before setting up new one
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener("timeupdate", handleSimpleFade);
      audioRef.current.removeEventListener("ended", handleSimpleLoop);
    }

    // Set up new audio when URL changes
    if (settings.sound.sound_url) {
      setupAudioFade();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleSimpleFade);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        audioRef.current.removeEventListener("ended", handleSimpleLoop);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.sound.sound_url]);

  // Simpler fade implementations that don't use Web Audio API
  const handleSimpleFade = () => {
    if (!audioRef.current || settings.sound.mode === "original") return;

    const duration = audioRef.current.duration;
    if (!isFinite(duration)) return; // Guard against NaN

    const currentTime = audioRef.current.currentTime;
    const fadeOutStart = duration - 1.5; // Start fade 1.5 seconds before end

    if (currentTime >= fadeOutStart) {
      const fadeOutDuration = 1.5;
      const fadeOutPosition = (currentTime - fadeOutStart) / fadeOutDuration;
      audioRef.current.volume =
        Math.max(0, 1 - fadeOutPosition) * (settings.sound.volume / 100);
    }
  };

  const handleSimpleLoop = () => {
    if (!audioRef.current || settings.sound.mode === "original") return;

    // Reset to beginning
    audioRef.current.currentTime = 0;

    // Start with low volume
    audioRef.current.volume = 0;

    // Start playing
    audioRef.current
      .play()
      .catch((err) => console.error("Audio loop failed:", err));

    // Fade in manually using intervals
    let volume = 0;
    const targetVolume = settings.sound.volume / 100;
    const fadeStep = targetVolume / 15; // 15 steps over ~1.5 seconds

    const fadeInterval = setInterval(() => {
      if (!audioRef.current) {
        clearInterval(fadeInterval);
        return;
      }

      volume = Math.min(targetVolume, volume + fadeStep);
      audioRef.current.volume = volume;

      if (volume >= targetVolume) {
        clearInterval(fadeInterval);
      }
    }, 100);
  };

  // Update volume directly
  useEffect(() => {
    if (audioRef.current && !(settings.sound.mode === "original")) {
      audioRef.current.volume = settings.sound.volume / 100;
    }
  }, [settings.sound.volume, settings.sound.mode]);

  return (
    <div
      className={`bg-blue w-screen h-screen text-white`}
      style={{ filter: `brightness(${settings.brightness}%)` }}
    >
      <div
        ref={videoRef}
        className={`w-full h-full absolute z-10 bg-blue ${isFadingOut ? "fade-in" : "fade-out"}`}
        onAnimationEnd={() => {
          if (videoRef.current) {
            if (isFadingOut) {
              videoRef.current.style.opacity = "100";
            } else {
              videoRef.current.style.opacity = "0";
            }
          }
        }}
      ></div>

      {/*//test button*/}
      {/*<button*/}
      {/*  onClick={() => {*/}
      {/*    getUserSettings();*/}
      {/*  }}*/}
      {/*  className={`bg-red-500 text-white p-2 rounded absolute top-0 right-0 m-2 z-50`}*/}
      {/*>*/}
      {/*  Save*/}
      {/*</button>*/}

      <div className={`w-full h-full absolute z-0 flex`}>
        {settings.video.show_video && (
          <>
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: "100%",
              }}
            >
              <ReactPlayer
                ref={playerRef}
                url={settings.video.video_url}
                playing
                loop={true}
                muted={!(settings.sound.mode === "original")}
                controls={false}
                height="100%"
                width="100%"
                volume={settings.sound.volume / 100}
                playbackRate={1}
                config={{
                  file: {
                    attributes: {
                      crossOrigin: "anonymous",
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    },
                    hlsOptions: {
                      maxBufferLength: 30,
                      maxMaxBufferLength: 60,
                      lowLatencyMode: false,
                      backBufferLength: 30,
                      startLevel: -1,
                      debug: false,
                    },
                  },
                }}
                onBuffer={() => console.log("Buffering...")}
                onBufferEnd={() => {
                  console.log("Buffering ended", initBuffer);
                  if (initBuffer === 0) {
                    setInitBuffer(1);
                    if(settings.sound.mode === "auto") {
                      videoKeywordsGenerator().then((r) => console.log(r));
                    }
                  }
                }}
                onError={(error) => {
                  console.log("Video loading error:", error);
                  setSettings(
                    (prev: Settings) =>
                      ({
                        ...prev,
                        video: {
                          ...prev.video,
                          video_url:
                            "https://virtualwindow.cam/recordings/rainy.mp4",
                        },
                      }) as Settings,
                  );
                }}
              />
            </div>
            <audio
              ref={audioRef}
              src={settings.sound.sound_url || undefined}
              style={{ display: "none" }}
              muted={settings.sound.mode === "original"}
            />
          </>
        )}
        {!settings.video.show_video && (
          <img
            src={`https://join.hkust.edu.hk/sites/default/files/2020-06/hkust.jpg`}
            className={`w-full bg-blue h-full object-cover`}
            alt={`image`}
          />
        )}
      </div>
      {!isFadingOut && (
        <>
          <SettingsPanel
            showSettingPanel={showSettingPanel}
            setShowSettingPanel={setShowSettingPanel}
            isClosingSettingsPanel={isClosingSettingsPanel}
            setIsClosingSettingsPanel={setIsClosingSettingsPanel}
            settings={settings}
            setSettings={setSettings}
            userStatus={userStatus}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSnackbarSeverity={setSnackbarSeverity}
            videoKeywordsGenerator={videoKeywordsGenerator}
          />

          <SettingsBar
            handleLogout={() => {
              setIsConfirmLogoutWindowShown(true);
            }}
            isFullScreen={isFullScreen}
            handleFullScreen={handleFullScreen}
            showSettingPanel={showSettingPanel}
            setShowSettingPanel={setShowSettingPanel}
            setIsClosingSettingsPanel={setIsClosingSettingsPanel}
            isBluetoothConnected={isBluetoothConnected}
            settings={settings}
            handleBluetoothSettings={handleBluetoothSettings}
          />

          <Clock settings={settings} />

          <ConfirmWindow
            message="Are you sure you want to logout?"
            onConfirm={logoutFromDisplay}
            onCancel={() => {
              setIsConfirmLogoutWindowShown(false);
            }}
            isConfirmWindowShown={isConfirmLogoutWindowShown}
          />

          <ConfirmWindow
            message="Are you sure you want to disconnect the Remote Control?"
            onConfirm={() => {
              confirmDisconnect = true;
              handleBluetoothSettings().then(() => {
                setIsConfirmBluetoothWindowShown(false);
              });
            }}
            onCancel={() => {
              setIsConfirmBluetoothWindowShown(false);
            }}
            isConfirmWindowShown={isConfirmBluetoothWindowShown}
          />

          <CustomizedSnackBar
            snackbarMessage={snackbarMessage}
            snackbarSeverity={snackbarSeverity}
            snackbarOpen={snackbarOpen}
            setSnackbarOpen={setSnackbarOpen}
          />
        </>
      )}
    </div>
  );
}

export default Display;
