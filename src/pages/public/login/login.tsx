import React, { useCallback, useEffect, useState } from 'react';
import Logo from '../../../assets/images/logo.png';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../../../api-integration/public/public';
import { useNavigate } from 'react-router-dom';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import { useDispatch } from 'react-redux';
import { fullPageLoader, updateUser } from '../../../api-integration/commonSlice';
import { useTranslation } from 'react-i18next';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { toggleCaptchaBadge } from '../../../util/util';
import Card from '../../../components/common/card/card';


interface formControls {
  email: string;
  password: string;
}

const Login = () => {
  const { t } = useTranslation();
  
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { register, handleSubmit, formState: { errors } } = useForm<formControls>();
  const [loginError, setLoginError] = useState<any>();
  const [resposneMessage, setresposneMessage] = useState<string>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showRecaptcha, setShowRecaptcha] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const onLogin = async (data: formControls) => {
    dispatch(fullPageLoader(true));
    if (executeRecaptcha) {
      const token = await executeRecaptcha('login');
    }

    // Perform your login logic with the reCAPTCHA token on the client side
    LoginAPI(data)
  }

  const [LoginAPI, { data, isLoading, isSuccess, isError, error }] =
    useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(fullPageLoader(false));
      if (data?.user) { 
        localStorage.setItem('refreshToken', data?.user?.refreshToken);
        const user = {
          userEmail: data?.user?.userEmail,
          userId: data?.user?.userId,
          firstName: data?.user?.firstName,
          lastName: data?.user?.lastName,
          picPath: data?.user?.picPath,
          totalCCPoints: data?.user?.totalCCPoints,
          usrCreatedDate: data?.user?.usrCreatedDate,
          referralId: data?.user?.referralId,
          libraryType: 'personal',
          roleInOrg: data?.user?.roleInOrg,
          blcUsercount: data?.user?.blcUsercount,
          GPTBlueID: data?.user?.GPTBlueID,
          blcFlag: data?.user?.blcFlag,
          accId: data?.user?.accId,
          orgId: data?.user?.orgId,
          accountType: data?.user?.accountType,
          isNewUser: data?.user?.isNewUser,
          showWelcomeNote: data?.user?.isNewUser,
          isProfileComplete: data?.user?.isProfileComplete,
          promptExeAlert: data?.user?.promptExeAlert,
        }
        dispatch(updateUser(user))
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        const page = localStorage.getItem('page');
        if (page) {
          navigate(page)
        } else {
          navigate('/app');
        }
      }
      if (data) {
        setresposneMessage(data?.message);
      }
      
    }
    if (isError) {
      setLoginError(error);
      dispatch(fullPageLoader(false));
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    setTimeout(() => {
      toggleCaptchaBadge(true);
    }, 1000);
  }, [])

  return (
    <>

      <div className='login-page'>
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-xl-5 col-lg-5 col-md-8">
              <div className='text-center'>
                <h1 className="bc-line-before d-inline-block mb-4">{t('login.title')}</h1>
              </div>
              <Card help={true} like={true} share={true} Feedback={true} title={t('login.title')} id="user_login" helpTitle={t('login.help.title')} helpContent={t('login.help.content')}>
                <div className='text-center mb-5'>
                  <img src={Logo} width="200" alt="BlueCallom" />
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="help-block text-danger mb-3 text-center">
                      {loginError &&
                        loginError?.error && (loginError?.status == 'FETCH_ERROR' || loginError?.status == 'PARSING_ERROR' ? <> {t('message.common_error')} </> : <>{loginError?.error}</>)
                      }
                      {
                        resposneMessage && <>{resposneMessage}</>
                      }
                    </div>
                    <form name="login" id="loginFrm" onSubmit={handleSubmit(onLogin)} >
                      <div className="pb-4 text-center">
                        <TooltipComponent title={t('login.btn.login_linkedin.tooltip')} >
                            <a href={process.env.REACT_APP_LINKEDIN_URL} className={`btn btn-primary btn-md rounded-pill px-5`}>
                              {t('login.btn.login_linkedin.label')}
                            </a>
                        </TooltipComponent>
                      </div>
                      <h4 className='mt-2 text-center'>
                        <TooltipComponent title={t('login.link.corporate_login.tooltip')} >
                          <a href="#" onClick={(e) => {e.preventDefault(); setShowContent(!showContent)}} >{t('login.link.corporate_login.text')}</a>
                        </TooltipComponent>
                      </h4>
                      {showContent && (
                        <div>
                          <div className='mb-4'>
                            <input type="email" className={`form-control form-control-lg ${errors?.email ? 'is-invalid' : ''}`} placeholder={t('login.form_field.email.placeholder')} {...register('email', {
                              required: true, pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: t('login.form_field.email.validation_message.invalid')
                              }
                            })} />
                            <div className="invalid-feedback">
                              {errors.email && errors.email.type === 'required' && t('login.form_field.email.validation_message.required')}
                              {errors.email && errors.email.type === 'pattern' && t('login.form_field.email.validation_message.invalid_format')}
                            </div>
                          </div>
                          <div className='mb-4'>
                            <input type="password" className={`form-control  form-control-lg ${errors?.email ? 'is-invalid' : ''}`} placeholder={t('login.form_field.password.placeholder')} {...register('password', { required: true })} />
                            <div className="invalid-feedback">
                              {errors.password && errors.password.type === 'required' && t('login.form_field.password.validation_message.required')}
                            </div>
                          </div>
                          <div className="text-end">
                            <TooltipComponent title={t('login.link.forgot_password.tooltip')} >
                              <a href="/forgotpwd" className='h6 text-decoration-none'>
                                {t('login.link.forgot_password.text')}
                              </a>
                            </TooltipComponent>
                          </div>
                          <div className="text-center">
                            <TooltipComponent title={t('login.btn.login.tooltip')} >
                              <button type="submit" name="submitbutton" className={`btn btn-primary btn-md rounded-pill px-4 ${isLoading ? 'disabled' : ''}`} disabled={isLoading} >{t('login.btn.login.label')}</button>
                            </TooltipComponent>
                          </div>
                        </div>
                      )}
                      
                      <div id='reCaptchaContainer'></div>
                      
                      <div className='py-2'>
                        {/* <ReCAPTCHA sitekey={process.env.REACT_APP_RECAPTCHA_SITEKEY || ''} /> */}
                        {/* <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITEKEY || ''} /> */}
                      </div>
                      
                      {/* <div className="login-or mt-3 mb-3 text-center position-relative">or</div> */}

                      
                      <div className="h6 mt-5 text-center lh-1-5">
                        {t('login.text.by_continuing.content')} 
                        &nbsp;
                        <div className="d-inline-block">
                          <TooltipComponent title={t('login.link.terms_service.tooltip')}  >
                            <a href="https://bluecallom.com/terms/" target="_blank" className='text-info text-decoration-none'>
                              {t('login.link.terms_service.text')}
                            </a>
                          </TooltipComponent>
                        </div>
                        &nbsp;
                        {t('text.and')}
                        &nbsp; 
                        <div className="d-inline-block">
                          <TooltipComponent title={t('login.link.privacy_policy.tooltip')} >
                            <a href="https://bluecallom.com/privacy/" target="_blank" className='text-info text-decoration-none'>
                              {t('login.link.privacy_policy.text')}
                            </a>
                          </TooltipComponent>
                        </div>
                        <br />
                        <div className="d-inline-block">
                          <TooltipComponent title={t('login.link.sign_up.tooltip')}>
                            <a href="#" className='text-info text-decoration-none'>
                              {t('login.link.sign_up.text')}
                            </a>
                          </TooltipComponent>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;