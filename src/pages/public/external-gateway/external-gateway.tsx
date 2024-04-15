import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fullPageLoader, updateAlertMessage, updateUser } from "../../../api-integration/commonSlice";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useExternalIntegrationMutation } from "../../../api-integration/public/public";

const ExternalGateway = () => {
  const params = useParams();
  const [queryParams, setQueryParams] = useState<any>({});
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [externalGatewayAPI, { data, isLoading, isSuccess, isError, error }] =
    useExternalIntegrationMutation();

  useEffect(() => {
    const refKey = localStorage.getItem('refKey');
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const queryParams: any = {};
    params.forEach((value, key) => {
      queryParams[key] = value;
    });
    if (refKey) {
      queryParams['refKey'] = refKey;
    }
    setQueryParams(queryParams)
    externalGatewayAPI(queryParams);
  }, []);

  useEffect(() => {
    const performAsyncOperation = async () => {
      try {
        if (isSuccess) {
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
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.removeItem('refKey');
            dispatch(updateUser(user))
            navigate('/app')
          }
          if (data) {
            // setresposneMessage(data?.message);
          }
        }
      } catch (error) {
        //console.error(error); // log the error
      } finally {
        dispatch(fullPageLoader(false)); 
      }
    };
  
    performAsyncOperation();
  
    if (isError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('message.login_error') }));
      dispatch(fullPageLoader(false));
      navigate('/login');
    }
  }, [isSuccess, isError]);

  return <></>
}
export default ExternalGateway