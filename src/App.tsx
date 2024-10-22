import { Route, Routes } from "react-router-dom";
import Display from "./Display.tsx";
import Login from "./Login.tsx";
import { useEffect, useState } from "react";
import useAuth from "./components/useAuth.tsx";

function App() {
  const { check_IsLoggedIn } = useAuth();
  const [userStatus, setUserStatus] = useState(null);
  useEffect(() => {
    check_IsLoggedIn().then((r) => setUserStatus(r));
  }, []);

  //disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  //disable right click
  // useEffect(() => {
  //   const handleContextMenu = (event: MouseEvent) => {
  //     event.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", handleContextMenu);
  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);

  return (
    <Routes>
      <Route path="/" element={<Display userStatus={userStatus} />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
