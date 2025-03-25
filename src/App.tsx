import { Route, Routes } from "react-router-dom";
import Display from "./Display.tsx";
import Login from "./Login.tsx";
import { useEffect, useState } from "react";
import useAuth from "./components/useAuth.tsx";
import settings_default from "../settings.json";

function App() {
  const { checkIsLoggedIn } = useAuth();
  const [userStatus, setUserStatus] = useState(null);
  const [deviceUUID, setDeviceUUID] = useState(null);
  const [settings, setSettings] = useState(settings_default);

  useEffect(() => {
    checkIsLoggedIn().then((r) => setUserStatus(r));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // disable right click
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Display
            userStatus={userStatus}
            setUserStatus={setUserStatus}
            deviceUUID={deviceUUID}
            setDeviceUUID={setDeviceUUID}
            settings={settings}
            setSettings={setSettings}
          />
        }
      />
      <Route
        path="/login"
        element={
          <Login deviceUUID={deviceUUID} setDeviceUUID={setDeviceUUID} />
        }
      />
    </Routes>
  );
}
export default App;
