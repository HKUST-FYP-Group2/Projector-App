import { Route, Routes } from "react-router-dom";
import Display from "./Display.tsx";
import Login from "./Login.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Display />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
export default App;
