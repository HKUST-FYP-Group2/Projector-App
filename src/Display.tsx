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
    <div className={`bg-blue w-screen h-screen text-white`}>
      <div className={`w-full text-center`}>Display Component</div>
      <div className={`absolute bottom-2 left-0`}>
        <div
          onClick={logout}
          className={`cursor-pointer w-fit h-fit hover:bg-blue-1 `}
        >
          <LogoutOutlinedIcon />
        </div>
      </div>
    </div>
  );
}

export default Display;
