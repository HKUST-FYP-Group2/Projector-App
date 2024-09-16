import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

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

      <div
        onClick={logout}
        className={`cursor-pointer w-fit h-fit hover:bg-blue-1`}
      >
        <LogoutOutlinedIcon />
      </div>
    </div>
  );
}

export default Display;
