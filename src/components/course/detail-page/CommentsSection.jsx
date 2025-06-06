// react 相關套件
import ReactLoading from "react-loading";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// 第三方套件
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { z } from "zod";

// API
import courseApi from "@/api/courseApi";

// 工具
import { formatDateToTaiwanStyle } from "@/utils/timeFormatted-utils";
import { countReplies, reduceComments } from "@/utils/countReplies-utils";

export default function CommentsSection({
  comments,
  videoId,
  disableInputComment,
}) {
  const [replyText, setReplyText] = useState({}); // 回覆輸入
  const [commentText, setCommentText] = useState(""); // 留言輸入
  const [userComments, setUserComments] = useState([]); // 留言
  const [replyCount, setReplyCount] = useState({}); // 回覆數
  const [showReplyBox, setShowReplyBox] = useState({}); // 是否顯示回覆輸入框
  const [isSending, setIsSending] = useState(false); // 是否留言中
  const [isReplying, setIsReplying] = useState({}); // 是否回覆中
  const [errors, setErrors] = useState({}); // 錯誤訊息

  // redux 使用者資訊
  const userInfo = useSelector((state) => state.auth.userData);

  // 定義留言規則
  const commentSchema = z.object({
    commentText: z.string().min(1, "留言不能為空"),
  });

  // 定義回覆規則
  const replySchema = z.object({
    replyText: z.string().min(1, "回覆不能為空"),
  });

  // 驗證留言
  const validateComment = (text) => {
    try {
      commentSchema.parse({ commentText: text });
      setErrors((prev) => ({ ...prev, commentText: null }));
      return true;
    } catch (error) {
      setErrors((prev) => ({ ...prev, commentText: error.errors[0].message }));
      return false;
    }
  };

  // 驗證回覆
  const validateReply = (text) => {
    try {
      replySchema.parse({ replyText: text });
      setErrors((prev) => ({ ...prev, replyText: null }));
      return true;
    } catch (error) {
      setErrors((prev) => ({ ...prev, replyText: error.errors[0].message }));
      return false;
    }
  };

  // 刪除留言
  const deleteComment = async (commentId) => {
    Swal.fire({
      title: "確定要刪除嗎？",
      text: "刪除後有問題請洽管理人員",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    })
      .then(async (result) => {
        await courseApi.deleteCourseComments(commentId);
        if (result.isConfirmed) {
          Swal.fire({
            title: "成功刪除",
            text: "已刪除留言",
            icon: "success",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "刪除失敗",
          text:
            error.response.data.status === "error" &&
            "請稍後再試，若有問題請洽管理人員",
        });
      })
      .finally(async () => {
        const reloadComments = await courseApi.getCourseComments(videoId);
        const { parentComments, childComments } =
          reduceComments(reloadComments);
        setUserComments(parentComments.reverse());
        setReplyCount(countReplies(childComments));
        setCommentText("");
        setIsSending(false);
      });
  };

  // 切換回覆輸入框
  const replySwitch = async (commentId) => {
    setShowReplyBox((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // 留言
  const sendComment = async () => {
    if (
      validateComment(commentText) &&
      commentText.trim() !== "" &&
      !isSending
    ) {
      setIsSending(true);
      try {
        const data = {
          content: commentText,
          parent_id: null,
        };
        await courseApi.postCourseComments(videoId, data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "留言失敗",
          text:
            error.response.data.status === "error" &&
            "請稍後再試，若有問題請洽管理人員",
        });
      } finally {
        const reloadComments = await courseApi.getCourseComments(videoId);
        const { parentComments, childComments } =
          reduceComments(reloadComments);
        setUserComments(parentComments.reverse());
        setReplyCount(countReplies(childComments));
        setCommentText("");
        setIsSending(false);
      }
    }
  };

  // 回覆
  const replyComment = async (commentId) => {
    const replyContent = replyText[commentId];
    if (validateReply(replyContent) && replyContent.trim() !== "") {
      setIsReplying((prev) => ({ ...prev, [commentId]: true })); // 只設置當前留言為 "回覆中"
      try {
        const data = {
          content: replyContent,
          parent_id: commentId,
        };
        await courseApi.postCourseComments(videoId, data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "回覆失敗",
          text:
            error.response.data.status === "error" &&
            "請稍後再試，若有問題請洽管理人員",
        });
      } finally {
        const reloadComments = await courseApi.getCourseComments(videoId);
        const { parentComments, childComments } =
          reduceComments(reloadComments);
        setUserComments(parentComments.reverse());
        setReplyCount(countReplies(childComments));

        setReplyText((prev) => ({
          ...prev,
          [commentId]: "",
        }));

        setShowReplyBox((prev) => ({
          ...prev,
          [commentId]: false,
        }));

        setIsReplying((prev) => ({ ...prev, [commentId]: false })); // 只讓當前留言結束 "回覆中"
      }
    }
  };

  // 整理留言
  useEffect(() => {
    if (comments && Array.isArray(comments)) {
      const { parentComments, childComments } = reduceComments(comments);
      setUserComments(parentComments.reverse());
      setReplyCount(countReplies(childComments));
    }
  }, [comments]);

  return (
    <>
      {/* <Loader/> */}
      <section className="video-comments pt-6">
        <div className="d-flex align-items-center py-4 mb-6">
          <div className="user-comment-picture me-3">
            <img
              className="w-100 h-100 object-cover"
              src={
                userInfo.avatar_url
                  ? userInfo.avatar_url
                  : "/images/icon/user.png"
              }
              alt="當前使用者頭像"
            />
          </div>
          <input
            type="text"
            placeholder={disableInputComment ? "課程尚未開放" : "留言..."}
            name="user-comment"
            id="user-comment"
            className={`user-comment py-2 ${
              errors.commentText ? "input-error" : ""
            }`}
            style={{ cursor: disableInputComment ? "not-allowed" : "" }}
            disabled={disableInputComment}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          {!disableInputComment && (
            <div>
              {!isSending && (
                <i
                  className="bi bi-send fs-4 p-2 send-icon-color"
                  onClick={() => sendComment()}
                ></i>
              )}
              {isSending && (
                <div className="p-2">
                  <ReactLoading
                    type={"spin"}
                    color={"#645caa"}
                    height={"1.5rem"}
                    width={"1.5rem"}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <ul className="history-comments">
          {userComments.map((userComment, index) => (
            <li className="mb-6" key={userComment.id}>
              <div className="user-content d-flex mb-3">
                <div className="user-image me-4">
                  <img
                    className="w-100 h-100 object-cover"
                    src={userComment.User.avatar_url}
                    alt="留言者頭像"
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center flex-fill">
                  <div className="f-column">
                    <span className="user-name mb-2">
                      {userComment.User.username}
                    </span>
                    <time className="comment-time fs-7">
                      {formatDateToTaiwanStyle(userComment.createdAt)}
                    </time>
                  </div>
                  {userComment.user_id == userInfo.id ? (
                    <button
                      type="button"
                      className="btn btn-outline-none fs-7 py-2 px-4 rounded-2 delete-comment"
                      onClick={() => deleteComment(userComment.id)}
                    >
                      刪除
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-none fs-7 py-2 px-4 rounded-2 delete-comment"
                      onClick={() => replySwitch(userComment.id)}
                    >
                      回覆
                    </button>
                  )}
                </div>
              </div>
              <div className="reply">
                <p className="reply-style fs-6">{userComment.content}</p>
                {showReplyBox[userComment.id] && (
                  <div className="d-flex align-items-center py-2">
                    <input
                      type="text"
                      placeholder="回覆留言"
                      name="reply-comment"
                      id={`reply-comment-${userComment.id}`} // 確保 ID 唯一
                      className={`w-100 reply-comment p-2 me-2 ${
                        errors.replyText ? "input-error" : ""
                      }`}
                      value={replyText[userComment.id] || ""} // 確保每個留言有自己的內容
                      onChange={(e) => {
                        setReplyText((prev) => ({
                          ...prev,
                          [userComment.id]: e.target.value,
                        }));
                      }}
                    />
                    <div>
                      {!isReplying[userComment.id] ? (
                        <i
                          className="bi bi-reply fs-4 p-2 reply-icon-color"
                          onClick={() => replyComment(userComment.id)}
                        ></i>
                      ) : (
                        <div className="p-2">
                          <ReactLoading
                            type={"spin"}
                            color={"#645caa"}
                            height={"1.5rem"}
                            width={"1.5rem"}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {replyCount[userComment.id] ? (
                  <div
                    className="accordion accordion-flush"
                    id="accordionFlushExample"
                  >
                    <div className="accordion-item">
                      <div
                        className="accordion-header mb-4"
                        id={`flush-heading${index}`}
                      >
                        <span
                          data-bs-toggle="collapse"
                          data-bs-target={`#flush-collapse${index}`}
                          aria-expanded="false"
                          aria-controls={`flush-collapse${index}`}
                          className={`accordion-button mouse-pointer-style collapsed py-2 px-4 ${
                            replyCount[userComment.id] === undefined
                              ? "d-none"
                              : ""
                          }`}
                        >
                          {replyCount[userComment.id]
                            ? replyCount[userComment.id].length
                            : ""}{" "}
                          則回覆
                        </span>
                      </div>
                      <div
                        id={`flush-collapse${index}`}
                        className="accordion-collapse collapse rounded-2"
                        aria-labelledby={`flush-collapse${index}`}
                      >
                        <div className="accordion-body">
                          {replyCount[userComment.id].map((item) => (
                            <div className="tutor-content mb-6" key={item.id}>
                              <div className="d-flex mb-3">
                                <div className="tutor-image me-4">
                                  <img
                                    className="w-100 h-100 object-cover"
                                    src={
                                      item.User.avatar_url
                                        ? item.User.avatar_url
                                        : "/images/icon/user.png"
                                    }
                                    alt="留言回覆者頭像"
                                  />
                                </div>
                                <div className="d-flex justify-content-between align-items-center flex-fill">
                                  <div className="f-column">
                                    <span className="tutor-name mb-2">
                                      {item.User.username}
                                    </span>
                                    <time className="comment-time fs-7">
                                      {formatDateToTaiwanStyle(item.createdAt)}
                                    </time>
                                  </div>
                                  {item.user_id == userInfo.id ? (
                                    <button
                                      type="button"
                                      className="btn btn-outline-none fs-7 py-2 px-4 rounded-2 reply-comment"
                                      onClick={() => deleteComment(item.id)}
                                    >
                                      刪除
                                    </button>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                              <p className="tutor-reply-style fs-6">
                                {item.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

CommentsSection.propTypes = {
  comments: PropTypes.array,
  videoId: PropTypes.string,
  disableInputComment: PropTypes.bool,
};
