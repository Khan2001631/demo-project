import './App.scss';
import Header from './components/common/header/header';
import Footer from './components/common/footer/footer';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import React, { Suspense, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import AuthGuard from './guards/auth.guard';
import NonAuthGuard from './guards/non-auth.guard';
import AskGPT from './pages/common/askgpt/askgpt';
import { useTranslation } from 'react-i18next';
import { useExtendSessionMutation } from './api-integration/public/common';
import { fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateLogin, updateLogout, updateUser } from './api-integration/commonSlice';
import { clearCookies } from './util/util';
import { useGetUserProfileMutation } from './api-integration/secure/secure';
import { Referral } from './components/common/referral-mapping/referral-mapping';

const Login = React.lazy(() => import('./pages/public/login/login'));
const Forgotpwd = React.lazy(() => import('./pages/public/login/forgot-pwd'));
const ExternalGateway = React.lazy(() => import('./pages/public/external-gateway/external-gateway'));

const Secure = React.lazy(() => import('./pages/secure/secure'));
const PromptsListing = React.lazy(() => import("./pages/common/prompts-listing/prompts-listing"));
const Alert = React.lazy(() => import('./components/common/alert/alert'));

const App = () => {
  const fullPageLoaderSelector = useSelector((state: any) => state.commonSlice.fullPageLoader);
  const { isSessionExpired, reloadPageAfterSessionExpired, isRefreshTokenExpired } = useSelector((state: any) => state.commonSlice);
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string);
  //const [, forceUpdate] = useReducer(x => x + 1, 0);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   // Retrieve the isLoggedIn state from localStorage on component mount
  //   const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  //   isLoggedIn ? dispatch(updateLogin()) : dispatch(updateLogout());
  // }, [dispatch]);

  // useEffect(() => {
  //   //console.log('isLoggedIn in App.Tsx', isLoggedIn);
  //   // Persist the isLoggedIn state in localStorage whenever it changes
  //   localStorage.setItem('isLoggedIn', String(isLoggedIn));
  // }, [isLoggedIn]);



  useEffect(() => {
    //const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string);
    isLoggedIn ? dispatch(updateLogin()) : dispatch(updateLogout());
  }, []);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [extendSesionAPI, { data: extendSessionResposne, isLoading: isExtensingSession, isSuccess: isSessionExtended, isError: isErrorWhileExtendingSession, error: errorWhileExtendingSession }] =
    useExtendSessionMutation();

  const [getProfileAPI, { data: profileData, isLoading: isProfileDataLoading, isSuccess: isGetProfileSuccess, isError: isProfileDataError, error: errorProfileData }] =
    useGetUserProfileMutation();

  const clearAndLogout = () => {
    localStorage.clear();
    clearCookies('accessToken');
    dispatch(updateIsSessionExpired(false));
    dispatch(updateAlertMessage({ status: 'error', message: t('message.session_expired') }));
    localStorage.clear();
    navigate('/login');
  }

  const callProfileAPI = () => {
    dispatch(fullPageLoader(true));
    getProfileAPI({accountType: 'user'});
  }

  useEffect(() => {
    // i18n.changeLanguage('fr');
    if (extendSessionResposne || isSessionExtended || isErrorWhileExtendingSession) {
      dispatch(fullPageLoader(false));
    }
    if (isErrorWhileExtendingSession) {
      clearAndLogout();
    }
  }, [extendSessionResposne, isSessionExtended, isErrorWhileExtendingSession]);

  useEffect(() => {
    if (isSessionExpired == true) {
      dispatch(fullPageLoader(true));
      extendSesionAPI({
        "refreshToken": localStorage.getItem('refreshToken')
      });
    }
  }, [isSessionExpired])

  useEffect(() => {
    if (isRefreshTokenExpired) {
      clearAndLogout();
    }
  }, [isRefreshTokenExpired])

  useEffect(() => {
    if (isSessionExtended) {
      if (extendSessionResposne?.success == true) {
        dispatch(updateIsSessionExpired(false));
        // dispatch(updateAlertMessage({ status: 'success', message: t('message.session_extended') }));
        if (reloadPageAfterSessionExpired) window.location.reload();
        // setRefresh({});
        // forceUpdate();
      } else {
        clearAndLogout();
      }
    }
  }, [isSessionExtended]);

  useEffect(() => {
    if (isGetProfileSuccess) {
      if (profileData.success == true && profileData.statusCode == 200) {
        localStorage.setItem('user', JSON.stringify(profileData?.user));
        dispatch(updateUser(profileData?.user));
        dispatch(fullPageLoader(false));
      } else {
        clearAndLogout();
        dispatch(updateAlertMessage({ status: 'success', message: profileData?.message }));
      }
    }
  }, [isGetProfileSuccess]);

  useEffect(() => {
    
    if (isLoggedIn) {
      const cachedData = localStorage.getItem('user');
      if (cachedData == null) callProfileAPI();
    }
  }, [isLoggedIn])


  useEffect(() => {
    const user = localStorage.getItem('user');
    const referrlKey = localStorage.getItem('refKey');
    if (user) {
      dispatch(updateUser(JSON.parse(user)));
    } 
    else if(!referrlKey) {
      localStorage.clear();
    }
  }, []);

  const location = useLocation();
  const imageUrl = `${window.location.protocol}//${window.location.host}/bluePrompt.svg`;
  const fullUrl = `${window.location.protocol}//${window.location.host}${location.pathname}`;

  return (
    <>
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content="bluecallom.ai" />
        <meta property="og:description" content="A text that reflects the function of that page.\n Where Generative-AI is at the forefront of the industry." />
        <meta property="og:image" content={imageUrl} />
        
        <meta property="twitter:card" content="summary" />
        <meta property="twitter:url" content={fullUrl} />
        <meta property="twitter:title" content="bluecallom.ai" />
        <meta property="twitter:description" content="A text that reflects the function of that page.\n Where Generative-AI is at the forefront of the industry." />
        <meta property="twitter:image" content={imageUrl} />
      
      <Header />
      <Suspense fallback={<div>{t('message.loading')}</div>}>
        <Routes>
          <Route path="/login" element={<NonAuthGuard><Login /></NonAuthGuard>} ></Route>
          <Route path="/forgotpwd" element={<NonAuthGuard><Forgotpwd /></NonAuthGuard>} ></Route>
          <Route path="/external/:id" element={<NonAuthGuard><ExternalGateway /></NonAuthGuard>} ></Route>
          <Route path="/home" element={<PromptsListing />} ></Route>
          <Route path="/app/askgpt/:id" element={<AskGPT />}></Route>
          <Route path="/app/askgpt" element={<AskGPT />}></Route>
          <Route path="/app/*" element={<AuthGuard><Secure /></AuthGuard>} ></Route>
          <Route path="/referral/:id" element={<NonAuthGuard><Referral /></NonAuthGuard>} />
          <Route path="*" element={<Navigate to="/home" replace />} ></Route>
        </Routes>
      </Suspense>
      <Footer />
      {fullPageLoaderSelector && <div className='fullpage-loader' ><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading…</span></div></div>}
      <Alert />
    </>
  );
}

export default App;
