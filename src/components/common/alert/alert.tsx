import { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { updateAlertMessage } from "../../../api-integration/commonSlice";
import { useTranslation } from "react-i18next";

const Alert = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const timeoutIdRef = useRef<any>(null);

  const alertMessage = useSelector((state: any) => state.commonSlice.alertMessage);
  const timeoutValue = alertMessage.timeout || Number(process.env.REACT_APP_ALERT_TIMEOUT);
  const closeAlert = () => {
    dispatch(updateAlertMessage({ status: '', message: '' }));
  }

  useEffect(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = setTimeout(closeAlert, timeoutValue);
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [alertMessage, timeoutValue]);

  return (
    <div className="alert-container">
      {
        alertMessage.status == 'success' &&
        <div className="alert alert-primary alert-dismissible fade show" role="alert"> {alertMessage?.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={closeAlert}></button>
        </div>
      }
      {
        alertMessage.status == 'error' &&
        <div className="alert alert-danger alert-dismissible fade show" role="alert"> {alertMessage?.message}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={closeAlert}></button>
        </div>
      }
    </div>
  )
}

export default Alert;