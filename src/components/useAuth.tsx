import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const useAuth = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "user_id",
    "username",
    "stream_key",
  ]);

  async function checkIsLoggedIn() {
    if (!cookies.token) {
      navigate("/login");
    }
    const status = await loginStatus();
    console.log("isLoggedin", status);
    if (status.logged_in) {
      navigate("/");
      //save user_id and username to cookies
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
        setCookie("user_id", res.data.user_id, { path: "/" });

        return {
          login_success: true,
          error_message: "",
          token: res.data.token,
          user_id: res.data.user_id,
        };
      } else {
        return {
          login_success: false,
          error_message: "Invalid Login Credential",
          token: null,
          user_id: null,
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
          token: null,
          user_id: null,
        };
      }

      return {
        login_success: false,
        error_message: "Please connect to the HKUST VPN or use Eduroam Wifi.",
        token: null,
        user_id: null,
      };
    }
  }

  async function handleQRLogin(token: string, id: any) {
    setCookie("token", token, { path: "/" });
    setCookie("user_id", id, { path: "/" });
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
      removeCookie("token");
      removeCookie("user_id");
      removeCookie("username");
      navigate("/login");
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
  async function putUserSettings(settings: any, ID: number) {
    const token = cookies.token;
    const userId = cookies.user_id || ID;

    if (!userId || !token) {
      return;
    }

    try {
      return await axios.put(
        `/api/users/${userId}/pjt`,
        {
          projector_app_setting: settings,
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
  async function getUserSettings(tok: string, Id: number) {
    const token = cookies.token || tok;
    const userId = cookies.user_id || Id;
    console.log("getUserSettings", token, userId);
    if (!userId || !token) {
      return null;
    }

    try {
      return await axios.get(`/api/users/${userId}/pjt`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log("Error fetching user settings:", err);
      return null;
    }
  }

  //get stream url
  async function getStreamUrl(tok: string, id: number) {
    const token = cookies.token || tok;
    const userId = cookies.user_id || id;
    try {
      const res = await axios.get(`/api/users/${userId}/sk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("streamKey", res.data.stream_key)
      setCookie("stream_key", res.data.stream_key, { path: "/" });
      return res.data.stream_key;
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
    putUserSettings,
    getUserSettings,
    getStreamUrl,
  };
};

export default useAuth;
