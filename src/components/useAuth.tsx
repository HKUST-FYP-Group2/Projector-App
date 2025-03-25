import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const useAuth = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "user_id",
    "username",
  ]);

  async function checkIsLoggedIn() {
    if (!cookies.token) {
      navigate("/login");
    }
    const status = await loginStatus();
    console.log(status);
    if (status.logged_in) {
      navigate("/");
      //save user_id and username to cookies
      console.log(status);
      setCookie("user_id", status.user_id, { path: "/" });
      setCookie("username", status.username, { path: "/" });
      return status;
    } else if (status === false || status.logged_in === false) {
      navigate("/login");
      return null;
    }
    return null;
  }

  async function loginStatus() {
    try {
      const token = cookies.token;
      const res = await axios.get(`/api/status`, {
        timeout: 3000,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
          device: "projector-app",
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
          error_message:
            errorMessages[err.response.status] ||
            "Ask Ivan to turn on the server",
        };
      }

      return {
        login_success: false,
        error_message: "Please connect to the HKUST VPN or use Eduroam Wifi.",
      };
    }
  }

  async function handleQRLogin(token: string) {
    setCookie("token", token, { path: "/" });
  }

  async function handleLogout() {
    const token = cookies.token;
    try {
      await axios
        .post(
          `/api/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(() => {
          removeCookie("token");
          removeCookie("user_id");
          removeCookie("username");
          navigate("/login");
        });
    } catch (err) {
      console.log(err);
      // navigate("/login");
    }
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

  //post user settings
  async function postUserSettings(settings: any) {
      const token = cookies.token;
      try {
      await axios.post(
          `/api/users/${cookies.user_id}/pjt`,
          {
          settings: settings,
          },
          {
          headers: {
              Authorization: `Bearer ${token}`,
          },
          },
      );
      } catch (err) {
      console.log(err);
      }
  }

  //get user settings
  async function getUserSettings() {
      const token = cookies.token;
      console.log(token)
      try {
      const res = await axios.get(`/api/users/${cookies.user_id}/pjt`, {
          headers: {
          Authorization: `Bearer ${token}`,
          },
      });
        console.log(res);
      return res;
      } catch (err) {
      console.log(err);
      return null;
      }
  }

  return {
    checkIsLoggedIn,
    handleLogin,
    handleLogout,
    getDeviceUUID,
    handleQRLogin,
    postUserSettings,
    getUserSettings,
  };
};

export default useAuth;
