// react 相關套件
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";

// 套件
import Swal from "sweetalert2";

// API
import courseApi from "@/api/courseApi";

// 工具
import { convertSecondsToTime } from "@/utils/timeFormatted-utils";

function StudentFavorites() {
  const [favoriteVideo, setFavoriteVideo] = useState([]); // 收藏影片陣列
  const [favoriteTutor, setFavoriteTutor] = useState([]); // 收藏講師陣列
  const [isGetData, setIsGetData] = useState(false); // 是否留言中

  // 獲取所有收藏影片
  const getFavoriteVideo = async () => {
    try {
      setIsGetData(true);
      const response = await courseApi.getAllFavoriteVideo();
      const { data } = response;
      setFavoriteVideo(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "取得資料失敗",
        text:
          error.response.data.status === "error" &&
          "請稍後再試，若有問題請洽管理人員",
      });
    } finally {
      setIsGetData(false);
    }
  };

  // 獲取所有收藏老師
  const getFavoriteTutor = async () => {
    try {
      setIsGetData(true);
      const response = await courseApi.getAllFavoriteTutor();
      const { data } = response;
      setFavoriteTutor(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "取得收藏老師失敗",
        text:
          error.response.data.status === "error" &&
          "請稍後再試，若有問題請洽管理人員",
      });
    } finally {
      setIsGetData(false);
    }
  };

  // 刪除收藏老師
  const deleteFavoriteTutor = async (tutorId) => {
    try {
      setIsGetData(true);
      const response = await courseApi.deleteFavoriteTutor(tutorId);
      if (response.status === 204) {
        getFavoriteTutor();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "刪除收藏老師失敗",
        text:
          error.response.data.status === "error" &&
          "請稍後再試，若有問題請洽管理人員",
      });
    } finally {
      setIsGetData(false);
    }
  };

  // 初始化
  useEffect(() => {
    setIsGetData(true);
    getFavoriteVideo();
  }, []);

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 學生我的收藏</title>
      </Helmet>

      <div className="overflow-y-auto">
        <h2 className="mb-6 ps-5 ps-lg-0">我的收藏</h2>
        <div className="bg-gray-04 p-8 rounded-3 student-favorites-section">
          <ul className="nav nav-tabs mb-5" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true"
                onClick={() => getFavoriteVideo()}
              >
                收藏影片
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
                onClick={() => getFavoriteTutor()}
              >
                收藏導師
              </button>
            </li>
          </ul>
          <div className="tab-content position-relative" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div className="table-wrap mt-6 mt-lg-8">
                <table className="table">
                  <thead>
                    <tr height="50">
                      <th></th>
                      <th>影片名稱</th>
                      <th>類別</th>
                      <th>觀看數</th>
                      <th>評價</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {favoriteVideo.map((item, index) => (
                      <tr className="align-middle" key={index}>
                        <td>
                          <NavLink to={`/video/${item.video_id}`}>
                            <div className="cover_image-wrap position-relative">
                              <img src={item.Video.cover_image} alt="封面圖" />
                              <span className="position-absolute py-1 px-2 rounded-1 fs-7 related-video-duration">
                                {convertSecondsToTime(item.Video.duration)}
                              </span>
                            </div>
                          </NavLink>
                        </td>
                        <td>{item.Video.title}</td>
                        <td>{item.Video.category}</td>
                        <td>{item.Video.view_count}</td>
                        <td>{Number(item.Video.rating)}</td>
                        <td>
                          <NavLink
                            to={`/video/${item.video_id}`}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="bi bi-box-arrow-up-right me-1"></i>
                            <span>前往</span>
                          </NavLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="profile"
              role="tabpanel"
              aria-labelledby="profile-tab"
            >
              <div className="container tutor-style">
                <div className="grid-container">
                  {favoriteTutor.map((tutor, index) => (
                    <div
                      className="card p-lg-5 p-md-4 p-4 img-hover-enlarge"
                      style={{ boxShadow: "0px 25px 50px -12px #0000001F" }}
                      key={index}
                    >
                      <div className="card-body p-0 d-flex flex-column flex-grow-1">
                        <div className="mb-5 f-between-start">
                          <div className="f-center">
                            {/* dynamic tutor profile */}
                            <img
                              src={
                                tutor.Tutor.User.avatar_url
                                  ? tutor.Tutor.User.avatar_url
                                  : "images/icon/user.png"
                              }
                              className="object-cover-fit rounded-circle me-2"
                              width="45"
                              height="45"
                              alt="tutor-avatar"
                            />
                            <div>
                              {/*  dynamic tutor name */}
                              <h5 className="card-title fw-medium text-gray-01 fs-lg-6 fs-5 mb-1">
                                {tutor.Tutor.User.username}
                              </h5>
                              {/*  dynamic title */}
                              {tutor.Tutor.slogan && (
                                <p className="text-gray-02 fs-8">
                                  {tutor.Tutor.slogan}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="f-center text-brand-03">
                            <span className="material-symbols-outlined icon-fill text-brand-01 me-1">
                              kid_star
                            </span>
                            {Number(tutor.Tutor.rating).toFixed(1)}
                          </p>
                        </div>

                        {tutor.Tutor.expertise && (
                          <div className="mb-5">
                            {tutor.Tutor.expertise
                              .trim()
                              .split(",")
                              .slice(0, 3)
                              .map((skill, index) => (
                                <div
                                  className="d-inline-block me-1 mb-1"
                                  key={index}
                                >
                                  <span className="d-inline-block tag tag-brand-02 fs-8">
                                    {skill.trim()}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}

                        <div className="mb-lg-6 mb-5 mt-auto">
                          <p className="text-gray-02 fs-7 fs-lg-6">
                            每小時收費
                          </p>
                          <h2 className="text-brand-03 fs-lg-2 fs-3">
                            NT ${" "}
                            {Number(tutor.Tutor.hourly_rate).toLocaleString(
                              "en-IN"
                            )}
                          </h2>
                        </div>

                        <div className="position-relative">
                          <span
                            className="favorite material-symbols-outlined icon-fill p-2 mb-2 rounded-circle align-middle
                           text-brand-01"
                            role="button"
                            onClick={() => deleteFavoriteTutor(tutor.Tutor.id)}
                          >
                            favorite
                          </span>
                        </div>

                        <NavLink
                          to={`/tutor/${tutor.Tutor.id}`}
                          className="btn btn-brand-03 w-100 slide-right-hover"
                        >
                          <p className="f-center me-1">
                            前往導師頁
                            <span className="material-symbols-outlined">
                              arrow_forward
                            </span>
                          </p>
                        </NavLink>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {isGetData && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  zIndex: 999,
                }}
              >
                <ReactLoading
                  type="spin"
                  color="black"
                  width="4rem"
                  height="4rem"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default StudentFavorites;
