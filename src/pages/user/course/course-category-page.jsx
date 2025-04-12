import { useState, useEffect, useCallback } from "react";
import { Link, NavLink, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Swal from "sweetalert2";

import courseApi from "@/api/courseApi";
import CourseCardList from "@/components/course/CourseCardList";
import Pagination from "@/components/layout/Pagination";
import Loader from "@/components/common/Loader";

import { categories } from "@/data/courses";

export default function CourseCategoryPage() {
  // loading
  const [loadingState, setLoadingState] = useState(true);

  // 依路由決定此頁顯示分類
  const [searchParams] = useSearchParams();
  const video_type = searchParams.get("video_type");
  const { category } = useParams();

  // 解析路由，避免某些參數被 "/" 影響
  const decodedCategory = decodeURIComponent(category);

  // 搜尋與篩選功能
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [order, setOrder] = useState("DESC");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearch(e.target.value);
    }
  };

  // 取得課程資料函式
  const [courseList, setCourseList] = useState([]);
  const [pageData, setPageData] = useState({});
  const getCoursesData = useCallback(
    async (currentPage = 1) => {
      setLoadingState(true);
      if (video_type !== "topicSeries") {
        try {
          const result = await courseApi.getCategoryAllVideos(
            video_type,
            currentPage,
            sortBy,
            order,
            decodedCategory,
            search
          );
          setCourseList(result.videos);
          setPageData(result.pagination);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "取得資料失敗",
            text: error.response?.data?.message || "發生錯誤，請稍後再試",
          });
        } finally {
          setLoadingState(false);
        }
      } else {
        try {
          const result = await courseApi.getCategoryAllCourses(
            currentPage,
            sortBy,
            order,
            decodedCategory,
            search
          );
          setCourseList(result.courses);
          setPageData(result.pagination);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "取得資料失敗",
            text: error.response?.data?.message || "發生錯誤，請稍後再試",
          });
        } finally {
          setLoadingState(false);
        }
      }
    },
    [sortBy, order, search, decodedCategory, video_type]
  );

  // title 判斷
  const videoTypeMap = {
    topicSeries: "主題式系列課程影片一覽",
    customLearning: "客製化學習需求影片一覽",
    freeTipShorts: "實用技術短影片一覽",
  };
  let pageTitle = videoTypeMap[video_type]
    ? `Coding∞bit ｜ ${videoTypeMap[video_type]}`
    : "Coding∞bit ｜課程影片一覽";

  // 初始化取得資料
  useEffect(() => {
    getCoursesData();
  }, [getCoursesData]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      {loadingState && <Loader />}

      <header className="topicSeries-header-section bg-brand-05 wrap">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <NavLink to="/" className="underline-hover">
                  首頁
                </NavLink>
              </li>
              <li className="breadcrumb-item">
                <NavLink to="/course-list" className="underline-hover">
                  課程一覽
                </NavLink>
              </li>
              <li
                className="breadcrumb-item active fw-semibold"
                aria-current="page"
              >
                {video_type === "topicSeries" && "主題式系列課程影片一覽"}
                {video_type === "customLearning" && "客製化學習需求影片一覽"}
                {video_type === "freeTipShorts" && "實用技術短影片一覽"}
              </li>
            </ol>
          </nav>
          <h1 className="text-brand-03 fs-3 fs-lg-1 mt-8">
            {video_type === "topicSeries" && "主題式系列課程影片一覽"}
            {video_type === "customLearning" && "客製化學習需求影片一覽"}
            {video_type === "freeTipShorts" && "實用技術短影片一覽"}
          </h1>
          <p className="fs-6 fs-lg-5 mt-3">
            {video_type === "topicSeries" &&
              "專業講師自編，單一主題的系列課程影片"}
            {video_type === "customLearning" &&
              "由講師專為解決學生需求而錄製，為成果導向的教學影片"}
            {video_type === "freeTipShorts" &&
              "由專業講師錄製，一支影片會進行一個小技術的教學"}
          </p>
          <div className="category-list f-center mt-10 mt-lg-13">
            <Link
              to={`/course/?video_type=${video_type}`}
              className="btn btn-outline-brand-03 me-2 mb-4"
            >
              全部
            </Link>
            {categories.map((category) => (
              <NavLink
                to={`/course/category/${encodeURIComponent(
                  category.name
                )}/?video_type=${video_type}`}
                className="btn btn-outline-brand-03 me-2 mb-4"
                key={category.id}
              >
                {category.name}
              </NavLink>
            ))}
          </div>
        </div>
      </header>
      <main className="topicSeries-course-section wrap">
        {courseList.length !== 0 ? (
          <div className="container">
            <div className="control-group f-end-center">
              <div className="position-relative f-align-center d-flex me-2 search-tutor">
                <input
                  type="search"
                  className="form-control nav-search-desktop border border-brand-03 border-3"
                  placeholder="搜尋課程"
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
                  {sortBy === "view_count" && "排序方式(最熱門)"}
                  {sortBy === "rating" && "排序方式(最高評價)"}
                  {sortBy === "created_at" &&
                    order !== "ASC" &&
                    "建立時間(最新到最舊)"}
                  {sortBy === "created_at" &&
                    order === "ASC" &&
                    "建立時間(最舊到最新)"}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setSortBy("view_count");
                        setOrder("DESC");
                      }}
                    >
                      最熱門
                    </button>
                  </li>
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
                        setSortBy("created_at");
                        setOrder("DESC");
                      }}
                    >
                      建立時間(最新到最舊)
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
                      建立時間(最舊到最新)
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row topicSeriesCourse-card-wrap mt-6 mt-lg-8 g-5">
              {video_type === "topicSeries" ? (
                <CourseCardList courseList={courseList} />
              ) : (
                <CourseCardList courseList={courseList} type="singleVideo" />
              )}
            </div>
            <nav className="mt-6 mt-lg-8" aria-label="navigation">
              <Pagination pageData={pageData} getData={getCoursesData} />
            </nav>
          </div>
        ) : (
          <div className="container text-center py-6 py-11">
            <h2 className="fs-5 fs-lg-2 fw-medium text-brand-03 py-6 py-lg-11">
              此類別目前沒有資料，請選擇其他類別
            </h2>
          </div>
        )}
      </main>
    </>
  );
}
