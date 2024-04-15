import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Card from '../../../components/common/card/card';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import { fullPageLoader } from '../../../api-integration/commonSlice';
import { useGetUserProfileMutation } from '../../../api-integration/secure/secure';


interface ManageCorpDashboardProps {
    id: string;
    accountType: string;
    title: string;
    helpTitle: string;
    helpContent: string;
}

const ManageCorpDashboard: React.FC<ManageCorpDashboardProps> = (props) => {
    const { user } = useSelector((state: any) => state.commonSlice);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    
    const [userCompanyName, setUserCompanyName] = React.useState<string>('');
    const [userDepartment, setUserDepartment] = React.useState<string>('');
    const [getUserDetailsAPI, { data: userInfo, isLoading: isUserDetailLoding, isSuccess: isUserDetailSuccess, isError: isUserDetailError, error: userDetailError  }] =
        useGetUserProfileMutation();
        
    useEffect(() => {
        if (user && user?.userId) {
            dispatch(fullPageLoader(true));
            getUserDetailsAPI({ userId: user?.userId });
        }
    }, []);

    useEffect(() => {
        if ( isUserDetailSuccess || isUserDetailError || userDetailError) {
            dispatch(fullPageLoader(false));
        }
        if (userInfo?.user){
            setUserCompanyName(userInfo?.user?.companyData?.companyname);
            setUserDepartment(userInfo?.user?.companyData?.departmentname);
        }
    }, [ isUserDetailSuccess, userInfo, isUserDetailError, userDetailError]);

    return (
        <>
        <Card id={props?.id}  like={false} share={false} help={true} helpTitle={props?.helpTitle} helpContent={props?.helpContent} titleType={1} title={props?.title} cardHeightClass='h-100' Feedback={true} logo={true}>
            <div className="row">
                <div className="col-5">
                    {t('text.company_name.label')} : 
                </div>
                <div className="col-7">
                    {userCompanyName}
                </div>
                <div className="col-5">
                    {t('text.department_name.label')} : 
                </div>
                <div className="col-7">
                    {userDepartment}
                </div>
            </div>
            {/* <div className="mt-3">
                <TooltipComponent title={t('buttons.add_user.tooltip')} >
                    <button type="button" 
                        className="btn btn-primary btn-md rounded-pill px-4"
                        data-bs-toggle="modal" 
                        data-bs-target={`#${manageUserModalId}`}
                        onClick={() => handleAddUserClick(user)}
                    >
                        {t('buttons.add_user.label')}
                    </button>
                </TooltipComponent>
            </div> */}
        </Card>
        </>
    );
};

export default ManageCorpDashboard;