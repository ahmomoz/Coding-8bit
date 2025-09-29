import { createHashRouter } from "react-router-dom";

// Layout
import UserLayout from "../router/UserLayout";
import TutorLayout from "../router/TutorLayout";
import NotFound from "../pages/NotFound";

// 使用者前台
import Home from "../pages/user/Home";

import Login from "../pages/user/auth/login";
import Signup from "../pages/user/auth/signup";
import ActivateSuccess from "../pages/user/auth/activate-success";
import ForgotPassword from "../pages/user/auth/forgot-password";
import ResetPassword from "../pages/user/auth/reset-password";

import CourseList from "../pages/user/course/course-list";
import CourseListPage from "../pages/user/course/course-list-page";
import CourseCategoryPage from "../pages/user/course/course-category-page";
import CourseDetailPage from "../pages/user/course/detail-page/course-detail-page";
import CourseVideoPage from "../pages/user/course/detail-page/course-video-page";
import SingleVideoPage from "../pages/user/course/detail-page/single-video-page";

import CustomRequestsList from "../pages/user/custom-request/custom-requests-list";
import AddLearningNeedPage from "../pages/user/custom-request/add-learning-need-page";

import SubscriptionList from "../pages/user/subscription/subscription-list";
import SubscriptionPayment from "../pages/user/subscription/subscription-payment";
import SubscriptionPaymentResult from "../pages/user/subscription/subscription-paymentResult";

import TutorList from "../pages/user/tutor/tutor-list";
import TutorBooking from "../pages/user/tutor/tutor-booking";
import TutorBookingPayment from "../pages/user/tutor/tutor-booking-payment";
import TutorInfo from "../pages/user/tutor/tutor-info";
import TutorApply from "../pages/user/tutor/tutor-apply";

import HelpCenter from "../pages/user/help-center";

// 使用者後台 - 講師
import TutorPanel from "../pages/tutor/tutor-panel";

import TutorManageBooking from "../pages/tutor/bookings/tutor-manage-bookings";

import TutorManageCourses from "../pages/tutor/courses/tutor-manage-courses";
import TutorManageAddTopicSeries from "../pages/tutor/courses/course/tutor-addCourses-topicSeries";
import TutorManageEditTopicSeries from "../pages/tutor/courses/course/tutor-editCourses-topicSeries ";
import TutorManageAddVideo from "../pages/tutor/courses/video/tutor-addVideo";
import TutorManageEditVideo from "../pages/tutor/courses/video/tutor-editVideo";
import TutorProfile from "../pages/tutor/profile/tutor-profile";

// 使用者後台 - 學生
import StudentLayout from "./StudentLayout";
import StudentPanel from "../pages/student/student-panel";
import StudentManageCustomRequests from "../pages/student/custom-request/student-manage-custom-requests";
import StudentProfile from "../pages/student/student-profile";
import StudentManageBooking from "../pages/student/bookings/student-manage-bookings";
import StudentFavorites from "../pages/student/student-favorites";
import BookingPaymentResult from "../pages/user/tutor/tutor-booking-payment-result";

export const router = createHashRouter([
  {
    // 前台
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <Home /> },

      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "activate-success", element: <ActivateSuccess /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },

      { path: "course-list", element: <CourseList /> },
      { path: "course", element: <CourseListPage /> },
      { path: "course/category/:category", element: <CourseCategoryPage /> },
      { path: "course/:id", element: <CourseDetailPage /> },
      { path: "course/:id/chapter/:videoId", element: <CourseVideoPage /> },
      { path: "video/:videoId", element: <SingleVideoPage /> },

      { path: "custom-requests-list", element: <CustomRequestsList /> },
      { path: "add-learning-need", element: <AddLearningNeedPage /> },

      { path: "subscription-list", element: <SubscriptionList /> },
      {
        path: "subscription/:subscriptionPlan/:duration/:planId",
        element: <SubscriptionPayment />,
      },
      {
        path: "subscription/subscription-paymentResult",
        element: <SubscriptionPaymentResult />,
      },

      { path: "tutor-list", element: <TutorList /> },
      { path: "tutor/:id", element: <TutorBooking /> },
      {
        path: "tutor-booking-payment",
        element: <TutorBookingPayment />,
      },
      {
        path: "tutor-booking-payment-result",
        element: <BookingPaymentResult />,
      },
      { path: "tutor-info/:id", element: <TutorInfo /> },
      { path: "tutor-apply", element: <TutorApply /> },

      { path: "help-center", element: <HelpCenter /> },
    ],
  },
  {
    // 使用者後台 - 講師
    path: "/tutor-panel",
    element: <TutorLayout />,
    children: [
      { index: true, element: <TutorPanel /> },

      { path: "booking", element: <TutorManageBooking /> },
      { path: "course", element: <TutorManageCourses /> },
      {
        path: "course/topicSeries/add",
        element: <TutorManageAddTopicSeries />,
      },
      {
        path: "course/topicSeries/:id/edit",
        element: <TutorManageEditTopicSeries />,
      },
      {
        path: "video/:type/add/:courseId/:id",
        element: <TutorManageAddVideo />,
      },
      { path: "video/:type/add", element: <TutorManageAddVideo /> },
      {
        path: "video/:type/edit/:courseId/:id",
        element: <TutorManageEditVideo />,
      },
      { path: "video/:type/edit/:id", element: <TutorManageEditVideo /> },
      { path: "profile", element: <TutorProfile /> },
    ],
  },
  {
    // 使用者後台 - 學生
    path: "/student-panel",
    element: <StudentLayout />,
    children: [
      { index: true, element: <StudentPanel /> },

      { path: "custom-request", element: <StudentManageCustomRequests /> },

      { path: "profile", element: <StudentProfile /> },
      { path: "booking", element: <StudentManageBooking /> },
      { path: "favorites", element: <StudentFavorites /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
