import { useState } from "react";
import { Helmet } from "react-helmet-async";

import Swal from "sweetalert2";

import EditContent from "@/components/tutor-panel/course/edit/EditContent";
import EditChapter from "@/components/tutor-panel/course/edit/EditChapter";
import Loader from "@/components/common/Loader";

export default function TutorManageEditTopicSeries() {
  // loading
  const [loadingState, setLoadingState] = useState(false);

  const submitApiRequest = async (apiFunc, courseId, data) => {
    setLoadingState(true);
    try {
      const result = await apiFunc(courseId, data);
      Swal.fire({
        icon: "success",
        title: "課程修改成功",
      });
      return result;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response?.message || "發生錯誤，請稍後再試",
      });
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 編輯主題式課程影片</title>
      </Helmet>
      {loadingState && <Loader />}

      <main className="tutor-edit-TopicSeriesCourses-wrap container-fluid">
        <h1 className="fs-5 fs-lg-2">編輯主題式課程影片 - 課程基本資料</h1>

        <div className="row f-center">
          <ul
            className="nav nav-tabs border-bottom border-gray-03 mt-4 mt-lg-6"
            id="editCourseTab"
            role="tablist"
          >
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="content-tab"
                data-bs-toggle="tab"
                data-bs-target="#content"
                type="button"
                role="tab"
                aria-controls="content"
                aria-selected="false"
                tabIndex="-1"
              >
                課程資訊
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="chapter-tab"
                data-bs-toggle="tab"
                data-bs-target="#chapter"
                type="button"
                role="tab"
                aria-controls="chapter"
                aria-selected="true"
              >
                課程章節列表
              </button>
            </li>
          </ul>

          <div className="row">
            <div className="col">
              <div className="tab-content" id="editCourseTabContent">
                <div
                  className="tab-pane fade show active"
                  id="content"
                  role="tabpanel"
                  aria-labelledby="content-tab"
                >
                  <div className="row f-center pt-2">
                    <EditContent
                      setLoadingState={setLoadingState}
                      submitApiRequest={submitApiRequest}
                    />
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="chapter"
                  role="tabpanel"
                  aria-labelledby="chapter-tab"
                >
                  <div className="row f-center pt-2 pt-md-10">
                    <EditChapter setLoadingState={setLoadingState} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
