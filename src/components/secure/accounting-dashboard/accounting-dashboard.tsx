import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Card from '../../../components/common/card/card';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import { useCheckCCBalanceMutation, useDiassociateAccountMutation } from '../../../api-integration/secure/secure';

import AssociateCompanyAccount from '../modals/associate-company';


interface AccountingDashboardProps {
    id: string;
    userDetails?: any;
    accountType: string;
    setReloadCheck?: any;
    title: string;
    helpTitle: string;
    helpContent: string;
}

const AccountingDashboard: React.FC<AccountingDashboardProps> = (props) => {
    const { user } = useSelector((state: any) => state.commonSlice);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [localConstCompanyName, setLocalConstCompanyName] = useState('');
    const [localConstCompanyWebsite, setLocalConstCompanyWebsite] = useState('');
    const [localAccAssociationCase, setLocalAccAssociationCase] = useState<number | undefined>(undefined);
    const [disassociateAccountAPI, { data: disassociateAccountData, isLoading: isDisassociateAccountLoading, isSuccess: isDisassociateAccountSuccess, isError: isDisassociateAccountError, error: disassociateAccountError }] =
    useDiassociateAccountMutation();

    const [checkCCBalanceAPI, { data: CCBalanceData, isLoading: isCCBalanceLoading, isSuccess: isCCBalanceSuccess, isError: isCCBalanceError, error: CCBalanceError }]= 
        useCheckCCBalanceMutation();
    
    useEffect(() => {
        if (props?.userDetails?.companyname) {
            setLocalConstCompanyName(props?.userDetails?.companyData?.companyname);
            setLocalConstCompanyWebsite(props?.userDetails?.companyData?.companyWebsite);
            setLocalAccAssociationCase(props?.userDetails?.accountAssociation);
        }else{
            setLocalConstCompanyName('');
            setLocalConstCompanyWebsite('');
            setLocalAccAssociationCase(1);
        }
    }, [props?.userDetails]);

    useEffect(() => {
        dispatch(fullPageLoader(true));
        checkCCBalanceAPI({ userId: user?.userId, accId: user?.accId, accountType: props.accountType });
    }, [user, props.accountType]);
    
    const onDisassociateCompany = () => {
        dispatch(fullPageLoader(true));
        disassociateAccountAPI({});
    };
    useEffect(() => {
        if (isDisassociateAccountSuccess || isDisassociateAccountError || disassociateAccountError) {
            dispatch(fullPageLoader(false));
        }
        if(isDisassociateAccountSuccess && disassociateAccountData?.success === true ){
            props.setReloadCheck(true);
            dispatch(updateAlertMessage({ status: 'success', message: disassociateAccountData?.message }));
        }
    }, [isDisassociateAccountSuccess, isDisassociateAccountError, disassociateAccountError]);

    useEffect(() => {
        if (isCCBalanceSuccess || isCCBalanceError || CCBalanceError) {
            dispatch(fullPageLoader(false));
        }   
    }, [isCCBalanceSuccess, isCCBalanceError, CCBalanceError]);
    
    const companyAssociationContent = () => {
        switch (props?.userDetails?.accountAssociation) {
            case '0':
            return (
                // website added but company does not exits,
                <div></div>
            );
            case '2':
            return (
                // website added but not connected
                <div>
                    {t('text.company_detail.not_connected')}&nbsp;
                    <span>
                        <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 ms-2" data-bs-toggle="modal" data-bs-target="#createCompanyAccountModal">
                            {t('buttons.click_here.label')}
                        </button>
                    </span>
                </div>
            );
            case '3':
            return (
                // website added but not accepted domain
                <div>
                    <span className='fw-bold'>
                        {localConstCompanyWebsite} &nbsp;
                    </span> 
                    <span dangerouslySetInnerHTML={{__html: t('text.company_detail.not_accepted_domain')}}></span>
                </div>
            );
            case '4':
            return (
                // bussiness email domain is not matching with company domain,
                <div>
                    <span dangerouslySetInnerHTML={{__html: t('text.company_detail.unmatched_email_company_domain')}}></span>
                </div>
            );
            case '5':
            return (
                // not connected with company 
                <div>
                    {t('text.company_detail.not_connected_company')} <span className='fw-bold'>{localConstCompanyName}</span>.&nbsp; 
                    {t('text.company_detail.want_connect')}
                    <span>
                        <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 ms-2" data-bs-toggle="modal" data-bs-target="#createCompanyAccountModal">
                            {t('buttons.click_here.label')}
                        </button>
                    </span> 
                </div>
            );
            
            case '20':
            return (
                // company association is on hold >> pending for verification
                <div>
                    <span dangerouslySetInnerHTML={{__html: t('text.company_detail.on_hold')}}></span>
                    <span>
                        <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 ms-2" data-bs-toggle="modal" data-bs-target="#createCompanyAccountModal">
                            {t('buttons.click_here.label')}
                        </button>
                    </span>
                </div>
            );
            case '100':
            return ( 
                // connected with company
                <>
                <div>
                    {t('text.company_detail.connected')} <span className="fw-bold">{localConstCompanyName}</span>
                </div>
                <TooltipComponent title={t('buttons.disassociate.tooltip')}>
                    <button type="button" className="btn btn-primary btn-sm rounded-pill px-4" onClick={onDisassociateCompany}>
                        {t('buttons.disassociate.label')}
                    </button>
                </TooltipComponent>
                </>
            );
            default:
            return (
                // website not added + Not connected with company
                <div dangerouslySetInnerHTML={{__html: t('text.company_detail.provide_website')}}></div>
            );
        }
    };

    return (
        <>  
        <Card id={props?.id}  like={false} share={false} help={true} helpTitle={props?.helpTitle} helpContent={props?.helpContent} titleType={1} title={props?.title} cardHeightClass='h-100' Feedback={true} logo={true}>
            <div className="row mb-2">
                <div className="col-md-8">
                    <div className='p-4 border border-secondary rounded mb-3'>
                        <div className="row">
                            <div className="col-4">
                                <h5>{t('accountDashboard.text.balance')}:</h5>
                            </div>
                            <div className="col-8">
                                <h5>
                                    {t('text.cc.label')} {CCBalanceData?.totalCCPoints ? new Intl.NumberFormat('en-US').format(CCBalanceData?.totalCCPoints) : ''}
                                </h5>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="text-end">
                        {location?.pathname.includes('userProfileEdit') && localAccAssociationCase == 0 &&
                            <TooltipComponent title={t('buttons.create_company.tooltip')} >
                                <NavLink to="/app/requestCompany">
                                    <button type="button" className="btn btn-primary btn-md rounded-pill px-4 me-2">
                                        {t('buttons.create_company.label')}
                                    </button>
                                </NavLink>
                            </TooltipComponent>
                        }
                        {location?.pathname.includes('userProfileEdit') &&
                            <TooltipComponent title={t('accountDashboard.btn.buy.tooltip')} >
                                <button type="button" className="btn btn-primary btn-md rounded-pill px-4" onClick={() => navigate('/app/accountDashboard')}>
                                    {t('accountDashboard.btn.buy.label')}
                                </button>
                            </TooltipComponent>
                        }
                    </div>
                    
                    {/* <div className="text-end">
                        <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" title={t('accountDashboard.btn.buy.tooltip')}>
                            {t('accountDashboard.btn.buy.label')}
                        </button>
                        <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" title={t('accountDashboard.btn.payout.tooltip')} onClick={() => navigate('/app/payout')}>
                            {t('accountDashboard.btn.payout.label')}
                        </button>
                        <button type="button" className="btn btn-primary btn-sm rounded-pill px-4 me-2" title={t('accountDashboard.btn.list.tooltip')}>
                            {t('accountDashboard.btn.list.label')}
                        </button>
                    </div> */}
                </div>
                <div className="col-md-4">
                    
                    {/* <h6>{t('accountDashboard.text.acc_balance')}: {t('text.cc.label')}:657,776</h6>
                    <h6>{t('accountDashboard.text.acc_balance_ytd')}: CC:657,776</h6> */}
                
                    {/* <div className="mb-2 form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="profilePublic" name="profilePublic" />
                        <label className="form-check-label" htmlFor="profilePublic">Make Profile Public</label>
                    </div>
                    <div className="mb-2 form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="dtdApplication" name="dtdApplication" />
                        <label className="form-check-label" htmlFor="dtdApplication">DTD Application</label>
                    </div>
                    <div className="mb-2 form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="publicLibPost" name="publicLibPost" />
                        <label className="form-check-label" htmlFor="publicLibPost">Public Library Post</label>
                    </div> */}
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                {location?.pathname.includes('userProfileEdit') &&
                    <div>
                        {companyAssociationContent()}
                    </div>
                }
                </div>
            </div>
        </Card>
        <AssociateCompanyAccount id="createCompanyAccountModal" associationCase={localAccAssociationCase} userObject={props?.userDetails} setReloadCheck={props.setReloadCheck} />
        </>
    );
};

export default AccountingDashboard;