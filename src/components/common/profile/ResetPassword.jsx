import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";
import axios from "axios";
import PropTypes from "prop-types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/common/FormInput";

export default function ResetPassword({ userData, setLoadingState }) {
  // Zod 驗證規則
  const passwordSchema = z
    .string()
    .min(9, "密碼必須至少超過 8 碼")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?~-])/,
      "密碼必須包含 1 個特殊符號、1 個大寫英文字母、1 個小寫英文字母與 1 個數字"
    );

  const schema = z
    .object({
      oldPassword: passwordSchema,
      newPassword: passwordSchema,
      checkPassword: passwordSchema,
    })
    .refine((data) => data.newPassword === data.checkPassword, {
      path: ["checkPassword"],
      message: "兩次密碼輸入不一致",
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  // 修改密碼
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    const { oldPassword, newPassword } = data;
    setLoadingState(true);
    try {
      await axios.post(
        "https://service.coding-8bit.com/api/v1/password/change-password",
        { oldPassword: oldPassword, newPassword: newPassword }
      );
      Swal.fire({
        title: "密碼修改成功",
        icon: "success",
      });
      navigate(0);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "密碼修改失敗",
        text: error.response?.data?.message || "發生錯誤，請稍後再試",
      });
    } finally {
      setLoadingState(false);
    }
  };

  // 切換重設密碼編輯狀態
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const handleEditPassword = () => {
    setIsEditingPassword((prev) => (prev = !prev));
  };

  // 隱碼按鈕邏輯
  const [showPasswordList, setShowPasswordList] = useState([
    false,
    false,
    false,
  ]);

  const handleShowPassword = (index) => {
    setShowPasswordList((prevState) =>
      prevState.map((show, i) => (i === index ? !show : show))
    );
  };

  return (
    <section className="bg-white rounded-3 p-4 p-md-6">
      <h2 className="fs-6 fs-md-5 fw-bold">帳號與密碼</h2>
      <div className="pt-4 pt-md-6">
        <div>
          <p className="fs-6 mb-2 fw-medium">電子信箱</p>
          <span className="form-control p-0 fw-bold border-0">
            {userData.email}
          </span>
        </div>
        <div
          className={`d-flex justify-content-between align-items-center mt-2 mt-md-4 ${
            isEditingPassword && "d-none"
          }`}
        >
          <div>
            <label className="mb-0 fs-6 fw-medium">密碼</label>
            <input
              className="form-control p-0 fs-5 fw-bold border-0"
              type="password"
              defaultValue="**********"
            />
          </div>
          <button
            type="button"
            className="flex-shrink-0 text-brand-03 fs-6 fw-bold border-0 bg-transparent underline-hover"
            onClick={handleEditPassword}
          >
            重設密碼
          </button>
        </div>
        <form
          className={`reset-password-form ${!isEditingPassword && "d-none"}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mt-2 mt-md-4 position-relative">
            <FormInput
              register={register}
              errors={errors}
              id="oldPassword"
              labelText="密碼"
              type={showPasswordList[0] ? "text" : "password"}
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleShowPassword(0);
              }}
            >
              <span className="material-symbols-outlined position-absolute top-0 end-0 text-gray-03 mt-md-10 me-4">
                {showPasswordList[0] ? "visibility" : "visibility_off"}
              </span>
            </a>
          </div>
          <div className="mt-2 mt-md-4 position-relative">
            <FormInput
              register={register}
              errors={errors}
              id="newPassword"
              labelText="密碼"
              type={showPasswordList[1] ? "text" : "password"}
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleShowPassword(1);
              }}
            >
              <span className="material-symbols-outlined position-absolute top-0 end-0 text-gray-03 mt-md-10 me-4">
                {showPasswordList[1] ? "visibility" : "visibility_off"}
              </span>
            </a>
          </div>
          <div className="mt-2 mt-md-4 position-relative">
            <FormInput
              register={register}
              errors={errors}
              id="checkPassword"
              labelText="確認新密碼"
              type={showPasswordList[2] ? "text" : "password"}
            />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleShowPassword(2);
              }}
            >
              <span className="material-symbols-outlined position-absolute top-0 end-0 text-gray-03 mt-md-10 me-4">
                {showPasswordList[2] ? "visibility" : "visibility_off"}
              </span>
            </a>
          </div>
          <div>
            <button
              type="submit"
              className={`btn btn-brand-03 rounded-2 mt-2 mt-md-4 ${
                !isEditingPassword && "d-none"
              }`}
              disabled={!isValid}
            >
              重設密碼
            </button>
            <button
              type="submit"
              className={`btn btn-outline-none rounded-2 mt-2 mt-md-4 ms-2 ${
                !isEditingPassword && "d-none"
              }`}
              onClick={handleEditPassword}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

ResetPassword.propTypes = {
  userData: PropTypes.object.isRequired,
  setLoadingState: PropTypes.func.isRequired,
};
