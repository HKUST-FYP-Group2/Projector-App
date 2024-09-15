import React from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

function Login() {
  const navigate = useNavigate();

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
    <div className={`flex flex-col justify-center items-center h-screen`}>
      <div className={`flex flex-col justify-center items-center p-3`}>
        <h1>Virtual Window for Workplace Well-being</h1>
        <br />
        <div className={`border-2 border-black w-fit p-3`}>
          <form onSubmit={handleSubmit}>
            <div>
              Username:
              <input type="text" name="username" />
            </div>
            <div>
              Password:
              <input type="password" name="password" />
            </div>
            <button type="submit" className={`bg-blue-500`}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
