import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";

import customRequestsApi from "@/api/customRequestsApi";

import CardModal from "@/components/custom-request/CardModal";
import Pagination from "@/components/layout/Pagination";
import Loader from "@/components/common/Loader";

import { formatDateToTaiwanStyle } from "@/utils/timeFormatted-utils";

export default function StudentManageCustomRequests() {
  // auth
  const { isAuth } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.auth);

  // loading
  const [loadingState, setLoadingState] = useState(true);

  // 取得需求資料函式
  const [customRequestList, setCustomRequestList] = useState([]);
  const [pageData, setPageData] = useState({});
  const getData = useCallback(
    async (page = 1) => {
      if (!userData?.id) return;

      setLoadingState(true);
      try {
        const result = await customRequestsApi.getUserCustomRequests(
          userData.id,
          page
        );
        setCustomRequestList(result.requests);
        setPageData(result.pagination);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "取得資料失敗",
          text: error?.response?.data?.message,
        });
      } finally {
        setLoadingState(false);
      }
    },
    [userData?.id]
  );

  // 更新需求
  const updateRequest = async (id, request, isCompleted) => {
    setLoadingState(true);
    try {
      await customRequestsApi.updateCustomRequest(id, {
        ...request,
        isCompleted: isCompleted,
      });
      Swal.fire({
        icon: "success",
        title: "修改成功",
      });
      getData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "取得資料失敗",
        text: error?.response?.data?.message,
      });
    } finally {
      setLoadingState(false);
    }
  };

  // 刪除需求
  const deleteRequest = async (id) => {
    Swal.fire({
      title: "確定要刪除嗎？",
      showCancelButton: true,
      confirmButtonText: "刪除",
      denyButtonText: "不要刪除",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoadingState(true);
        try {
          await customRequestsApi.deleteCustomRequest(id);
          Swal.fire({
            icon: "success",
            title: "刪除成功",
          });
          getData();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: error?.response,
          });
        } finally {
          setLoadingState(false);
        }
      }
    });
  };

  // modal
  const [temCustomRequest, setTemCustomRequest] = useState({});
  const myModal = useRef(null);
  const cardModalRef = useRef(null);
  const openModal = (request) => {
    myModal.current.show();
    setTemCustomRequest(request);
  };

  // 初始化 - 啟用 modal
  useEffect(() => {
    myModal.current = new bootstrap.Modal(cardModalRef.current);
  }, []);

  // 初始化 - 取得資料
  useEffect(() => {
    if (isAuth) {
      getData();
    }
  }, [userData.id, isAuth, getData]);

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 客製化學習需求管理</title>
      </Helmet>
      {loadingState && <Loader />}

      <main className="manage-custom-request-list-wrap container-fluid">
        <div className="f-xxl-between">
          <div className="title">
            <h1 className="fs-4 fs-lg-2">
              客製化學習需求管理 - 已提出的學習需求
            </h1>
          </div>
          <div>
            <NavLink
              to="/custom-requests-list"
              className="btn btn-brand-03 rounded-2 slide-right-hover d-inline-flex f-align-center mt-6 mt-xxl-0 py-3"
            >
              前往學習需求列表
              <span className="material-symbols-outlined icon-fill fs-5 ms-1">
                arrow_forward
              </span>
            </NavLink>
          </div>
        </div>

        {/* 需求列表 */}
        <div className="table-wrap mt-6 mt-lg-13">
          {customRequestList.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>需求標題</th>
                    <th>類別</th>
                    <th>上傳時間</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {customRequestList.map((request) => (
                    <tr className="align-middle" key={request.id}>
                      <td>{request.title}</td>
                      <td>{request.category}</td>
                      <td>{formatDateToTaiwanStyle(request.createdAt)}</td>
                      <td>
                        <div className="f-column">
                          <button
                            type="button"
                            className={`btn border-0 d-inline-flex f-align-center p-0 ${
                              request.isCompleted
                                ? "link-danger"
                                : "link-success"
                            }`}
                            onClick={() =>
                              updateRequest(
                                request.id,
                                request,
                                !request.isCompleted
                              )
                            }
                          >
                            <span className="material-symbols-outlined me-1">
                              {request.isCompleted ? "warning" : "check_circle"}
                            </span>
                            {request.isCompleted ? "改為未解決" : "改為已解決"}
                          </button>
                          <button
                            type="button"
                            className="btn link-brand-03 border-0 d-inline-flex f-align-center p-0 mt-1"
                            onClick={() => openModal(request)}
                          >
                            <span className="material-symbols-outlined me-1">
                              dataset
                            </span>
                            詳細
                          </button>
                          <button
                            type="button"
                            className="btn link-danger border-0 f-align-center p-0 mt-1"
                            onClick={() => deleteRequest(request.id)}
                          >
                            <span className="material-symbols-outlined me-1">
                              delete
                            </span>
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* 頁碼 */}
              <div className="mt-4 mt-lg-6">
                <Pagination pageData={pageData} getData={getData} />
              </div>
            </>
          ) : (
            <>
              <div className="text-center bg-gray-04 py-8 py-lg-13">
                <h2>暫時沒有資料</h2>
              </div>
            </>
          )}
        </div>
      </main>

      {/* 學習需求卡片 Modal */}
      <CardModal
        temCustomCourse={temCustomRequest}
        cardModalRef={cardModalRef}
        setLoadingState={setLoadingState}
      />
    </>
  );
}
