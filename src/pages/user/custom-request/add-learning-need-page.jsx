import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginCheck, getUserData } from "@/store/slice/authSlice";
import { Helmet } from "react-helmet-async";

import Swal from "sweetalert2";

import AddLearningNeedRobot from "@/components/custom-request/AddLearningNeedRobot";
import ChatRoom from "@/components/custom-request/ChatRoom";
import LearningNeedForm from "@/components/custom-request/LearningNeedForm";
import TransparentLoader from "@/components/common/TransparentLoader";

export default function AddLearningNeedPage() {
  // loading
  const [loadingState, setLoadingState] = useState(false);

  // 取得使用者資料
  const dispatch = useDispatch();
  const { userData, isAuth } = useSelector((state) => state.auth);

  // 初始化 - 確認身分
  const navigate = useNavigate();
  useEffect(() => {
    if (
      userData.id &&
      !userData.subscriptions
        .filter((item) => item.plan_name === "premium")
        .filter((item) => item.status === "active").length > 0
    ) {
      Swal.fire({
        title: "成為高級會員後即可提出客製化學習需求",
        showCancelButton: false,
        confirmButtonText: "確定",
      });
      navigate(-1);
    }
  }, [userData.id, navigate, userData.subscriptions]);

  useEffect(() => {
    if (isAuth) {
      dispatch(getUserData());
    }
  }, [isAuth, dispatch]);

  useEffect(() => {
    dispatch(loginCheck());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 新增客製化需求</title>
      </Helmet>
      {loadingState && <TransparentLoader />}

      {userData.username && <AddLearningNeedRobot />}

      <div className="add-learning-need-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="guide-wrap">
                <div className="guide-text-wrap p-0 p-sm-8">
                  <h2>學習需求是什麼？</h2>
                  <div className="mt-4 mt-lg-6">
                    <p className="fs-7">
                      不曉得您在程式學習上有沒有遇到以下情況：
                    </p>
                    <ul className="disc-list-style ps-5 py-4 py-lg-5">
                      <li>
                        <h3>
                          只是想學習一個小知識點，卻找不到適合的教學，網路上的知識雜七雜八，沒有一個是真正符合需求的。
                        </h3>
                      </li>
                      <li className="mt-5">
                        <h3>
                          學習到一半突然遇上一個小bug，卻不知道如何解決，需要有人手把手引導。
                        </h3>
                      </li>
                    </ul>
                    <p className="fs-7">
                      這些情況，就適合提出客製化學習需求！只要在本頁面描述您的情況並填寫相關資訊，發表學習需求，就有機會獲得專屬解答。
                    </p>
                  </div>
                  <div className="divider-label-brand-02 d-flex align-items-center py-2 py-lg-4">
                    <hr />
                  </div>
                  <h2>該怎麼描述我的需求？</h2>
                  <ul className="py-5">
                    <li>
                      <h3>1. 在標題寫上您使用的程式語言，並簡述您的學習需求</h3>
                      <p className="fs-7 ps-5 mt-2">
                        開頭寫上程式語言，再用簡短的一句話說明您希望解決的問題或達成的目標。(例如：CSS
                        毛玻璃樣式)
                      </p>
                    </li>
                    <li className="mt-4 mt-lg-5">
                      <h3>2. 選擇背景資訊</h3>
                      <p className="fs-7 ps-5 mt-2">
                        我們提供了幾個下拉式選單，請選擇符合自己情況的選項，讓大家更了解您的狀況，能回答得更加精準。
                      </p>
                    </li>
                    <li className="mt-4 mt-lg-5">
                      <h3>3. 填入關鍵字</h3>
                      <p className="fs-7 ps-5 mt-2">
                        填寫幾個關鍵字，讓大家更容易看見這個需求。關鍵字與關鍵字之間請以半形逗號隔開。(例如：React,
                        前端開發, 效能優化, Hooks)
                      </p>
                    </li>
                    <li className="mt-4 mt-lg-5">
                      <h3>4. 描述您的學習需求</h3>
                      <p className="fs-7 ps-5 mt-2">
                        請明確描述您想學習怎麼樣的小知識 /
                        想解決什麼問題，以成果為導向。
                      </p>
                    </li>
                  </ul>
                </div>
                <div className="openRobot-button-wrap bg-brand-02 position-relative">
                  <img
                    src="images/deco/addLearningNeedBot.svg"
                    alt="addLearningNeedBot-icon"
                    className="position-absolute"
                  />
                  <div>
                    <h3 className="text-brand-03 fw-medium">
                      還是不太清楚該怎麼填寫？
                    </h3>
                    <button
                      type="button"
                      className="btn btn-outline-none text-brand-03 fs-7 fs-lg-6 fw-bold slide-right-hover d-inline-flex f-align-center px-0 py-3"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      點我開啟建立需求小幫手
                      <span className="material-symbols-outlined icon-fill fs-5 ms-1">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <LearningNeedForm setLoadingState={setLoadingState} />
            </div>
          </div>
        </div>
      </div>

      {/* 聊天室 */}
      {userData.username && <ChatRoom username={userData.username} />}
    </>
  );
}
