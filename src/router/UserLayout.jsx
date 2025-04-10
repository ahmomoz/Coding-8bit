import { Outlet, useLocation } from "react-router-dom";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import ScrollToTopBtn from "@/components/layout/ScrollToTopBtn";
import ScrollToTop from "@/components/layout/ScrollToTop";

export default function UserLayout() {
  const location = useLocation();

  const excludedRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/activate-success",
    "/reset-password",
    "/custom-requests-list",
    "/add-learning-need",
  ];

  const isExcludedRoute = excludedRoutes.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      {!isExcludedRoute && <Header />}
      <Outlet />
      {!isExcludedRoute && <ScrollToTopBtn />}
      {!isExcludedRoute && <Footer />}
    </>
  );
}
