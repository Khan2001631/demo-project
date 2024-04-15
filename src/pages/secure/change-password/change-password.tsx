import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import Card from "../../../components/common/card/card";
import UserCard from "../../../components/common/user-card/user-card";
import { useChangePasswordMutation } from "../../../api-integration/secure/secure";
import {fullPageLoader, updateAlertMessage} from "../../../api-integration/commonSlice";
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import { useNavigate } from "react-router-dom";

interface FormControls {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordComponent: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    dispatch(fullPageLoader(false));
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {register, handleSubmit, getValues,setError,formState: { errors },} = useForm<FormControls>({defaultValues: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
    });

    const [updatePwdError, setUpdatePwdError] = useState<any>();
    const [resposneMessage, setresposneMessage] = useState<string>();
  

    const [UpdatePwdAPI, { data, isLoading, isSuccess, isError, error }] =
        useChangePasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      // If the current password is not matching,then the if condition will be executed.
      // if(data.success === false) // Could use this as well.
      if(data?.message === "Sorry, your current password is incorrect, the password was not updated.")
      {
        //console.log("Failed");
        dispatch(fullPageLoader(false));
        setError("currentPassword",{
          message: "Current password is not correct. Please provide the correct password",
        })
      }
      else if (data) {
        setresposneMessage(data?.message);
        dispatch(
          updateAlertMessage({ status: "success", message: data?.message })
        );
        navigate("/login");
      }
      dispatch(fullPageLoader(false));
    }
    if (isError) {
      //console.log("Failed");
      setUpdatePwdError(error);
      dispatch(fullPageLoader(false));
    }
  }, [isSuccess, isError]);

  const onUpdate = async (data: FormControls) => {
    dispatch(fullPageLoader(true));
    UpdatePwdAPI(data);
  };


    return (
        <div className="container">
            <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-3">
                    <div className="mb-3">
                        <UserCard />
                    </div>
                </div>
                <div className="col-xl-9 col-lg-9 col-md-12 mb-3">
                <Card
                    id="changePassword_updatePassword"
                    help={true}
                    like={true}
                    share={true}
                    Feedback={true}
                    logo={true}
                    titleType={1}
                    home={true}
                    settings={true}
                    title={t("update_pwd.title")}
                    helpTitle={t("update_pwd.help.title")}
                    helpContent={t("update_pwd.help.content")}
                    cardHeightClass='h-100'
                >
                    <div className="help-block text-danger mb-3 text-center">
                        {updatePwdError &&updatePwdError?.error &&(updatePwdError?.status === "FETCH_ERROR" ||updatePwdError?.status === "PARSING_ERROR" ? 
                        (<> {t("message.common_error")} </>
                        ) : (
                        <>{updatePwdError?.error}</>
                        ))}
                        {resposneMessage && <>{resposneMessage}</>}
                    </div>
                    <form onSubmit={handleSubmit(onUpdate)}>
                        <div className="row mb-3">
                            <div className="col-lg-3">
                                <label htmlFor="currentPassword">
                                    {t("update_pwd.form_field.currentPassword.label")}:
                                </label>
                            </div>
                            <div className="col-lg-8">
                                <input
                                    type="password"
                                    className={`form-control ${errors?.currentPassword ? "is-invalid" : ""}`}
                                    placeholder={t("update_pwd.form_field.currentPassword.placeholder")}
                                    {...register("currentPassword", {required: true})}
                                />
                                <div className="invalid-feedback">
                                    {errors.currentPassword && errors.currentPassword.type === "required" && t("update_pwd.form_field.currentPassword.validation_message.required")}
                                    {errors.currentPassword && (<div>{errors.currentPassword?.message}</div>)}
                                </div>  
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-lg-3">
                                <label htmlFor="newPassword">
                                    {t("update_pwd.form_field.newPassword.label")}
                                </label>
                            </div>
                            <div className="col-lg-8">
                                <input
                                    type="password"
                                    className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                                    placeholder={t("update_pwd.form_field.newPassword.placeholder")}
                                    {...register("newPassword", {required: true,
                                        pattern: {
                                            value:/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?`\-=[\]\\;',./]).{8,50}$/,
                                            message: t("update_pwd.form_field.newPassword.validation_message.invalid"),
                                        },
                                    })}
                                />
                                <div className="invalid-feedback">
                                    {errors.newPassword && errors.newPassword.type === "required" &&t("update_pwd.form_field.newPassword.validation_message.required")}
                                    {errors.newPassword && errors.newPassword.type === "pattern" && t("update_pwd.form_field.newPassword.validation_message.invalid")}
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-lg-3">
                            <label htmlFor="confirm_password">
                                {t("update_pwd.form_field.confirmPassword.label")}:
                            </label>
                            </div>
                            <div className="col-lg-8">
                                <input
                                    type="password"
                                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                    placeholder={t("update_pwd.form_field.confirmPassword.placeholder")}
                                    {...register("confirmPassword", {required: true,
                                        validate: (value) => { const { newPassword } = getValues();
                                            return (newPassword === value || t("update_pwd.form_field.confirmPassword.validation_message.custom_message"));
                                    },})}
                                />
                                <div className="invalid-feedback">
                                    {errors.confirmPassword && errors.confirmPassword.type === "required" &&t("update_pwd.form_field.confirmPassword.validation_message.required")}
                                    {errors.confirmPassword && errors.confirmPassword.type === "validate" && (<div> Passwords should match</div>)}
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <TooltipComponent title={t("update_pwd.btn.update.tooltip")} >
                                <button type="submit" name="submitbutton" className={`btn btn-primary btn-md rounded-pill px-4`} disabled={isLoading} >
                                    {t("update_pwd.btn.update.label")}
                                </button>
                            </TooltipComponent>
                        </div>
                    </form>
                </Card>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordComponent;