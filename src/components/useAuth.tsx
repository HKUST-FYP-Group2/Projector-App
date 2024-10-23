import { useNavigate } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Cookies from "js-cookie";

const useAuth = () => {
  const navigate = useNavigate();

  async function check_IsLoggedIn() {
    if (Cookies.get(`session`) === undefined) {
      navigate("/login");
    }
    const status = await loginStatus();
    if (status.logged_in === true) {
      navigate("/");
      return status;
    } else if (status === false || status.logged_in === false) {
      navigate("/login");
      return null;
    }
  }

  async function loginStatus() {
    try {
      const res = await axios("/api/status", { timeout: 3000 });
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  function logout() {
    axios.post("/api/logout").then(() => {
      navigate("/login");
    });
  }

  return { check_IsLoggedIn, logout, loginStatus };
};

export default useAuth;
