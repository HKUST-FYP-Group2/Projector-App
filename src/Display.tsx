import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

function Display() {
  useAuth();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("session");
    navigate("/login");
  }

  return (
    <div>
      <div>Display Component</div>

      <button onClick={logout}>logout</button>
    </div>
  );
}

export default Display;
