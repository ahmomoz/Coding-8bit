import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="layout-footer-wrap wrap-lg bg-white">
      <div className="container f-xl-between">
        <div className="footer-info-wrap flex-grow-1">
          <NavLink to="/" className="navbar-brand">
            <picture>
              <source
                srcSet="images/logo-sm.svg"
                media="(max-width: 575.98px)"
              />
              <img src="images/logo.svg" alt="logo-image" />
            </picture>
          </NavLink>
          <ul className="mt-4">
            <li className="f-align-center mt-2">
              <p className="fs-7 lh-sm">本網站僅供作品參考，並非真實營運販售</p>
            </li>
            <li className="mt-2">
              <div>
                <p className="fs-7 lh-sm">
                  Copyright@2025 Coding∞bit 保留所有權利
                </p>
              </div>
              <div className="f-align-items mt-2 mt-g-0">
                <a
                  href="https://coding-8bit.com/PrivacyPolicy.html"
                  target="_blank"
                  className="fs-7 underline-hover d-inline"
                >
                  隱私權政策
                </a>
                <span className="ms-1">|</span>
                <a
                  href="https://coding-8bit.com/TermsOfService.html"
                  target="_blank"
                  className="fs-7 underline-hover d-inline ms-1"
                >
                  使用條款
                </a>
              </div>
            </li>
          </ul>
        </div>
        <div className="d-flex flex-grow-1 mt-8 mt-lg-0">
          <ul className="navbar-nav f-column w-50 px-4">
            <li className="nav-item">
              <NavLink
                className="nav-link underline-hover d-inline-flex link-gray-02 fs-7"
                aria-current="page"
                to="/course-list"
              >
                精選課程
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link underline-hover d-inline-flex link-gray-02 fs-7"
                to="/tutor-list"
              >
                一對一教學
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link underline-hover d-inline-flex link-gray-02 fs-7"
                to="/custom-requests-list"
              >
                課程客製化
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav f-column w-50 px-4">
            <li className="nav-item">
              <NavLink
                className="nav-link underline-hover d-inline-flex link-gray-02 fs-7"
                aria-current="page"
                to="/help-center"
              >
                幫助中心
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link underline-hover d-inline-flex link-gray-02 fs-7"
                to="/subscription-list"
              >
                訂閱方案選擇
              </NavLink>
            </li>
          </ul>
        </div>
        <ul className="d-flex justify-content-lg-end flex-grow-1 mt-8 mt-lg-0 ms-lg-6">
          <li>
            <a href="#" className="icon-hover">
              <img src="images/icon/icon-ins-purple.svg" alt="icon-ins" />
            </a>
          </li>
          <li className="ms-3">
            <a href="#" className="icon-hover">
              <img src="images/icon/icon-facebook-purple.svg" alt="icon-ins" />
            </a>
          </li>
          <li className="ms-3">
            <a href="mailto:coding8bit@gmail.com" className="icon-hover">
              <img src="images/icon/icon-mail-purple.svg" alt="icon-ins" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
