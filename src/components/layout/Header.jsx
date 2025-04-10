import { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Loader from "@/components/common/Loader";
import {
  loginCheck,
  getUserData,
  changeUserRole,
  logout,
} from "@/utils/slice/authSlice";
import useScrollPosition from "@/hooks/use-scrollPosition";

const navItems = [
  {
    to: "/course-list",
    label: "精選課程",
  },
  {
    to: "/tutor-list",
    label: "一對一教學",
  },
  {
    to: "/custom-requests-list",
    label: "課程客製化",
  },
  {
    to: "/help-center",
    label: "幫助中心",
  },
];

export default function Header() {
  // loading
  const [loadingState, setLoadingState] = useState(true);

  // 搜尋 input
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const sanitizedSearch = e.target.value.trim();
      navigate(`/course?video_type=topicSeries&search=${sanitizedSearch}`);
      e.target.value = "";
    }
  };

  // auth
  const { isAuth, userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  const navigate = useNavigate();

  // 切換身分
  const roleToggle = async () => {
    setLoadingState(true);
    try {
      await dispatch(changeUserRole(userData));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingState(false);
    }
  };

  // 登出
  const signout = () => {
    dispatch(logout());
    navigate(0);
  };

  // 初始化 - 取得使用者資料
  useEffect(() => {
    if (token) {
      dispatch(getUserData());
      setLoadingState(false);
    }
  }, [dispatch, token]);

  // 初始化 - 驗證身分
  useEffect(() => {
    if (token) {
      dispatch(loginCheck());
    } else {
      setLoadingState(false);
    }
  }, [dispatch, token]);

  const subscriptions = userData?.subscriptions || [];
  const hasPremium = subscriptions.some(
    (item) => item.plan_name === "premium" && item.status === "active"
  );
  const hasBasic = subscriptions.some(
    (item) => item.plan_name === "basic" && item.status === "active"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // 切換行動版 Menu 狀態
  const handleTogglerClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // 判斷往下滑的高度要超過多少為 true
  const isScrolled = useScrollPosition(100);

  // 初始化 - 監聽路由變化，有切換路由則隱藏 Menu
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      {loadingState && <Loader />}

      {isMenuOpen && <style>{`body { overflow: hidden; }`}</style>}
      <nav
        className={`layout-nav-wrap navbar navbar-expand-lg navbar-light py-2 ${
          isMenuOpen || isScrolled ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container-lg">
          <div className="d-flex">
            <NavLink to="/" className="navbar-brand me-10">
              <picture>
                <source
                  srcSet="images/logo-sm.svg"
                  media="(max-width: 991.98px)"
                />
                <img src="images/logo.svg" alt="logo-image" />
              </picture>
            </NavLink>
            <div className="position-relative f-align-center d-none d-xl-flex">
              <input
                type="search"
                className="form-control nav-search-desktop"
                placeholder="搜尋感興趣的課程"
                onKeyDown={handleSearch}
              />
              <span
                className="material-symbols-outlined text-gray-03 position-absolute ps-4"
                style={{ width: "20px", height: "20px" }}
              >
                search
              </span>
            </div>
          </div>
          <button
            id="layout-navbar-toggler"
            className="navbar-toggler border-0 p-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleTogglerClick}
          >
            <span
              id="menu-icon"
              className={`material-symbols-outlined icon-fill fs-4 ${
                isMenuOpen && "d-none"
              }`}
            >
              menu
            </span>
            <span
              id="close-icon"
              className={`material-symbols-outlined icon-fill fs-4 ${
                isMenuOpen ? "" : "d-none"
              }`}
            >
              close
            </span>
          </button>
          <div
            id="navbarSupportedContent"
            className={`collapse navbar-collapse justify-content-end ${
              isMenuOpen && "show"
            }`}
          >
            <ul className="navbar-nav align-items-lg-center">
              {userData?.id && (
                <li className="f-center align-self-center ps-4 d-lg-none">
                  <div className="flex-shrink-0">
                    {!userData.avatar_url ? (
                      <img
                        src="images/icon/user.png"
                        alt="profile"
                        className="object-fit-cover rounded-circle me-4"
                        style={{ height: "48px", width: "48px" }}
                      />
                    ) : (
                      <img
                        src={userData.avatar_url}
                        alt="profile"
                        className="object-fit-cover rounded-circle me-4"
                        style={{ height: "48px", width: "48px" }}
                      />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-brand-03">
                      {!hasPremium && !hasBasic ? (
                        "free"
                      ) : (
                        <>
                          {(hasPremium && hasBasic) ||
                            (hasPremium && !hasBasic && "premium")}
                          {!hasPremium && hasBasic && "basic"}
                        </>
                      )}
                    </small>
                    <p className="text-gray-01">{userData.username}</p>
                  </div>
                </li>
              )}

              <li className="position-relative f-align-center mt-4 d-lg-none">
                <input
                  type="search"
                  className="form-control nav-search-mobile"
                  placeholder="搜尋感興趣的課程"
                  onKeyDown={handleSearch}
                />
                <span
                  className="material-symbols-outlined text-gray-03 position-absolute ps-4"
                  style={{ width: "20px", height: "20px" }}
                >
                  search
                </span>
              </li>

              {navItems.map((item, index) => (
                <li
                  key={index}
                  className={`nav-item ${index === 0 && "mt-4 mt-lg-0"}`}
                >
                  <NavLink
                    className="nav-link underline-hover w-100 d-inline-flex link-gray-02"
                    to={item.to}
                    aria-current={
                      item.to === window.location.pathname ? "page" : undefined
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}

              {isAuth && (
                <>
                  <hr className="d-lg-none mx-4" />
                  {!userData?.roles?.includes("tutor") && (
                    <li className="nav-item d-lg-none">
                      <NavLink
                        className="nav-link underline-hover w-100 d-inline-flex link-gray-02"
                        to="/tutor-apply"
                      >
                        成為講師
                      </NavLink>
                    </li>
                  )}
                  {userData?.roles?.includes("tutor") && (
                    <li className="nav-item d-lg-none mt-2">
                      <button
                        className="nav-link underline-hover w-100 d-inline-flex link-gray-02"
                        aria-current="page"
                        type="button"
                        onClick={roleToggle}
                      >
                        {userData.last_active_role === "student"
                          ? "切換成講師身分"
                          : "切換成學生身分"}
                      </button>
                    </li>
                  )}

                  <li className="nav-item d-lg-none">
                    {userData?.roles?.includes("tutor") ? (
                      <NavLink
                        className="nav-link underline-hover w-100 d-inline-flex link-gray-02"
                        to={
                          userData.last_active_role === "student"
                            ? "/student-panel"
                            : "/tutor-panel"
                        }
                      >
                        後台儀表板
                      </NavLink>
                    ) : (
                      <NavLink
                        className="nav-link underline-hover w-100 d-inline-flex link-gray-02"
                        to="/student-panel"
                      >
                        後台儀表板
                      </NavLink>
                    )}
                  </li>
                  <li className="nav-item d-lg-none">
                    {userData?.roles?.includes("tutor") ? (
                      <NavLink
                        className="nav-link underline-hover w-100 d-inline-flex link-gray-02"
                        to={
                          userData.last_active_role === "student"
                            ? "/student-panel/profile"
                            : "/tutor-panel/profile"
                        }
                      >
                        個人資料
                      </NavLink>
                    ) : (
                      <NavLink
                        className="nav-link underline-hover w-100 d-inline-flex link-gray-02"
                        to="/student-panel/profile"
                      >
                        個人資料
                      </NavLink>
                    )}
                  </li>
                  <li className="nav-item d-lg-none fixed-bottom">
                    <hr className="mx-4" />
                    <button
                      type="button"
                      className="nav-link underline-hover w-100 d-inline-flex ps-6 pb-6 link-gray-02"
                      onClick={signout}
                    >
                      <span className="material-symbols-outlined me-2">
                        logout
                      </span>
                      登出
                    </button>
                  </li>
                </>
              )}

              <li className="nav-item nav-bottom-btn ms-lg-10 dropdown">
                {!isAuth ? (
                  <NavLink
                    to="/login"
                    className="btn btn-outline-brand-03 w-100"
                  >
                    登入 / 註冊
                  </NavLink>
                ) : (
                  <>
                    <NavLink
                      to="/tutor-panel"
                      className="btn btn-brand-02 py-2 d-none d-lg-flex align-items-center"
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="flex-shrink-0">
                        {!userData.avatar_url ? (
                          <img
                            src="images/icon/user.png"
                            alt="profile"
                            className="object-fit-cover rounded-circle me-4"
                            style={{ height: "32px", width: "32px" }}
                          />
                        ) : (
                          <img
                            src={userData.avatar_url}
                            alt="profile"
                            className="object-fit-cover rounded-circle me-4"
                            style={{ height: "32px", width: "32px" }}
                          />
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <small className="text-brand-03">
                          {!hasPremium && !hasBasic ? (
                            "free"
                          ) : (
                            <>
                              {(hasPremium && hasBasic) ||
                                (hasPremium && !hasBasic && "premium")}
                              {!hasPremium && hasBasic && "basic"}
                            </>
                          )}
                        </small>

                        <p className="text-gray-01">{userData.username}</p>
                      </div>
                    </NavLink>
                    <ul
                      className="dropdown-menu dropdown-menu-end rounded-1 mt-4"
                      aria-labelledby="dropdownMenuLink"
                    >
                      {!userData?.roles?.includes("tutor") && (
                        <li className="nav-item">
                          <Link className="dropdown-item" to="/tutor-apply">
                            成為講師
                          </Link>
                        </li>
                      )}
                      {userData?.roles?.includes("tutor") && (
                        <li>
                          <button
                            type="button"
                            className="dropdown-item"
                            onClick={roleToggle}
                          >
                            {userData.last_active_role === "student"
                              ? "切換成講師身分"
                              : "切換成學生身分"}
                          </button>
                        </li>
                      )}

                      <li>
                        {userData?.roles?.includes("tutor") ? (
                          <Link
                            to={
                              userData.last_active_role === "student"
                                ? "/student-panel"
                                : "/tutor-panel"
                            }
                            className="dropdown-item"
                          >
                            後台儀表板
                          </Link>
                        ) : (
                          <Link to="/student-panel" className="dropdown-item">
                            後台儀表板
                          </Link>
                        )}
                      </li>
                      <li>
                        {userData?.roles?.includes("tutor") ? (
                          <Link
                            className="dropdown-item"
                            to={
                              userData.last_active_role === "student"
                                ? "/student-panel/profile"
                                : "/tutor-panel/profile"
                            }
                          >
                            個人資料
                          </Link>
                        ) : (
                          <Link
                            className="dropdown-item"
                            to="/student-panel/profile"
                          >
                            個人資料
                          </Link>
                        )}
                      </li>
                      <li>
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={signout}
                        >
                          登出
                        </button>
                      </li>
                    </ul>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
