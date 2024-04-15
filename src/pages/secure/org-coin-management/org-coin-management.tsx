import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import {  useLocation } from "react-router-dom";
import { fullPageLoader, updateUser, updateAlertMessage } from "../../../api-integration/commonSlice";
import UserCard from "../../../components/common/user-card/user-card";
import AccountingDashboard from '../../../components/secure/accounting-dashboard/accounting-dashboard';
import Statistics from "../../../components/common/statistics/statistics";
import CallomCoinPurchase from '../../../components/secure/cc-purchase/cc-purchase';
import Transactions from '../../../components/secure/transactions/transactions';
import {useCheckCCBalanceMutation} from '../../../api-integration/secure/secure';
import { useTranslation } from 'react-i18next';

interface OrgCoinManagementProps {
    // Define the props for the component here
}

const OrgCoinManagement: React.FC<OrgCoinManagementProps> = (props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    useEffect(() => {
        dispatch(fullPageLoader(false));
    }, [dispatch]);
    const [checkCCBalanceAPI, { data: userCCBalanceData, isLoading: isUserCCBalanceLoading, isSuccess: isUserCCBalanceSuccess, isError: isUserCCBalanceError, error: userCCBalanceError }]= 
    useCheckCCBalanceMutation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const URlMessage = queryParams.get("msg");

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
            checkCCBalanceAPI({ userId: user?.userId, accId: user?.accId, accountType: 'corp' });
        }
    }, [URlMessage]);

    useEffect(() => {
        if (isUserCCBalanceSuccess) {
            let user = JSON.parse(localStorage.getItem('user') as string);
            user.totalCCPoints = userCCBalanceData?.totalCCPoints;
            dispatch(fullPageLoader(false));
            dispatch(updateUser(user));
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [isUserCCBalanceSuccess, isUserCCBalanceError]);

    return (
        <>
            <div className="container">
                <div className='row mb-3'>
                    <div className='col-xl-3 col-lg-3 col-md-3 col-sm-12'>
                        <UserCard />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <AccountingDashboard 
                        id="organizationCoinManagement_AccountingDashboard" 
                        accountType="corp"
                        title={t('coin_management.title')} 
                        helpTitle={t('coin_management.help.title')} 
                        helpContent={t('coin_management.help.content')}
                        />
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                        <Statistics id="organizationCoinManagement_Analytics" cardHeightClass={'h-100'} statsType="corp" />
                    </div>
                </div>
                <div className="row">
                    <div className='col-xl-3 col-lg-3 col-md-3 col-sm-12'>
                        <CallomCoinPurchase id='organizationCoinManagement_CallomCoinPurchase' accountType='corp'/>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                        <Transactions id='organizationCoinManagement_Transactions' accountType='corp'/>

                    </div>
                </div>
            </div>
        </>
    );
};

export default OrgCoinManagement;