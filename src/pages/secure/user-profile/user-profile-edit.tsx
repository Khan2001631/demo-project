import React, {  useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { SubmitHandler, useForm, FieldValues, set  } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Modal } from "bootstrap";
import { fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired, updateUser } from "../../../api-integration/commonSlice";
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import Card from '../../../components/common/card/card';
import NoPicture from '../../../assets/images/nopicture.jpg';
import UserCard from "../../../components/common/user-card/user-card";
import Statistics from "../../../components/common/statistics/statistics";
import { useGetUserProfileMutation, usePostUserProfileMutation, useGetCountryListMutation, useUploadImageMutation } from '../../../api-integration/secure/secure';
import AccountingDashboard from '../../../components/secure/accounting-dashboard/accounting-dashboard';
import ImageCrop from '../../../components/secure/upload-image/upload-image';
import AssociateCompanyAccount from '../../../components/secure/modals/associate-company';

interface userProfileInterface {
    username: string;
    firstName: string;
    lastName: string;
    city: string;
    state?: string;
    postcode?: string;
    country: string;
    email: string;
    businessemail?: string;
    mobile?: string;
    // companyname?: string;
    companyWebsite?: string;
    linkedInURL?: string;
    title?: string;
    userStory?: string;
    showRefKey?: boolean;
    refKey?: string;
    internalSource?: string;
}


let UserProfileEdit:React.FC = ({}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const uploadImageModalId = 'uploadImageModal';
    
    //const [createFormPayload, setCreateFormPayload] = useState<any>({});
    const [showRefKeyInput, setShowRefKeyInput] = useState(true);
    const [isUpdated, setIsUpdated] = useState(false);
    const [ccUserStory, setCCUserStory] = useState(0);
    const [localUserObj, setLocalUserObj] = useState<any>({});
    const [reloadCheck, setReloadCheck] = useState(false);
    const [companyAssocStatus, setCompanyAssocStatus] = useState<number>(0);
    const [source, setSource] = useState('');
    const [otherSource, setOtherSource] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<userProfileInterface>();
    const { user } = useSelector((state: any) => state.commonSlice);
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_IMAGE_SIZE = 1048576; // 1 MB in bytes
    const internalSourceOptions = [
        { value: "", label: "Select source" },
        { value: "internet_search", label: "Internet Search" },
        { value: "social_media", label: "Social Media" },
        { value: "blog_post", label: "Blog Post" },
        { value: "news_article", label: "News Article" },
        { value: "word_of_mouth", label: "Word of Mouth" },
        { value: "other", label: "Other" },
      ];

    const [getUserDetails, { data: userInfo, isLoading, isSuccess, isError  }] =
    useGetUserProfileMutation();

    const [countryListAPI, { data: countryListData, isLoading: isCountryListLoading, isSuccess: isCountryListSuccess, isError: isCountryListError  }] = 
    useGetCountryListMutation();

    const [uploadImageAPI, { data: uploadedImage, isLoading: isUploadingImage, isSuccess: isUploadingImageSuccess, isError: isUploadingImageEror  }] =
    useUploadImageMutation(); 
    
    const [updateUserProfileAPI, { data: createUserResponse, isLoading: isCreateLoading, isSuccess: isCreateSuccess, isError: isCreateError, error }] =
      usePostUserProfileMutation();
    
    useEffect(() => {
        async function fetchData() {
          dispatch(fullPageLoader(true));
      
          const userDetails = getUserDetails({accountType: 'user'})
            .catch(error => {
                dispatch(fullPageLoader(false));
                dispatch(updateAlertMessage({ status: 'error', message: error.message }));
            });
      
          const countryList = countryListAPI({})
            .catch(error => {
                dispatch(fullPageLoader(false));
                dispatch(updateAlertMessage({ status: 'error', message: error.message }));
            });
      
          // Start both API calls at the same time
          const [userDetailsResult, countryListResult] = await Promise.all([userDetails, countryList]);
      
          // Check if both API calls were successful
          if (userDetailsResult && countryListResult) {
            //console.log('Both API calls were successful');
            // Handle success for both API calls
            dispatch(fullPageLoader(false));
            setReloadCheck(false);
            if (userInfo?.success == false && userInfo?.statusCode != 401) {
                if (userInfo?.status == 'FETCH_ERROR' || userInfo?.status == 'PARSING_ERROR') {
                    dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
                } 
                else {
                    dispatch(updateAlertMessage({ status: 'error', message: userInfo?.message }));
                }
            }
            else if(userInfo?.success == true){
                //Update Local Storage
                let localUser = JSON.parse(localStorage.getItem('user') as string);
                localUser.accId = userInfo?.user?.accId;
                localUser.orgId = userInfo?.user?.orgId;
                localUser.accountType = userInfo?.user?.accountType;
                dispatch(updateUser(localUser));
                localStorage.setItem('user', JSON.stringify(localUser));
            }
          }
        }
        fetchData();
    }, [reloadCheck]); 

    useEffect(() => {
        if (userInfo?.user) {
            setValue('username', userInfo.user.username);
            setValue('firstName', userInfo.user.firstName);
            setValue('lastName', userInfo.user.lastName);
            setValue('city', userInfo.user.city);
            setValue('state', userInfo.user.state);
            setValue('postcode', userInfo.user.postcode);
            setValue('country', userInfo.user.country);
            setValue('email', userInfo.user.email);
            setValue('businessemail', userInfo.user.businessemail);
            setValue('mobile', userInfo.user.mobile);
            // setValue('companyname', userInfo.user.companyname);
            setValue('companyWebsite', userInfo.user.companyWebsite);
            setValue('linkedInURL', userInfo.user.linkedInURL);
            setValue('title', userInfo.user.title);
            setValue('userStory', userInfo.user.userStory);
            setValue('showRefKey', userInfo.user.showRefKey);
            setValue('refKey', userInfo.user.refKey);
            const selectedInternalSourceValue = internalSourceOptions.find(option => option.value === userInfo.user.internalsource) ? userInfo.user.internalsource : "other";
            setValue('internalSource', selectedInternalSourceValue);
            if(selectedInternalSourceValue === "other") {
                setOtherSource(userInfo.user.internalsource);
                setSource("other");
            }
            setCompanyAssocStatus(userInfo.user.accountAssociation);
            setLocalUserObj(userInfo?.user);
        }
      }, [userInfo, setValue]);
    
    useEffect(() => {
        if (user?.showRefKey === false) {
            setShowRefKeyInput(false);
        }
      }, [user?.showRefKey]);
    
    const onSubmit: SubmitHandler<userProfileInterface> = (data: any) => {
        dispatch(fullPageLoader(true));
        const payload = {
            ...data,
            internalSource: source === 'other' ? otherSource : source
        }
        updateUserProfileAPI(payload)
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSource(event.target.value);
        if (event.target.value !== 'other') {
            setOtherSource('');
        }
    };

    const handleUploadImage = (data:any)=>{
        const payload = {
            image: data,
            type: "userProfile"
        }
        uploadImageAPI(payload)
        .then(() => {
            // Close the modal manually
            var myModalEl = document.getElementById(uploadImageModalId)
            if (myModalEl) {
                var modal = Modal.getInstance(myModalEl)
                modal?.hide()
            }
        })
    }

    useEffect(() => {
        if (isUploadingImageSuccess) {
            if (uploadedImage?.statusCode == 401) {
                dispatch(updateIsSessionExpired(true));
                dispatch(updateReloadPageAfterSessionExpired(false));
            } else if (uploadedImage?.success == false) {
                dispatch(updateAlertMessage({ status: 'error', message: uploadedImage?.message }));
            } else if (uploadedImage?.success == true) {
                dispatch(updateAlertMessage({ status: 'success', message: uploadedImage?.message }));
                let user = JSON.parse(localStorage.getItem('user') as string);
                user.picPath = uploadedImage?.picPath;
                dispatch(updateUser(user));
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                if (uploadedImage?.status == 'FETCH_ERROR' || uploadedImage?.status == 'PARSING_ERROR') {
                    dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
                } else {
                    dispatch(updateAlertMessage({ status: 'error', message: uploadedImage?.message }));
                }
            }
        }
        if (isUploadingImageEror) {
            dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
        }
    }, [isUploadingImageSuccess, isUploadingImageEror])

    useEffect(()=> {
    if (isCreateSuccess) {
        dispatch(fullPageLoader(false));
        if (createUserResponse?.statusCode == 401) {
          dispatch(updateIsSessionExpired(true));
          dispatch(updateReloadPageAfterSessionExpired(false));
        } else if (createUserResponse?.success == false) {
          dispatch(updateAlertMessage({ status: 'error', message: createUserResponse?.message }));
        }
        else if (createUserResponse?.success == true) {
            dispatch(updateAlertMessage({ status: 'success', message: createUserResponse?.message }));
            if('showRefKey' in createUserResponse?.user && createUserResponse?.user?.showRefKey === false){
                setIsUpdated(true);
            }
            setReloadCheck(!reloadCheck);
            let user = JSON.parse(localStorage.getItem('user') as string);
            user.userEmail = createUserResponse?.user?.email;
            user.userId = createUserResponse?.user?.userId;
            user.firstName = createUserResponse?.user?.firstName;
            user.lastName = createUserResponse?.user?.lastName;
            user.picPath = createUserResponse?.user?.picPath;
            user.totalCCPoints = createUserResponse?.user?.totalCCPoints;
            user.usrCreatedDate = createUserResponse?.user?.usrCreatedDate;
            user.referralId = createUserResponse?.user?.referralId;
            user.showRefKey = createUserResponse?.user?.showRefKey;
            user.internalsource = createUserResponse?.user?.internalsource;
            user.isNewUser = false;
            user.isProfileComplete = true;
            dispatch(updateUser(user));
            localStorage.setItem('user', JSON.stringify(user));
        }
        else {
          if (createUserResponse?.status == 'FETCH_ERROR' || createUserResponse?.status == 'PARSING_ERROR') {
            dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
          } else {
            dispatch(updateAlertMessage({ status: 'error', message: createUserResponse?.message }));
          }
        }
      }
  
      if (isCreateError) {
        dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
      }
    }, [isCreateError, isCreateSuccess])

    return(
        <>
            <div className="container">
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 order-md-1 order-4 mb-3">
                        <UserCard />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 order-md-2 order-2 mb-3">
                        <AccountingDashboard id="userProfile_AccountingDashboard"
                            accountType="user"
                            userDetails={localUserObj}
                            setReloadCheck={setReloadCheck}
                            title={t('accountDashboard.title')} 
                            helpTitle={t('accountDashboard.help.title')} 
                            helpContent={t('accountDashboard.help.content')}
                        />
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 order-md-3 order-5 mb-3">
                        <Statistics id="userProfile_Analytics" cardHeightClass={'h-100'} statsType="user"/>
                    </div>
                
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 order-md-4 order-1 mb-3">
                        <Card id='userProfile_myConnections' cardHeightClass={''} like={false} share={false} help={true} helpTitle={t('my_connections.help.title')} helpContent={t('my_connections.help.content')} titleType={1} title={t('my_connections.title')} Feedback={true} logo={true}>
                            {t('my_connections.label.invited_by')}: {userInfo?.user?.invitedByUserFirstname} {userInfo?.user?.invitedByUserLastname}
                        </Card>
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 order-md-5 order-3 mb-3">     
                    <Card cardHeightClass={''} like={false} share={false} help={true} helpTitle={t('userProfile.help.title')} helpContent={t('userProfile.help.content')} titleType={1} title={t('userProfile.title')} Feedback={true} logo={true} id="userProfile_ProfileDetails">
                         {
                            isCountryListSuccess && countryListData.statusCode && countryListData.statusCode == '401'?(
                                <h5>Please login to edit your profile.</h5>
                            ):<form id="profileEdit" onSubmit={handleSubmit(onSubmit)} > 
                            <div className="row">
                                <div className="col-lg-9">
                                    <div className="row g-2">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.username.label')}<span className="text-danger">*</span></label>
                                                <input type="text" 
                                                className={`form-control ${errors?.username ? 'is-invalid' : ''}`}
                                                id="username" placeholder={t('userProfile.form_field.username.placeholder')} 
                                                
                                                {...register('username', { required: true, maxLength:26 })}/>
                                                <div className="invalid-feedback">
                                                    {errors.username && errors.username.type === 'required' && t('userProfile.form_field.username.validation_message.required')}
                                                    {errors.username && errors.username.type === 'maxLength' && t('userProfile.form_field.username.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.firstname.label')}<span className="text-danger">*</span></label>
                                                <input type="text" 
                                                className={`form-control ${errors?.firstName ? 'is-invalid' : ''}`}
                                                id="firstName" placeholder={t('userProfile.form_field.firstname.placeholder')} 
                                                // value={userInfo?.user?.firstName}
                                                {...register('firstName', { required: true, maxLength:26 })}/>
                                                <div className="invalid-feedback">
                                                    {errors.firstName && errors.firstName.type === 'required' && t('userProfile.form_field.firstname.validation_message.required')}
                                                    {errors.firstName && errors.firstName.type === 'maxLength' && t('userProfile.form_field.firstname.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.lastname.label')}<span className="text-danger">*</span></label>
                                                <input 
                                                type="text" placeholder={t('userProfile.form_field.lastname.placeholder')} 
                                                // value={userInfo?.user?.lastName}
                                                className={`form-control ${errors?.lastName ? 'is-invalid' : ''}`}
                                                {...register('lastName', { required: true, maxLength:26 })} 
                                                id="lastName"/>
                                                <div className="invalid-feedback">
                                                    {errors.lastName && errors.lastName.type === 'required' && t('userProfile.form_field.lastname.validation_message.required')}
                                                    {errors.lastName && errors.lastName.type === 'maxLength' && t('userProfile.form_field.lastname.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.city.label')}<span className="text-danger">*</span></label>
                                                <input type="text" placeholder={t('userProfile.form_field.city.placeholder')}
                                                className={`form-control ${errors?.city ? 'is-invalid' : ''}`}
                                                // value={userInfo?.user?.city}
                                                {...register('city', { required: true, maxLength:26 })}  
                                                id="city"/>
                                                <div className="invalid-feedback">
                                                    {errors.city && errors.city.type === 'required' && t('userProfile.form_field.city.validation_message.required')}
                                                    {errors.city && errors.city.type === 'maxLength' && t('userProfile.form_field.city.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.state.label')}</label>
                                                <input type="text" placeholder={t('userProfile.form_field.state.placeholder')}
                                                className={`form-control ${errors?.state ? 'is-invalid' : ''}`}
                                                // value={userInfo?.user?.city}
                                                {...register('state', { maxLength:26 })}  
                                                id="state"/>
                                                <div className="invalid-feedback">
                                                    {errors.state && errors.state.type === 'maxLength' && t('userProfile.form_field.state.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.postal_code.label')}</label>
                                                <input type="text" placeholder={t('userProfile.form_field.postal_code.placeholder')}
                                                className={`form-control ${errors?.postcode ? 'is-invalid' : ''}`}
                                                // value={userInfo?.user?.postcode}
                                                {...register('postcode', { maxLength:26 })}  
                                                id="postcode"/>
                                                <div className="invalid-feedback">
                                                    {errors.postcode && errors.postcode.type === 'maxLength' && t('userProfile.form_field.postal_code.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                        {isCountryListLoading ? (
                                            <p>{t('message.loading')}</p>
                                            ) : (

                                            <div className="mb-3">{isCountryListSuccess}
                                                <label className="form-label">{t('userProfile.form_field.country.label')}<span className="text-danger">*</span></label>
                                                
                                                <select className={`form-select ${errors?.country ? 'is-invalid' : ''}`} id="country" {...register('country', { required: true })} >
                                                {/* <option value="" selected>Please select company</option> */}
                                                {isCountryListSuccess && countryListData && countryListData.countryData && countryListData?.countryData.map(({ country_ID, country_code, country }: { country_ID: number; country_code: string; country:string;}) => (
                                                    <option key={country_ID} value={country_code}>
                                                    {country}
                                                    </option>
                                                ))}
                                                </select>

                                                <div className="invalid-feedback">
                                                    {errors.country && errors.country.type === 'required' && t('userProfile.form_field.country.validation_message.required')}
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.email.label')}<span className="text-danger">*</span></label>
                                                <input type="email" placeholder={t('userProfile.form_field.email.placeholder')}
                                                className={`form-control ${errors?.email ? 'is-invalid' : ''}`}
                                                {...register('email', { required: true,  maxLength:250, pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message: t('userProfile.form_field.email.validation_message.invalid')
                                                } })}
                                                id="email"/>
                                                <div className="invalid-feedback">
                                                    {errors.email && errors.email.type === 'required' && t('userProfile.form_field.email.validation_message.required')}
                                                    {errors.email && errors.email.type === 'pattern' && t('userProfile.form_field.email.validation_message.invalid_format')}
                                                    {errors.email && errors.email.type === 'maxLength' && t('userProfile.form_field.email.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.title.label')}</label>
                                                <input type="text" placeholder={t('userProfile.form_field.title.placeholder')} 
                                                    className={`form-control ${errors?.title ? 'is-invalid' : ''}`}
                                                    // value={userInfo?.user?.title}
                                                    {...register('title', { maxLength:60 })} 
                                                    id="title"/>                    

                                                <div className="invalid-feedback">
                                                    {errors.title && errors.title.type === 'maxLength' && t('userProfile.form_field.title.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.mobile_phn.label')}</label>
                                                <input type="text" placeholder={t('userProfile.form_field.mobile_phn.placeholder')} 
                                                    className={`form-control ${errors?.mobile ? 'is-invalid' : ''}`}
                                                    {...register('mobile', { maxLength:20, pattern: {
                                                        value: /^\s*[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9()]*\s*$/,
                                                        message: t('userProfile.form_field.mobile_phn.validation_message.invalid')
                                                    } })}
                                                    id="mobile"/>                    

                                                <div className="invalid-feedback">
                                                    {errors.mobile && errors.mobile.type === 'maxLength' && t('userProfile.form_field.mobile_phn.validation_message.maxlength')}
                                                    {errors.mobile && errors.mobile.type === 'pattern' && t('userProfile.form_field.mobile_phn.validation_message.invalid_format')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label className="form-label">{t('inputs.text.linkedin_url.label')}<span className="text-danger">*</span></label>
                                                <input type="text" placeholder={t('inputs.text.linkedin_url.placeholder')} 
                                                    className={`form-control ${errors?.linkedInURL ? 'is-invalid' : ''}`}
                                                    {...register('linkedInURL', { required: true, maxLength:250, 
                                                        pattern: {
                                                            value: /^(https?):\/\/\S+$/i,
                                                            message: t('inputs.text.linkedin_url.validation_message.url_invalid')
                                                        }
                                                    })} 
                                                    id="linkedInURL"
                                                />
                                                <div>
                                                    <small className="text-muted">e.g. https://www.linkedin.com/...</small>
                                                </div>                    
                                                <div className="invalid-feedback">                                                   
                                                    {errors.linkedInURL && errors.linkedInURL.type === "required" && t('inputs.text.linkedin_url.validation_message.required')}
                                                    {errors.linkedInURL && errors.linkedInURL.type === 'maxLength' && t('inputs.text.linkedin_url.validation_message.maxlength')}
                                                    {errors.linkedInURL && errors.linkedInURL.type === 'pattern' && t('inputs.text.linkedin_url.validation_message.url_invalid')}
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.company.label')}</label>
                                                <input type="text" placeholder={t('userProfile.form_field.company.placeholder')} 
                                                    className={`form-control ${errors?.companyname ? 'is-invalid' : ''}`}
                                                    // value={userInfo?.user?.companyname}
                                                    // {...register('companyname', { maxLength:26 })} 
                                                    readOnly={true}
                                                    id="companyname"/>                    

                                                <div className="invalid-feedback">
                                                    {errors.companyname && errors.companyname.type === 'maxLength' && t('userProfile.form_field.company.validation_message.maxlength')}
                                                </div> 
                                            </div>
                                        </div> */}
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.company_url.label')}</label>
                                                <input type="text" placeholder={t('userProfile.form_field.company_url.placeholder')}
                                                    className={`form-control ${companyAssocStatus >= 20 ? 'opacity-50' : ''} ${errors?.companyWebsite ? 'is-invalid' : ''}`}
                                                    readOnly={companyAssocStatus >= 20}
                                                    {...register('companyWebsite', {
                                                        maxLength: 250,
                                                        pattern: {
                                                            value: /^(https?):\/\/\S+$/i,
                                                            message: t('userProfile.form_field.company_url.validation_message.url_invalid')
                                                        }
                                                    })}
                                                    id="companyUrl"/>
                                                <div className="invalid-feedback">
                                                    {errors.companyWebsite && errors.companyWebsite.type === 'maxLength' && t('userProfile.form_field.company_url.validation_message.maxlength')}
                                                    {errors.companyWebsite && errors.companyWebsite.type === 'pattern' && t('userProfile.form_field.company_url.validation_message.url_invalid')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.bizz_email.label')}<span className="text-danger">*</span></label>
                                                <input type="email" placeholder={t('userProfile.form_field.bizz_email.placeholder')}
                                                className={`form-control ${errors?.businessemail ? 'is-invalid' : ''}`}
                                                {...register('businessemail', { required: true, maxLength:250, pattern: {
                                                    value: /\S+@\S+\.\S+/,
                                                    message: t('userProfile.form_field.bizz_email.validation_message.invalid')
                                                } })}
                                                id="businessemail"/>
                                                <div className="invalid-feedback">
                                                    {errors.businessemail && errors.businessemail.type === 'pattern' && t('userProfile.form_field.bizz_email.validation_message.invalid_format')}
                                                    {errors.businessemail && errors.businessemail.type === 'maxLength' && t('userProfile.form_field.bizz_email.validation_message.maxlength')}
                                                    {errors.businessemail && errors.businessemail.type === 'required' && t('userProfile.form_field.bizz_email.validation_message.required')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="mb-3">
                                                <label className="form-label">{t('userProfile.form_field.bio.label')}</label>
                                                <div>
                                                    <small id="CCuserStory" className="text-muted">
                                                        {250 - ccUserStory} {t('message.characters_remaining')}
                                                    </small>
                                                </div>
                                                <textarea 
                                                    rows={5} placeholder={t('userProfile.form_field.bio.placeholder')} 
                                                    className={`form-control ${errors?.userStory ? 'is-invalid' : ''}`} 
                                                    {...register('userStory', { maxLength:250 })}
                                                    onChange={e => setCCUserStory(e.target.value.length)}
                                                    id="story">
                                                </textarea>
                                                <div className="invalid-feedback">
                                                    {errors.userStory && errors.userStory.type === 'maxLength' && t('userProfile.form_field.bio.validation_message.maxlength')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            How did you hear about GPTBlue?
                                        </div>
                                        <div className="col-lg-6">
                                            <div className=''>
                                                <select className='form-select'
                                                    {...register('internalSource')}
                                                    onChange={handleChange}
                                                >
                                                    {internalSourceOptions.map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            {source === 'other' &&
                                            <div className=''>
                                                <input type='text' placeholder='Please specify' maxLength={250} className='form-control' value={otherSource} onChange={e => setOtherSource(e.target.value)} />
                                            </div> 
                                            } 
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-lg-3 text-center">
                                    <img src={isLoggedIn ? user?.picPath : NoPicture} className="blc_image_lg rounded rounded-circle image-fluid" />
                                    
                                    <div className="mt-3">
                                        <TooltipComponent title={t('userProfile.btn.edit_profile_pic.tooltip')} >
                                            <button type="button" className="btn btn-primary btn-md rounded-pill px-4" 
                                                data-bs-toggle="modal" 
                                                data-bs-target={`#${uploadImageModalId}`}
                                            >
                                                {t('userProfile.btn.edit_profile_pic.label')}
                                            </button>
                                        </TooltipComponent>
                                    </div>
                                    {userInfo?.user?.showRefKey && userInfo?.user?.showRefKey == true && !isUpdated && showRefKeyInput && 
                                        <div className="mt-5">
                                            <label className="form-label">{t('userProfile.form_field.referal_key.label')}</label>
                                            <input type='text' id='refKey' 
                                            className={`form-control ${errors?.refKey ? 'is-invalid' : ''}`}
                                            {...register('refKey', { maxLength:26 })} 
                                            placeholder={t('userProfile.form_field.referal_key.placeholder')} />
                                            <div className="invalid-feedback">
                                                {errors.refKey && errors.refKey.type === 'maxLength' && t('userProfile.form_field.referal_key.validation_message.maxlength')}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="text-center mt-3">
                                <TooltipComponent title={t('userProfile.btn.save.tooltip')} >
                                <button type="submit" className="btn btn-primary btn-md rounded-pill px-4">
                                    {t('userProfile.btn.save.label')}
                                </button>
                                </TooltipComponent>
                            </div>
                            
                            </form>
                        }
                        </Card>
                    </div>
                </div>
            </div>
            <ImageCrop
                id={uploadImageModalId} 
                imageSize={MAX_IMAGE_SIZE} 
                imageType={ALLOWED_FILE_TYPES} 
                handleImageUpload={handleUploadImage} 
                maintainAspectRatio={true}
            />
        </> 
    ) 
}

export default UserProfileEdit;
