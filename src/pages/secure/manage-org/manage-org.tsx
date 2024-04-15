import React, {  useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm, FieldValues, set  } from "react-hook-form";
import UserCard from "../../../components/common/user-card/user-card";
import Statistics from "../../../components/common/statistics/statistics";
import { useDispatch, useSelector } from 'react-redux';
import ManageCorpDashboard from '../../../components/secure/manage-corp-dashboard/manage-corp-dashboard';
import OrgSelection from '../../../components/secure/org-selection/org-selection';
import Card from '../../../components/common/card/card';
import { useAddUpdateOrgMutation, useGetCountryListMutation, useGetOrgnizationsLevelMutation, useGetOrgnizationsListMutation, useGetTeamMutation } from '../../../api-integration/secure/secure';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import { useNavigate, useParams } from 'react-router-dom';
import { use } from 'i18next';

interface IManageOrg {
    orgId: number;
    orgPId: number;
    orgLevel: string;
    orgDepartmentName: string;
    orgManagerId: number;
    orgCountry: string;
    orgCountryCode: string;
    orgCity: string;
    orgState: string;
    orgZipCode: string;
    orgCategory: string;
    orgStatus: string;
    orgHeadline: string;
    orgObjective: string;
    orgPublish: boolean;
}

const ManageOrg: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const { register, handleSubmit, formState: { errors }, setValue, trigger, clearErrors } = useForm<IManageOrg>();
    const [triggerReload, setTriggerReload] = useState(false);
    const formFields: ('orgId' | 'orgPId' | 'orgLevel' | 'orgDepartmentName' | 'orgManagerId' | 'orgCountry' | 'orgCountryCode' | 'orgCity' | 'orgState' | 'orgZipCode' | 'orgCategory' | 'orgStatus' | 'orgHeadline' | 'orgObjective' | 'orgPublish')[]
        = ['orgId', 'orgPId', 'orgLevel', 'orgDepartmentName', 'orgManagerId', 'orgCountry', 'orgCountryCode', 'orgCity', 'orgState', 'orgZipCode', 'orgCategory', 'orgStatus', 'orgHeadline', 'orgObjective', 'orgPublish'];

    const [countryListAPI, { data: countryListData, isLoading: isCountryListLoading, isSuccess: isCountryListSuccess, isError: isCountryListError, error: countryListError  }] = 
        useGetCountryListMutation();
    const [getOrgnizationsListAPI, {data: orgListData, isLoading: isOrgListLoading, isSuccess: isOrgListSuccess, isError: isOrgListError, error: orgListError}] =
        useGetOrgnizationsListMutation();
    const [getOrgnizationsLevelAPI, {data:orgLevelData, isLoading:isOrgLevelLoading, isSuccess: isOrgLevelSuccess, isError: isOrgLevelError, error: orgLevelError}]=
        useGetOrgnizationsLevelMutation();
    const[addUpdateOrgAPI, {data: addUpdateOrgData, isLoading: isAddUpdateOrgLoading, isSuccess: isAddUpdateOrgSuccess, isError: isAddUpdateOrgError, error: addUpdateOrgError}]=
        useAddUpdateOrgMutation();
    const [getTeamAPI, {data: teamData, isLoading: isTeamLoading, isSuccess: isTeamSuccess, isError: isTeamError, error: teamError}] = 
        useGetTeamMutation();

    useEffect(() => {
        dispatch(fullPageLoader(true));
        countryListAPI({});
        getTeamAPI({orgid: 0})
    }, []);

    useEffect(() => {
        if(isCountryListSuccess || isCountryListError || countryListError) {
            dispatch(fullPageLoader(false));
        }
    }, [isCountryListSuccess, isCountryListError, countryListError]);
    
    useEffect(() => {
        if(isTeamSuccess || isTeamError || teamError) {
            dispatch(fullPageLoader(false));
        }
    }, [isTeamSuccess, isTeamError, teamError]);

    useEffect(() => {
        if(isOrgListSuccess || isOrgListError || orgListError) {
            dispatch(fullPageLoader(false));
        }
    }, [isOrgListSuccess, orgListError, isOrgListError]);

    useEffect(() => {
        if(isAddUpdateOrgSuccess || isAddUpdateOrgError || addUpdateOrgError) {
            dispatch(fullPageLoader(false));
        }
        if(isAddUpdateOrgSuccess && addUpdateOrgData) {
            if(addUpdateOrgData?.success == true){
                setTriggerReload(prevState => !prevState);
                dispatch(updateAlertMessage({ status: 'success', message: addUpdateOrgData?.message }));
                navigate(`/app/manageOrg/edit/${addUpdateOrgData?.orgData?.orgId}`);
            }
            else{
                dispatch(updateAlertMessage({ status: 'error', message: addUpdateOrgData?.message }));
            }
        }
    }, [isAddUpdateOrgSuccess, addUpdateOrgError, isAddUpdateOrgError]);

    const handleOrgSelect = (orgId: number) => {
        navigate(`/app/manageOrg/edit/${orgId}`);
    };

    useEffect(() => {
        if (params.id) {
            // Fetch data for the selected org
            dispatch(fullPageLoader(true));
            getOrgnizationsListAPI({orgID: params.id});
        }
    }, [params.id]);

    useEffect(() => {
        if(isOrgLevelSuccess || isOrgLevelError || orgLevelError) {
            dispatch(fullPageLoader(false));
        }
        if(isOrgLevelSuccess && orgLevelData) {
            setValue('orgLevel', orgListData?.orgData?.[0]?.orgLevel);
        }
    }, [isOrgLevelSuccess, orgLevelError, isOrgLevelError]);

    useEffect(() => {
        if( isOrgListSuccess && orgListData && orgListData?.orgData) {
            // Set the data to the form fields
            formFields.forEach(field => {
                let formFieldvalue = orgListData?.orgData?.[0]?.[field];
        
                // If the field is 'orgPublish', convert the value to boolean
                if (field === 'orgPublish') {
                    formFieldvalue = formFieldvalue === "YES" ? true : false;
                }
                else if (field === 'orgManagerId') {
                    formFieldvalue = Number(formFieldvalue);
                }
                setValue(field, formFieldvalue);
                //setValue(field, orgListData?.orgData?.[0]?.[field]);
            });
            // Fetch the org level data
            dispatch(fullPageLoader(true));
            getOrgnizationsLevelAPI({orgID: orgListData?.orgData?.[0]?.orgPId, orgHeirarchy:  "C"});
        }else{
            formFields.forEach(field => {
                setValue(field, '');
            });
        }
    }, [orgListData, isOrgListSuccess]);

    const [parentOrgListData, setParentOrgListData] = useState<any>(null);
    function handleOrgListData(childOrgListData: any) {
        setParentOrgListData(childOrgListData);
        setValue('orgPId', orgListData?.orgData?.[0]?.orgPId);
    }
    useEffect(() => {
        if (parentOrgListData?.orgData?.length > 0) {
          setValue('orgPId', orgListData?.orgData?.[0]?.orgPId);
        }
    }, [parentOrgListData, setValue]);

    useEffect(() => {
        if(teamData && teamData?.usersData && orgListData && orgListData?.orgData && orgListData?.orgData?.[0]){
            setValue('orgManagerId', orgListData?.orgData?.[0]?.orgManagerId);
        }
    }, [teamData, orgListData, setValue]);
    

    const onSubmit: SubmitHandler<IManageOrg> = (data: any) => {
        const payload = {
            ...data,
            orgId: params.id ? params.id : 0
        }
        dispatch(fullPageLoader(true));
        addUpdateOrgAPI(payload);
    }

    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                    <UserCard />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <ManageCorpDashboard id="organizationManagement_CompanyDetails" accountType="corporate" 
                        title={t('card.org_user_dashboard.title')} 
                        helpTitle={t('card.org_user_dashboard.help.title')} 
                        helpContent={t('card.org_user_dashboard.help.content')} 
                    />
                </div>
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <Statistics id="organizationManagement_Analytics" cardHeightClass={'h-100'} statsType="corp"/>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                    <OrgSelection 
                        onOrgSelect={handleOrgSelect}
                        onOrgListData={handleOrgListData} 
                        triggerReload={triggerReload}
                    />
                </div>
                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                    <Card id="organizationManagement_OrganizationDetails" cardHeightClass='h-100' help={true} helpTitle={t('card.organization_detail.help.title')} helpContent={t('card.organization_detail.help.content')} titleType={1} title={t('card.organization_detail.title')} Feedback={true} logo={true}>
                        <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">{t('inputs.select.parent_org.label')}<span className='text-danger'>*</span></label>
                                <select 
                                    className={`form-select ${errors?.orgPId ? 'is-invalid' : ''}`}
                                    {...register('orgPId', { required: true })}
                                    onChange={(e) => {
                                        dispatch(fullPageLoader(true));
                                        getOrgnizationsLevelAPI({orgID: e.target.value, orgHeirarchy:  "C"});
                                        if(e.target.value.length > 0){
                                            clearErrors('orgPId');
                                        }
                                        if (params.id != undefined) {
                                            trigger('orgPId')
                                        }
                                    }}
                                >
                                    <option value="">{t('inputs.select.parent_org.default_option')}</option>
                                    {parentOrgListData && parentOrgListData?.orgData && parentOrgListData?.orgData
                                        .filter(({ orgId, orgLevel }: { orgId: number, orgLevel: string }) => orgId !== Number(params.id) && orgLevel !== 'DEPARTMENT')
                                        .map(({ orgId, orgDepartmentName }: { orgId: number, orgDepartmentName: string }, index: number) => (
                                            <option key={index} value={orgId}>
                                                {orgDepartmentName}
                                            </option>
                                        ))
                                    }
                                </select>
                                <div className="invalid-feedback">
                                    {errors.orgPId && errors.orgPId.type === 'required' && t('inputs.select.parent_org.validation_message.required')}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t('inputs.select.org_level.label')}<span className='text-danger'>*</span></label>
                                <select 
                                    className={`form-select ${errors?.orgLevel ? 'is-invalid' : ''}`}
                                    {...register('orgLevel', { required: true })}
                                >
                                    <option value="">{t('inputs.select.org_level.default_option')}</option>
                                    {orgLevelData && orgLevelData?.orgLevel && orgLevelData?.orgLevel.map(({ level, name }: { level: string; name: string }, index: number) => (
                                        <option key={index} value={level}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">
                                    {errors.orgLevel && errors.orgLevel.type === 'required' && t('inputs.select.org_level.validation_message.required')}
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">{t('inputs.text.org_name.label')}<span className='text-danger'>*</span></label>
                                <input type="text" 
                                    className={`form-control ${errors?.orgDepartmentName ? 'is-invalid' : ''}`}
                                    placeholder={t('inputs.text.org_name.placeholder')}
                                    maxLength={250}
                                    {...register('orgDepartmentName', { required: true })}
                                />
                                <div className="invalid-feedback">
                                    {errors.orgDepartmentName && errors.orgDepartmentName.type === 'required' && t('inputs.text.org_name.validation_message.required')}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t('inputs.select.manager.label')}<span className='text-danger'>*</span></label>
                                <select 
                                    className={`form-select ${errors?.orgManagerId ? 'is-invalid' : ''}`}
                                    {...register('orgManagerId', { required: true })}
                                >
                                    <option value="">{t('inputs.select.manager.default_option')}</option>
                                    
                                    {isTeamSuccess && teamData && teamData?.usersData && teamData?.usersData.map(({ USERID, FIRSTNAME, LASTNAME }: { USERID: number, FIRSTNAME: string, LASTNAME: string }, index: number) => (
                                        <option key={index} value={USERID.toString()}>
                                            {FIRSTNAME + ' ' + LASTNAME}
                                        </option>
                                    ))}
                                </select>
                                <div className="invalid-feedback">
                                    {errors.orgManagerId && errors.orgManagerId.type === 'required' && t('inputs.select.manager.validation_message.required')}
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">{t('inputs.text.city.label')}<span className='text-danger'>*</span></label>
                                <input type="text" 
                                    className={`form-control ${errors?.orgCity ? 'is-invalid' : ''}`}
                                    placeholder={t('inputs.text.city.placeholder')}
                                    {...register('orgCity', { required: true })}
                                />
                                <div className="invalid-feedback">
                                    {errors.orgCity && errors.orgCity.type === 'required' && t('inputs.text.city.validation_message.required')}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t('inputs.text.state.label')}<span className='text-danger'>*</span></label>
                                <input type="text" 
                                    className={`form-control ${errors?.orgState ? 'is-invalid' : ''}`}
                                    placeholder={t('inputs.text.state.placeholder')}
                                    {...register('orgState', { required: true })}
                                />
                                <div className="invalid-feedback">
                                    {errors.orgState && errors.orgState.type === 'required' && t('inputs.text.state.validation_message.required')}
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">{t('inputs.text.postal_code.label')}<span className='text-danger'>*</span></label>
                                <input type="text" 
                                    className={`form-control ${errors?.orgZipCode ? 'is-invalid' : ''}`}
                                    placeholder={t('inputs.text.postal_code.placeholder')}
                                    {...register('orgZipCode', { required: true })}
                                />
                                <div className="invalid-feedback">
                                    {errors.orgZipCode && errors.orgZipCode.type === 'required' && t('inputs.text.postal_code.validation_message.required')}
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                {isCountryListLoading ? (
                                <p>{t('message.loading')}</p>
                                ) : (
                                    <div >
                                        <label htmlFor='orgCountry' className="form-label">{t('inputs.select.country.label')}<span className='text-danger'>*</span></label>
                                        <select className={`form-select ${errors?.orgCountry ? 'is-invalid' : ''}`} 
                                            id="orgCountry" 
                                            {...register('orgCountry', { required: true })}
                                            
                                        >
                                            <option value=''>{t('inputs.select.country.default_option')}</option>
                                            {isCountryListSuccess && countryListData && countryListData.countryData && countryListData?.countryData.map(({ country_ID, country_code, country }: { country_ID: number; country_code: string; country:string;}) => (
                                                <option key={country_ID} value={country_code}>
                                                    {country}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="invalid-feedback">
                                            {errors.orgCountry && errors.orgCountry.type === 'required' && t('inputs.select.country.validation_message.required')}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">{t('inputs.select.org_category.label')}<span className='text-danger'>*</span></label>
                                <select 
                                    className={`form-select ${errors?.orgCategory ? 'is-invalid' : ''}`}
                                    {...register('orgCategory', { required: true })}
                                >
                                    <option value="">{t('inputs.select.org_category.default_option')}</option>
                                    <option value="Internal">Internal</option>
                                    <option value="Upstream">Upstream</option>
                                    <option value="Downstream">Downstream</option>
                                </select>
                                <div className="invalid-feedback">
                                    {errors.orgCategory && errors.orgCategory.type === 'required' && t('inputs.select.org_category.validation_message.required')}
                                </div>
                            </div>   
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label">{t('inputs.select.org_status.label')}<span className='text-danger'>*</span></label>
                                <select 
                                    className={`form-select ${errors?.orgStatus ? 'is-invalid' : ''}`}
                                    {...register('orgStatus', { required: true })}    
                                >
                                    <option value="">{t('inputs.select.org_status.default_option')}</option>
                                    <option value="Active">Active</option>
                                    <option value="Hold">Hold</option>
                                    <option value="Hidden">Hidden</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                                <div className="invalid-feedback">
                                    {errors.orgStatus && errors.orgStatus.type === 'required' && t('inputs.select.org_status.validation_message.required')}
                                </div>
                            </div>
                            <div className="col-md-6 d-flex align-items-center">
                                <div className="form-check form-switch">
                                    <input className="form-check-input" 
                                        type="checkbox" 
                                        id="orgPub"
                                        {...register('orgPublish')}
                                    />
                                    <label className="form-check-label" htmlFor="orgPub">{t('inputs.checkbox.publish.label')}</label>
                                </div>
                            </div> 
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <label className="form-label">{t('inputs.text.headline.label')}<span className='text-danger'>*</span></label>
                                <input type="text" 
                                    className={`form-control ${errors?.orgHeadline ? 'is-invalid' : ''}`} 
                                    {...register('orgHeadline', { required: true })}
                                    maxLength={140}
                                    placeholder={t('inputs.text.headline.placeholder')}
                                />
                                <div className="invalid-feedback">
                                    {errors.orgHeadline && errors.orgHeadline.type === 'required' && t('inputs.text.headline.validation_message.required')}
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <label className="form-label">{t('inputs.textarea.org_objective.label')}<span className='text-danger'>*</span></label>
                                <textarea className={`form-control ${errors?.orgObjective ? 'is-invalid' : ''}`}
                                    placeholder={t('inputs.textarea.org_objective.placeholder')}
                                    rows={3}
                                    maxLength={500}
                                    {...register('orgObjective', { required: true })}
                                />
                                <div className="invalid-feedback">
                                    {errors.orgObjective && errors.orgObjective.type === 'required' && t('inputs.textarea.org_objective.validation_message.required')}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <TooltipComponent title={params.id ? t('buttons.update.tooltip') :t('buttons.add.tooltip')} >
                                    <button type="submit" className="btn btn-primary btn-md rounded-pill px-4 mt-3">
                                        {params.id ? t('buttons.update.label') : t('buttons.add.label')}
                                    </button>
                                </TooltipComponent>
                            </div>
                        </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
        
    );
};

export default ManageOrg;