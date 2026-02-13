import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

import axios from "axios";
import Swal from "sweetalert2";

import ResetPassword from "@/components/common/profile/ResetPassword";
import ProfileContent from "@/components/common/profile/ProfileContent";
import Loader from "@/components/common/Loader";

export default function StudentProfile() {
  // loading
  const [loadingState, setLoadingState] = useState(false);

  // 取得使用者資料
  const [userData, setUserData] = useState({});
  const getUserData = async (token) => {
    setLoadingState(true);
    try {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      const res = await axios.get(
        `https://service.coding-8bit.com/api/v1/user/users/me`
      );
      setUserData(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "取得資料失敗",
        text: error.response?.data?.message || "發生錯誤，請稍後再試",
      });
    } finally {
      setLoadingState(false);
    }
  };

  // 初始化 - 確認是否已登入
  useEffect(() => {
    const token =
      document.cookie.replace(
        /(?:(?:^|.*;\s*)authToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      ) || null;
    if (token) {
      getUserData(token);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 個人資料</title>
      </Helmet>
      {loadingState && <Loader />}
      <style>{`body { background-color:rgb(250, 250, 250); }`}</style>

      <main className="container-fluid">
        <h1 className="fs-4 fs-lg-2">個人資料</h1>

        <div className="row pt-2 pt-md-10">
          <div className="col-12 col-md-5">
            <ResetPassword
              userData={userData}
              setLoadingState={setLoadingState}
            />
          </div>
          <div className="col-12 col-md-7">
            <ProfileContent
              userData={userData}
              setLoadingState={setLoadingState}
            />
          </div>
        </div>
      </main>
    </>
  );
}
