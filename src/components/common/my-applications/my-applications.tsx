import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import Card from "../card/card";
import { fullPageLoader } from "../../../api-integration/commonSlice";
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import DateTimeComponent from '../date-time/date-time';
import { use } from 'i18next';

interface MyApplicationsProps {
    accountType: string;
    id: string;
}
const MyApplications: React.FC<MyApplicationsProps> = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state: any) => state.commonSlice);
  

  useEffect(() => {
    dispatch(fullPageLoader(false));
  }, []);

  return (
    <Card id={props?.id} titleType={1} cardPadding='p-2' title={t('card.My_Applications.title')} help={true} Feedback={true} logo={true} cardHeightClass={''} helpTitle={t('card.My_Applications.help.title')} helpContent={t('card.My_Applications.help.content')}>
        <div className="row g-1 d-flex justify-content-evenly my-apps">
            <div className="col-auto">
                <NavLink to="/app/askgpt" className="text-decoration-none">
                    <TooltipComponent title={t('links.gptblue_io.tooltip')} >
                        <div className="app bg-primary text-light d-flex align-items-center">
                            {t('links.gptblue_io.label')}
                        </div>
                    </TooltipComponent>
                </NavLink>
            </div>
            <div className="col-auto">
                <TooltipComponent title={t('links.blue_exchange.tooltip')} >
                    <div className="app bg-secondary text-light d-flex align-items-center disabled">
                        {t('links.blue_exchange.label')}
                    </div>
                </TooltipComponent>
            </div>
            <div className="col-auto">
                <NavLink to="/app/userProfileEdit" className="text-decoration-none">
                    <TooltipComponent title={t('links.my_settings.tooltip')} >
                        <div className="app bg-orange text-light d-flex align-items-center">
                            {t('links.my_settings.label')}
                        </div>
                    </TooltipComponent>
                </NavLink>
            </div>

            <div className="col-auto">
                <NavLink to="/app/prompts/create" className="text-decoration-none">
                    <TooltipComponent title={t('links.studio.tooltip')} >
                        <div className="app bg-danger text-light d-flex align-items-center">
                            {t('links.studio.label')}
                        </div>
                    </TooltipComponent>
                </NavLink>
            </div>
            <div className="col-auto">
                <a className="text-decoration-none" href={process.env.REACT_APP_PARTNER_URL} target="_blank">
                <TooltipComponent title={t('links.partner_portal.tooltip')} >
                    <div className="app bg-gray text-light d-flex align-items-center">
                        {t('links.partner_portal.label')}
                    </div>
                </TooltipComponent>
                </a>
            </div>
            
            <div className="col-auto">
                {user?.accountType == 'corp' && !location?.pathname.includes('companyPortal') ? 
                    <NavLink to="/app/companyPortal" className= "text-decoration-none">
                        <TooltipComponent title={t('company_portal.link.home.tooltip')}>
                            <div className= "app bg-teal text-light d-flex align-items-center">
                                {t('company_portal.link.home.label')}
                            </div>
                        </TooltipComponent>
                    </NavLink>
                :
                <TooltipComponent title={t('company_portal.link.home.tooltip')}>
                    <div className="app bg-teal text-light d-flex align-items-center opacity-50 ">
                        {t('company_portal.link.home.label')}
                    </div>
                </TooltipComponent>
                }
                
            </div>
        </div>

        {props?.accountType === 'corp' &&  
            <div className="mt-4 row g-1 d-flex justify-content-evenly my-apps">
                <div className="col-auto">
                    <NavLink to="/app/manageOrg" className="text-decoration-none">
                        <TooltipComponent title={t('organization_management.link.home.tooltip')} >
                            <div className="app bg-cyan text-light d-flex align-items-center">
                                {t('organization_management.link.home.label')}
                            </div>
                        </TooltipComponent>
                    </NavLink>
                </div>
                <div className="col-auto">
                    <NavLink to="/app/manageTeam" className="text-decoration-none">
                        <TooltipComponent title={t('team_management.link.home.tooltip')} >
                            <div className="app bg-dark text-light d-flex align-items-center" >
                                {t('team_management.link.home.label')}
                            </div>
                        </TooltipComponent>
                    </NavLink>
                </div>
                <div className="col-auto">
                    <NavLink to="/app/prompts/approval" className="text-decoration-none">
                        <TooltipComponent title={t('prompt_management.link.home.tooltip')} >
                            <div className="app bg-danger text-light d-flex align-items-center">
                                {t('prompt_management.link.home.label')}
                            </div>
                        </TooltipComponent>
                    </NavLink>
                </div>
                <div className="col-auto">
                    <NavLink to="/app/orgCoinManagement" className="text-decoration-none">
                        <TooltipComponent title={t('coin_management.link.home.tooltip')} >
                            <div className="app bg-light text-dark d-flex align-items-center">
                                {t('coin_management.link.home.label')}
                            </div>
                        </TooltipComponent>
                    </NavLink>
                </div>
                <div className="col-auto">
                    {/* <NavLink to="/app/companyPortal" className="text-decoration-none"> */}
                    <TooltipComponent title={t('library_management.link.home.tooltip')} >
                        <div className="app bg-cyan text-light d-flex align-items-center">
                            {t('library_management.link.home.label')}
                        </div>
                    </TooltipComponent>
                    {/* </NavLink> */}
                </div>
                <div className="col-auto">
                    {/* <NavLink to="/app/companyPortal" className="text-decoration-none"> */}
                    <TooltipComponent title={t('system_management.link.home.tooltip')} >
                        <div className="app bg-gray-500 text-light d-flex align-items-center">
                            {t('system_management.link.home.label')}
                        </div>
                    </TooltipComponent>
                    {/* </NavLink> */}
                </div>
            </div>
        }
        <div className="my-4 text-center">
            <TooltipComponent title={t('prompt.home.time_tooltip')} >
                <button type="button" className="btn btn-primary btn-md rounded-pill px-4">
                    < DateTimeComponent />
                </button>
            </TooltipComponent>
        </div>
    </Card>
  );
}

export default MyApplications;