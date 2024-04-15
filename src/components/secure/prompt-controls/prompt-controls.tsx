import React, { useEffect, useState } from 'react';
import Card from '../../common/card/card';
import { useTranslation } from 'react-i18next';
import { createPromptNameDescInterface } from '../../../interfaces/prompts/prompts.interface';
import { set, useForm } from 'react-hook-form';
import TooltipComponent from '../../common/bootstrap-component/tooltip-component';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Freeze from '../../../assets/icons/freeze.svg';
import Share from '../../../assets/icons/share.svg';
import Deploy from '../../../assets/icons/deploy.svg';
import EuroSvg from "../../../components/common/icons/euro-svg";
import Copy from '../../../assets/icons/copy.svg';
import image from '../../../assets/icons/no-image.svg';
import Versions from '../../../assets/icons/versions.svg';
import History from '../../../assets/icons/history.svg';
import Delete from '../../../assets/icons/delete.svg';
import Duplicate from '../../../assets/icons/duplicate.svg';
import Plus from '../../../assets/icons/plus.svg';
import { useDispatch } from 'react-redux';
import { fullPageLoader, updateAlertMessage, updateUser } from '../../../api-integration/commonSlice';
import { useCopyPromptsMutation, useCreatePromptMutation, useDeployPromptsMutation, useUpdatePromptsMutation } from '../../../api-integration/secure/prompts';
import PromptDeployModal from '../modals/prompt-deploy';
import PromptShareModal from '../../secure/modals/prompt-share';
import { useGenerateImageMutation, useGetUserProfileMutation } from '../../../api-integration/secure/secure';
import HelpModal from '../../common/help-modal/help-modal';


const localPromptPremiumCCMax = 5000000;

interface PromptControlsProps {
    selectedPromptData?: any;
    mode: 'create' | 'edit';
    onConstFreezeSet: (freeze: string) => void;
    onConstIterativeSet: (iterative: boolean) => void;
    onConstFunctionCallSet: (functionCall: boolean) => void;
    onConstCustomDataSet: (customData: boolean) => void;
    onConstCustomModelIdSet: (customModelId: string) => void;
    onConstPromptLevelSet: (promptLevel: number) => void;
    onConstAutoSaveSet: (autoSave: boolean) => void;
    customModelData: any;
    onPromptFieldChange: (field: string, value: any) => void;
    onPromptFormDataSubmit: () => void;
    childConstDefaultActionCCount: number;
}

const PromptControls: React.FC<PromptControlsProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const DOMAIN_URL = window.location.origin;
    const promptDeployModalId = "promptDeployModal";
    const promptShareModalId = "promptShareModal";
    const defaultPromptLevel = 0;
    const { register, handleSubmit, formState: { errors }, setValue, clearErrors, trigger } = useForm<createPromptNameDescInterface>();
    const [bottomText, setBottomText] = useState('');
    const [localAccId, setLocalAccId] = useState(0);
    const [localUserId, setLocalUserId] = useState(0);
    const [helpTitle, setHelpTitle] = useState('');
    const [helpContent, setHelpContent] = useState('');
    
    
    const [promptNameCCount, setPromptNameCCount] = useState(props?.selectedPromptData?.PROMPTNAME ? 500-props?.selectedPromptData?.PROMPTNAME.length : 500);
    const [promptDescriptionCCount, setPromptDescriptionCCount] = useState(props?.selectedPromptData?.PROMPTDESCRIPTION ? 500-props?.selectedPromptData?.PROMPTDESCRIPTION.length : 500);
    const [localAuthorView, setLocalAuthorView] = useState(false);
    const [localOpenSource, setLocalOpenSource] = useState(false);
    const [averageCCUsed, setAverageCCUsed] = useState(0);  
    const [localAutoSave, setLocalAutoSave] = useState(false);
    const [localAllowCopy, setLocalAllowCopy] = useState(false);
    const [localIterativeTask, setLocalIterativeTask] = useState(false);
    const [localCustomData, setLocalCustomData] = useState(false);
    const [localFunctionCall, setLocalFunctionCall] = useState(false);
    const [localPromptLevel, setLocalPromptLevel] = useState(defaultPromptLevel);
    const [localPublicAccessibility, setLocalPublicAccessibility] = useState(0);
    const [localFreezeStatus, setLocalFreezeStatus] = useState(props?.selectedPromptData?.PROMPTSTAUS ? props?.selectedPromptData?.PROMPTSTAUS : '');
    const [localConstPromptDesc, setLocalConstPromptDesc] = useState(props?.selectedPromptData?.PROMPTDESCRIPTION ? props?.selectedPromptData?.PROMPTDESCRIPTION : '');   
    const [localConstImageSrc, setLocalConstImageSrc] = useState(props.selectedPromptData?.promptImage || image);
    const [localConstDescRequired, setLocalConstDescRequired] = useState('');
    const [localTotalCCUsed, setLocalTotalCCUsed] = useState(0);
    const [localCustomModelId, setLocalCustomModelId] = useState(props?.selectedPromptData?.customModelDetail?.[0]?.CUSTOMMODELID || 0);
    const [selectedCustomDescription, setSelectedCustomDescription] = useState(props?.selectedPromptData?.customModelDetail?.[0]?.MODELDESCRIPTION || '');
    const [promptEarning, setPromptEarning] = useState(0);

    const [freezePromptsAPI, { data: freezePromptsData, isLoading: isUFreezePromptLoading, isSuccess: isFreezePromptSuccess, isError: isFreezePromptError, error: freezePromptError }] =
        useUpdatePromptsMutation();
    const [deletePromptsAPI, { data: deletePromptsData, isLoading: isDeletePromptLoading, isSuccess: isDeletePromptSuccess, isError: isDeletePromptError, error: deletePromptError }] =
        useUpdatePromptsMutation();
    const [deployPromptsAPI, { data: deployPromptsData, isLoading: isDeployPromptLoading, isSuccess: isDeployPromptSuccess, isError: isDeployPromptError, error: deployPromptError }] =
        useDeployPromptsMutation();
    const [copyPromptsAPI, { data: copyPromptsData, isLoading: isCopyPromptLoading, isSuccess: isCopyPromptSuccess, isError: isCopyPromptError, error: copyPromptError }] =
        useCopyPromptsMutation();
    
    const [generateImageAPI, { data: generateImageData, isLoading: isGenerateImageLoading, isSuccess: isGenerateImageSuccess, isError: isGenerateImageError, error: generateImageError }]=
        useGenerateImageMutation();
    const [getUserDetailsAPI, { data: userInfo, isLoading: isUserDetailLoding, isSuccess: isUserDetailSuccess, isError: isUserDetailError, error: userDetailError  }] =
        useGetUserProfileMutation();
    

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user') as string);
        setLocalAccId(user?.accId);
        setLocalUserId(user?.userId);
    }, [localStorage]);

    useEffect(() => {
        if (isFreezePromptSuccess) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'success', message: props?.selectedPromptData?.PROMPTSTAUS == "freeze" ? t('message.success_unfreezed_prompt') : t('message.success_freezed_prompt') }));
            if(localFreezeStatus == "freeze"){
                setLocalFreezeStatus("active");
            }
            else{
                setLocalFreezeStatus("freeze"); 
            }
        }
        if (isFreezePromptError) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'error', message: freezePromptsData?.message }));
        }
    }, [isFreezePromptSuccess, isFreezePromptError]);

    useEffect(() => {
        if (isDeletePromptSuccess) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'success', message: deletePromptsData?.message }));
            navigate(`/app/prompts/create`);
        }
        if (isDeletePromptError) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'error', message: deletePromptsData?.message }));
        }
    }, [isDeletePromptSuccess, isDeletePromptError]);

    useEffect(() => {
        if (isDeployPromptSuccess) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'success', message: deployPromptsData?.message }));
            navigate(`/app/prompts/edit/${props?.selectedPromptData?.GPTBLUEPROMPTID}`);
        }
        if (isDeployPromptError) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'error', message: deployPromptsData?.message }));
        }
    }, [isDeployPromptSuccess, isDeployPromptError]);

    useEffect(() => {
        if (isCopyPromptSuccess) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'success', message: copyPromptsData?.message }));
            navigate(`/app/prompts/edit/${copyPromptsData?.promptId}`)
        }
        if (isCopyPromptError) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'error', message: copyPromptsData?.message }));
        }
    }, [isCopyPromptSuccess, isCopyPromptError]);

    
    useEffect(() => {
        setLocalFreezeStatus(props?.selectedPromptData?.PROMPTSTAUS);
        setAverageCCUsed(props?.selectedPromptData?.AverageToken == "" ? 0 : props?.selectedPromptData?.AverageToken);
    }, [props?.selectedPromptData]);

    useEffect(() => {
        if (props?.selectedPromptData) {
            setValue('PROMPTNAME', props?.selectedPromptData?.PROMPTNAME || '');
            setPromptNameCCount(500 - props?.selectedPromptData?.PROMPTNAME.length);
            setValue('PROMPTDESCRIPTION', props?.selectedPromptData?.PROMPTDESCRIPTION || '');
            setPromptDescriptionCCount(500 - props?.selectedPromptData?.PROMPTDESCRIPTION.length);
            setLocalConstPromptDesc(props?.selectedPromptData?.PROMPTDESCRIPTION || '')
            setLocalAuthorView(props?.selectedPromptData?.AUTHORVIEW || false);
            setLocalOpenSource(props?.selectedPromptData?.OPENSOURCE || false);
            setLocalAutoSave(props?.selectedPromptData?.AUTOSAVE || false)
            setLocalAllowCopy(props?.selectedPromptData?.ALLOWTOCOPY || false);
            setLocalIterativeTask(props?.selectedPromptData?.ITERATIVETASK=="yes" ? true : false);
            setLocalCustomData(props?.selectedPromptData?.CUSTOMDATA || false);
            setLocalFunctionCall(props?.selectedPromptData?.FUNCTIONCALL || false);
            setLocalPublicAccessibility(props?.selectedPromptData?.PUBLICACCESSIBILITY || 0);
            setLocalPromptLevel(props?.selectedPromptData?.PROMPTLEVEL=="S" ? 0 : props?.selectedPromptData?.PROMPTLEVEL=="A" ? 1 : 2 || defaultPromptLevel);
            setLocalConstImageSrc(props?.selectedPromptData?.promptImage || image);
            setLocalCustomModelId(props?.selectedPromptData?.customModelDetail?.[0]?.CUSTOMMODELID || 0);
            setSelectedCustomDescription(props?.selectedPromptData?.customModelDetail?.[0]?.MODELDESCRIPTION || '');
            let primiumValue = props?.selectedPromptData?.PREMIUMPRICECC || 0;
            setValue('PREMIUMPRICECC', primiumValue.toLocaleString());
            setPromptEarning(props?.selectedPromptData?.PREMIUMPRICECC || 0);
        } 
        // else {
        //     setValue('PROMPTNAME', '');
        //     setValue('PROMPTDESCRIPTION', '');
        //     setLocalAuthorView(false);
        //     setLocalOpenSource(false);
        //     setLocalAutoSave(false);
        //     setLocalAllowCopy(false);
        //     setLocalIterativeTask(false);
        //     setLocalCustomData(false);
        //     setLocalFunctionCall(false);
        //     setLocalPublicAccessibility(0);
        //     setLocalPromptLevel(defaultPromptLevel);
        //     setLocalConstImageSrc(image);
        //     setLocalCustomModelId(0);
        //     setSelectedCustomDescription('');
        // }
    }, [props?.selectedPromptData, setValue]);

    const handleChangeAuthorView = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalAuthorView(event.target.checked);
        setValue('AUTHORVIEW', event.target.checked ? 1 : 0);
        props.onPromptFieldChange('AUTHORVIEW', event.target.checked ? 1 : 0);
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
    };

    const handleChangeAutoSave = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalAutoSave(event.target.checked);
        setValue('AUTOSAVE', event.target.checked ? 1 : 0);
        props.onPromptFieldChange('AUTOSAVE', event.target.checked ? 1 : 0);
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
    };

    const handleChangeOpenSource = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalOpenSource(event.target.checked);
        setValue('OPENSOURCE', event.target.checked ? 1 : 0);
        props.onPromptFieldChange('OPENSOURCE', event.target.checked ? 1 : 0);
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
    };

    const handleChangeAllowCopy = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalAllowCopy(event.target.checked);
        setValue('ALLOWTOCOPY', event.target.checked ? 1 : 0);
        props.onPromptFieldChange('ALLOWTOCOPY', event.target.checked ? 1 : 0);
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
    };
    const handleChangeIterativeTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalIterativeTask(event.target.checked);
        setValue('ITERATIVETASK', event.target.checked ? 'yes' : 'no');
        props.onPromptFieldChange('ITERATIVETASK', event.target.checked ? 'yes' : 'no');
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
    };
    const handleChangeCustomData = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalCustomData(event.target.checked);
        if (event.target.checked) {
            setLocalFunctionCall(false);
        }
        setValue('CUSTOMDATA', event.target.checked ? 1 : 0);
        props.onPromptFieldChange('CUSTOMDATA', event.target.checked ? 1 : 0);
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
    };
    const handleChangeFunctionCall = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalFunctionCall(event.target.checked);
        if (event.target.checked) {
            setLocalCustomData(false);
        }
        setValue('FUNCTIONCALL', event.target.checked ? 1 : 0);
        props.onPromptFieldChange('FUNCTIONCALL', event.target.checked ? 1 : 0);
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
    };
    const handleChangeCustomModelId = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCustomIdValue = Number(event.target.value);
        setLocalCustomModelId(selectedCustomIdValue);
        setValue('CUSTOMMODELID', selectedCustomIdValue);
        props.onPromptFieldChange('CUSTOMMODELID', Number(event.target.value));
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
        if(event.target.value != "") {
            clearErrors('CUSTOMMODELID');
            setSelectedCustomDescription((props?.customModelData?.customModelDetail.find((item: any) => item.CUSTOMMODELID === selectedCustomIdValue)).MODELDESCRIPTION) 
        }
        else {
            setSelectedCustomDescription('');
        }
    };
    const handleChangePublicAccessibility = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalPublicAccessibility(Number(event.target.value));
        setValue('PUBLICACCESSIBILITY', Number(event.target.value));
        props.onPromptFieldChange('PUBLICACCESSIBILITY', Number(event.target.value));
        if(localAutoSave == true){
            props.onPromptFormDataSubmit();
        }
    }
    const handleChangePromptLevel = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalPromptLevel(Number(event.target.value));
        if (Number(event.target.value) == 0) {
            setLocalIterativeTask(false);
            setLocalCustomData(false);
            setLocalFunctionCall(false);
            setValue('PROMPTLEVEL', 'S');
            props.onPromptFieldChange('PROMPTLEVEL', 'S');
            if(localAutoSave == true){
                props.onPromptFormDataSubmit();
            }
        }
        else if (Number(event.target.value) == 1) {
            setLocalIterativeTask(false);
            setLocalCustomData(false);
            setLocalFunctionCall(false);
            setValue('PROMPTLEVEL', 'A');
            props.onPromptFieldChange('PROMPTLEVEL', 'A');
            if(localAutoSave == true){
                props.onPromptFormDataSubmit();
            }
        }
        else {
            setValue('PROMPTLEVEL', 'E');
            props.onPromptFieldChange('PROMPTLEVEL', 'E');
            if(localAutoSave == true){
                props.onPromptFormDataSubmit();
            }
        }
    }

    
    const contentCopyURL = () => {
        navigator.clipboard.writeText(`${DOMAIN_URL}/app/askgpt/${props?.selectedPromptData?.URLCODE}`)
        dispatch(updateAlertMessage({ status: 'success', message: t('message.copied_msg') }));
    }
    const copyPrompt = () => {
        if (window.confirm(t('message.confirm_copy_prompt')) == true) {
          dispatch(fullPageLoader(true));
          copyPromptsAPI({ "GPTBluePromptId": props?.selectedPromptData?.GPTBLUEPROMPTID });
        }
    }
    
    useEffect(() => {
        props.onConstFreezeSet(localFreezeStatus);
    }, [props.onConstFreezeSet, localFreezeStatus]);

    useEffect(() => {
        props.onConstIterativeSet(localIterativeTask);
    }, [props.onConstIterativeSet, localIterativeTask]);

    useEffect(() => {
        props.onConstFunctionCallSet(localFunctionCall);
    }, [props.onConstFunctionCallSet, localFunctionCall]);
    

    useEffect(() => {
        props.onConstCustomDataSet(localCustomData);
    }, [props.onConstCustomDataSet, localCustomData]);

    useEffect(() => {
        props.onConstCustomModelIdSet(localCustomModelId);
    }, [props.onConstCustomModelIdSet, localCustomModelId]);

    useEffect(() => {
        props.onConstAutoSaveSet(localAutoSave);
    }, [props.onConstAutoSaveSet, localAutoSave]);

    useEffect(() => {
        props.onConstPromptLevelSet(localPromptLevel);
    }, [props.onConstPromptLevelSet, localPromptLevel]);

    useEffect(() => {
        if (props.mode === 'edit' && props?.selectedPromptData) {
            const text = props?.selectedPromptData?.OWNERFIRSTNAME
            ? `Author: ${props?.selectedPromptData.OWNERFIRSTNAME} ${props?.selectedPromptData.OWNERLASTNAME}, ${props?.selectedPromptData.OWNERCOMPANY}`
            : '';
            setBottomText(text);
        }
      }, [props?.selectedPromptData, props?.mode]);

    const onSubmit = () => {
        props.onPromptFormDataSubmit();
    }

    const handleDeployConfirm = () => {
        dispatch(fullPageLoader(true));
        deployPromptsAPI({ "promptId": props?.selectedPromptData?.GPTBLUEPROMPTID });
    };

    const onGenerateImage = () => {
        if(localConstPromptDesc == "") {
            setLocalConstDescRequired("Description is required for generating image.")
            return;
        }
        setLocalConstDescRequired("");
        setLocalTotalCCUsed(0);
        dispatch(fullPageLoader(true));
        generateImageAPI({imageDescription: localConstPromptDesc, imageType: "prompt", accountType: "user", "promptId": props?.selectedPromptData?.GPTBLUEPROMPTID})
    };
    useEffect(() => {
        if (isGenerateImageSuccess) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'success', message: generateImageData?.message }));
            if(generateImageData?.imageData?.image){
                setLocalConstImageSrc(generateImageData?.imageData?.image);
                setLocalTotalCCUsed(generateImageData?.imageData?.totalUsedCC);
                dispatch(fullPageLoader(true));
                getUserDetailsAPI({accountType: 'user'});
            }
            else{
                setLocalConstImageSrc(image);
                setLocalTotalCCUsed(0);
            }
        }
        if (isGenerateImageError || generateImageError) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'error', message: generateImageData?.message }));
        }
    }, [isGenerateImageSuccess, isGenerateImageError, generateImageError]);
    
    useEffect(() => {
        if (isUserDetailSuccess) {
            dispatch(fullPageLoader(false));
            let user = JSON.parse(localStorage.getItem('user') as string);
            user.totalCCPoints = userInfo?.user?.totalCCPoints;
            dispatch(updateUser(user));
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (isUserDetailError || userDetailError) {
            dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'error', message: userInfo?.message }));
        }
    }, [isUserDetailSuccess, isUserDetailError, userDetailError]);


    return (
        <>
            <Card id="dtd_promptDefinition" titleType={1} title={t('card.Prompt_Framing_Controls.title')} cardHeightClass='h-100' bottomTextFlag={true} bottomText={bottomText} help={true} Feedback={true} settings={true} settingsDisabled={true} logo={true} share={true} helpTitle={t('card.Prompt_Framing_Controls.help.title')} helpContent={t('card.Prompt_Framing_Controls.help.content')} plusUrl="/app/prompts/create">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className="col-lg-6">
                            <div className={`${(localFreezeStatus == "freeze") ? 'disabled-item' : ''}`}>
                                <div className="mb-3">
                                    <label htmlFor="promptName1" className="fw-bold">{t('prompt.prompt_name')}<span className="text-danger">*</span></label>
                                    <div>
                                        <small className="text-muted">
                                            {promptNameCCount} {t('message.characters_remaining')}
                                        </small>
                                    </div>
                                    <input type="text" className={`form-control ${errors?.PROMPTNAME ? 'is-invalid' : ''}`} 
                                        id="promptName1" 
                                        {...register('PROMPTNAME', { required: true })} 
                                        maxLength={500} 
                                        onChange={e => {
                                            setPromptNameCCount(500 - e.target.value.length);
                                            props.onPromptFieldChange('PROMPTNAME', e.target.value);
                                            setValue('PROMPTNAME', e.target.value);
                                            if(e.target.value.length > 0){
                                                clearErrors('PROMPTNAME');
                                            }
                                            if (localAutoSave) {
                                                trigger('PROMPTNAME')
                                            }
                                        }}
                                        onBlur={e => {
                                            if(localAutoSave == true && e.target.value.length > 0 && e.target.value.length <= 500){
                                                props.onPromptFormDataSubmit();
                                            }
                                        }}
                                    />
                                    <div className="invalid-feedback">
                                        {errors.PROMPTNAME && errors.PROMPTNAME.type === 'required' && t('prompt.prompt_name_required')}
                                    </div>
                                </div>
                                <div className="mb-3 ">
                                    <label htmlFor="promptDescription" className="fw-bold">{t('prompt.prompt_description')}</label>
                                    <div>
                                        <small className="text-muted">
                                            {promptDescriptionCCount} {t('message.characters_remaining')}
                                        </small>
                                    </div>
                                    <textarea className="form-control" 
                                        id="promptDescription" 
                                        {...register('PROMPTDESCRIPTION')} 
                                        rows={3} maxLength={500}
                                        onChange={e => {
                                            setPromptDescriptionCCount(500 - e.target.value.length);
                                            setLocalConstPromptDesc(e.target.value);
                                            setLocalConstDescRequired("");
                                            props.onPromptFieldChange('PROMPTDESCRIPTION', e.target.value);
                                            setValue('PROMPTDESCRIPTION', e.target.value);
                                        }}
                                        onBlur={e => {
                                            if(localAutoSave == true){
                                                props.onPromptFormDataSubmit();
                                            }
                                        }}
                                    />
                                    <small className="text-danger">{localConstDescRequired}</small>
                                </div>
                                <div className="row">
                                    <div className="col-sm-7">
                                        <label htmlFor="pPremium" className="fw-bold">{t('inputs.text.prompt_premium.label')}</label>
                                        <div>
                                            <small className="text-muted">{t('inputs.text.prompt_premium.callomcoins')} ({t('inputs.text.prompt_premium.max')} {new Intl.NumberFormat('en-US').format(localPromptPremiumCCMax)})</small>
                                        </div>
                                    </div>
                                    <div className="col-sm-5">
                                        <div className="fw-bold">{t('inputs.text.prompt_earning.label')}</div>
                                        <div>
                                            <small className="text-muted">{t('inputs.text.prompt_premium.callomcoins')}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-7 mb-3'>
                                        {/* <label htmlFor="pPremium" className="fw-bold">{t('inputs.text.prompt_premium.label')}</label>
                                        <div><small className="text-muted">{t('inputs.text.prompt_premium.callomcoins')} ({t('inputs.text.prompt_premium.max')} {new Intl.NumberFormat('en-US').format(localPromptPremiumCCMax)})</small></div> */}
                                        <input type="text" className= "form-control" 
                                            id="pPremium"
                                            {...register('PREMIUMPRICECC')}
                                            placeholder={t('inputs.text.prompt_premium.placeholder')}
                                            onKeyDown={(e) => {
                                                if (['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                                    return;
                                                }
                                                let inputValue = Number((e.target as HTMLInputElement).value.replace(/,/g, '') + e.key);
                                                if (isNaN(inputValue) || inputValue > 5000000) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                let inputValue = Number(e.target.value.replace(/,/g, ''));
                                                if (!isNaN(inputValue) && inputValue <= 5000000) {
                                                    setPromptEarning(inputValue);
                                                    props.onPromptFieldChange('PREMIUMPRICECC', inputValue);
                                                    setValue('PREMIUMPRICECC', inputValue);
                                                    e.target.value = inputValue.toLocaleString();
                                                }
                                            }}
                                            onBlur={e => {
                                                if(localAutoSave == true){
                                                    props.onPromptFormDataSubmit();
                                                }
                                            }}
                                        />
                                        {/* <input type="number" className= "form-control" 
                                            id="pPremium"
                                            {...register('PREMIUMPRICECC')}
                                            placeholder={t('inputs.text.prompt_premium.placeholder')}
                                            onKeyDown={(e) => {
                                                if (['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                                    return;
                                                }
                                                let inputValue = Number((e.target as HTMLInputElement).value + e.key);
                                                if (inputValue > 5000000) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                let inputValue = Number(e.target.value);
                                                if (inputValue <= 5000000) {
                                                    setPromptEarning(inputValue);
                                                    props.onPromptFieldChange('PREMIUMPRICECC', inputValue);
                                                    setValue('PREMIUMPRICECC', inputValue);
                                                }
                                            }}
                                            onBlur={e => {
                                                if(localAutoSave == true){
                                                    props.onPromptFormDataSubmit();
                                                }
                                            }}
                                        /> */}
                                        <div className='d-flex justify-content-between'>
                                            <small className="text-muted">
                                                {t('inputs.text.prompt_premium.min')}&nbsp;
                                                {new Intl.NumberFormat('en-US').format(promptEarning * 0.00012)}
                                            </small>
                                            <small className="text-muted">
                                                ({t('inputs.text.prompt_premium.max')}
                                                <EuroSvg
                                                    size={20}
                                                    color="var(--bs-secondary)"
                                                />
                                                {new Intl.NumberFormat('en-US').format(localPromptPremiumCCMax * 0.00012)}
                                                )
                                            </small>
                                        </div>
                                    </div>
                                    <div className='col-sm-5 mb-3'>
                                        {/* <div className="fw-bold">{t('inputs.text.prompt_earning.label')}</div>
                                        <div><small className="text-muted">{t('inputs.text.prompt_premium.callomcoins')}</small></div> */}
                                        <input type="text" className= "form-control"
                                            disabled={true}
                                            value={new Intl.NumberFormat('en-US').format(Math.round(promptEarning * 0.75))}
                                        />
                                        <small className="text-muted">
                                            {t('inputs.text.prompt_premium.min')}&nbsp;
                                            {new Intl.NumberFormat('en-US').format(promptEarning * 0.75 * 0.00012)}
                                        </small>
                                    </div>
                                </div>
                                {localCustomData && (localAccId == 300000100) &&
                                    <>
                                        <div className="mb-3">
                                            <label className='fw-bold'>{t('inputs.select.custom_model.label')}</label>
                                            <select className={`form-select ${errors?.CUSTOMMODELID ? 'is-invalid' : ''}`} 
                                                {...register('CUSTOMMODELID', { required: true })} 
                                                value={localCustomModelId} 
                                                onChange={handleChangeCustomModelId}
                                            >
                                                <option value="">{t('inputs.select.custom_model.default_option')}</option>
                                                {props?.customModelData && props?.customModelData?.customModelDetail.map((item: any, index: number) => (
                                                    <option key={index} value={item.CUSTOMMODELID}>{item.MODELDISPLAYNAME}</option>
                                                ))}
                                            </select>
                                            <div className="invalid-feedback">
                                                {errors.CUSTOMMODELID && errors.CUSTOMMODELID.type === 'required' && t('inputs.select.custom_model.validation_message.required')}
                                            </div>
                                        </div>
                                        <h6 className="fw-bold">{t('text.custom_model_desc.label')}</h6>
                                        {selectedCustomDescription.trim() === "" ? <p>{t('text.custom_model_desc.none_selected')}</p> : <p>{selectedCustomDescription}</p>}
                                    </>
                                }
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className={`${(localFreezeStatus == "freeze") ? 'disabled-item' : ''}`}>
                                        {/* <div className="mb-2 form-check form-switch">
                                            <input className="form-check-input" 
                                                type="checkbox" id="AuthorView" 
                                                {...register('AUTHORVIEW')}  
                                                checked={localAuthorView} 
                                                onChange={handleChangeAuthorView} 
                                            />
                                            <label className="form-check-label" htmlFor="AuthorView">
                                                {t('text.prompt_author.label_view')}
                                            </label>
                                        </div>  */}
                                        <div className={`mb-2 form-check form-switch ${(props.mode == "create") ? 'disabled-item' : ''}`}>
                                            <input className="form-check-input" 
                                                type="checkbox" id="autoSave" 
                                                {...register('AUTOSAVE')} 
                                                checked={localAutoSave} 
                                                onChange={handleChangeAutoSave} 
                                            />
                                            <label className="form-check-label" htmlFor="autoSafe">
                                                {t('inputs.checkbox.auto_save.label')}
                                            </label>
                                        </div>
                                        <div className="mb-2 form-check form-switch">
                                            <input className="form-check-input" 
                                                type="checkbox" id="openSource" 
                                                {...register('OPENSOURCE')}  
                                                checked={localOpenSource} 
                                                onChange={handleChangeOpenSource} 
                                            />
                                            <TooltipComponent title={t('inputs.checkbox.open_source.tooltip')} >
                                                <label className="form-check-label"
                                                    data-bs-toggle="modal" 
                                                    data-bs-target='#open_source_help'
                                                    onClick={() => {setHelpTitle(t('inputs.checkbox.open_source.help.title')); setHelpContent(t('inputs.checkbox.open_source.help.content')); }}
                                                >
                                                    {t('inputs.checkbox.open_source.label')}
                                                </label>
                                            </TooltipComponent>
                                        </div>
                                        <div className="mb-2 form-check form-switch">
                                            <input className="form-check-input" 
                                                type="checkbox" id="AllowCopy" 
                                                {...register('ALLOWTOCOPY')} 
                                                checked={localAllowCopy} 
                                                onChange={handleChangeAllowCopy} 
                                            />
                                            <TooltipComponent title={t('inputs.checkbox.allow_to_copy.tooltip')} >
                                                <label className="form-check-label">
                                                    {t('inputs.checkbox.allow_to_copy.label')}
                                                </label>
                                            </TooltipComponent>
                                        </div>
                                        <div className={`${(localPromptLevel != 2) ? 'disabled-item' : ''}`}>
                                            <div className="mb-2 form-check form-switch">
                                                <input className="form-check-input" 
                                                    type="checkbox" id="Iterative" 
                                                    {...register('ITERATIVETASK')} 
                                                    checked={localIterativeTask} 
                                                    onChange={handleChangeIterativeTask} 
                                                />
                                                <TooltipComponent title={t('inputs.checkbox.iterative.tooltip')} >
                                                    <label className="form-check-label"
                                                        data-bs-toggle="modal" 
                                                        data-bs-target='#iterative_task_help'
                                                        onClick={() => {setHelpTitle(t('inputs.checkbox.iterative.help.title')); setHelpContent(t('inputs.checkbox.iterative.help.content'));}}
                                                    >
                                                        {t('inputs.checkbox.iterative.label')}
                                                    </label>
                                                </TooltipComponent>
                                            </div>
                                            {localAccId == 300000100 &&
                                                <div className="mb-2 form-check form-switch">
                                                    <input className="form-check-input" 
                                                        type="checkbox" id="CustomData" 
                                                        {...register('CUSTOMDATA')} 
                                                        checked={localCustomData} 
                                                        onChange={handleChangeCustomData} 
                                                    />
                                                    <label className="form-check-label" 
                                                        data-bs-toggle="modal" 
                                                        data-bs-target='#custom_modal_help'
                                                        onClick={() => {setHelpTitle(t('inputs.checkbox.custom_model.help.title')); setHelpContent(t('inputs.checkbox.custom_model.help.content'));}}
                                                    >
                                                        {t('inputs.checkbox.custom_model.label')}
                                                    </label>
                                                </div>
                                             }
                                            <div className="mb-2 form-check form-switch">
                                                <input className="form-check-input" 
                                                    type="checkbox" id="functionCall" 
                                                    {...register('FUNCTIONCALL')} 
                                                    checked={localFunctionCall} 
                                                    onChange={handleChangeFunctionCall} 
                                                />
                                                <TooltipComponent title={t('inputs.checkbox.function_call.tooltip')} >
                                                    <label className="form-check-label" 
                                                        data-bs-toggle="modal" 
                                                        data-bs-target='#function_call_help'
                                                        onClick={() => {setHelpTitle(t('inputs.checkbox.function_call.help.title')); setHelpContent(t('inputs.checkbox.function_call.help.content'));}}
                                                    >
                                                        {t('inputs.checkbox.function_call.label')}
                                                    </label>
                                                </TooltipComponent>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className={`text-end ${(localFreezeStatus == "freeze") ? 'disabled-item' : ''}`}>
                                        <div className="mb-3 text-center mx-auto">
                                                <input type="range" 
                                                    className="form-range bc-range" 
                                                    {...register('PROMPTLEVEL')}
                                                    min="0" max="2" 
                                                    step={1} 
                                                    value={localPromptLevel}
                                                    onChange={handleChangePromptLevel}
                                                />
                                                <div className="d-flex justify-content-between">
                                                    <TooltipComponent title={t('links.standard.tooltip')} >
                                                        <small
                                                            data-bs-toggle="modal" 
                                                            data-bs-target='#standard_prompt_help'
                                                            onClick={() => {setHelpTitle(t('links.standard.help.title')); setHelpContent(t('links.standard.help.content'));}}
                                                        >
                                                            {t('links.standard.label')}
                                                        </small>
                                                    </TooltipComponent>
                                                    <TooltipComponent title={t('links.advanced.tooltip')} >
                                                        <small
                                                            data-bs-toggle="modal" 
                                                            data-bs-target='#advanced_prompt_help'
                                                            onClick={() => {setHelpTitle(t('links.advanced.help.title')); setHelpContent(t('links.advanced.help.content'));}}
                                                        >
                                                            {t('links.advanced.label')}
                                                        </small>
                                                    </TooltipComponent>
                                                    <TooltipComponent title={t('links.expert.tooltip')} >
                                                        <small 
                                                            data-bs-toggle="modal" 
                                                            data-bs-target='#expert_prompt_help'
                                                            onClick={() => {setHelpTitle(t('links.expert.help.title')); setHelpContent(t('links.expert.help.content'));}}
                                                        >
                                                            {t('links.expert.label')}
                                                        </small>
                                                    </TooltipComponent>
                                                </div>
                                            </div>
                                        <div className="mb-3">
                                            <input type="range" 
                                                className="form-range bc-range" 
                                                {...register('PUBLICACCESSIBILITY')} 
                                                min="0" max="2" 
                                                step={1} 
                                                value={props.childConstDefaultActionCCount == 2500 ? 0 : localPublicAccessibility}
                                                onChange={handleChangePublicAccessibility}
                                            />
                                            <div className="d-flex justify-content-between">
                                                <TooltipComponent title={t('links.none.tooltip')} >
                                                    <small
                                                        data-bs-toggle="modal" 
                                                        data-bs-target='#none_prompt_help'
                                                        onClick={() => {setHelpTitle(t('links.none.help.title')); setHelpContent(t('links.none.help.content'));}}
                                                    >
                                                        {t('links.none.label')}
                                                    </small>
                                                </TooltipComponent>
                                                <TooltipComponent title={t('links.invite.tooltip')} >
                                                    <small
                                                        data-bs-toggle="modal" 
                                                        data-bs-target='#invite_prompt_help'
                                                        onClick={() => {setHelpTitle(t('links.invite.help.title')); setHelpContent(t('links.invite.help.content'));}}
                                                    >
                                                        {t('links.invite.label')}
                                                    </small>
                                                </TooltipComponent>
                                                <TooltipComponent title={t('links.public.tooltip')} >
                                                    <small
                                                        data-bs-toggle="modal" 
                                                        data-bs-target='#public_prompt_help'
                                                        onClick={() => {setHelpTitle(t('links.public.help.title')); setHelpContent(t('links.public.help.content'));}}
                                                    >
                                                        {t('links.public.label')}
                                                    </small>
                                                </TooltipComponent>
                                            </div>
                                        </div>
                                        {/* <div className="mb-2 text-center">
                                            <div className="form-check form-switch w-25 mx-auto">
                                            <input className="form-check-input" type="checkbox" id="sponsored" {...register('SPONSOREDPROMPT')} />
                                            </div>
                                            <div className="w-100">
                                            <label className="form-check-label" htmlFor="sponsored">
                                                {t('common.sponsored')}
                                            </label>
                                            </div>
                                        </div> */}
                                    </div>
                                    {props?.mode == 'edit' && localPublicAccessibility == 2 && 
                                    (
                                        <div className="mb-3 text-end">
                                            <TooltipComponent title={t('links.copy.tooltip')} >
                                                <NavLink to={`${props?.selectedPromptData?.URLCODE ? DOMAIN_URL + '/app/askgpt/' + props?.selectedPromptData?.URLCODE : ''}`} target="_blank" className="public-url">
                                                    {`${props?.selectedPromptData?.URLCODE ? DOMAIN_URL + '/app/askgpt/' + props?.selectedPromptData?.URLCODE : ''}`}
                                                </NavLink>
                                            </TooltipComponent>
                                            <TooltipComponent title={t('icons.copy.tooltip')} >
                                                <img src={Copy} className='h-1-5 cursor-pointer align-baseline' 
                                                    onClick={contentCopyURL} 
                                                />
                                            </TooltipComponent>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex justify-content-end">
                                <div className='me-2'>
                                {(
                                    (
                                        props.mode == "create"
                                    ) 
                                    || 
                                    (
                                        [1, 2].includes(props?.selectedPromptData?.MYROLEID)
                                        &&
                                        localFreezeStatus != "freeze" 
                                    )
                                )
                                    &&
                                    <div className='text-center'>
                                        <div className='mb-1 fw-bold'>{t('text.propmt_icon.label')}</div>
                                        <TooltipComponent title={t('buttons.generate.tooltip')} >
                                            <button type="button" className="btn btn-primary rounded-pill px-4" onClick={onGenerateImage}>
                                                {t('buttons.generate.label')}
                                            </button>
                                        </TooltipComponent>
                                        <div className="mt-1">
                                            <TooltipComponent title={t('text.total_cc_used.tooltip')} >
                                                {t('text.total_cc_used.label')}: {localTotalCCUsed}
                                            </TooltipComponent>
                                        </div>
                                    </div>
                                }
                                </div>
                                <div>
                                    <img src={localConstImageSrc} className="img-fluid h-7 border border-primary rounded" alt="prompt avatar" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-4 text-start">
                            {(
                            (
                                props.mode == "create"
                            ) 
                            || 
                            (
                                [1, 2].includes(props?.selectedPromptData?.MYROLEID)
                                &&
                                localFreezeStatus != "freeze"
                                &&
                                localAutoSave == false 
                            )
                            )
                            &&
                                <TooltipComponent title={t('prompt.btn_save_tooltip')} >
                                    <button type="submit" className="btn btn-primary btn-md rounded-pill me-2 px-4">
                                        {t('prompt.save_prompt')}
                                    </button>
                                </TooltipComponent>
                            }
                            {props.mode == "edit" &&
                                <div className='mb-1'>
                                    <TooltipComponent title={t('text.average_cc_used.tooltip')} >
                                        {t('text.average_cc_used.label')}: {averageCCUsed}
                                    </TooltipComponent>
                                </div>
                            }
                        </div>
                        <div className="col-lg-8 text-md-end text-lg-end text-start">
                            {props?.mode == 'edit' &&
                                <div>
                                    {props?.selectedPromptData?.MYROLEID == 1 &&
                                        <div className="d-inline-block text-center px-2">
                                            
                                                <div className="mb-1">
                                                    <TooltipComponent title={localFreezeStatus == "freeze" ? t('text.unfreeze_prompt_label.tooltip') : t('text.freeze_prompt_label.tooltip')} >
                                                        <small
                                                            data-bs-toggle="modal" 
                                                            data-bs-target='#freeze_prompt_help'
                                                            onClick={() => {setHelpTitle(localFreezeStatus == "freeze" ? t('text.unfreeze_prompt_label.help.title') : t('text.freeze_prompt_label.help.title')); setHelpContent(localFreezeStatus == "freeze" ? t('text.unfreeze_prompt_label.help.content') : t('text.freeze_prompt_label.help.content'));}}
                                                        >
                                                            {localFreezeStatus == "freeze" ? t('text.unfreeze_prompt_label.label') : t('text.freeze_prompt_label.label')}
                                                        </small>
                                                    </TooltipComponent>
                                                </div>
                                                <TooltipComponent title={localFreezeStatus == "freeze" ? t('icons.unfreeze_prompt.tooltip') : t('icons.freeze_prompt.tooltip')} >
                                                    <img src={Freeze} 
                                                        className='h-1-5 cursor-pointer' 
                                                        onClick={() => { 
                                                            if (window.confirm(props?.selectedPromptData?.PROMPTSTAUS == "freeze" 
                                                            ? 
                                                                t('message.confirm_unfreeze_prompt') 
                                                            : 
                                                                t('message.confirm_freeze_prompt')
                                                            ) == true) 
                                                            {
                                                                dispatch(fullPageLoader(true)); 
                                                                freezePromptsAPI({ "promptId": props?.selectedPromptData?.GPTBLUEPROMPTID, "promptStatus": props?.selectedPromptData?.PROMPTSTAUS == "freeze" ? "active" : 'freeze' }) 
                                                            } 
                                                        }} 
                                                    />
                                                </TooltipComponent>
                                        </div>
                                    }
                                    <div className={`d-inline-block text-center px-2 ${localPublicAccessibility == 0 ? 'disabled-item' : ''}`}>
                                        <TooltipComponent title={t('text.share_prompt_label.tooltip')} >
                                            <div className="mb-1">
                                                <small
                                                    data-bs-toggle="modal" 
                                                    data-bs-target='#share_prompt_help'
                                                    onClick={() => {setHelpTitle(t('text.share_prompt_label.help.title')); setHelpContent(t('text.share_prompt_label.help.content'));}}
                                                >
                                                    {t('text.share_prompt_label.label')}
                                                </small>
                                            </div>
                                        </TooltipComponent>
                                        <TooltipComponent title={t('icons.share_prompt.tooltip')} >
                                            <img src={Share} 
                                                className='h-1-5 cursor-pointer' 
                                                data-bs-toggle="modal" 
                                                data-bs-target={`#${promptShareModalId}`} 
                                            />
                                        </TooltipComponent>
                                    </div>
                                    <div className="d-inline-block text-center px-2">
                                        <TooltipComponent title={t('icons.deploy_prompt.tooltip')} >
                                            <div className="mb-1">
                                                <small>{t('icons.deploy_prompt.label')}</small>
                                            </div>
                                            <img src={Deploy} 
                                                className='h-1-5 cursor-pointer'
                                                data-bs-toggle="modal" 
                                                data-bs-target={`#${promptDeployModalId}`}
                                            />
                                        </TooltipComponent>
                                    </div>
                                    <div className={`d-inline-block text-center px-2 ${localAllowCopy || props?.selectedPromptData?.MYROLEID == 1 ? '' : 'disabled-item'}`}>
                                        <TooltipComponent title={t('icons.duplicate_prompt.tooltip')} >
                                            <div className="mb-1">
                                                <small>{t('icons.duplicate_prompt.label')}</small>
                                            </div>
                                            <img src={Duplicate} 
                                                className='h-1-5 cursor-pointer' 
                                                onClick={() => copyPrompt()} 
                                            />
                                        </TooltipComponent>
                                    </div>
                                    {/* <div className="d-inline-block text-center px-2">
                                        <TooltipComponent title={t('icons.version_prompt.tooltip')} >
                                            <div className="mb-1">
                                                <small>{t('icons.version_prompt.label')}</small>
                                            </div>
                                            <img src={Versions} 
                                                className='h-1-5 cursor-pointer' 
                                            />
                                        </TooltipComponent>
                                    </div>
                                    <div className="d-inline-block text-center px-2">
                                        <TooltipComponent title={t('icons.history_prompt.tooltip')} >
                                            <div className="mb-1">
                                                <small>{t('icons.history_prompt.label')}</small>
                                            </div>
                                            <img src={History} 
                                                className='h-1-5 cursor-pointer' 
                                            />
                                        </TooltipComponent>
                                    </div> */}
                                    {props?.selectedPromptData?.MYROLEID == 1 &&
                                        <div className="d-inline-block text-center px-2">
                                            <TooltipComponent title={t('icons.delete_prompt.tooltip')} >
                                                <div className="mb-1">
                                                    <small>{t('icons.delete_prompt.label')}</small>
                                                </div>
                                                <img src={Delete} 
                                                    className='h-1-5 cursor-pointer' 
                                                    onClick={() => { 
                                                        if (window.confirm(t('message.confirm_delete_prompt')) == true) {
                                                            dispatch(fullPageLoader(true)); 
                                                            deletePromptsAPI({ "promptId": props?.selectedPromptData?.GPTBLUEPROMPTID, "promptStatus": "inactive" }) 
                                                        } 
                                                    }} 
                                                />
                                            </TooltipComponent>
                                        </div>
                                    }
                                    <div className="d-inline-block text-center px-2">
                                        <TooltipComponent title={t('icons.new_prompt.tooltip')} >
                                            <div className="mb-1">
                                                <small>{t('icons.new_prompt.label')}</small>
                                            </div>
                                            <NavLink to="/app/prompts/create" className="text-decoration-none">
                                                <img src={Plus} className='h-1-5 cursor-pointer' />
                                            </NavLink>
                                        </TooltipComponent>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    
                </form>
            </Card>
            <PromptDeployModal 
                id={promptDeployModalId}
                onConfirm={handleDeployConfirm} 
            />
            <PromptShareModal 
                id={promptShareModalId}
                gptBluePromptId={props?.selectedPromptData?.GPTBLUEPROMPTID || 0}
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='open_source_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='iterative_task_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='custom_modal_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='function_call_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='standard_prompt_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='advanced_prompt_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='expert_prompt_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='none_prompt_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='invite_prompt_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='public_prompt_help'
            />
            <HelpModal 
                title={helpTitle} 
                content={helpContent} 
                id='freeze_prompt_help'
            />
            <HelpModal  
                title={helpTitle} 
                content={helpContent} 
                id='share_prompt_help'
            />
        </>
    );
};

export default PromptControls;
