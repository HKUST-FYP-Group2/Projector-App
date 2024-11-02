import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const useAuth = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  async function checkIsLoggedIn() {
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
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function handleLogin(username: string, password: string) {
    try {
      const res = await axios.post(
        `/api/login`,
        {
          username: username,
          password: password,
        },
        {
          timeout: 5000,
        },
      );
      console.log(res);
      if (res.status === 200) {
        setCookie("token", res.data.token, { path: "/" });
        return {
          login_success: true,
          error_message: "",
        };
      } else {
        return {
          login_success: false,
          error_message: "Invalid Login Credential",
        };
      }
    } catch (err) {
      console.log(err);
      const errorMessages: { [key: number]: string } = {
        401: "Invalid Login Credential",
        500: "Internal Server Error",
      };

      if (axios.isAxiosError(err) && err.response) {
        return {
          login_success: false,
          error_message: errorMessages[err.response.status] || "Not Found",
        };
      }

      return { login_success: false, error_message: "Not Found" };
    }
  }

  async function handleLogout() {
    try {
      await axios.post(`/api/logout`).then(() => {
        removeCookie("token");
        navigate("/login");
      });
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
    //for admin admin test login
    return null;
  }

  async function getDeviceUUID() {
    try {
      const res = await axios.get(`/api/uuid`, {
        timeout: 3000,
        headers: {
          "device-type": "projector-app",
        },
      });
      if (res.status === 200) {
        return res.data.uuid;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  return {
    check_IsLoggedIn: checkIsLoggedIn,
    handleLogin,
    handleLogout,
    loginStatus,
    getDeviceUUID,
  };
};

export default useAuth;
