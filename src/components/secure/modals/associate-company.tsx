import React, { useEffect, useState } from 'react';
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";
import { useTranslation } from 'react-i18next';
import { useConnectAccountMutation, useGetCompanyDetailMutation, useVerifySecurityCodesMutation, useDiassociateAccountMutation, useResendCodeMutation } from '../../../api-integration/secure/secure';
import { useDispatch, useSelector } from 'react-redux';
import { fullPageLoader, updateAlertMessage, updateUser } from '../../../api-integration/commonSlice';
import TooltipComponent from '../../common/bootstrap-component/tooltip-component';
import { Modal } from 'bootstrap';




interface AssociateCompanyAccountProps {
    id: string;
    associationCase: number | undefined;
    userObject: any;
    setReloadCheck: (value: boolean) => void;
}

const AssociateCompanyAccount: React.FC<AssociateCompanyAccountProps> = ({id, associationCase, userObject, setReloadCheck}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.commonSlice);
    const [departmentSelectedValue, setDepartmentSelectedValue] = useState(user?.orgId);
    const [departmentError, setDepartmentError] = useState(false);
    const [securityCode, setSecurityCode] = useState('');
    const [securityCodeError, setSecurityCodeError] = useState(false);
    const [securityCodeSuccess, setSecurityCodeSuccess] = useState(false);
    const [codeSuccessMsg, setCodeSuccessMsg] = useState('');
    const [securityCodeValidationMsg, setSecurityCodeValidationMsg] = useState('');

    const [getCompanyDetailAPI, { data: companyDetailListData, isLoading: isCompanyDetailLoading, isSuccess: isCompanyDetailSuccess, isError: isCompanyDetailError, error: companyDetailError }] = 
    useGetCompanyDetailMutation();

    const [verifyCodesAPI, {data: verifyCodesData, isLoading: isVerifyCodesLoading, isSuccess: isVerifyCodesSuccess, isError: isVerifyCodesError, error: verifyCodesError}]
    =useVerifySecurityCodesMutation();

    const [connectAccountAPI, { data: connectAccountData, isLoading: isConnectAccountLoading, isSuccess: isConnectAccountSuccess, isError: isConnectAccountError, error: connectAccountError }] =
    useConnectAccountMutation();

    const [disassociateAccountAPI, { data: disassociateAccountData, isLoading: isDisassociateAccountLoading, isSuccess: isDisassociateAccountSuccess, isError: isDisassociateAccountError, error: disassociateAccountError }] =
    useDiassociateAccountMutation();

    const [resendCodeAPI, { data: resendCodeData, isLoading: isResendCodeLoading, isSuccess: isResendCodeSuccess, isError: isResendCodeError, error: resendCodeError }] =
    useResendCodeMutation();
    
    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
          draggableBootstrapModal(modalElement);
        }
    }, [id]);

    useEffect(() => {
        if (userObject?.companyData?.domainname !== undefined) {
            dispatch(fullPageLoader(true));
            getCompanyDetailAPI({ domainName: userObject?.companyData?.domainname });
        }
    }, [userObject?.companyData?.domainname]);

    useEffect(() => {
        if(userObject?.orgId !== undefined && userObject?.orgId !== "4000001"){
            setDepartmentSelectedValue(userObject?.orgId);
        }
        else{
            setDepartmentSelectedValue('');
        }
    }, [userObject?.orgId]);

    useEffect(() => {
        if (isCompanyDetailSuccess || isCompanyDetailError || companyDetailError) {
            dispatch(fullPageLoader(false));
        }   
    }, [isCompanyDetailSuccess, isCompanyDetailError, companyDetailError]);
  
    const connectCompany = () => {
        if (departmentSelectedValue !== '' && departmentSelectedValue !== undefined) {
            // Close the modal manually
            var myModalEl = document.getElementById(id);
            if (myModalEl) {
                var modal = Modal.getInstance(myModalEl)
                modal?.hide()
            }
            dispatch(fullPageLoader(true));
            connectAccountAPI({orgId: departmentSelectedValue});
        }
        else {
            setDepartmentError(true);
        }
    }
    useEffect(() => {
        if (isConnectAccountSuccess || isConnectAccountError || connectAccountError) {
            dispatch(fullPageLoader(false));
        }
        if(isConnectAccountSuccess && connectAccountData?.success === true ){
            dispatch(fullPageLoader(false));
            setReloadCheck(true);
            dispatch(updateAlertMessage({ status: 'success', message: connectAccountData?.message }));
        }
    }, [isConnectAccountSuccess, isConnectAccountError, connectAccountError]);

    const handleDepartmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDepartmentSelectedValue(event.target.value);
        if (event.target.value) {
            setDepartmentError(false);
        }
    };

    const handleSecurityCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecurityCode(event.target.value);
        if (event.target.value) {
            setSecurityCodeError(false);
        }
    };
    
    const onConfirmCode = () => {
        if (!securityCode) {
            setSecurityCodeError(true);
            setSecurityCodeValidationMsg(t('message.security_code_required'));
        }
        if (!departmentSelectedValue) {
            setDepartmentError(true);
        }
        if (securityCode && departmentSelectedValue) {
            dispatch(fullPageLoader(true));
            verifyCodesAPI({sCode: securityCode});
        }
    };

    useEffect(() => {
        if (isVerifyCodesSuccess || isVerifyCodesError || verifyCodesError) {
            dispatch(fullPageLoader(false));
        }
        if(isVerifyCodesSuccess && verifyCodesData?.success === true ){
            // Close the modal manually
            var myModalEl = document.getElementById(id);
            if (myModalEl) {
                var modal = Modal.getInstance(myModalEl)
                modal?.hide()
            }
            setReloadCheck(true);
            dispatch(updateAlertMessage({ status: 'success', message: verifyCodesData?.message }));
        }
        else {
            setSecurityCodeError(true);
            setSecurityCodeValidationMsg(verifyCodesData?.message);
        }
    }, [isVerifyCodesSuccess, isVerifyCodesError, verifyCodesError]);

    const onResendCode = () => {
        dispatch(fullPageLoader(true));
        resendCodeAPI({});
    };
    useEffect(() => {
        if (isResendCodeSuccess || isResendCodeError || resendCodeError) {
            dispatch(fullPageLoader(false));
        }
        if(isResendCodeSuccess && resendCodeData?.success === true ){
            setReloadCheck(true);
            setSecurityCode(''); // clear the security code
            setSecurityCodeSuccess(true);
            setCodeSuccessMsg(resendCodeData?.message);
            //dispatch(updateAlertMessage({ status: 'success', message: resendCodeData?.message }));
        }
    }, [isResendCodeSuccess, isResendCodeError, resendCodeError]);

    const onDisassociateCompany = () => {
        dispatch(fullPageLoader(true));
        disassociateAccountAPI({});
    };
    useEffect(() => {
        if (isDisassociateAccountSuccess || isDisassociateAccountError || disassociateAccountError) {
            dispatch(fullPageLoader(false));
        }
        if(isDisassociateAccountSuccess && disassociateAccountData?.success === true ){
            setReloadCheck(true);
            dispatch(updateAlertMessage({ status: 'success', message: disassociateAccountData?.message }));
        }
    }, [isDisassociateAccountSuccess, isDisassociateAccountError, disassociateAccountError]);

    
    
    return (
        <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>
                            {t('modals.associate_company.title')}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {associationCase == 2 && ( 
                            <>
                             {/* website added but not connected */}
                            <div>
                                {t('text.bussiness_email.label')}: 
                                <br/>{userObject?.businessemail}
                            </div>
                            <div className='mt-3'>
                                {t('text.company_detail.label')}:<br/>
                                {t('text.company_detail.not_exits')}
                            </div>
                            </>
                        )}                        
                        {associationCase == 5 && (
                            // not connected with company  
                            <>
                            <div className='mb-1'>
                                <label htmlFor="departmentDivision">{t('inputs.select.department_division.label')}<span className='text-danger'>*</span></label>
                                <select className="form-select" 
                                    id="departmentDivision" 
                                    required 
                                    onChange={handleDepartmentChange}
                                    value={departmentSelectedValue}
                                >
                                    <option value="">{t('inputs.select.department_division.default_option')}</option>
                                    {companyDetailListData && companyDetailListData?.map((item: { ORG_ID: number; DEPARTMENTNAME: string; }, index: number) => (
                                        <option key={index} value={item.ORG_ID}>
                                            {item.DEPARTMENTNAME}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {departmentError && <div className="error text-danger">Please select Department Division.</div>}
                            </>
                        )}                        
                        {associationCase == 20 && (
                            // company association is on hold >> pending for verification
                            <> 
                                <div className='mb-3'>
                                    <label htmlFor="departmentDiv">{t('inputs.select.department_division.label')}<span className='text-danger'>*</span></label>
                                    <select className="form-select" 
                                        id="departmentDiv" 
                                        required
                                        onChange={handleDepartmentChange}
                                        value={departmentSelectedValue}
                                    >
                                        <option value="">{t('inputs.select.department_division.default_option')}</option>
                                        {companyDetailListData && companyDetailListData?.map((item: { ORG_ID: number; DEPARTMENTNAME: string; }, index: number) => (
                                            <option key={index} value={item.ORG_ID}>
                                                {item.DEPARTMENTNAME}
                                            </option>
                                        ))}
                                    </select>
                                    {departmentError && <div className="error text-danger">Please select Department Division.</div>}
                                </div>
                                <div className='mt-3'>
                                    <div className=''>
                                        <label htmlFor="securityCode">
                                            {t('inputs.text.security_code.label')}<span className='text-danger'>*</span>
                                        </label>
                                        <input type="text" 
                                            className="form-control" 
                                            placeholder= {t('inputs.text.security_code.placeholder')} 
                                            id="securityCode" 
                                            onChange={handleSecurityCodeChange}
                                        />
                                        {securityCodeError && <div className="error text-danger">{securityCodeValidationMsg}</div>}
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    {t('text.not_recieved_email')}, <a className='text-decoration-none' onClick={onResendCode}>{t('links.click_here')}</a> {t('text.email_request')}.
                                </div>
                                <div>
                                    {securityCodeSuccess && <div className="success text-success">{codeSuccessMsg}</div>}
                                </div>
                            </>
                        )}
                        <div className="modal-footer">
                            <TooltipComponent title={t('buttons.close_modal.tooltip')}>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('buttons.close_modal.label')}</button>
                            </TooltipComponent>
                            {associationCase == 5 && (
                                // not connected with company 
                                <TooltipComponent title={t('buttons.connect_with.tooltip')}> 
                                    <button type="button" className="btn btn-primary" onClick={connectCompany}>
                                        {t('buttons.connect_with.label')} {userObject?.companyData?.companyname}
                                    </button>
                                </TooltipComponent>
                            )}
                            {associationCase == 20 && 
                                (
                                    // company association is on hold >> pending for verification
                                <> 
                                    <TooltipComponent title={t('buttons.confirm_code.tooltip')}>
                                        <button type="button" className="btn btn-primary" onClick={onConfirmCode}>
                                            {t('buttons.confirm_code.label')}
                                        </button>
                                    </TooltipComponent>
                                
                                    <TooltipComponent title={t('buttons.disassociate.tooltip')}>
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onDisassociateCompany}>
                                            {t('buttons.disassociate.label')}
                                        </button>
                                    </TooltipComponent>
                                </>
                                )
                            }
                        </div>
                    </div>
                </div>    
            </div>
        </div>
    );
};

export default AssociateCompanyAccount;