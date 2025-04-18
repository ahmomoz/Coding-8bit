import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Swal from "sweetalert2";

import authApi from "@/api/authApi";

export default function ForgotPassword() {
  // loading
  const [loadingState, setLoadingState] = useState(false);

  const [isClick, setIsClick] = useState(true);

  // 傳送忘記密碼郵件函式
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const sendEmail = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "請輸入電子郵件",
      });
      return;
    }

    setLoadingState(true);
    try {
      await authApi.sendForgotPasswordEmail({ email });
      Swal.fire({
        icon: "success",
        title: "已傳送重設密碼的連結至您的電子信箱",
        text: "請至信箱確認信件",
      });

      // 開始倒數計時
      setIsClick(false);
      setCountdown(60);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "傳送電子信件失敗",
        text: error?.data,
      });
    } finally {
      setLoadingState(false);
    }
  };

  // 倒數計時 useEffect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer); // 清除計時器
    } else {
      setIsClick(true); // 倒數結束後恢復按鈕可用
    }
  }, [countdown]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 忘記密碼</title>
      </Helmet>

      <style>{`body { background-color: #c0c4df; }`}</style>
      <main className="forgot-password-section bg">
        <div className="container">
          <NavLink to="/" className="navbar-brand">
            <picture>
              <source
                srcSet="images/logo-sm.svg"
                media="(max-width: 575.98px)"
              />
              <img src="images/logo.svg" alt="logo-image" />
            </picture>
          </NavLink>
          <div className="row f-end-center my-9 my-lg-13">
            <div className="col-lg-6">
              <div className="user-auth-card card border-0 rounded-2">
                <div className="card-body px-6 py-10 p-lg-13">
                  <h1 className="fs-4 fs-lg-3 text-brand-03">忘記密碼</h1>
                  <p className="mt-6">將發送重設密碼的連結至您的電子信箱</p>
                  <form className="mt-6 mt-lg-8">
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control underline-input"
                        id="addEmail"
                        aria-describedby="emailHelp"
                        placeholder="請輸入電子信箱"
                        onChange={handleEmailChange}
                      />
                      <span className="material-symbols-outlined position-absolute top-0 text-gray-03 ms-1 mt-1">
                        mail
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-brand-03 rounded-2 slide-right-hover w-100 f-center mt-6 mt-lg-10"
                      id="sendResetPasswordBtn"
                      onClick={sendEmail}
                      disabled={!isClick}
                    >
                      {isClick ? "發送驗證信" : `請稍候重試 (${countdown}s)`}
                      <span className="material-symbols-outlined icon-fill fs-6 fs-md-5 mt-1 ms-1">
                        arrow_forward
                      </span>
                      {loadingState && (
                        <span
                          className="spinner-border text-brand-01 ms-2"
                          style={{ width: "20px", height: "20px" }}
                          role="status"
                        ></span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
