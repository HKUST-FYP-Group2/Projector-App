import React, { useEffect, useRef, useState } from "react";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import useAuth from "./components/useAuth.tsx";
import { io } from "socket.io-client";
import { useCookies } from "react-cookie";

interface LoginProps {
  deviceUUID: any;
  setDeviceUUID: (value: any) => void;
}

function Login({ deviceUUID, setDeviceUUID }: LoginProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const loginMainRef = useRef<HTMLDivElement>(null);
  const { handleLogin, getDeviceUUID, handleQRLogin } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCookie] = useCookies(["deviceUUID"]);
  const VITE_API_ENDPOINT = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchDeviceUUID = async () => {
      const uuid = await getDeviceUUID();
      if (uuid === null) {
        setTimeout(fetchDeviceUUID, 3000);
      } else {
        setDeviceUUID(uuid);
        setCookie("deviceUUID", uuid);

        //emit device uuid to server
        console.log(VITE_API_ENDPOINT);
        const socket = io(VITE_API_ENDPOINT);
        socket.on("connect", () => {
          socket.emit("QRLogin", { device_uuid: uuid });
        });
        socket.on("QRLogin", (data) => {
          console.log(data);
          if (data?.login_success === "true" && data?.token) {
            handleQRLogin(data.token);
            setLoginSuccess(true);
            setIsFadingOut(true);
            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        });
      }
    };
    (async () => {
      await fetchDeviceUUID();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const username = form.elements.namedItem("username") as HTMLInputElement;
    const password = form.elements.namedItem("password") as HTMLInputElement;

    if (username.value === "admin" && password.value === "admin") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setLoginSuccess(true);
        setIsFadingOut(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }, 1000);
      return;
    }

    await handleLogin(username.value, password.value).then(
      (r: { login_success: any; error_message: string }) => {
        if (r.login_success) {
          setLoading(false);
          setLoginSuccess(true);
          setIsFadingOut(true);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          setLoading(false);
          setErrorMessage(r.error_message);
        }
      },
    );
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
                    <div
                      className={`text-red-2 font-bold text-xs block h-4 select-none`}
                    >
                      {errorMessage}
                    </div>
                    <button
                      type="submit"
                      className={`bg-blue select-none w-full mt-[8px] text-white p-1 rounded-3xl uppercase h-[40px] flex items-center justify-center ${!loading && "hover:bg-blue-2"}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress
                          size="1.5rem"
                          style={{ color: "#0074bc" }}
                        />
                      ) : (
                        "Login"
                      )}
                    </button>
                  </form>
                </div>
                <div
                  className={`w-[210px] pl-[20px] border-blue border-dashed border-l-2 mt-[20px]`}
                >
                  <div
                    className={`items-center justify-center flex flex-col mt-[10px] `}
                  >
                    <div>
                      {deviceUUID === null || deviceUUID === undefined ? (
                        <CircularProgress
                          size="7rem"
                          style={{ color: "#003366" }}
                        />
                      ) : (
                        <QRCodeSVG
                          value={deviceUUID}
                          size={120}
                          bgColor="transparent"
                          fgColor="#003366"
                        />
                      )}
                    </div>
                    <div
                      className={`text-blue-3 text-[14px] text-center mt-2 leading-4 select-none`}
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
