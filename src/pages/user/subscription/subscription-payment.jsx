import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Swal from "sweetalert2";

import subscriptionApi from "@/api/subscriptionApi";
import orderApi from "@/api/orderApi";

import { BuyerForm } from "@/components/common/payment-form/BuyerForm";
import PaymentStepSection1 from "@/components/subscription/PaymentStepSection1";
import Loader from "@/components/common/Loader";

import { PaymentSchema } from "@/schema/payment-schema";
import { formatDateToTaiwan } from "@/utils/timeFormatted-utils";

const step2Fields = ["buyerEmail", "buyerName", "buyerTel"];

export default function SubscriptionPayment() {
  // loading
  const [loadingState, setLoadingState] = useState(false);

  // 取得路由中的值
  const { subscriptionPlan, duration, planId } = useParams();

  // 目前處於的步驟進度
  const [currentStep, setCurrentStep] = useState(1);

  const methods = useForm({
    resolver: zodResolver(PaymentSchema),
  });

  // 往下一步
  const [formattedToday, setFormattedToday] = useState("");
  const [formattedNextMonth, setFormattedNextMonth] = useState("");
  const [formattedNextYear, setFormattedNextYear] = useState("");
  const toNextStep = async () => {
    // 第一步，建立訂閱方案
    if (currentStep === 1) {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      // 開始日期
      setFormattedToday(formatDateToTaiwan(today));

      // 下個月的日期
      setFormattedNextMonth(formatDateToTaiwan(nextMonth));

      // 明年的日期
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setFormattedNextYear(formatDateToTaiwan(nextYear));

      addSubscription({
        plan_id: planId,
        billing_cycle: duration === "price_monthly" ? "monthly" : "annually",
        start_date: formatDateToTaiwan(today),
        end_date: duration === "price_monthly" ? formatDateToTaiwan(nextMonth) : formatDateToTaiwan(nextYear),
      });
    }
    if (currentStep === 2) {
      const isValid = await methods.trigger(step2Fields);
      if (!isValid) {
        Swal.fire({
          icon: "error",
          title: "請確認所有欄位已經填妥",
        });
        return;
      }
      await createOrder();
    }
  };

  // 取得所有方案
  const [prices, setPrices] = useState({});
  const getPlans = async () => {
    setLoadingState(true);
    try {
      const res = await subscriptionApi.getPlans();
      const formattedData = res.data.reduce((acc, item) => {
        if (item.name !== "free") {
          acc[item.name] = {
            price_monthly: item.price_monthly,
            price_annually: item.price_annually,
          };
        }
        return acc;
      }, {});
      setPrices(formattedData);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "取得訂閱方案失敗",
        text: error.response?.data?.message || "發生未知錯誤",
      });
    } finally {
      setLoadingState(false);
    }
  };

  // 取得 RTK 使用者資料
  const { isAuth } = useSelector((state) => state.auth);
  const { userData } = useSelector((state) => state.auth);

  // 建立訂閱函式
  const [subscriptionId, setSubscriptionId] = useState("");
  const navigate = useNavigate();
  const addSubscription = async (subscriptionData) => {
    setLoadingState(true);
    try {
      if (!isAuth) {
        Swal.fire("請先登入再進行訂閱");
        navigate("/login");
        return;
      }
      const res = await subscriptionApi.addSubscription(subscriptionData);
      setSubscriptionId(res.data.id);
      setCurrentStep((currentStep) => currentStep + 1);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "訂閱失敗",
        text: error.response?.data?.message || "發生錯誤，請稍後再試",
      });
    } finally {
      setLoadingState(false);
    }
  };

  // 建立訂單函式
  const createOrder = async () => {
    setLoadingState(true);
    try {
      const orderData = {
        order_type: "subscription",
        target_id: subscriptionId,
        amount: prices[subscriptionPlan]?.[duration],
      };

      const res = await orderApi.createOrder({
        user_id: userData.id,
        ...orderData,
      });

      addPay(res.data.id);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "付款失敗",
        text: error.response?.data?.message || "發生未知錯誤",
      });
    } finally {
      setLoadingState(false);
    }
  };
  // 建立藍新金流
  const addPay = async (orderId) => {
    setLoadingState(true);
    try {
      // 設定前端跳轉的網址
      const returnUrl = `https://coding-8bit.com/#/subscription/subscription-paymentResult`;

      // 呼叫 API 取得藍新金流參數
      const response = await orderApi.addPay(orderId, returnUrl);

      // 取得必要的付款資訊
      const transactionId = response.transactionId;

      // 必要資料存入 sessionStorage 給付款完成頁用
      sessionStorage.setItem("transactionId", transactionId);
      sessionStorage.setItem("subscriptionId", subscriptionId);
      sessionStorage.setItem("subscriptionPlan", subscriptionPlan);
      sessionStorage.setItem("duration", duration);
      sessionStorage.setItem("formattedToday", formattedToday);
      sessionStorage.setItem("formattedNextMonth", formattedNextMonth);
      sessionStorage.setItem("formattedNextYear", formattedNextYear);

      // 創建表單並跳轉到藍新付款頁
      const form = document.createElement("form");
      form.method = "POST";
      form.action = response.PayGateWay;
      form.style.display = "none";

      // 藍新金流參數
      const params = [
        { name: "MerchantID", value: response.MerchantID },
        { name: "TradeInfo", value: response.TradeInfo },
        { name: "TradeSha", value: response.TradeSha },
        { name: "Version", value: response.Version },
      ];

      params.forEach(({ name, value }) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit(); // 跳轉到藍新金流
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "付款失敗",
        text: error.response?.data?.message || "發生未知錯誤",
      });
    } finally {
      setLoadingState(false);
    }
  };

  const onSubmit = () => {};

  // 初始化 - 取得方案價格
  useEffect(() => {
    getPlans();
  }, []);

  return (
    <>
      <Helmet>
        <title>Coding∞bit ｜ 訂閱付款</title>
      </Helmet>
      {loadingState && <Loader />}

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {currentStep === 1 && <PaymentStepSection1 prices={prices} duration={duration} subscriptionPlan={subscriptionPlan} toNextStep={toNextStep} />}
          {currentStep === 2 && (
            <>
              <main className="subscription-booking-section wrap-lg">
                <div className="container">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <NavLink to="/" className="underline-hover">
                          首頁
                        </NavLink>
                      </li>
                      <li className="breadcrumb-item">
                        <NavLink to="/subscription-list" className="underline-hover">
                          訂閱方案
                        </NavLink>
                      </li>
                      <li className="breadcrumb-item active fw-semibold">{subscriptionPlan === "basic" ? "基本會員 - 確認付款" : "高級會員 - 確認付款"}</li>
                    </ol>
                  </nav>
                  <h1 className="fs-2 fs-lg-1 text-brand-03 mt-8">確認付款</h1>
                  <div className="row mt-8 mt-lg-12">
                    <div className="col-lg-7">
                      <div className="input-card card shadow rounded-2 p-6 p-lg-10 ">
                        <h2 className="fs-5 fs-lg-3">購買人資訊</h2>
                        <BuyerForm />
                      </div>
                      <div className="input-card card shadow rounded-2 p-6 p-lg-10 mt-6">
                        <h2 className="fs-5 fs-lg-3">付款方式</h2>
                        <div className="form-check mt-6">
                          <input className="form-check-input" type="radio" name="pay-with" id="creditCard" defaultChecked />
                          <label className="form-check-label" htmlFor="creditCard">
                            藍新金流
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 電腦版明細卡片 */}
                    <div className="col-lg-5 d-none d-lg-block">
                      <div className="input-card card shadow rounded-2 p-6 p-lg-10">
                        <h2 className="fs-5 fs-lg-3">訂閱方案明細</h2>
                        <table className="table mt-8">
                          <tbody>
                            <tr className="border-top border-bottom f-between-center">
                              <th scope="row" className="border-0">
                                <h4 className="fs-6 fs-lg-5 fw-medium py-10">
                                  {subscriptionPlan === "basic" && "基本會員方案"}
                                  {subscriptionPlan === "premium" && "高級會員方案"}
                                  {duration === "price_monthly" ? " / 月" : " / 年"}
                                </h4>
                              </th>
                              <td className="border-0 text-end">
                                <h4 className="fs-6 fs-lg-5 fw-medium py-10">NT$ {prices[subscriptionPlan]?.[duration].toLocaleString() || ""}</h4>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table className="table border-0 mt-8">
                          <tbody>
                            <tr className="f-between-center">
                              <th scope="row" className="border-0">
                                <h4 className="fs-6 fs-lg-5">總計</h4>
                              </th>
                              <td className="border-0 text-end">
                                <h4 className="fs-2">NT$ {prices[subscriptionPlan]?.[duration].toLocaleString() || ""}</h4>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <button className="btn btn-brand-03 slide-right-hover f-center rounded-2 w-100 mt-8" onClick={toNextStep}>
                          前往付款
                          <span className="material-symbols-outlined icon-fill fs-6 fs-md-5 mt-1 ms-1">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </main>

              {/* 手機版明細卡片 */}
              <div className="media-subscription-price-card sticky-bottom bg-white border-top d-lg-none px-4 py-5">
                <div className="f-between-center">
                  <div>
                    <h4 className="fs-6 fs-lg-5 fw-medium">
                      {subscriptionPlan === "basic" && "基本會員方案"}
                      {subscriptionPlan === "premium" && "高級會員方案"}
                      {duration === "price_monthly" ? " / 月" : " / 年"}
                    </h4>
                    <h4 className="text-brand-03 fs-lg-2 fs-3 mt-1">NT$ {prices[subscriptionPlan]?.[duration] || ""}</h4>
                  </div>
                  <button className="btn btn-brand-03 slide-right-hover f-center rounded-2" onClick={toNextStep}>
                    立即付款
                    <span className="material-symbols-outlined icon-fill fs-6 fs-md-5 mt-1 ms-1">arrow_forward</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </>
  );
}
