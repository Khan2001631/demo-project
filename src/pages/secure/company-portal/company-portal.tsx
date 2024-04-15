import React, { useEffect } from 'react';
import UserCard from "../../../components/common/user-card/user-card";
import MyApplications from "../../../components/common/my-applications/my-applications";
import Statistics from "../../../components/common/statistics/statistics";
import PromptLibrary from "../../../components/common/prompt-library/prompt-library";
import { fullPageLoader } from "../../../api-integration/commonSlice";
import { useDispatch } from 'react-redux';

interface CompanyPortalProps {
    // Add any props you need for the CompanyPortal component
}

const CompanyPortal: React.FC<CompanyPortalProps> = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fullPageLoader(false));
    }, [dispatch]);

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 mb-3">
                        <div className="mb-3">
                            <UserCard />
                        </div>
                        <MyApplications accountType="corp" id="companyPortal_MyApplication"/>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-3">    
                        <PromptLibrary id="companyPortal_PromptLibrary" libraryType="org" />
                    </div>
                    <div className="col-xl-3 col-lg-6 col-md-12 col-sm-12 mb-3">
                        <Statistics id="companyPortal_Analytics" statsType="corp" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyPortal;