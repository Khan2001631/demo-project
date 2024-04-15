import React, { useEffect, useState } from 'react';
import Card from '../../../components/common/card/card';
import { useTranslation } from 'react-i18next';
import NoLogo from '../../../assets/images/nologo.jpg';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import { Modal, Tooltip } from 'bootstrap';
import { SubmitHandler, useForm, FieldValues, set  } from "react-hook-form";
import ImageCrop from '../../../components/secure/upload-image/upload-image';
import { useCompanyCreateRequestMutation, useGetAccCreateRequestMutation } from '../../../api-integration/secure/secure';
import { useDispatch } from 'react-redux';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import { use } from 'i18next';

interface IAddUpdateCompanyProps {
    ACCID: number;
    COMPANYNAME: string;
    REGISTRATIONNO: string;
    COMPANYTYPE: string;
    COMPANYREVENUE: string;
    COMPANYWEBSITE: string;
    ACCOUNTSTATUS: string;
    COMPANYSIZE: string;
    COMPANYAGE: string;
    HEADLINE: string;
    ABOUT: string;
    TEMPCOMPANYLOGO: string;
}

const AddUpdateCompany: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];
    const MAX_IMAGE_SIZE = 2097152; // 2 MB in bytes
    const uploadLogoModalId = 'uploadLogoModal';
    const [logoBase64Data, setLogoBase64Data] = useState('');
    const [localAccId, setLocalAccId] = useState(0);
    const {register, handleSubmit, setValue, formState: { errors },} = useForm<IAddUpdateCompanyProps>();
    const formFields: ('ACCID' | 'COMPANYNAME' | 'REGISTRATIONNO' | 'COMPANYTYPE' | 'COMPANYREVENUE' | 'COMPANYWEBSITE' | 'ACCOUNTSTATUS' | 'COMPANYSIZE' | 'COMPANYAGE' | 'HEADLINE' | 'ABOUT' | 'TEMPCOMPANYLOGO' )[]
        = ['ACCID', 'COMPANYNAME', 'REGISTRATIONNO', 'COMPANYTYPE', 'COMPANYREVENUE', 'COMPANYWEBSITE', 'ACCOUNTSTATUS', 'COMPANYSIZE', 'COMPANYAGE', 'HEADLINE', 'ABOUT', 'TEMPCOMPANYLOGO'];

    const [companyCreateRequestAPI, { data: companyCreateRequestData, error: companyCreateRequestError, isLoading: isLoadingcompanyCreateRequest, isSuccess: isSuccesscompanyCreateRequest, isError: isErrorcompanyCreateRequest }]
        =useCompanyCreateRequestMutation();
    const [getAccCreateRequestAPI, { data: getAccCreateRequestData, error: getAccCreateRequestError, isLoading: isLoadinggetAccCreateRequest, isSuccess: isSuccessgetAccCreateRequest, isError: isErrorgetAccCreateRequest }]
        =useGetAccCreateRequestMutation();

    useEffect(() => {
        dispatch(fullPageLoader(true));
        getAccCreateRequestAPI({ACCID: 0});
    }, []);

    useEffect(() => {
        if(isSuccessgetAccCreateRequest && getAccCreateRequestData){
            dispatch(fullPageLoader(false));
            if(getAccCreateRequestData?.success == true){
                const accData = getAccCreateRequestData?.companyRequestData?.[0];
                if(isSuccessgetAccCreateRequest && accData){ 
                    setLogoBase64Data(accData?.TEMPCOMPANYLOGO);
                    // Set the data to the form fields
                    formFields.forEach(field => {
                        let formFieldvalue = accData?.[field];
                        // If the field is a dropdown and the value is null, set it to an empty string
                        if (field === 'COMPANYTYPE' || field === 'COMPANYREVENUE' || field === 'ACCOUNTSTATUS' || field === 'COMPANYSIZE' || field === 'COMPANYAGE') {
                            formFieldvalue = formFieldvalue || '';
                        }
                        if(field === 'TEMPCOMPANYLOGO'){
                            setLogoBase64Data(formFieldvalue);
                        }
                        if(field === 'ACCID'){
                            setLocalAccId(formFieldvalue);
                        }
                        setValue(field, formFieldvalue);
                    });
                }
            }
        }
        if(isErrorgetAccCreateRequest || getAccCreateRequestError){
            dispatch(fullPageLoader(false));
        }
    }, [isSuccessgetAccCreateRequest, isErrorgetAccCreateRequest, getAccCreateRequestError]);
    
    const handleUploadImage = (data:any)=>{
        //console.log(data);
        setLogoBase64Data(data);
        const payload = {
            image: data,
            type: "userProfile"
        }
        //uploadImageAPI(payload)
        //.then(() => {
            // Close the modal manually
            var myModalEl = document.getElementById(uploadLogoModalId)
            if (myModalEl) {
                var modal = Modal.getInstance(myModalEl)
                modal?.hide()
            }
        //})
    }
    
    
    const onSubmit: SubmitHandler<IAddUpdateCompanyProps> = (data: any) => {
        const payload = {
            ...data,
            ACCID: localAccId,
            TEMPCOMPANYLOGO: logoBase64Data,
        }
        dispatch(fullPageLoader(true));
        companyCreateRequestAPI(payload);
    }
    useEffect(() => {
        if(isSuccesscompanyCreateRequest && companyCreateRequestData){
            dispatch(fullPageLoader(false));
            if(companyCreateRequestData?.success == true){
                dispatch(updateAlertMessage({ status: 'success', message: companyCreateRequestData?.message }));
                setLocalAccId(companyCreateRequestData?.companyDetail?.ACCID);
            }
            else{
                dispatch(updateAlertMessage({ status: 'error', message: companyCreateRequestData?.message }));
            }
        }
        if(isErrorcompanyCreateRequest || companyCreateRequestError){
            dispatch(fullPageLoader(false));
        }
    }, [isSuccesscompanyCreateRequest, isErrorcompanyCreateRequest, companyCreateRequestError]);

    return (
        <>
        <Card id="ManageCompany_CompanyInformation" like={false} share={false} help={true} helpTitle={t('card.manage_company.help.title')} helpContent={t('card.manage_company.help.content')} titleType={1} title={t('card.manage_company.title')} Feedback={true} logo={true}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='row mb-3'>
                    <div className="col-md-3">
                        <label htmlFor="companyN">
                            {t('inputs.text.company_name.label')}<span className='text-danger'>*</span>
                        </label>
                        <input type="text" 
                            className={`form-control ${errors?.COMPANYNAME ? "is-invalid" : ""}`}
                            id="companyN"
                            maxLength={125} 
                            placeholder={t('inputs.text.company_name.placeholder')}
                            {...register("COMPANYNAME", {required: true})}
                        />
                        <div className="invalid-feedback">
                            {errors.COMPANYNAME && errors.COMPANYNAME.type === "required" && t("inputs.text.company_name.validation_message.required")}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="regNo">
                            <TooltipComponent title={t('inputs.text.registration_no.tooltip')} >
                                {t('inputs.text.registration_no.label')}
                            </TooltipComponent>
                        </label>
                        <input type="text" 
                            className="form-control" 
                            id="regNo"
                            maxLength={50} 
                            placeholder={t('inputs.text.registration_no.placeholder')} 
                            {...register("REGISTRATIONNO")}
                            
                        />
                    </div>
                    <div className="col-md-3">
                        <label className='form-label'>
                            <TooltipComponent title={t('inputs.select.company_type.tooltip')} >
                                {t('inputs.select.company_type.label')}
                            </TooltipComponent>
                        </label>
                        <select 
                            className='form-select'
                            {...register('COMPANYTYPE')}
                        >
                            <option value="">{t('inputs.select.company_type.default_option')}</option>
                            <option value="Producer">Producer</option>
                            <option value="Developer">Developer</option>
                            <option value="Trade">Trade</option>
                            <option value="Service">Service</option>
                            <option value="ASS">ASS</option>
                            <option value="NGO">NGO</option>
                            <option value="EDU">EDU</option>
                            <option value="GOV">GOV</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className='form-label'>
                            <TooltipComponent title={t('inputs.select.revenue.tooltip')}>
                                {t('inputs.select.revenue.label')}
                            </TooltipComponent>
                        </label>
                        <select 
                            className='form-select'
                            {...register('COMPANYREVENUE')}
                        >
                            <option value="">{t('inputs.select.revenue.default_option')}</option>
                            <option value="$1M or less">$1M or less</option>
                            <option value="1-9M">1-9M</option>
                            <option value="$10-75">$10-75</option>
                            <option value="$76-250">$76-250</option>
                            <option value="250-1B">250-1B</option>
                            <option value="Over 1B">Over 1B</option>
                        </select>
                    </div>
                </div>
                <div className='row mb-3'>
                    <div className="col-md-3">
                        <label htmlFor="compWebsite">{t('inputs.text.company_website.label')}</label>
                        <input type="text" 
                            className={`form-control ${errors?.COMPANYWEBSITE ? "is-invalid" : ""}`}
                            id="compWebsite"
                            maxLength={250} 
                            placeholder={t('inputs.text.company_website.placeholder')}
                            {...register('COMPANYWEBSITE', {
                                pattern: {
                                    value: /^(https?):\/\/\S+$/i,
                                    message: t('inputs.text.company_website.url_invalid')
                                }
                            })}
                        />
                        <div className="invalid-feedback">
                            {errors.COMPANYWEBSITE && errors.COMPANYWEBSITE.type === 'pattern' && t('inputs.text.company_website.url_invalid')}
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className='form-label'>
                            <TooltipComponent title={t('inputs.select.account_status.tooltip')} >
                                {t('inputs.select.account_status.label')}
                            </TooltipComponent>
                        </label>
                        <select 
                            className='form-select'
                            {...register('ACCOUNTSTATUS')}
                        >
                            <option value="">{t('inputs.select.account_status.default_option')}</option>
                            <option value="Customer">Customer</option>
                            <option value="Partner">Partner</option>
                            <option value="Explorer">Explorer</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className='form-label'>
                            <TooltipComponent title={t('inputs.select.company_size.tooltip')} >
                                {t('inputs.select.company_size.label')}
                            </TooltipComponent>
                        </label>
                        <select 
                            className='form-select'
                            {...register('COMPANYSIZE')}
                        >
                            <option value="">{t('inputs.select.company_size.default_option')}</option>
                            <option value="1-9">1-9</option>
                            <option value="10-100">10-100</option>
                            <option value="100-1,000">100-1,000</option>
                            <option value="1,000+">1,000+</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className='form-label'>
                            <TooltipComponent title={t('inputs.select.company_founded.tooltip')} >
                                {t('inputs.select.company_founded.label')}
                            </TooltipComponent>
                        </label>
                        <select 
                            className='form-select'
                            {...register('COMPANYAGE')}
                        >
                            <option value="">{t('inputs.select.company_founded.default_option')}</option>
                            <option value="before &lt;1960">before &lt;1960</option>
                            <option value="&lt;1980">&lt;1980</option>
                            <option value="&lt;2000">&lt;2000</option>
                            <option value="&lt;2020">&lt;2020</option>
                            <option value="&gt;2020">&gt;2020</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <div className='mb-3'>
                                    <label htmlFor="headline">
                                        <TooltipComponent title={t('inputs.text.headline_company.tooltip')} >
                                            {t('inputs.text.headline_company.label')}
                                        </TooltipComponent>
                                    </label>
                                    <input type="text" 
                                        className="form-control" 
                                        id="headline"
                                        maxLength={250} 
                                        placeholder={t('inputs.text.headline_company.placeholder')} 
                                        {...register("HEADLINE")}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="about">
                                        <TooltipComponent title={t('inputs.textarea.about.tooltip')} >
                                            {t('inputs.textarea.about.label')}
                                        </TooltipComponent>
                                    </label>
                                    <textarea 
                                        className="form-control" 
                                        id="about"
                                        maxLength={500} 
                                        placeholder={t('inputs.textarea.about.placeholder')} 
                                        {...register("ABOUT")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 text-center">
                        <div className='mb-2'>
                            <TooltipComponent title={t('inputs.file.logo_upload.tooltip')} >
                                {t('inputs.file.logo_upload.label')}
                            </TooltipComponent>
                        </div>
                        <img src={logoBase64Data != '' ? logoBase64Data : NoLogo} className="h-7 image-fluid" />   
                        
                        <div className="mt-3">
                            <TooltipComponent title={t('buttons.edit_logo.tooltip')} >
                                <button type="button" className="btn btn-primary btn-md rounded-pill px-4" 
                                    data-bs-toggle="modal" 
                                    data-bs-target= {`#${uploadLogoModalId}`}
                                >
                                    {t('buttons.edit_logo.label')}
                                </button>
                            </TooltipComponent>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-md-12 text-center">
                        <TooltipComponent title={t('buttons.submit.tooltip')} >
                            <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4">
                                {t('buttons.submit.label')}
                            </button>
                        </TooltipComponent>
                    </div>
                </div>
            </form>
        </Card>
        <ImageCrop
            id={uploadLogoModalId} 
            imageSize={MAX_IMAGE_SIZE} 
            imageType={ALLOWED_FILE_TYPES} 
            handleImageUpload={handleUploadImage} 
            maintainAspectRatio={false}
        />
        </>
    );
};

export default AddUpdateCompany;