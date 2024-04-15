import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import {  useLocation } from "react-router-dom";
import { fullPageLoader, updateUser, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from "../../../api-integration/commonSlice";
import AccountingDashboard from '../../../components/secure/accounting-dashboard/accounting-dashboard';
import UserCard from "../../../components/common/user-card/user-card";
import Statistics from "../../../components/common/statistics/statistics";
import Transactions from '../../../components/secure/transactions/transactions';
import CallomCoinPurchase from '../../../components/secure/cc-purchase/cc-purchase';
import {useCheckCCBalanceMutation} from '../../../api-integration/secure/secure';
import { useTranslation } from 'react-i18next';


const AccountDashboard = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const URlMessage = queryParams.get("msg");

    const [checkCCBalanceAPI, { data: userCCBalanceData, isLoading: isUserCCBalanceLoading, isSuccess: isUserCCBalanceSuccess, isError: isUserCCBalanceError, error: userCCBalanceError }]= 
        useCheckCCBalanceMutation();

    useEffect(() => {
        if (URlMessage) {
            dispatch(updateAlertMessage({ status: 'success', message: URlMessage }));
            // Remove message from URL
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete("msg");
            window.history.replaceState({}, '', newUrl);

            //Update CC points in local storage
            let user = JSON.parse(localStorage.getItem('user') as string);
            dispatch(fullPageLoader(true));
            checkCCBalanceAPI({ userId: user?.userId, accId: user?.accId, accountType: 'user' });
        }
    }, [URlMessage]);

    useEffect(() => {
        if (isUserCCBalanceSuccess) {
            dispatch(fullPageLoader(false));
            let user = JSON.parse(localStorage.getItem('user') as string);
            user.totalCCPoints = userCCBalanceData?.totalCCPoints;
            dispatch(updateUser(user));
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (isUserCCBalanceError) {
            dispatch(fullPageLoader(false));
        }
    }, [isUserCCBalanceSuccess, isUserCCBalanceError]);
    
    return (
        <>
            <div className="container">
                <div className="row d-flex mb-4">
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                        <UserCard />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <AccountingDashboard id="accountDashboard_AccountingDashboard" accountType="user" title={t('accountDashboard.title')} helpTitle={t('accountDashboard.help.title')} helpContent={t('accountDashboard.help.content')} />
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                        <Statistics id="accountDashboard_Analytics" cardHeightClass="h-100" statsType="prompt"/>
                    </div>
                </div>
                <div className="row d-flex">
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                        <CallomCoinPurchase id='accountDashboard_CallomCoinPurchase' accountType='user'/>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                        <Transactions id='accountDashboard_Transactions' accountType='user'/>
                    </div>
                </div>
            </div>
        </>
    );
}


export default AccountDashboard;


