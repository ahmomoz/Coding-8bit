import { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Swal from "sweetalert2";

import authApi from "@/api/authApi";

const { VITE_API_BASE } = import.meta.env;

export default function Login() {
  const navigate = useNavigate();

  // 抓取路由上的search params
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams?.get("redirect");

  // loading
  const [loadingState, setLoadingState] = useState(false);

  // 登入邏輯
  const [formData, setFormData] = useState({});
  const loginFn = async () => {
    const { email, password } = formData;

    // 驗證空值
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "請輸入帳號密碼",
      });
      return;
    }

    // 驗證 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "warning",
        title: "請輸入正確的信箱格式",
      });
      return;
    }

    setLoadingState(true);
    try {
      await authApi.login(formData);
      Swal.fire({
        title: "登入成功",
        icon: "success",
      });

      const redirectTo = redirectPath ?? "/";
      navigate(redirectTo);
    } catch (error) {
      const msg = error?.response?.data?.message;

      if (msg === "帳號不存在") {
        // 如果帳號未註冊的話，彈出提示並導引去註冊
        Swal.fire({
          icon: "info",
          title: "查無帳號",
          text: "尚未註冊，是否前往註冊頁面？",
          showCancelButton: true,
          confirmButtonText: "前往註冊",
          cancelButtonText: "取消",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/signup");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "登入失敗",
          text: msg || "發生錯誤，請稍後再試",
        });
      }
    } finally {
      setLoadingState(false);
    }
  };

  // 驗證身分
  const loginCheck = useCallback(async () => {
    setLoadingState(true);
    try {
      await authApi.loginCheck();
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "驗證錯誤",
        text: error?.response?.data?.message,
      });
      document.cookie =
        "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } finally {
      setLoadingState(false);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((state) => ({ ...state, [name]: value }));
  };

  // 隱碼按鈕邏輯
  const [showPasswordList, setShowPasswordList] = useState([false, false]);
  const handleShowPassword = (index) => {
    setShowPasswordList((prevState) =>
      prevState.map((show, i) => (i === index ? !show : show))
    );
  };

  // 初始化 - 確認是否有 token
  useEffect(() => {
    const token =
      document.cookie.replace(
        /(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      ) || null;
    if (token) {
      loginCheck();
    }
  }, [loginCheck]);

  // 初始化 - 第三方登入確認身分
  const paramToken = searchParams.get("token");
  useEffect(() => {
    if (paramToken) {
      document.cookie = `authToken=${paramToken}; path=/; SameSite=Lax`;

      // 等待瀏覽器設置 Cookie
      setTimeout(() => {
        const token =
          document.cookie.replace(
            /(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/,
            "$1"
          ) || null;

        if (token) {
          loginCheck(token);
        }
      }, 100);
    }
  }, [loginCheck, paramToken]);

  // 初始化 - 接 GitHub 若重複登入帳號顯示訊息
  const error = searchParams.get("error");
  useEffect(() => {
    if (error) {
      Swal.fire(decodeURIComponent(error)); // 解析中文
    }
  }, [error]);

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 登入</title>
      </Helmet>

      <style>{`body { background-color: #c0c4df; }`}</style>
      <main className="login-section bg">
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
          <div className="row f-end-center mt-9 mt-lg-12">
            <div className="col-lg-6">
              <div className="user-auth-card card border-0 rounded-2">
                <div className="card-body px-6 py-10 p-lg-13">
                  <h1 className="fs-4 fs-lg-3 text-brand-03">
                    Coding∞bit 會員登入
                  </h1>
                  <form className="mt-6 mt-lg-11">
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control underline-input"
                        id="email"
                        name="email"
                        aria-describedby="emailHelp"
                        placeholder="請輸入電子信箱"
                        onChange={handleInputChange}
                      />
                      <span className="material-symbols-outlined position-absolute top-0 text-gray-03 ms-1 mt-1">
                        mail
                      </span>
                    </div>
                    <div className="position-relative mt-9">
                      <input
                        type={showPasswordList[0] ? "text" : "password"}
                        className="form-control underline-input"
                        id="password"
                        name="password"
                        placeholder="請輸入密碼"
                        onChange={handleInputChange}
                      />
                      <span className="material-symbols-outlined position-absolute top-0 text-gray-03 ms-1 mt-1">
                        lock
                      </span>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleShowPassword(0);
                        }}
                      >
                        <span className="material-symbols-outlined position-absolute top-0 end-0 text-gray-03 ms-1 mt-1">
                          {showPasswordList[0]
                            ? "visibility"
                            : "visibility_off"}
                        </span>
                      </a>
                    </div>
                    <div className="f-between-center mt-9">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          記住帳號
                        </label>
                      </div>
                      <NavLink
                        to="/forgot-password"
                        className="link-brand-03 fw-medium underline-hover link-hover"
                      >
                        忘記密碼
                      </NavLink>
                    </div>
                    <button
                      type="button"
                      className="btn btn-brand-03 rounded-2 slide-right-hover w-100 f-center mt-4 mt-lg-6"
                      id="loginBtn"
                      onClick={loginFn}
                    >
                      立即登入
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
                  <div className="divider-label d-flex align-items-center mt-6 mt-lg-8">
                    <hr />
                    <span>OR</span>
                    <hr />
                  </div>
                  <a
                    href={`${VITE_API_BASE}/auth/google`}
                    type="button"
                    className="btn btn-brand-02 border-1 rounded-1 w-100 f-center mt-2"
                  >
                    <img
                      src="images/icon/icons-google.svg"
                      alt="icon-google"
                      className="me-3"
                    />
                    使用 Google 登入
                  </a>
                  <a
                    href={`${VITE_API_BASE}/auth/line`}
                    type="button"
                    className="btn btn-brand-02 border-1 rounded-1 w-100 f-center mt-2"
                  >
                    <img
                      src="images/icon/icons-line.svg"
                      alt="icon-google"
                      className="me-3"
                      style={{ width: "20px", height: "20px" }}
                    />
                    使用 Line 登入
                  </a>
                  <a
                    href={`${VITE_API_BASE}/auth/github`}
                    type="button"
                    className="btn btn-brand-02 border-1 rounded-1 w-100 f-center mt-2"
                  >
                    <img
                      src="images/icon/icons-github.svg"
                      alt="icon-google"
                      className="me-3"
                      style={{ width: "20px", height: "20px" }}
                    />
                    使用 GitHub 登入
                  </a>

                  <div className="f-end-center mt-6 mt-lg-8">
                    <p className="text-center">還不是會員？</p>
                    <NavLink
                      to="/signup"
                      className="link-brand-03 fw-medium underline-hover ms-1"
                    >
                      點此註冊
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
