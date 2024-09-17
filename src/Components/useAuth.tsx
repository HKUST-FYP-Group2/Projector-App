import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (!session || !isValidSession(session)) {
      navigate("/login");
    }
  }, [navigate]);

  const isValidSession = (session: string) => {
    //TODO: Add session validation logic, use axios to connect to flask
    return session === "valid-session-token";
  };
};

export default useAuth;
