// react 相關套件
import { useState, useEffect, useRef } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";

// 第三方套件
import Swal from "sweetalert2";

// API
import courseApi from "@/api/courseApi";

// 組件
import VideoContent from "@/components/course/detail-page/VideoContent";
import Loader from "@/components/common/Loader";

// 工具
import { convertSecondsToTime } from "@/utils/timeFormatted-utils";
import { loginCheck } from "@/store/slice/authSlice";

export default function CourseVideoPage() {
  const [otherVideos, setOtherVideos] = useState([]); // 講師其他影片
  const [relatedVideos, setRelatedVideos] = useState([]); // 相關影片
  const [loadingState, setLoadingState] = useState(true); // loading
  const [swalShown, setSwalShown] = useState(false); // 狀態變數來追蹤是否已經顯示過 Swal 彈窗
  const { videoId } = useParams(); // 取得影片ID
  const navigate = useNavigate(); // 用於導頁
  const dispatch = useDispatch(); // redux dispatch
  const dispatchRef = useRef(dispatch);
  const navigateRef = useRef(navigate);

  // 只會記錄一次錯誤訊息，防止重覆彈出 modal
  const errorLogged = useRef(false);

  // 確保開發環境時初始化只執行一次
  const isInitial = useRef(false);

  // 取得影片資料
  const [videoData, setVideoData] = useState({
    Tutor: {
      User: {},
    },
  });

  useEffect(() => {
    if (!videoData.id) return;

    // 過濾同講師無章節or相同課程
    const filterOtherCourse = (others) => {
      return others.filter(
        (other) =>
          other.CourseChapters &&
          other.CourseChapters.length > 0 &&
          other.id !== videoData.course_id
      );
    };

    // 過濾同課程的影片並取 6 支影片
    const filterRelatedVideo = (relatedVideo) => {
      return relatedVideo
        .filter((related) => {
          return related.course_id !== videoData.course_id;
        })
        .slice(0, 6);
    };

    // 在 videoData 更新後調用過濾函數
    const filterOtherVideos = async () => {
      const otherCourseResult = await courseApi.getFrontTutorCourses({
        tutorId: videoData.tutor_id,
      });
      return filterOtherCourse(otherCourseResult.courses);
    };

    // 在 videoData 更新後調用過濾函數
    const filterRelatedVideos = async () => {
      const relatedVideosResult = await courseApi.getFrontTutorVideos({
        category: videoData.category,
      });
      return filterRelatedVideo(relatedVideosResult.videos);
    };

    // 使用 Promise.all 確保兩個函數執行完畢後再執行 setLoadingState(false)
    const executeFilters = async () => {
      try {
        const [otherVideosResult, relatedVideosResult] = await Promise.all([
          filterOtherVideos(),
          filterRelatedVideos(),
        ]);

        // 在 Promise.all 完成後執行 setState
        setOtherVideos(otherVideosResult);
        setRelatedVideos(relatedVideosResult);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "影片獲取失敗",
          text:
            error.response.data.status === "error" &&
            "請稍後再試，若有問題請洽管理人員",
        });
      } finally {
        setLoadingState(false);
        isInitial.current = false;
      }
    };

    executeFilters();
  }, [videoData]);

  // 初始化
  useEffect(() => {
    if (!isInitial.current) {
      isInitial.current = true;

      const getInitialData = async () => {
        if (swalShown) return;

        const isLoginStatus = await dispatchRef.current(loginCheck());
        if (isLoginStatus.meta.requestStatus === "rejected") {
          if (!errorLogged.current) {
            setSwalShown(true);
            Swal.fire({
              title: "請先登入或註冊會員",
              text: "趕緊加入觀賞優質課程吧",
              icon: "error",
              showCancelButton: true,
              confirmButtonText: "註冊",
              cancelButtonText: "登入",
              allowOutsideClick: false,
            }).then((result) => {
              setSwalShown(false);
              if (result.isConfirmed) {
                navigateRef.current("/signup"); // 註冊
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                navigateRef.current("/login"); // 登入
              }
            });
          }
          errorLogged.current = true;
          setLoadingState(false);
        } else {
          setLoadingState(true);
          try {
            const videoResult = await courseApi.getVideoDetail(videoId);
            setVideoData(videoResult);
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "取得資料失敗",
              text:
                error.response.data.status === "error" &&
                "發生錯誤，請稍後再試",
            });
          } finally {
            setLoadingState(false);
          }
        }
      };
      getInitialData();
    }
  }, [videoId, swalShown]);

  return (
    <>
      <Helmet>
        <title>
          {videoData?.title
            ? `${videoData.title} ｜ 影片詳細`
            : "Coding∞bit ｜ 課程詳細"}
        </title>
      </Helmet>
      {loadingState && <Loader />}
      <main className="video-details container-lg py-lg-13 py-md-0">
        <div className="row">
          {videoData.video_url && (
            <>
              <VideoContent
                videoUrl={videoData?.video_url}
                courseList={videoData}
                paramsVideoId={videoId}
                page="single-video"
              />
              <aside className="col-lg-5 col-xl-4">
                {/* 講師其他影片 */}
                {otherVideos.length > 0 && (
                  <div className="other-videos rounded-4 aside-border mb-6">
                    <div
                      className="px-6 d-flex justify-content-between align-items-center"
                      style={{ marginBottom: "22px" }}
                    >
                      <h4 className="tutor-other-video-title">講師其他影片</h4>
                      <NavLink
                        to={`/tutor-info/${videoData.tutor_id}`}
                        className="f-align-center show-more-button slide-right-hover"
                      >
                        <span className="me-1">更多</span>
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </NavLink>
                    </div>
                    <ul className="other-videos-list">
                      {otherVideos.map((other, index) => (
                        <li
                          className="d-flex py-3 py-4 px-6 video-background-color-hover"
                          key={index}
                        >
                          <NavLink
                            to={`/course/${other.id}`}
                            className="d-flex justify-content-between chapter-item"
                          >
                            <div className="position-relative">
                              <img
                                className="rounded-2 me-4 other-video-image"
                                src={other.cover_image}
                                alt="影片縮圖"
                              />
                              <span className="position-absolute py-1 px-2 rounded-1 fs-7 other-video-duration">
                                {convertSecondsToTime(other.duration)}
                              </span>
                            </div>
                            <div className="f-column-between py-2">
                              <h5 className="other-video-title">
                                {other.title}
                              </h5>
                              <div className="f-align-center me-6">
                                <span className="view-count me-1 material-symbols-outlined eyes-icon fs-6">
                                  visibility
                                </span>
                                <data
                                  value={other.view_count}
                                  className="data-view-count fs-7"
                                >
                                  {Number(other.view_count).toLocaleString()}
                                </data>
                              </div>
                            </div>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 相關影片 */}
                {relatedVideos.length > 0 && (
                  <div className="related-videos rounded-4 aside-border">
                    <div
                      className="px-6 f-between-center"
                      style={{ marginBottom: "22px" }}
                    >
                      <h4 className="tutor-related-video-title">相關影片</h4>
                      <div className="f-align-center mouse-pointer-style slide-right-hover">
                        <NavLink
                          to={`/course?video_type=freeTipShorts`}
                          className="d-flex justify-content-between chapter-item show-more-button"
                        >
                          <span className="me-1">更多</span>
                          <span className="material-symbols-outlined">
                            arrow_forward
                          </span>
                        </NavLink>
                      </div>
                    </div>
                    <ul className="related-videos-list">
                      {relatedVideos.map((related, index) => (
                        <li
                          className="d-flex py-3 py-4 px-6 video-background-color-hover position-relative"
                          key={index}
                        >
                          <NavLink
                            to={`/video/${related.id}`}
                            className="d-flex justify-content-between chapter-item"
                          >
                            <div className="position-relative me-4 related-video-image rounded-2">
                              <img
                                className="w-100"
                                src={related.cover_image}
                                alt="影片縮圖"
                              />
                              <span className="position-absolute py-1 px-2 rounded-1 fs-7 related-video-duration">
                                {convertSecondsToTime(related.duration)}
                              </span>
                            </div>
                            <div className="f-column-between py-2">
                              <h5 className="related-video-title">
                                {related.title}
                              </h5>
                              <div className="f-align-center">
                                <span className="material-symbols-outlined me-1 author-icon fs-6">
                                  co_present
                                </span>
                                <span className="me-2 me-md-4">
                                  {related.Tutor.User.username}
                                </span>
                                <span className="view-count me-1 material-symbols-outlined eyes-icon fs-6">
                                  visibility
                                </span>
                                <data
                                  value={related.view_count}
                                  className="data-view-count fs-7"
                                >
                                  {Number(related.view_count).toLocaleString()}
                                </data>
                              </div>
                            </div>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </>
          )}
        </div>
      </main>
    </>
  );
}
