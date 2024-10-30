import React, { useRef, useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginFailed, setLoginFailed] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const loginMainRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.elements.namedItem("username") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    //   if (username.value === "admin" && password.value === "admin") {
    //     setLoading(true);
    //     setTimeout(() => {
    //       setLoading(false);
    //       setLoginSuccess(true);
    //       setIsFadingOut(true);
    //       setTimeout(() => {
    //         navigate("/");
    //       }, 1000);
    //     }, 1000);
    //   } else {
    //     setLoginFailed(true);
    //   }
    // };

    try {
      const res = await axios.post(
        "/api/login",
        {
          username: username.value,
          password: password.value,
        },
        {
          timeout: 5000, // 5 seconds timeout
        },
      );

      if (res.status === 200) {
        setLoading(false);
        setLoginSuccess(true);
        setIsFadingOut(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setLoginFailed(res.status);
        alert(res.data);
      }
    } catch (err: unknown) {
      setLoading(false);
      if (axios.isAxiosError(err) && err.response) {
        setLoginFailed(err.response.status);
      } else {
        setLoginFailed(500);
      }
    }
  };

  return (
    <>
      {isFadingOut && (
        <div className={`w-screen h-screen bg-blue absolute z-0`}></div>
      )}
      <div
        className={`flex flex-col z-10 justify-center items-center h-screen w-screen bg-blue ${isFadingOut ? "fade-out" : ""}`}
        ref={loginMainRef}
        onAnimationEnd={() => {
          if (isFadingOut && loginMainRef.current) {
            loginMainRef.current.style.opacity = "0";
          }
        }}
      >
        <img
          src={`https://join.hkust.edu.hk/sites/default/files/2020-06/hkust.jpg`}
          className={`w-full h-full object-cover absolute z-10 opacity-30 fade-in-30`}
          alt={`image`}
        />

        <div className="flex flex-col bg-yellow rounded-[20px] z-20 w-[700px] h-[350px] absolute">
          {/*{loading && (*/}
          {/*  <div className={`w-full h-full items-center justify-center flex`}>*/}
          {/*    <div*/}
          {/*      className={`w-[100px] h-[100px] flex justify-center items-center`}*/}
          {/*    >*/}
          {/*      <CircularProgress*/}
          {/*        size={`100%`}*/}
          {/*        sx={{ color: "rgba(0, 51, 102, 1)" }}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*)}*/}
          {loading && loginSuccess && (
            <div className={`w-full h-full items-center justify-center flex`}>
              <div className="absolute text-blue font-bold text-2xl text-center">
                Login Success <br /> Redirecting...
              </div>
            </div>
          )}
          {!loginSuccess && (
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
                    <div className={`text-red-2 font-bold text-xs block h-4`}>
                      {loginFailed === 401 && "Invalid Login Credential"}
                      {loginFailed === 500 && "Internal Server Error"}
                    </div>
                    <button
                      type="submit"
                      className={`bg-blue w-full mt-[8px] text-white p-1 rounded-3xl uppercase h-[40px] flex items-center justify-center ${!loading && "hover:bg-blue-2"}`}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size="1.5rem" /> : "Login"}
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
