import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import tutorApi from "@/api/tutorApi";

import AOS from "aos";
import Swal from "sweetalert2";

import MainTitle from "@/components/MainTitle";
import TutorsCard from "@/components/tutor/TutorsCard";
import Pagination from "@/components/layout/Pagination";
import Loader from "@/components/common/Loader";
import TutorCardLoadingSkeleton from "@/components/tutor/TutorCardLoadingSkeleton";

export default function TutorList() {
  // loading
  const [loadingState, setLoadingState] = useState(true);
  const [loadingTutorState, setLoadingTutorState] = useState(false);

  const userImages = [
    "images/user/user-1.png",
    "images/user/user-5.png",
    "images/user/user-6.png",
    "images/user/user-7.png",
    "images/user/user-10.png",
    "images/user/user-8.png",
    "images/user/user-9.png",
  ];

  // 找講師按鈕往下跳轉函式
  const tutorListRef = useRef(null);
  const handleScroll = (e) => {
    e.preventDefault;
    if (tutorListRef.current) {
      tutorListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 搜尋與篩選功能
  const [sortBy, setSortBy] = useState("rating");
  const [order, setOrder] = useState("DESC");

  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const sanitizedSearch = e.target.value.trim();
      setSearch(sanitizedSearch);
    }
  };

  // 取得資料函式
  const [tutorsList, setTutorsList] = useState([]);
  const [pageData, setPageData] = useState({});
  const getTutorsData = useCallback(
    async (currentPage = 1) => {
      setLoadingTutorState(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const tutorResult = await tutorApi.getAllTutor(currentPage, sortBy, order, search);
        setTutorsList(tutorResult.tutors);
        setPageData(tutorResult.pagination);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "取得資料失敗",
          text: error.response?.data?.message || "發生錯誤，請稍後再試",
        });
      } finally {
        setLoadingTutorState(false);
      }
    },
    [search, sortBy, order]
  );

  // title 打字機效果
  const [titleText, setTitleText] = useState("程式卡關？");
  const [, setCalc] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setCalc((prevCalc) => {
        const newCalc = prevCalc + 1;
        setTitleText(newCalc % 2 === 1 ? "程式卡關？" : "程式冗長？");
        return newCalc;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingState(false);
    }, 1000);

    return () => clearTimeout(timer); // cleanup
  }, []);

  // 初始化 - AOS
  useEffect(() => {
    AOS.init();
  }, []);

  // 初始化 - 取得資料
  useEffect(() => {
    getTutorsData();
  }, [getTutorsData]);

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 可預約講師一覽</title>
      </Helmet>

      {loadingState && <Loader />}

      <main className="tutor-list">
        {/* hero-section */}
        <section className="hero-section">
          <div className="container">
            <div className="d-flex justify-content-md-around align-items-md-center">
              <div>
                <div className="question-text-wrapper">
                  <h2 className="fs-1 mb-2 question-text text-brand-03">{titleText}</h2>
                </div>
                <h2 className="fs-md-1 fs-2 mb-12">找專業講師來場一對一課程</h2>
                <a
                  className="w-50 btn btn-brand-03 cta-btn f-center slide-down-hover mb-5"
                  onClick={handleScroll}
                >
                  我要找講師
                  <span className="material-symbols-outlined">keyboard_arrow_down</span>
                </a>
                <div className="d-flex align-items-center">
                  {userImages.map((src, index) => (
                    <img key={index} src={src} alt="tutor" className="object-cover-fit profile" />
                  ))}
                  <p className="profile">100+</p>
                </div>
              </div>
              <img src="images/deco/star3D.png" className="star-deco" alt="star-deco" />
            </div>
          </div>
        </section>

        {/* service introduction */}
        <section className="service-intro" style={{ overflow: "hidden" }}>
          <div className="container">
            {/* title */}
            <div className="f-center flex-column">
              <MainTitle
                longTitle={false}
                beforeTitle="什麼是一對一教學 & 程式碼檢視服務"
                afterTitle=""
              />
              <p className="mt-5 mb-11 description fs-md-5 fs-6">
                只要您訂閱成為基本會員，即可購買專業講師一對一課程或是程式碼檢視服務。
              </p>
            </div>
            <div className="row justify-content-around">
              <div className="col-lg-6 col-md-8">
                {/* description */}
                <div>
                  <div
                    className="mb-8 f-center"
                    data-aos="fade-right"
                    data-aos-easing="linear"
                    data-aos-duration="800"
                    data-aos-offset="200"
                  >
                    <p className="tag bg-brand-03 text-white fs-md-5 fs-7 text-nowrap me-3">
                      一對一課程
                    </p>
                    <span className="material-symbols-outlined me-3">chevron_right</span>
                    <p className="fs-md-5 fs-7">
                      不怕問題被淹沒在人海之中，只要預約，就可以在線上接受指定講師的單獨教學。
                    </p>
                  </div>
                  <div
                    className="mb-8 f-center"
                    data-aos="fade-right"
                    data-aos-easing="linear"
                    data-aos-duration="800"
                    data-aos-delay="300"
                    data-aos-offset="200"
                  >
                    <p className="tag bg-brand-03 text-white fs-md-5 fs-7 text-nowrap me-3">
                      程式碼檢視
                    </p>
                    <span className="material-symbols-outlined me-3">chevron_right</span>
                    <p className="fs-md-5 fs-7">
                      預約時提交想接受指導的程式碼，講師將會於預約時間回覆指導，再也不怕code沒有人批改。
                    </p>
                  </div>
                </div>

                <NavLink
                  to="/subscription-list"
                  className="underline-hover text-brand-03 cta fs-md-5 fs-6"
                  data-aos="fade-right"
                  data-aos-easing="linear"
                  data-aos-duration="1000"
                  data-aos-delay="800"
                >
                  還沒有訂閱嗎？點我前往訂閱
                </NavLink>
              </div>
              {/* image */}
              <div className="col-4">
                <img src="images/deco/Illustration-9.png" alt="illustration" className="deco-img" />
              </div>
            </div>
          </div>
        </section>

        {/* Tutor Cards */}
        <section ref={tutorListRef} className="wrap">
          <div className="container">
            <MainTitle longTitle={false} beforeTitle="尋找喜歡的講師" afterTitle="" />
            <div className="mt-8">
              <div className="control-group">
                <div className="position-relative f-align-center d-flex me-2 search-tutor">
                  <input
                    type="search"
                    className="form-control nav-search-desktop border border-brand-03 border-3"
                    placeholder="搜尋講師"
                    onKeyDown={handleSearch}
                  />
                  <span
                    className="material-symbols-outlined text-gray-03 position-absolute ps-4"
                    style={{ width: "20px", height: "20px" }}
                  >
                    search
                  </span>
                </div>

                <div className="sort">
                  <button
                    type="button"
                    className="btn btn-outline-brand-03 dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {sortBy === "rating" && "排序方式(最高評價)"}
                    {sortBy === "hourly_rate" && order === "ASC" && "排序方式(預約價格最低)"}
                    {sortBy === "hourly_rate" && order !== "ASC" && "排序方式(預約價格最高)"}
                    {sortBy === "created_at" && order !== "ASC" && "成為老師時間(最新到最舊)"}
                    {sortBy === "created_at" && order === "ASC" && "成為老師時間(最舊到最新)"}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setSortBy("rating");
                          setOrder("DESC");
                        }}
                      >
                        最高評價
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setSortBy("hourly_rate");
                          setOrder("ASC");
                        }}
                      >
                        預約價格最低
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setSortBy("hourly_rate");
                          setOrder("DESC");
                        }}
                      >
                        預約價格最高
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setSortBy("created_at");
                          setOrder("DESC");
                        }}
                      >
                        成為老師時間(最新到最舊)
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => {
                          setSortBy("created_at");
                          setOrder("ASC");
                        }}
                      >
                        成為老師時間(最舊到最新)
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="my-8">
              {loadingTutorState ? (
                <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-4">
                  {Array.from({ length: 9 }, (_, i) => (
                    <li className="tutor-card col" key={i}>
                      <TutorCardLoadingSkeleton />
                    </li>
                  ))}
                </div>
              ) : tutorsList.length > 0 ? (
                <TutorsCard tutorList={tutorsList} cardsNum={3} />
              ) : (
                <div className="d-flex justify-content-md-around align-items-md-center">
                  <h2 className="fw-medium text-brand-03 py-6 py-lg-11">
                    此類別目前沒有資料，請選擇其他類別
                  </h2>
                </div>
              )}
            </div>
            {tutorsList.length > 0 && (
              <nav aria-label="navigation">
                <Pagination pageData={pageData} getData={getTutorsData} />
              </nav>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
