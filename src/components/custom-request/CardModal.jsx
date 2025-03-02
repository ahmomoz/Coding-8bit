import { useState, useEffect, lazy, Suspense } from "react";

const ReactQuill = lazy(() => import("react-quill-new"));
import PropTypes from "prop-types";
import Loader from "@/components/common/Loader";
import DOMPurify from "dompurify";

import { formatDateToTaiwanStyle } from "@/utils/timeFormatted-utils";

export default function CardModal({ temCustomCourse, cardModalRef }) {
  // ReactQuill 文字編輯器
  const [value, setValue] = useState("");

  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  return (
    <>
      <div
        className="custom-modal modal fade"
        id="cardModal"
        tabIndex="-1"
        ref={cardModalRef}
      >
        <div className="modal-dialog modal-xl modal-fullscreen-sm-down">
          <div className="modal-content">
            <div className="modal-header px-4">
              <h5 className="modal-title f-align-center" id="cardModalLabel">
                {temCustomCourse?.isCompleted && (
                  <p className="text-brand-03 d-inline-flex f-align-center me-3">
                    <span className="material-symbols-outlined icon-fill text-brand-03 me-1">
                      check_circle
                    </span>
                    已解決
                  </p>
                )}
                {temCustomCourse?.title}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="content-wrapper">
                {/* 左側欄：原需求、作者信息、標籤、照片 */}
                <div className="left-column col-md-6">
                  <div className="scrollable-content p-5">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        id="modalAuthorAvatar"
                        src={
                          temCustomCourse?.User?.avatar_url
                            ? temCustomCourse?.User?.avatar_url
                            : "/images/icon/user.png"
                        }
                        alt="作者頭像"
                        className="rounded-circle me-2"
                        width="40"
                        height="40"
                      />
                      <h6 id="modalAuthorName" className="mb-0">
                        {temCustomCourse?.User?.username}
                      </h6>
                      <small className="text-brand-03 ms-4 ms-lg-6">
                        {temCustomCourse?.level}
                      </small>
                    </div>
                    <p
                      id="modalContent"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(temCustomCourse?.content),
                      }}
                    ></p>
                    <div id="modalTags" className="mb-3">
                      {temCustomCourse?.tag &&
                        temCustomCourse?.tag
                          .split(", ")
                          .slice(0, 5)
                          .map((tag, index) => (
                            <span
                              className="badge bg-secondary me-1 mt-3"
                              key={index}
                            >
                              {tag}
                            </span>
                          ))}
                    </div>
                    <small id="modalDate" className="text-muted d-block mb-3">
                      {formatDateToTaiwanStyle(temCustomCourse?.createdAt)}
                    </small>
                    {temCustomCourse?.photos?.map((photo) => (
                      <img
                        id="modalPhoto"
                        src={photo.photo_url}
                        alt="相關照片"
                        className="img-fluid mb-3"
                        key={photo.id}
                      />
                    ))}
                  </div>

                  <div className="fixed-bottom-form">
                    <h6 className="mb-3">新增回應：</h6>
                    <form id="newResponseForm">
                      <div className="mb-3">
                        {editorLoaded && (
                          <Suspense fallback={<Loader />}>
                            <ReactQuill value={value} onChange={setValue} />
                          </Suspense>
                        )}
                      </div>
                      <div className="form-actions">
                        <button
                          type="submit"
                          className="btn btn-brand-03 rounded-2"
                        >
                          提交回應
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* 右側欄：回覆意見 */}
                <div className="right-column col-md-6">
                  <div className="scrollable-content p-5">
                    <h6 className="mb-3">回覆意見：</h6>
                    <div id="modalResponses" className="comments-container">
                      {/* 回覆將在這裡動態插入 */}
                      {/* {temCustomCourse?.responses?.map((res) => (
                        <div
                          className="card mb-3 border-0 bg-light"
                          key={res.id}
                        >
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <img
                                  src={res.avatar}
                                  alt="author-avatar-image"
                                  className="rounded-circle me-2"
                                  width="32"
                                  height="32"
                                />
                                <div>
                                  <h6 className="mb-0 fw-bold">{res.author}</h6>
                                  <small className="text-muted">
                                    {res.date}
                                  </small>
                                </div>
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn btn-link text-muted p-0"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                >
                                  <span className="material-symbols-outlined">
                                    more_vert
                                  </span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      編輯
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      刪除
                                    </a>
                                  </li>
                                  <li>
                                    <a className="dropdown-item" href="#">
                                      舉報
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <p className="card-text mb-2">{res.content}</p>
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-sm btn-light me-2 like-button d-flex align-items-center"
                                data-response-id="r1"
                              >
                                <span className="material-symbols-outlined icon-fill me-2">
                                  thumb_up
                                </span>
                                <span className="like-count">{res.likes}</span>
                              </button>
                              <button className="btn btn-sm btn-light d-flex align-items-center">
                                <span className="material-symbols-outlined me-2">
                                  comment
                                </span>
                                回覆
                              </button>
                            </div>
                          </div>
                        </div>
                      ))} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CardModal.propTypes = {
  temCustomCourse: PropTypes.object,
  cardModalRef: PropTypes.object,
};
