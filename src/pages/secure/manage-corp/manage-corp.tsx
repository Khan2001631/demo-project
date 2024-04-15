import React, {  useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import UserCard from "../../../components/common/user-card/user-card";
import Statistics from "../../../components/common/statistics/statistics";
import { useDispatch, useSelector } from 'react-redux';
import ManageCorpDashboard from '../../../components/secure/manage-corp-dashboard/manage-corp-dashboard';





const ManageCorp: React.FC = () => {

    

    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                    <UserCard />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <ManageCorpDashboard id="teamManagement_OurTeam" accountType="corporate" title="Our Team" helpTitle="Our Team" helpContent="Our Team" />
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                    <Statistics id="teamManagement_Analytics" cardHeightClass={'h-100'} statsType="user"/>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                    
                </div>
                <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12">
                    
                </div>
            </div>
        </div>
        
    );
};

export default ManageCorp;