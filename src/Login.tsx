import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.elements.namedItem("username") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    //TODO: should connect to flask auth, now just for demo
    if (username.value === "admin" && password.value === "admin") {
      const session = "s"; // Replace with session token return from flask
      sessionStorage.setItem("session", session);
      navigate("/");
    } else {
      alert("admin admin");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-blue">
      <img
        src={`https://join.hkust.edu.hk/sites/default/files/2020-06/hkust.jpg`}
        className={`w-full h-full object-cover absolute z-0 opacity-20`}
        alt={`image`}
      />
      <div className="flex flex-col justify-center items-center p-10 bg-yellow rounded-lg z-10">
        <div className="font-bold text-3xl xl:text-4xl text-blue select-none">
          Virtual Window
        </div>
        <div className={`w-full text-l xl:text-xl`}>
          <form onSubmit={handleSubmit}>
            <div className="relative mt-3 w-full">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="login-input-style"
              />
            </div>
            <div className="relative focus-within:text-blue-2 text-blue">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="login-input-style pr-10"
              />
              <span
                className="absolute right-2 top-4 cursor-pointer"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? (
                  <VisibilityOutlinedIcon />
                ) : (
                  <VisibilityOffOutlinedIcon />
                )}
              </span>
            </div>
            <button
              type="submit"
              className="bg-blue w-full mt-3 text-white p-1 rounded-3xl hover:bg-blue-2 uppercase"
            >
              login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
