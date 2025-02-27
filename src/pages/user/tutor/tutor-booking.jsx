import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useDispatch } from "react-redux";

import { Swiper } from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import * as bootstrap from "bootstrap";

import tutorApi from "@/api/tutorApi";
import courseApi from "@/api/courseApi";

import ShowMoreButton from "@/components/common/ShowMoreButton";
import TutorBookingResume from "@/components/tutor/TutorBookingResume";
import TutorsCard from "@/components/tutor/TutorsCard";
import CourseCardList from "@/components/course/CourseCardList";
import CommentsSection from "@/components/tutor/CommentsSection";
import SectionFallback from "@/components/common/SectionFallback";
import Timetable from "@/components/tutor/Timetable";
import Loader from "@/components/common/Loader";

import { updateFormData } from "../../../utils/slice/bookingSlice";
import { recommendTutorData, tutorStats } from "../../../data/tutors";
import { formatDateDash } from "@/utils/timeFormatted-utils";

export default function TutorBooking() {
  // 抓取路由上的 id 來取得遠端特定 id 的資料
  const { id: tutor_id } = useParams();
  // Loading的useState
  const [loadingState, setLoadingState] = useState(true);
  // 講師基本資料的useState
  const [tutorBasicInfo, setTutorBasicInfo] = useState({
    name: "API裡面沒有名字",
    avatar_url: "images/icon/default-tutor-icon.png",
    about: "",
    hourly_rate: 0,
    expertise: "",
    rating: "",
    resume: { work_experience: [], education: [], certificates: [] },
    statistics: {},
  });
  const [courses, setCourses] = useState([]);
  const [comments, setComments] = useState([]);
  // 關於可預約時間的useState
  const [accumulateAvailableTime, setAccumulateAvailableTime] = useState([]); //儲存已fetch過的時間
  const [currentAvailableTime, setCurrentAvailableTime] = useState([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [isLoadingAvailableTime, setLoadingAvailableTime] = useState(false);

  // modal
  const serviceSelectionModal = useRef(null);
  const serviceSelectionModalRef = useRef(null);

  useEffect(() => {
    serviceSelectionModal.current = new bootstrap.Modal(serviceSelectionModalRef.current);
  }, []);

  // 取得講師頁面的資料的Function
  const getTutorBasicData = async () => {
    setLoadingState(true);
    try {
      const [basicInfoResult, experienceResult, educationResult, certificateResult, videos] = await Promise.all([
        tutorApi.getTutorDetail(tutor_id),
        tutorApi.getExp(tutor_id),
        tutorApi.getEdu(tutor_id),
        tutorApi.getCertificate(tutor_id),
        courseApi.getTutorVideosInBooking(tutor_id),
      ]);

      setTutorBasicInfo((prev) => ({
        ...prev,
        ...basicInfoResult.data,
        resume: {
          work_experience: experienceResult.data,
          education: educationResult.data,
          certificates: certificateResult.data,
        },
      }));

      setCourses(videos.videos);
    } catch (error) {
      console.log("錯誤", error);
    } finally {
      setLoadingState(false);
    }
  };

  const getAvailabilityData = async () => {
    setLoadingAvailableTime(true);
    try {
      // 計算baseDate
      const today = new Date();
      const dayOffset = weekOffset < 0 ? 0 : weekOffset * 7;
      const baseDate = formatDateDash(formatDateDash(today.setDate(today.getDate() + dayOffset)));

      // 檢查資料是否已經儲在useState裡面
      const existingData = accumulateAvailableTime.find((data) => data.baseDate === baseDate);

      // 如果資料已存在，我們直接拿，不用再fetch API
      if (existingData) {
        setCurrentAvailableTime(existingData.timeSlots);
      } else {
        // 如果不存在，就可以fetch API
        const result = await tutorApi.getAvailability(tutor_id, baseDate);

        // 把剛剛fetch的data存到useState裡面，避免過度fetch API
        const newData = { baseDate, timeSlots: result.data?.slice(7, 14) };
        setAccumulateAvailableTime((prev) => [...prev, newData]);
        setCurrentAvailableTime(result.data?.slice(7, 14));
      }
    } catch (error) {
      console.log("錯誤", error);
    } finally {
      setLoadingAvailableTime(false);
    }
  };

  // 初始化 - 取得資料
  useEffect(() => {
    //TODO 檢查這個老師是否存在，才可以繼續
    getTutorBasicData();
  }, []);

  useEffect(() => {
    getAvailabilityData();
  }, [weekOffset]);

  // 初始化 - swiper
  useEffect(() => {
    new Swiper(".tutor-card-swiper", {
      modules: [Navigation, Autoplay],
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      },
    });
    new Swiper(".freeTipShortsSwiper", {
      modules: [Navigation, Autoplay],
      slidesPerView: 1,
      spaceBetween: 40,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 5000,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
      },
    });
  }, []);

  // 控制timetable的arrow
  const toNextWeek = async () => {
    setWeekOffset((prev) => prev + 1);
  };

  const toPrevWeek = () => {
    if (weekOffset > 0) {
      setWeekOffset((prev) => prev - 1);
    }
  };

  // 建立Dispatch 來修改 RTK的State
  const dispatch = useDispatch();

  // 傳遞預約種類路由參數
  const navigate = useNavigate();

  // 跳轉自下一頁按紐
  const toPaymentPage = (serviceType) => {
    dispatch(updateFormData({ service_type: serviceType }));
    dispatch(updateFormData({ tutor_id: tutor_id }));
    dispatch(updateFormData({ tutor_name: tutorBasicInfo.name }));
    serviceSelectionModal.current.hide();
    navigate(`/tutor-booking-payment`);
  };

  return (
    <>
      <Helmet>
        <title>{tutorBasicInfo?.name ? `${tutorBasicInfo.name} ｜ 講師詳細` : "Coding∞bit ｜ 講師詳細"}</title>
      </Helmet>
      {/* {loadingState && <Loader />} */}
      <div className="tutor-booking">
        {/*  Mobile Top Cover */}
        <div className="position-relative d-lg-none">
          <div className="img-wrapper img-hover-enlarge">
            <img src="images/course/course-2-high-res.jpg" className="w-100" alt="tutor cover" style={{ maxHeight: "300px" }} />
          </div>

          <span className="material-symbols-outlined icon-fill text-white position-absolute top-50 start-50 translate-middle" style={{ fontSize: "56px" }}>
            play_circle
          </span>

          <span className="favorite material-symbols-outlined icon-fill p-2 rounded-circle align-middle" role="button" style={{ backgroundColor: "#1e1e1e66" }} data-favorite="true">
            favorite
          </span>
        </div>
        {/*  Main Content */}
        <main className="container py-lg-13 py-7">
          <div className="row">
            {/*  tutor information */}

            <div className="col-lg-8">
              {/*  section 1 - overview */}
              <section className="section">
                {/*  tutor profile  */}
                <div className="tutor-profile section-component">
                  <div className="flex-shrink-0">
                    <img src={tutorBasicInfo.avatar_url} alt="profile" className="object-fit-cover rounded-circle me-6" />
                  </div>
                  <div className="flex-grow-1">
                    <h2 className="mb-2 fs-lg-2 fs-4">{tutorBasicInfo.name}</h2>
                    <p className="fs-lg-5 fs-6 text-gray-02">{tutorBasicInfo.title}</p>
                  </div>
                </div>
                {/*  tag list  */}
                <div className="list-x-scroll py-2 section-component">
                  <a href="#" className="tag tag-brand-02 fs-8 me-3">
                    {tutorBasicInfo.expertise}
                  </a>
                </div>
                {/*  tab  */}
                <div className="section-component">
                  <ul className="nav nav-tabs mb-6 list-x-scroll flex-nowrap" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="about-me-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#about-me-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="about-me-tab-pane"
                        aria-selected="true"
                      >
                        關於我
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="resume-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#resume-tab-pane"
                        type="button"
                        role="tab"
                        aria-controls="resume-tab-pane"
                        aria-selected="false"
                      >
                        我的履歷
                      </button>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="about-me-tab-pane" role="tabpanel" aria-labelledby="about-me-tab" tabIndex="0">
                      <ShowMoreButton text={tutorBasicInfo.about} />
                    </div>
                    <div className="tab-pane fade" id="resume-tab-pane" role="tabpanel" aria-labelledby="resume-tab" tabIndex="0">
                      <TutorBookingResume resume={tutorBasicInfo.resume} />
                    </div>
                  </div>
                  {/* statistics */}
                  <div className="row row-cols-2 row-cols-lg-5 g-3 mt-5">
                    {tutorStats.map((item, index) => (
                      <div className="col" key={index}>
                        <div className="stat-overview-card">
                          <h4 className="text-brand-03">{item.details}</h4>
                          <p className="fs-7">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* section 2 - video list */}
              <section className="section">
                <div className="section-component f-between-center">
                  <h4>講師影片</h4>
                  <NavLink to={`/tutor-info/${tutor_id}`} className="text-brand-03 d-flex slide-right-hover" data-show="false">
                    <p>更多</p>
                    <span className="material-symbols-outlined icon-fill">arrow_forward</span>
                  </NavLink>
                </div>

                <div className="swiper freeTipShortsSwiper">
                  <div className="swiper-wrapper">
                    {courses.map((course) => (
                      <div className="swiper-slide" key={course.id}>
                        <CourseCardList courseList={course} cardsNum={1} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>{courses.length === 0 && <SectionFallback materialIconName="animated_images" fallbackText="講師暫無影片" />}</div>
              </section>

              {/* section 3 - timetable  */}
              <section className="section schedule">
                <div className="section-component f-between-center">
                  <h4>時間表</h4>
                </div>
                {currentAvailableTime.length === 0 ? (
                  <SectionFallback materialIconName="event_busy" fallbackText="講師暫無可預約時間" />
                ) : (
                  <Timetable availability={currentAvailableTime} weekOffset={weekOffset} toNextWeek={toNextWeek} toPrevWeek={toPrevWeek} isLoading={isLoadingAvailableTime} />
                )}
              </section>

              {/* section 4 - student comment */}
              <CommentsSection comments={comments} />

              {/* section 5 - tutor recommendation */}
              <section className="section mb-0">
                <div className="section-component f-between-center">
                  <h4>推薦講師</h4>
                  <NavLink to="/tutor-list" className="text-brand-03 d-flex slide-right-hover">
                    <p>更多</p>
                    <span className="material-symbols-outlined icon-fill">arrow_forward</span>
                  </NavLink>
                </div>

                {/* desktop */}
                <TutorsCard tutorList={recommendTutorData} cardsNum={2} />
                {/* mobile */}
                <div className="swiper tutor-card-swiper d-block d-lg-none">
                  <div className="swiper-wrapper mb-10 py-5">
                    {recommendTutorData.map((tutor) => (
                      <div className="swiper-slide" key={tutor.id}>
                        <TutorsCard tutorList={tutor} cardsNum={1} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Desktop right CTA card */}
            <div className="col-lg-4 d-lg-block d-none">
              <div className="desktop-cta-card card p-lg-6 p-4 sticky-top">
                <div className="position-relative mb-lg-5 mb-4">
                  <div className="img-wrapper img-hover-enlarge rounded-2">
                    <img src="images/course/course-2.png" className="card-img-top rounded-2 object-fit-cover" alt="course-2" />
                  </div>

                  <span className="favorite material-symbols-outlined icon-fill p-2 rounded-circle align-middle" role="button" style={{ backgroundColor: "#1e1e1e66" }} data-favorite="true">
                    favorite
                  </span>
                </div>
                <div className="card-body p-0">
                  <div className="mb-lg-6 mb-5">
                    <p className="text-gray-02 fs-7 fs-lg-6">每小時收費</p>
                    <h2 className="text-brand-03 fs-lg-2 fs-3">NT ${tutorBasicInfo.hourly_rate}</h2>
                  </div>

                  <button className="btn slide-right-hover btn-brand-03 w-100" data-bs-toggle="modal" data-bs-target="#serviceSelectionModal">
                    <p className="f-center me-1">
                      立即預約
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {/* Modal - Service Select Modal */}
      <div className="modal fade service-selection-modal" id="serviceSelectionModal" tabIndex="-1" aria-labelledby="serviceSelectionModalLabel" aria-hidden="true" ref={serviceSelectionModalRef}>
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h4 className="modal-title fs-md-2 fs-3 text-center mb-8" id="serviceSelectionModalLabel">
                請選擇想預約的項目
              </h4>
              <div className="row row-cols-lg-2 g-4 flex-column flex-lg-row">
                <div className="col service-card">
                  <button
                    className="h-100 border-0"
                    onClick={() => {
                      toPaymentPage("courseSession");
                    }}
                  >
                    <div className="f-center flex-column bg-gray-04 py-8 px-5 rounded-2 slide-up-hover h-100">
                      <h3 className="fs-4 fs-md-3">一對一教學</h3>
                      <img src="images/deco/Illustration-7.png" alt="one-on-one-illustration" />
                      <p className="text-center mb-auto">以線上Google meeting的形式， 將於預約時間前一天發送會議連結， 講師會於預約時間內進行一對一單獨指導。</p>
                    </div>
                  </button>
                </div>
                <div className="col service-card">
                  <button
                    className="h-100 border-0"
                    onClick={() => {
                      toPaymentPage("codeReview");
                    }}
                  >
                    <div className="f-center flex-column bg-gray-04 py-8 px-5 rounded-2 slide-up-hover h-100">
                      <h3 className="fs-4 fs-md-3">程式碼檢視</h3>
                      <img src="images/deco/Illustration-8.png" alt="code-review-illustration" />
                      <p className="text-center mb-auto">您需要於預約時繳交GitHub Repo， 提供想接受檢視的程式碼， 講師會於預約時間內進行程式碼檢視服務， 並且於時間結束時回覆檢視後的結果。</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Student Comment Modal */}
      <CommentsSection comments={comments} modal={true} />

      {/* Mobile sticky bottom CTA card */}
      <div className="mobile-bottom-cta d-lg-none sticky-bottom border border-2 border-brand-02 bg-white" style={{ borderRadius: "16px 16px 0px 0px" }}>
        <div className="pt-4 pb-6 px-4">
          <div className="f-between-center">
            <div>
              <p className="text-gray-02 fs-7 fs-lg-6">每小時收費</p>
              <h2 className="text-brand-03 fs-lg-2 fs-3">NT ${tutorBasicInfo.hourly_rate}</h2>
            </div>

            <button className="btn slide-right-hover btn-brand-03" data-bs-toggle="modal" data-bs-target="#serviceSelectionModal">
              <p className="f-center me-1">
                立即預約
                <span className="material-symbols-outlined">arrow_forward</span>
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
