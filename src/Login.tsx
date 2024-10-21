import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (session) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.elements.namedItem("username") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    // if (username.value === "admin" && password.value === "admin") {
    //   const session = "s"; // Replace with session token return from flask
    //   sessionStorage.setItem("session", session);
    //   setLoading(true);
    //   setTimeout(() => {
    //     setLoading(false);
    //     setLoginSuccess(true);
    //     setIsFadingOut(true);
    //     setTimeout(() => {
    //       navigate("/");
    //     }, 1000);
    //   }, 1000);
    // } else {
    //   setLoginFailed(true);
    // }

    axios
      .post("/api/login", {
        username: username.value,
        password: password.value,
      })
      .then((res) => {
        if (res.status === 200) {
          const session = "s"; // Replace with session token return from flask
          sessionStorage.setItem("session", session);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            setLoginSuccess(true);
            setIsFadingOut(true);
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }, 1000);
        } else {
          setLoginFailed(true);
        }
      })
      .catch((err) => {
        setLoginFailed(true);
      });

    // axios("/api/status")
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  return (
    <>
      {isFadingOut && (
        <div className={`w-screen h-screen bg-blue absolute z-0`}></div>
      )}
      <div
        className={`flex flex-col z-10 justify-center items-center h-screen w-screen bg-blue ${isFadingOut ? "fade-out" : ""}`}
      >
        <img
          src={`https://join.hkust.edu.hk/sites/default/files/2020-06/hkust.jpg`}
          className={`w-full h-full object-cover absolute z-10 opacity-30 fade-in-30`}
          alt={`image`}
        />

        <div className="flex flex-col bg-yellow rounded-[20px] z-20 w-[700px] h-[350px] absolute">
          {loading && (
            <div className={`w-full h-full items-center justify-center flex`}>
              <div
                className={`w-[100px] h-[100px] flex justify-center items-center`}
              >
                <CircularProgress
                  size={`100%`}
                  sx={{ color: "rgba(0, 51, 102, 1)" }}
                />
              </div>
            </div>
          )}
          {!loading && loginSuccess && (
            <div className={`w-full h-full items-center justify-center flex`}>
              <div className="absolute text-blue font-bold text-2xl text-center">
                Login Success <br /> Redirecting...
              </div>
            </div>
          )}
          {!loading && !loginSuccess && (
            <>
              <div className="w-full font-bold text-[28px] mt-[50px] text-center text-blue select-none absolute mb-auto">
                Virtual Window for Workplace Well-being
              </div>
              <div
                className={`w-full absolute h-fit flex item-center justify-center mt-[100px]`}
              >
                <div className={`w-[280px] text-[20px] mr-[55px]`}>
                  <form onSubmit={handleSubmit} autoComplete={"off"}>
                    <div className="relative mt-[20px] w-full">
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="login-input-style"
                        spellCheck={false}
                      />
                    </div>
                    <div className="relative focus-within:text-blue-2 text-blue mt-[8px]">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        className="login-input-style pr-10"
                        spellCheck={false}
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
                    <div
                      className={`text-red-2 font-bold text-xs ${loginFailed ? `` : `invisible`}`}
                    >
                      Invalid Login Credential
                    </div>
                    <button
                      type="submit"
                      className="bg-blue w-full mt-[8px] text-white p-1 rounded-3xl hover:bg-blue-2 uppercase "
                    >
                      login
                    </button>
                  </form>
                </div>
                <div
                  className={`w-[210px] pl-[20px] border-blue border-dashed border-l-2 mt-[20px]`}
                >
                  <div
                    className={`items-center justify-center flex flex-col mt-[10px]`}
                  >
                    <div>
                      <QRCodeSVG
                        value={`Virtual Window for Workplace Well-being`}
                        size={120}
                        bgColor="transparent"
                        fgColor="#003366"
                      />
                    </div>
                    <div
                      className={`text-blue-3 text-[14px] text-center mt-2 leading-4`}
                    >
                      Scan this with your control app to sign in
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
