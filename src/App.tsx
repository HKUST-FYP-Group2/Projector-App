import { Route, Routes } from "react-router-dom";
import Display from "./Display.tsx";
import Login from "./Login.tsx";
import { useEffect } from "react";

function App() {
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
      <Route path="/" element={<Display />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
