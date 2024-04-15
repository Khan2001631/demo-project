import Card from "../card/card";
import NoPicture from '../../../assets/images/nopicture.jpg';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { fullPageLoader, updateAlertMessage, updateUser } from "../../../api-integration/commonSlice";
import { useLogoutMutation, useGenerateReferralIdMutation } from "../../../api-integration/secure/secure";
import { useEffect, useState } from "react";
import { FormatDate, clearCookies } from "../../../util/util";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Copy from '../../../assets/icons/copy.svg';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import HelpModal from "../help-modal/help-modal";


const UserCard= () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const generateReferralKeyModalId = "generateReferralKeyModal";
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const { user } = useSelector((state: any) => state.commonSlice);
  
 
  const [localRefKey, setLocalRefKey] = useState('');
  const [localStorageUser, setLocalStorageUser] = useState(JSON.parse(localStorage.getItem('user') as string));
  
  const dispatch = useDispatch();
  const [logoutAPI, { data: loggoutOut, isLoading, isSuccess, isError, error: logoutError }] =
    useLogoutMutation();
  const [generateRefKeyAPI, { data: refKeyData, isLoading:isKeyLoading, isSuccess: isKeySuccess, isError: isKeyError, error: KeyError }] =
    useGenerateReferralIdMutation();
    

  const logout = () => {
    dispatch(fullPageLoader(true));
    logoutAPI({});
  };

  const login = () => {
    sessionStorage.setItem('page', location?.pathname)
    navigate('/login');
  }
  function generateReferralPath(refKey: string): string {
    const { protocol, host } = window.location;
    return `${protocol}//${host}/referral/${refKey}`;
  }
  useEffect(() => {
    const userRefKey = user?.referralId; 
    const referralPath = generateReferralPath(userRefKey);
    setLocalRefKey(referralPath || '');
    setLocalStorageUser(JSON.parse(localStorage.getItem('user') as string));
  }, [user]);

  const contentCopyURL = () => {
    navigator.clipboard.writeText(localRefKey || '')
    dispatch(updateAlertMessage({ status: 'success', message: t('message.copied_msg') }));
  }
  const handleGenerateReferralKey = () => {
    dispatch(fullPageLoader(true));
    generateRefKeyAPI({});
  }
  
  useEffect(() => {
    if(isKeySuccess){
      dispatch(fullPageLoader(false));
      dispatch(updateAlertMessage({ status: 'success', message: refKeyData.message }));
      if (refKeyData?.refId) {
        let user = JSON.parse(localStorage.getItem('user') as string);
        user.referralId = refKeyData?.refId;
        user.showRefKey = false;
        dispatch(updateUser(user));
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  }, [isKeySuccess, isKeyError]);

  useEffect(() => {
    if (loggoutOut) {
      dispatch(fullPageLoader(false));
      localStorage.clear();
      dispatch(updateAlertMessage({ status: 'success', message: t('message.logout_success') }));
      clearCookies('accessToken')
      localStorage.removeItem('user');
      navigate('/login');
    }
    if (logoutError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('message.logout_error') }));
      dispatch(fullPageLoader(false));
    }
  }, [loggoutOut, logoutError]);
  return (
    <>
    <Card logo={true} titleType={1} share={true} settings={true} settingsClicked={() => navigate(`/app/userProfileEdit`)} homeDisabled={location?.pathname.includes('home')} settingsDisabled={location?.pathname.includes('userProfileEdit')} help={true} Feedback={true} logout={isLoggedIn ? true : false} home={true} onLogout={logout} title={t('card.user_profile.title')} id="user_profile" helpTitle={t('card.user_profile.help.title')} helpContent={t('card.user_profile.help.content')}>
      <div className="d-flex justify-content-between">
        <div>
          <h5 className="card-title">
            {isLoggedIn && user?.firstName && user?.lastName ?
                <>
                  <div className="cursor-pointer" onClick={() => navigate(`/app/userProfileEdit`)}>
                    {user?.firstName ? user?.firstName : ''}
                    <br />
                    {user?.lastName ? user?.lastName : ''}
                  </div>
                </>
                : t('text.welcome_user.label')
            }
          </h5>
        </div>
        <div>
          <img src={isLoggedIn && user && user.picPath ? user?.picPath : NoPicture} className="blc_image_lg cursor-pointer rounded rounded-circle image-fluid" onClick={() => navigate(`/app/userProfileEdit`)} />
        </div>
      </div>
      {
        (!isLoggedIn) && 
        <div className="d-inline-block">
          <TooltipComponent title={t('buttons.login.tooltip')} >
            <button className="btn btn-primary btn-md rounded-pill px-3" onClick={login}>{t('buttons.login.label')}</button>
          </TooltipComponent>
          </div>
      }
      {isLoggedIn && user?.usrCreatedDate &&
        <div className="card-text">
          {t('text.prompt_author.label')}<br />
          <h3>
            <NavLink to={`/app/accountDashboard`} className="text-decoration-none">
              <TooltipComponent title={t('text.cc.tooltip')} > 
                {t('text.cc.label')} {user?.totalCCPoints ? new Intl.NumberFormat('en-US').format(user?.totalCCPoints) : ''}
              </TooltipComponent>
            </NavLink>
          </h3>
          {user?.referralId ?
            <div>
              {t('text.ref_id.label')}:<br />
              <div className="d-flex mb-2">
                <TooltipComponent title={t('text.ref_id.tooltip')} > 
                  <h4>{user?.referralId}</h4>
                </TooltipComponent>
                <TooltipComponent title={t('userProfile.form_field.referal_key.icon.copy.tooltip')} >
                  <img src={Copy} className='ps-2 h-1-5 cursor-pointer align-baseline' onClick={contentCopyURL} /><br />
                </TooltipComponent>
              </div>
            </div>
          : 
            <div className="mb-2">
              <TooltipComponent title={t('userProfile.form_field.referal_key.btn.generate.tooltip')} >
                <button type="button" 
                  className="btn btn-primary btn-md rounded-pill px-3" 
                  data-bs-toggle="modal" 
                  data-bs-target={`#${generateReferralKeyModalId}`}
                >
                  {t('userProfile.form_field.referal_key.btn.generate.label')}
                </button>
              </TooltipComponent>
            </div>
          }
          {t('text.bluecallomer_since.label')} {new Date(user?.usrCreatedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}<br />
        </div>
      }
    </Card>
    <HelpModal 
      title={t('userProfile.form_field.referal_key.modal.title')} 
      content={t('userProfile.form_field.referal_key.modal.content')} 
      id={generateReferralKeyModalId}
      onGenerateKey={handleGenerateReferralKey} 
    />
  </>
  )
}

export default UserCard;