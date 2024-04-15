import React, {useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import Logo from '../../../assets/images/logo.png';
import Card from '../../../components/common/card/card';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import { useForgotPwdMutation } from '../../../api-integration/public/public';

interface formControls {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    dispatch(fullPageLoader(false));
    
    const { register, handleSubmit, formState: { errors } } = useForm<formControls>();
    const [forgotPwdError, setForgotPwdError] = useState<any>();
    const [resposneMessage, setresposneMessage] = useState<string>();
            
    const [ForgotPwdAPI, { data, isLoading, isSuccess, isError, error }] =
        useForgotPwdMutation();
      
    useEffect(() => {
        if (isSuccess) {
            if (data) {
                setresposneMessage(data?.message);
                dispatch(updateAlertMessage({ status: 'success', message: data?.message }));
                //navigate('/login');
            }
            dispatch(fullPageLoader(false));
        }
        if (isError) {
            setForgotPwdError(error);
            dispatch(fullPageLoader(false));
        }
    }, [isSuccess, isError]);

    const onReset = async (data: formControls) => {
        dispatch(fullPageLoader(true));
        ForgotPwdAPI(data)
    }

    return (
        <>
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-xl-5 col-lg-5 col-md-8">
                    <div className='text-center'>
                        <h2 className="bc-line-before d-inline-block mb-4">{t('forgot_pwd.title')}</h2>
                    </div>
                    <Card help={true} like={true} share={true} Feedback={true} title={t('forgot_pwd.title')} id="forgotPassword_resetPassword" helpTitle={t('forgot_pwd.help.title')} helpContent={t('forgot_pwd.help.content')}>
                        <div className='text-center mb-5'>
                            <img src={Logo} width="200" alt="BlueCallom" />
                        </div>
                        <div className="help-block text-danger mb-3 text-center">
                        {forgotPwdError &&
                            forgotPwdError?.error && (forgotPwdError?.status == 'FETCH_ERROR' || forgotPwdError?.status == 'PARSING_ERROR' ? <> {t('message.common_error')} </> : <>{forgotPwdError?.error}</>)
                        }
                        {
                            resposneMessage && <>{resposneMessage}</>
                        }
                        </div>

                        <form onSubmit={handleSubmit(onReset)}>
                            <div className='mb-4'>
                                <label htmlFor="email">Email:</label>
                                <input type="email" className={`form-control form-control-lg ${errors?.email ? 'is-invalid' : ''}`} placeholder={t('forgot_pwd.form_field.email.placeholder')} {...register('email', {
                                    required: true, 
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: t('forgot_pwd.form_field.email.validation_message.invalid')
                                    },
                                })} />
                                <div className="invalid-feedback">
                                    {errors.email && errors.email.type === 'required' && t('forgot_pwd.form_field.email.validation_message.required')}
                                    {errors.email && errors.email.type === 'pattern' && t('forgot_pwd.form_field.email.validation_message.invalid_format')}
                                </div>
                            </div>
                            <div className="text-center">
                                <TooltipComponent title={t('forgot_pwd.btn.reset.tooltip')} >
                                    <button type="submit" name="submitbutton" className={`btn btn-primary btn-md rounded-pill px-4 ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>{t('forgot_pwd.btn.reset.label')}</button>
                                </TooltipComponent>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
        </>
    );
};

export default ForgotPassword;