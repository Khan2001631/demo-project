import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAddUserMutation, useGetCountryListMutation } from '../../../api-integration/secure/secure';
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { useGetOrganizationRolesMutation } from '../../../api-integration/secure/secure';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import { useDispatch } from 'react-redux';
import { Modal } from 'bootstrap';

interface iUser {
    USERID: number;
    FIRSTNAME: string;
    LASTNAME: string;
    EMAIL: string;
    BIZZEMAIL: string;
    CITY: string;
    COUNTRY: string;
    ROLEID: string[]; 
    userRoles: any;
    Y_GPTBLUE_ROLES__NAME: string;
}

interface ManageUserModalProps {
    id: string;
    currentUser: iUser | null;
    setReloadComponent: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageUserModal: React.FC<ManageUserModalProps> = ({ id, currentUser, setReloadComponent }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<iUser>();
    const [localCurrentUser, setLocalCurrentUser] = useState<iUser | null>(null);
    const [localOrganizationRole, setLocalOrganizationRole] = useState<Set<string>>(new Set()); 
    const [organizationRoles, setOrganizationRoles] = useState<any>();

    const [addUserAPI, { data: addUserData, isLoading: isAddUserLoading, isSuccess: isAddUserSuccess, isError: isAddUserError, error: addUserError }]= 
    useAddUserMutation();

    const [countryListAPI, { data: countryListData, isLoading: isCountryListLoading, isSuccess: isCountryListSuccess, isError: isCountryListError  }] = 
    useGetCountryListMutation();

    const [getOrganizationRolesAPI, {data:organizationRolesData, isLoading:isOrganziationRoleLoading, isSuccess:isOrganizationRoleSuccess, isError:isOrganizationRoleError, error: organizationRoleError}] = 
    useGetOrganizationRolesMutation();

    useEffect(() => {
        dispatch(fullPageLoader(true))
        getOrganizationRolesAPI({
            roleIdList: "", 
            roleGroup: "organization" 
        })
    },[])

    useEffect(() => {
        if(isOrganizationRoleSuccess || isOrganizationRoleError)
        {
            dispatch(fullPageLoader(false));
        }
        if(organizationRolesData?.success == true)
        {
            setOrganizationRoles(organizationRolesData?.rolesData);
        }   
    },[isOrganizationRoleSuccess,isOrganizationRoleError,organizationRoleError])    
    
    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
            draggableBootstrapModal(modalElement);
        }
        dispatch(fullPageLoader(false));
        countryListAPI({}); 
    }, [id]);

    useEffect(() => {
        if (currentUser?.USERID) {
            setLocalCurrentUser(currentUser);
            if (currentUser?.userRoles && Array.isArray(currentUser.userRoles)) {
                const names = currentUser.userRoles.map((role: any) => role.Y_GPTBLUE_ROLES__NAME);
                const namesSet = new Set<string>(names);
                setLocalOrganizationRole(namesSet);
            } else {
                setLocalOrganizationRole(new Set<string>());
            }
        } else {
            setLocalCurrentUser(null);
            setLocalOrganizationRole(new Set<string>());
        }
    }, [currentUser]);

    useEffect(() => {
        if (localCurrentUser !== null) {
            setValue('FIRSTNAME', localCurrentUser?.FIRSTNAME);
            setValue('LASTNAME', localCurrentUser?.LASTNAME);
            setValue('EMAIL', localCurrentUser?.EMAIL);
            setValue('BIZZEMAIL', localCurrentUser?.BIZZEMAIL);
            setValue('CITY', localCurrentUser?.CITY);
            setValue('COUNTRY', localCurrentUser?.COUNTRY);
            setValue('ROLEID', Array.from(localOrganizationRole)); 
        } else {
            setValue('FIRSTNAME', '');
            setValue('LASTNAME', '');
            setValue('EMAIL', '');
            setValue('BIZZEMAIL', '');
            setValue('CITY', '');
            setValue('COUNTRY', '');
            setValue('ROLEID', []);
        }
    }, [localCurrentUser, setValue]);

    useEffect(() => {
        if(isCountryListSuccess || isCountryListError || isCountryListError) {
            dispatch(fullPageLoader(false));
        }
    }, [isCountryListSuccess, isCountryListError, isCountryListError]);

    useEffect(() => {
        if(isAddUserSuccess ) {
            dispatch(fullPageLoader(false));
            if (addUserData?.status == 'FETCH_ERROR' || addUserData?.status == 'PARSING_ERROR') {
                dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
            } 
            else if (addUserData?.success == false) {
                dispatch(updateAlertMessage({ status: 'error', message: addUserData?.message }));
            }
            else if (addUserData?.success == true) {
                dispatch(updateAlertMessage({ status: 'success', message: addUserData?.message }));
                setReloadComponent(true);
            }
            else {
                dispatch(updateAlertMessage({ status: 'error', message: addUserData?.message }));
            }
        }
        if(isAddUserError || addUserError){
            dispatch(fullPageLoader(false));
        }
    }, [isAddUserSuccess, isAddUserError, addUserError]);

    const resetModalValues = () => {
        setValue('FIRSTNAME', '');
        setValue('LASTNAME', '');
        setValue('EMAIL', '');
        setValue('BIZZEMAIL', '');
        setValue('CITY', '');
        setValue('COUNTRY', '');
        setValue('ROLEID', []); 
    };
    const handleSave: SubmitHandler<iUser> = (data: any) => {
        const roleArray = Array.from(localOrganizationRole);
        const payload = {
            ...data,
            ROLEID: roleArray,
            userId: localCurrentUser?.USERID || 0
        }        
        // Close the modal manually
        const myModalEl = document.getElementById(id);
        if (myModalEl) {
            const modal = Modal.getInstance(myModalEl);
            if (modal) {
                modal?.hide();
                resetModalValues();
            }
        }
        dispatch(fullPageLoader(true));
        addUserAPI(payload);
    };

    const handleCheckBoxes = (role: any) => {
        const roleName = role.roleName;
        if (localOrganizationRole && localOrganizationRole.has(roleName)) {
            const updatedSet = new Set(localOrganizationRole);
            updatedSet.delete(roleName);
            setLocalOrganizationRole(updatedSet);
        } else {
            setLocalOrganizationRole(new Set([...(localOrganizationRole || []), roleName]));
        }
    }

    return (
        
        <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
        <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id={`${id}Label`}>
                        {t('modals.manage_user.title')}
                    </h5>
                    <button type="button" className="btn-close" 
                        data-bs-dismiss="modal" aria-label="Close"
                        onClick={() => clearErrors(["FIRSTNAME","LASTNAME","BIZZEMAIL","CITY","COUNTRY","EMAIL","ROLEID"])}
                    ></button>
                </div>
                <form onSubmit={handleSubmit(handleSave)}>
                <div className="modal-body">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor='firstName' className="form-label">{t('userProfile.form_field.firstname.label')}<span className="text-danger">*</span></label>
                                    <input type="text" 
                                        className={`form-control ${errors?.FIRSTNAME ? 'is-invalid' : ''}`}
                                        id="firstName" placeholder={t('userProfile.form_field.firstname.placeholder')} 
                                        {...register('FIRSTNAME', { required: true, maxLength:26 })}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.FIRSTNAME && errors.FIRSTNAME.type === 'required' && t('userProfile.form_field.firstname.validation_message.required')}
                                        {errors.FIRSTNAME && errors.FIRSTNAME.type === 'maxLength' && t('userProfile.form_field.firstname.validation_message.maxlength')}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor='lastName' className="form-label">{t('userProfile.form_field.lastname.label')}<span className="text-danger">*</span></label>
                                    <input 
                                        type="text" placeholder={t('userProfile.form_field.lastname.placeholder')} 
                                        className={`form-control ${errors?.LASTNAME ? 'is-invalid' : ''}`}
                                        {...register('LASTNAME', { required: true, maxLength:26 })} 
                                        id="lastName"
                                    />
                                    <div className="invalid-feedback">
                                        {errors.LASTNAME && errors.LASTNAME.type === 'required' && t('userProfile.form_field.lastname.validation_message.required')}
                                        {errors.LASTNAME && errors.LASTNAME.type === 'maxLength' && t('userProfile.form_field.lastname.validation_message.maxlength')}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor='email' className="form-label">{t('userProfile.form_field.email.label')}<span className="text-danger">*</span></label>
                                    <input type="email" placeholder={t('userProfile.form_field.email.placeholder')}
                                    className={`form-control ${errors?.EMAIL ? 'is-invalid' : ''}`}
                                    {...register('EMAIL', { required: true,  maxLength:250, pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: t('userProfile.form_field.email.validation_message.invalid')
                                    } })}
                                    id="email"/>
                                    <div className="invalid-feedback">
                                        {errors.EMAIL && errors.EMAIL.type === 'required' && t('userProfile.form_field.email.validation_message.required')}
                                        {errors.EMAIL && errors.EMAIL.type === 'pattern' && t('userProfile.form_field.email.validation_message.invalid_format')}
                                        {errors.EMAIL && errors.EMAIL.type === 'maxLength' && t('userProfile.form_field.email.validation_message.maxlength')}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor='businessemail' className="form-label">{t('userProfile.form_field.bizz_email.label')}<span className="text-danger">*</span></label>
                                    <input type="email" placeholder={t('userProfile.form_field.bizz_email.placeholder')}
                                    className={`form-control ${errors?.BIZZEMAIL ? 'is-invalid' : ''}`}
                                    {...register('BIZZEMAIL', { required: true, maxLength:250, pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: t('userProfile.form_field.bizz_email.validation_message.invalid')
                                    } })}
                                    id="businessemail"/>
                                    <div className="invalid-feedback">
                                        {errors.BIZZEMAIL && errors.BIZZEMAIL.type === 'pattern' && t('userProfile.form_field.bizz_email.validation_message.invalid_format')}
                                        {errors.BIZZEMAIL && errors.BIZZEMAIL.type === 'maxLength' && t('userProfile.form_field.bizz_email.validation_message.maxlength')}
                                        {errors.BIZZEMAIL && errors.BIZZEMAIL.type === 'required' && t('userProfile.form_field.bizz_email.validation_message.required')}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor='city' className="form-label">{t('userProfile.form_field.city.label')}<span className="text-danger">*</span></label>
                                    <input type="text" placeholder={t('userProfile.form_field.city.placeholder')}
                                    className={`form-control ${errors?.CITY ? 'is-invalid' : ''}`}
                                    {...register('CITY', { required: true, maxLength:26 })}  
                                    id="city"/>
                                    <div className="invalid-feedback">
                                        {errors.CITY && errors.CITY.type === 'required' && t('userProfile.form_field.city.validation_message.required')}
                                        {errors.CITY && errors.CITY.type === 'maxLength' && t('userProfile.form_field.city.validation_message.maxlength')}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                {isCountryListLoading ? (
                                    <p>{t('message.loading')}</p>
                                    ) : (

                                    <div className="mb-3">
                                        <label htmlFor='country' className="form-label">{t('userProfile.form_field.country.label')}<span className="text-danger">*</span></label>
                                        <select 
                                            className={`form-select ${errors?.COUNTRY ? 'is-invalid' : ''}`} 
                                            id="country" 
                                            {...register('COUNTRY', { required: true })} 
                                        >
                                        {isCountryListSuccess && countryListData && countryListData.countryData && countryListData?.countryData.map(({ country_ID, country_code, country }: { country_ID: number; country_code: string; country:string;}) => (
                                            <option key={country_ID} value={country_code}>
                                                {country}
                                            </option>
                                        ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.COUNTRY && errors.COUNTRY.type === 'required' && t('userProfile.form_field.country.validation_message.required')}
                                        </div>
                                    </div>
                                    )}
                            </div>
                            <div className="col-md-6">
                                <h6>{t('inputs.checkbox.org_roles.label')}</h6>
                                <div className="row">
                                {organizationRoles?.map((role:any, index: number) => (
                                            <div className="col-md-6" key={index}>
                                                <div className="mb-3 form-check">
                                                <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={role.roleId}
                                                        value=""
                                                        checked={localOrganizationRole?.has(role.roleName)} 
                                                        onChange={() => handleCheckBoxes(role)}
                                                    />
                                                    <label className="form-check-label" >{role.roleName}</label>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" 
                        data-bs-dismiss="modal"
                        onClick={() => clearErrors(["FIRSTNAME","LASTNAME","BIZZEMAIL","CITY","COUNTRY","EMAIL","ROLEID"])}
                    >
                        {t('buttons.close_modal.label')}
                    </button>
                    <button type="submit" className="btn btn-primary">{t('buttons.save.label')}</button>
                </div>
                </form>
            </div>
        </div>
    </div>
    );
};

export default ManageUserModal;

