import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAuth = () => {
  const navigate = useNavigate();

  async function check_IsLoggedIn() {
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
      const res = await axios("/api/status");
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

  return { check_IsLoggedIn, logout };
};

export default useAuth;
