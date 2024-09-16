import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.elements.namedItem("username") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    //TODO: should connect to flask auth
    if (username.value === "admin" && password.value === "admin") {
      const session = "valid-session-token"; // Replace with session token return from flask
      localStorage.setItem("session", session);
      navigate("/");
    } else {
      alert("admin admin");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-blue">
      <div className="flex flex-col justify-center items-center p-10 bg-yellow rounded-lg">
        <div className="font-bold text-3xl text-blue select-none">
          Virtual <br />
          Window
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="relative mt-3">
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
