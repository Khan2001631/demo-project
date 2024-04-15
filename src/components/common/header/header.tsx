import { useTranslation } from "react-i18next";

import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { fullPageLoader, updateAlertMessage, updateTileInfo } from "../../../api-integration/commonSlice";
import { useLogoutMutation } from "../../../api-integration/secure/secure";
import { useEffect } from "react";
import { clearCookies, getPageByURL } from "../../../util/util";
import Logo from '../../../assets/images/logo.png';
import { useGetPageTileInfoMutation } from "../../../api-integration/public/public";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutAPI, { data: loggoutOut, isLoading, isSuccess, isError, error: logoutError }] =
    useLogoutMutation();

  const [pageTileInfoAPI, { data: pageTileInfo, isLoading: isPageTileInfoLoading, isSuccess: isPageTileInfoSuccess, isError: isPageTileInfoError, error: pageTileInfoError }] =
    useGetPageTileInfoMutation();

  const logout = () => {
    dispatch(fullPageLoader(true));
    logoutAPI({});
  };

  useEffect(() => {
    if (location.pathname) {
      if (getPageByURL(location.pathname)) {
        dispatch(fullPageLoader(true));
        pageTileInfoAPI({
          "Page": getPageByURL(location.pathname)
        });
      }
    }
  }, [location])

  useEffect(() => {
    if (isPageTileInfoSuccess) {
      if (pageTileInfo?.statusCode == 200 && pageTileInfo?.success == true) {
        dispatch(fullPageLoader(false));
        dispatch(updateTileInfo(pageTileInfo?.TileInfo))
      } else {
        dispatch(updateAlertMessage({ status: 'error', message: pageTileInfo?.message }));
      }
    }
    if (pageTileInfoError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('message.error_rating_card') }));
    }
  }, [isPageTileInfoSuccess, pageTileInfoError]);

  useEffect(() => {
    if (loggoutOut) {
      dispatch(fullPageLoader(false));
      localStorage.clear();
      dispatch(updateAlertMessage({ status: 'success', message: t('message.logout_success') }));
      clearCookies('accessToken')
      navigate('/login');
    }
    if (logoutError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('message.logout_error') }));
      dispatch(fullPageLoader(false));
    }
  }, [loggoutOut, loggoutOut])

  return (
    <div className="header p-5">
      {/* <NavLink to="/"> */}
      <img src={Logo} className="logo" />
      {/* </NavLink> */}
    </div>
  )
}

export default Header;