import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const useAuth = () => {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["token"]);

  async function check_IsLoggedIn() {
    if (!cookies.token) {
      navigate("/login");
    }
    const status = await loginStatus();
    if (status.logged_in) {
      navigate("/");
      return status;
    } else if (status === false || status.logged_in === false) {
      navigate("/login");
      return null;
    }
    return null;
  }

  async function loginStatus() {
    try {
      const res = await axios.get(`/api/status`, { timeout: 3000 });
      console.log(res);
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  function logout() {
    axios.post(`/api/logout`).then(() => {
      removeCookie("token");
      navigate("/login");
    });
    //for admin admin test login
    navigate("/login");
  }

  async function getDeviceUUID() {
    const res = await axios.get(`/api/uuid`, {
      timeout: 3000,
      headers: {
        "device-type": "projector-app",
      },
    });
    if (res.status === 200) {
      return res.data;
    } else {
      return null;
    }
  }

  return { check_IsLoggedIn, logout, loginStatus, getDeviceUUID };
};

export default useAuth;
