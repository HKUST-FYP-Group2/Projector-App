import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { useCookies } from "react-cookie";

const useAuth = () => {
  const navigate = useNavigate();
  // const [cookies, , removeCookie] = useCookies(["session"]);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const API_ENDPOINT = import.meta.env.VITE_API_URL;

  async function check_IsLoggedIn() {
    // if (!cookies.session) {
    //   navigate("/login");
    // }
    // const status = await loginStatus();
    // if (status.logged_in) {
    //   navigate("/");
    //   return status;
    // } else if (status === false || status.logged_in === false) {
    //   navigate("/login");
    //   return null;
    // }
    return null;
  }

  async function loginStatus() {
    try {
      const res = await axios(`${API_ENDPOINT}/status`, { timeout: 3000 });
      return res.data;
    } catch (err) {
      return false;
    }
  }

  function logout() {
    axios.post(`${API_ENDPOINT}/logout`).then(() => {
      // removeCookie("session");
      navigate("/login");
    });
    //for admin admin test login
    navigate("/login");
  }

  async function getDeviceUUID() {
    const res = await axios.get(`${API_ENDPOINT}/device`, {
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
