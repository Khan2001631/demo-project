import React, { useEffect, useState } from 'react';
import { set, useForm } from "react-hook-form";
import { createPromptInterface } from "../../../interfaces/prompts/prompts.interface";
import Card from '../../common/card/card';
import { useTranslation } from 'react-i18next';
import TooltipComponent from '../../common/bootstrap-component/tooltip-component';
import { NavLink } from 'react-router-dom';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import { useDispatch } from 'react-redux';
import { useCreatePromptMutation } from '../../../api-integration/secure/prompts';

interface PromptObjectValues {
    selectedPromptData: any;
    functionDetailData: any;
    selectedPromptObject: string;
    childConstIterative: boolean;
    childConstFunctionCall: boolean;
    childConstCustomData: boolean;
    childConstFreeze: string | null;
    childConstCustomModelId: string | null;
    childConstAutoSave: boolean;
    onPrePromptTaskChange: (value: string) => void;
    onPostPromptFormatChange: (value: string) => void;
    onTestGPTBluePrompt: (payload: any) => void;
    onPromptFieldChange: (field: string, value: any) => void;
    onPromptFormDataSubmit: () => void;
    onConstDefaultActionCCountSet: (value: number) => void;
}

const PromptObjectValues: React.FC<PromptObjectValues> = (props) => {    
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const DOMAIN_URL = window.location.origin;
    const { register, handleSubmit, formState: { errors }, setValue, getValues, clearErrors, trigger } = useForm<createPromptInterface>();
    
      
    const [localFunctionId, setLocalFunctionId] = useState(0);
    const [actorDefinitionCCount, setActorDefinitionCCount] = useState(props?.selectedPromptData?.ACTORDEFINITION ? 2500-props?.selectedPromptData?.ACTORDEFINITION.length : 2500);
    const [envContextCCount, setEnvContextCCount] = useState(props?.selectedPromptData?.ENVIRONMENTCONTEXT ? 2500-props?.selectedPromptData?.ENVIRONMENTCONTEXT.length : 2500);
    const [challengeDescCCount, setChallengeDescCCount] = useState(props?.selectedPromptData?.CHALLENGEDESCRIPTION ? 2500-props?.selectedPromptData?.CHALLENGEDESCRIPTION.length : 2500);
    const [dataHandlingCCount, setDataHandlingCCount] = useState(props?.selectedPromptData?.DATAHANDLING ? 2500-props?.selectedPromptData?.DATAHANDLING.length : 2500);
    const [gptblueObjCCount, setGptblueObjCCount] = useState(props?.selectedPromptData?.OBJECTIVE ? 2500-props?.selectedPromptData?.OBJECTIVE.length : 2500);
    const [audienceCCount, setAudienceCCount] = useState(props?.selectedPromptData?.AUDIENCE ? 2500-props?.selectedPromptData?.AUDIENCE.length : 2500); 
    const [taskCCount, setTaskCCount] = useState(props?.selectedPromptData?.TASK ? 2500-props?.selectedPromptData?.TASK.length : 2500);
    const [iterativePrePromptTasksCCount, setIterativePrePromptTasksCCount] = useState(props?.selectedPromptData?.ITERATIVEPREPROMPTTASKS ? 2500-props?.selectedPromptData?.ITERATIVEPREPROMPTTASKS.length : 2500); 
    const [iterativePostPromptFormatCCount, setIterativePostPromptFormatCCount] = useState(props?.selectedPromptData?.ITERATIVEPOSTPROMPTFORMAT ? 2500-props?.selectedPromptData?.ITERATIVEPOSTPROMPTFORMAT.length : 2500);
    const [defaultActionCCount, setDefaultActionCCount] = useState(props?.selectedPromptData?.DEFAULTACTION ? 2500-props?.selectedPromptData?.DEFAULTACTION.length : 2500);
    const [writingStyleCCount, setWritingStyleCCount] = useState(props?.selectedPromptData?.WRITINGSTYLE ? 2500-props?.selectedPromptData?.WRITINGSTYLE.length : 2500);
    const [timelineCCount, setTimelineCCount] = useState(props?.selectedPromptData?.TIMELINEPRIORITY ? 2500-props?.selectedPromptData?.TIMELINEPRIORITY.length : 2500);
    const [outputFormatCCount, setOutputFormatCCount] = useState(props?.selectedPromptData?.OUTPUTFORMAT ? 2500-props?.selectedPromptData?.OUTPUTFORMAT.length : 2500);
    const [referencesCCount, setReferencesCCount] = useState(props?.selectedPromptData?.PROMPTREFERENCES ? 2500-props?.selectedPromptData?.PROMPTREFERENCES.length : 2500);
    const [selectedFuncCallDescription, setSelectedFuncCallDescription] = useState(props?.selectedPromptData?.functionDetail?.[0]?.FUNCTIONDESCRIPTION || '');

    useEffect(() => {
        if (props?.selectedPromptData) {
            setLocalFunctionId(props?.selectedPromptData?.functionDetail?.[0]?.FUNCTIONID);
            setValue('PROMPTNAME', props?.selectedPromptData?.PROMPTNAME || '');
            setValue('ACTORDEFINITION', props?.selectedPromptData?.ACTORDEFINITION || '');
            setActorDefinitionCCount(2500 - props?.selectedPromptData?.ACTORDEFINITION.length)
            setValue('ENVIRONMENTCONTEXT', props?.selectedPromptData?.ENVIRONMENTCONTEXT || '');
            setEnvContextCCount(2500 - props?.selectedPromptData?.ENVIRONMENTCONTEXT.length)
            setValue('CHALLENGEDESCRIPTION', props?.selectedPromptData?.CHALLENGEDESCRIPTION || '');
            setChallengeDescCCount(2500 - props?.selectedPromptData?.CHALLENGEDESCRIPTION.length)
            setValue('DATAHANDLING', props?.selectedPromptData?.DATAHANDLING || '');
            setDataHandlingCCount(2500 - props?.selectedPromptData?.DATAHANDLING.length)
            setValue('OBJECTIVE', props?.selectedPromptData?.OBJECTIVE || '');
            setGptblueObjCCount(2500 - props?.selectedPromptData?.OBJECTIVE.length)
            setValue('AUDIENCE', props?.selectedPromptData?.AUDIENCE || '');
            setAudienceCCount(2500 - props?.selectedPromptData?.AUDIENCE.length)
            setValue('TASK', props?.selectedPromptData?.TASK || '');
            setTaskCCount(2500 - props?.selectedPromptData?.TASK.length)
            setValue('ITERATIVEPREPROMPTTASKS', props?.selectedPromptData?.ITERATIVEPREPROMPTTASKS || '');
            setIterativePrePromptTasksCCount(2500 - props?.selectedPromptData?.ITERATIVEPREPROMPTTASKS.length)
            setValue('ITERATIVEPOSTPROMPTFORMAT', props?.selectedPromptData?.ITERATIVEPOSTPROMPTFORMAT || '');
            setIterativePostPromptFormatCCount(2500 - props?.selectedPromptData?.ITERATIVEPOSTPROMPTFORMAT.length)
            setValue('DEFAULTACTION', props?.selectedPromptData?.DEFAULTACTION || '');
            setDefaultActionCCount(2500 - props?.selectedPromptData?.DEFAULTACTION.length)
            props.onConstDefaultActionCCountSet(2500 - props?.selectedPromptData?.DEFAULTACTION.length);
            setValue('WRITINGSTYLE', props?.selectedPromptData?.WRITINGSTYLE || '');
            setWritingStyleCCount(2500 - props?.selectedPromptData?.WRITINGSTYLE.length)
            setValue('TIMELINEPRIORITY', props?.selectedPromptData?.TIMELINEPRIORITY || '');
            setTimelineCCount(2500 - props?.selectedPromptData?.TIMELINEPRIORITY.length)
            setValue('OUTPUTFORMAT', props?.selectedPromptData?.OUTPUTFORMAT || '');
            setOutputFormatCCount(2500 - props?.selectedPromptData?.OUTPUTFORMAT.length)
            setValue('PROMPTREFERENCES', props?.selectedPromptData?.PROMPTREFERENCES || '');
            setReferencesCCount(2500 - props?.selectedPromptData?.PROMPTREFERENCES.length)
            setLocalFunctionId(props?.selectedPromptData?.functionDetail?.[0]?.FUNCTIONID || 0);
        } else {
            setValue('PROMPTNAME', '');
            setValue('ACTORDEFINITION', '');
            setValue('ENVIRONMENTCONTEXT', '');
            setValue('CHALLENGEDESCRIPTION', '');
            setValue('DATAHANDLING', '');
            setValue('OBJECTIVE', '');
            setValue('AUDIENCE', '');
            setValue('TASK', '');
            setValue('ITERATIVEPREPROMPTTASKS', '');
            setValue('ITERATIVEPOSTPROMPTFORMAT', '');
            setValue('DEFAULTACTION', '');
            setValue('WRITINGSTYLE', '');
            setValue('TIMELINEPRIORITY', '');
            setValue('OUTPUTFORMAT', '');
            setValue('PROMPTREFERENCES', '');
            setLocalFunctionId(0);
        }
    }, [props?.selectedPromptData, setValue]);

    useEffect(() => {
        props.onConstDefaultActionCCountSet(defaultActionCCount);
    }, [props.onConstDefaultActionCCountSet, defaultActionCCount]);

    const handleFunctionIdChange = (event: { target: { value: any; }; }) => {
        setLocalFunctionId(event.target.value);
        setValue('FUNCTIONID', event.target.value);
        if(event.target.value != ""){
            const selectedFuncCallDesc = props?.functionDetailData?.functionDetail?.find((item: any) => item.FUNCTIONID == event.target.value);
            setSelectedFuncCallDescription(selectedFuncCallDesc?.FUNCTIONDESCRIPTION || '');
            props.onPromptFieldChange('FUNCTIONID', event.target.value);
            if(props.childConstAutoSave == true){
                props.onPromptFormDataSubmit();
            }

        }
        else{
            setSelectedFuncCallDescription('');
        }
    };
    
    const handleChildPromptFieldChange = (field:string, value:any) => {
        props.onPromptFieldChange(field, value);
    };
    const onSubmit =  (data: createPromptInterface) => {
        const savePayload = {
            ...data,
            FUNCTIONID: localFunctionId,
            gptBluePromptId: props?.selectedPromptData?.GPTBLUEPROMPTID,
        };
        props.onPromptFormDataSubmit();
        //dispatch(fullPageLoader(true));
        //createPromptAPI(savePayload)
    };
    
    const testGPTBluePrompt = () => {
        const formData = getValues();
        const payload = {
            ...formData,
            FUNCTIONID: localFunctionId,
            gptBluePromptId: props?.selectedPromptData?.GPTBLUEPROMPTID,
            customdata : props?.childConstCustomData == true ? 1 : 0,
            functionCall: props?.childConstFunctionCall == true ? 1 : 0,
            CUSTOMMODELID: props?.childConstCustomModelId,
        };
        //console.log('payload= ', payload);
        props.onTestGPTBluePrompt(payload);
    };

    return (
        <Card id="dtd_promptObjectDetails" titleType={1} 
            title={t('card.Prompt_Framing_Designer.title')} 
            help={true} Feedback={true} logo={true} cardHeightClass='' 
            helpTitle={t('card.Prompt_Framing_Designer.help.title')} helpContent={t('card.Prompt_Framing_Designer.help.content')}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`${(props.childConstFreeze == "freeze") ? 'disabled-item' : ''}`}>
                    {props.selectedPromptObject === 'promptActorDefinition' && (
                        <div className="mb-3 ">
                            <label htmlFor="actorDefinition" className="fw-bold">
                                {t('prompt.actor_persona')}
                            </label>
                            <div>   
                                <small className="text-muted">
                                    {actorDefinitionCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" 
                                id="actorDefinition" {...register('ACTORDEFINITION')} 
                                rows={8} maxLength={2500}
                                onChange={e => {
                                    setActorDefinitionCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('ACTORDEFINITION', e.target.value);
                                    setValue('ACTORDEFINITION', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    {props.selectedPromptObject === 'promptEnvContext' && (
                        <div className="mb-3">
                            <label htmlFor="environmentContext" className="fw-bold">
                                {t('prompt.environment_context')}
                            </label>
                            <div>
                                <small className="text-muted">
                                    {envContextCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" 
                                id="environmentContext" {...register('ENVIRONMENTCONTEXT')} 
                                rows={8} maxLength={2500}
                                onChange={e => {
                                    setEnvContextCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('ENVIRONMENTCONTEXT', e.target.value);
                                    setValue('ENVIRONMENTCONTEXT', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    {props.selectedPromptObject === 'promptChallengeDesc' && (
                        <div className="mb-3">
                            <label htmlFor="challengeDescription" className="fw-bold">
                                {t('prompt.elaborate_Challenge_description')}
                            </label>
                            <div>
                                <small className="text-muted">
                                    {challengeDescCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" 
                                id="challengeDescription" {...register('CHALLENGEDESCRIPTION')} 
                                rows={8} maxLength={2500}
                                onChange={e => {
                                    setChallengeDescCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('CHALLENGEDESCRIPTION', e.target.value);
                                    setValue('CHALLENGEDESCRIPTION', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    {props.selectedPromptObject === 'promptDataHandling' && (
                        <div className="mb-3">
                            <label htmlFor="dataHandling" className="fw-bold">
                                {t('prompt.data_handling')}
                            </label>
                            <div>
                                <small className="text-muted">
                                    {dataHandlingCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" 
                                id="dataHandling" {...register('DATAHANDLING')} 
                                rows={8} maxLength={2500}
                                onChange={e => {
                                    setDataHandlingCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('DATAHANDLING', e.target.value);
                                    setValue('DATAHANDLING', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    {props.selectedPromptObject === 'promptGptblueObj' && (
                        <div className="mb-3">
                            <label htmlFor="gptblueObjective" className="fw-bold">
                                {t('text.objective')}
                            </label>
                            <div>
                            <small className="text-muted">
                                {gptblueObjCCount} {t('message.characters_remaining')}
                            </small>
                            </div>
                            <textarea className="form-control" 
                                id="gptblueObjective" {...register('OBJECTIVE')} 
                                rows={8} maxLength={2500} 
                                //onChange={e => setGptblueObjCCount(2500 - e.target.value.length)}
                                onChange={e => {
                                    setGptblueObjCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('OBJECTIVE', e.target.value);
                                    setValue('OBJECTIVE', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    {props.selectedPromptObject === 'promptAudience' && (   
                        <div className="mb-3">
                            <label htmlFor="audience" className="fw-bold">
                                {t('prompt.audience')}
                            </label>
                            <div>
                                <small className="text-muted">
                                    {audienceCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" 
                                id="audience" {...register('AUDIENCE')} 
                                rows={8} maxLength={2500} 
                                //onChange={e => setAudienceCCount(2500 - e.target.value.length)}
                                onChange={e => {
                                    setAudienceCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('AUDIENCE', e.target.value);
                                    setValue('AUDIENCE', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>  
                    )}
                    {props.selectedPromptObject === 'promptTask' && (
                        <div className="mb-3">
                            <label htmlFor="task" className="fw-bold">
                                {t('prompt.task')}
                            </label>
                            <div>
                                <small className="text-muted">
                                    {taskCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" 
                                id="task" {...register('TASK')} 
                                rows={8} maxLength={2500} 
                                //onChange={e => setTaskCCount(2500 - e.target.value.length)}
                                onChange={e => {
                                    setTaskCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('TASK', e.target.value);
                                    setValue('TASK', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    <div className={`${(props.childConstIterative) ? '' : 'd-none'}`}>
                        {props.selectedPromptObject === 'promptRQuery' && (
                            <>
                            <div className="mb-3">
                                <label htmlFor="iterativePrePromptTasks" className="fw-bold">
                                    {t('prompt.iterative_pre_prompt_tasks')}
                                </label>
                                <div>
                                    <small className="text-muted">
                                        {iterativePrePromptTasksCCount} {t('message.characters_remaining')}
                                    </small>
                                </div>
                                <textarea className="form-control" 
                                    id="iterativePrePromptTasks" {...register('ITERATIVEPREPROMPTTASKS')} 
                                    rows={8} maxLength={2500}
                                    //onChange={e => { setIterativePrePromptTasksCCount(2500 - e.target.value.length); props.onPrePromptTaskChange(e.target.value); }}
                                    onChange={e => {
                                        setIterativePrePromptTasksCCount(2500 -e.target.value.length);
                                        props.onPromptFieldChange('ITERATIVEPREPROMPTTASKS', e.target.value);
                                        setValue('ITERATIVEPREPROMPTTASKS', e.target.value);
                                    }}
                                    onBlur={e => {
                                        if(props.childConstAutoSave == true){
                                            props.onPromptFormDataSubmit();
                                        }
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                                {t('prompt.iterative_post_prompt_format_description')}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="iterativePostPromptFormat" className="fw-bold">
                                    {t('prompt.iterative_post_prompt_format')}
                                </label>
                                <div>
                                    <small className="text-muted">
                                        {iterativePostPromptFormatCCount} {t('message.characters_remaining')}
                                    </small>
                                </div>
                                <textarea className="form-control" 
                                    id="iterativePostPromptFormat" {...register('ITERATIVEPOSTPROMPTFORMAT')} 
                                    rows={8} maxLength={2500}
                                    //onChange={e => { setIterativePostPromptFormatCCount(2500 - e.target.value.length); props.onPostPromptFormatChange(e.target.value); }}
                                    onChange={e => {
                                        setIterativePostPromptFormatCCount(2500 -e.target.value.length);
                                        props.onPromptFieldChange('ITERATIVEPOSTPROMPTFORMAT', e.target.value);
                                        setValue('ITERATIVEPOSTPROMPTFORMAT', e.target.value);
                                    }}
                                    onBlur={e => {
                                        if(props.childConstAutoSave == true){
                                            props.onPromptFormDataSubmit();
                                        }
                                    }}
                                />
                            </div>
                            </>
                        )}
                    </div>
                </div>
                {props.selectedPromptObject === 'promptDAction' && ( 
                    <div className="mb-3">
                        <label htmlFor="defaultAction" className="fw-bold">
                            {t('prompt.default_action')}
                        </label>
                        <div>
                            <small className="text-muted">
                                {defaultActionCCount} {t('message.characters_remaining')}
                            </small>
                        </div>
                        <textarea className={`form-control ${errors?.DEFAULTACTION ? 'is-invalid' : ''}`} 
                            id="defaultAction" {...register('DEFAULTACTION')}
                            rows={8} maxLength={2500} 
                            //onChange={e => setDefaultActionCCount(2500 - e.target.value.length)}
                            onChange={e => {
                                setDefaultActionCCount(2500 -e.target.value.length);
                                props.onPromptFieldChange('DEFAULTACTION', e.target.value);
                                setValue('DEFAULTACTION', e.target.value);
                                // if(e.target.value.length > 0){
                                //     clearErrors('DEFAULTACTION');
                                // }
                                // if (props.childConstAutoSave) {
                                //     trigger('DEFAULTACTION')
                                // }
                            }}
                            onBlur={e => {
                                if(props.childConstAutoSave == true){
                                    props.onPromptFormDataSubmit();
                                }
                            }}
                        />
                        {/* <div className="invalid-feedback">
                            {errors.DEFAULTACTION && errors.DEFAULTACTION.type === 'required' && t('prompt.default_action_required')}
                        </div> */}
                    </div>
                )}
                <div className={`${(props.childConstFreeze == "freeze") ? 'disabled-item' : ''}`}>
                    {props.selectedPromptObject === 'promptWritingStyle' && (
                        <div className="mb-3">
                            <label htmlFor="writingStyle" className="fw-bold">
                                {t('prompt.writing_style')}
                            </label>
                            <div>
                                <small className="text-muted">
                                    {writingStyleCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" 
                                id="writingStyle" {...register('WRITINGSTYLE')} 
                                rows={8} maxLength={2500}
                                //onChange={e => setWritingStyleCCount(2500 - e.target.value.length)}
                                onChange={e => {
                                    setWritingStyleCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('WRITINGSTYLE', e.target.value);
                                    setValue('WRITINGSTYLE', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    {props.selectedPromptObject === 'promptTimeline' && (
                        <div className="mb-3">
                            <label htmlFor="timeline" className="fw-bold">
                                {t('prompt.timeline_priorities')}
                            </label>
                            <div>
                                <small className="text-muted">
                                {timelineCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" id="timeline" 
                                {...register('TIMELINEPRIORITY')} rows={8}
                                maxLength={2500} 
                                //onChange={e => setTimelineCCount(2500 - e.target.value.length)} 
                                onChange={e => {
                                    setTimelineCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('TIMELINEPRIORITY', e.target.value);
                                    setValue('TIMELINEPRIORITY', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    {props.selectedPromptObject === 'promptOFormat' && (
                        <div className="mb-3">
                            <label htmlFor="outputFormat" className="fw-bold">
                                {t('prompt.output_format')}
                            </label>
                            <div>
                                <small className="text-muted">
                                    {outputFormatCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" id="outputFormat" 
                                {...register('OUTPUTFORMAT')} rows={8} 
                                maxLength={2500} 
                                //onChange={e => setOutputFormatCCount(2500 - e.target.value.length)}
                                onChange={e => {
                                    setOutputFormatCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('OUTPUTFORMAT', e.target.value);
                                    setValue('OUTPUTFORMAT', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    {props.selectedPromptObject === 'promptReferences' && (
                        <div className="mb-3">
                            <label htmlFor="references" className="fw-bold">
                                {t('prompt.references')}
                            </label>
                            <div>
                                <small className="text-muted">
                                    {referencesCCount} {t('message.characters_remaining')}
                                </small>
                            </div>
                            <textarea className="form-control" id="references" 
                                {...register('PROMPTREFERENCES')} rows={8} 
                                maxLength={2500} 
                                //onChange={e => setReferencesCCount(2500 - e.target.value.length)}
                                onChange={e => {
                                    setReferencesCCount(2500 -e.target.value.length);
                                    props.onPromptFieldChange('PROMPTREFERENCES', e.target.value);
                                    setValue('PROMPTREFERENCES', e.target.value);
                                }}
                                onBlur={e => {
                                    if(props.childConstAutoSave == true){
                                        props.onPromptFormDataSubmit();
                                    }
                                }}
                            />
                        </div>
                    )}
                    <div className={`${(props.childConstFunctionCall) ? '' : 'd-none'}`}>
                        {props.selectedPromptObject === 'promptFunctionCall' && ( 
                            <>
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    {t('inputs.select.function_call.label')}
                                </label>
                                <select className="form-select" 
                                    {...register('FUNCTIONID')} 
                                    value={localFunctionId} 
                                    onChange={handleFunctionIdChange}
                                >
                                    <option value="0">{t('inputs.select.function_call.default_option')}</option>
                                    { props?.functionDetailData 
                                        && 
                                        props?.functionDetailData?.functionDetail 
                                        && 
                                        props?.functionDetailData?.functionDetail.map(({ FUNCTIONID, FUNCTIONDISPLAYNAME, INDEX}: { FUNCTIONID: number; FUNCTIONDISPLAYNAME: string; INDEX: number}) => (
                                        <option key={FUNCTIONID} value={FUNCTIONID}>
                                            {FUNCTIONDISPLAYNAME}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <h6 className="fw-bold">
                                    {t('text.function_call_desc.label')}
                                </h6>
                                {selectedFuncCallDescription.trim() === "" ? <p>{t('text.function_call_desc.none_selected')}</p> : <p>{selectedFuncCallDescription}</p>}
                            </div>
                            </>
                        )}
                    </div>
                </div>
               <div className="mt-5 pt-4 text-end">
                    {[1, 2].includes(props?.selectedPromptData?.MYROLEID) && props.childConstAutoSave == false &&
                        <div className={`d-inline-block ${(props.childConstFreeze == "freeze") ? 'disabled-item' : ''}`}>
                            <TooltipComponent title={t('prompt.btn_save_tooltip')} >
                                <button id="savePromptBtn" type="submit" className="btn btn-primary btn-md rounded-pill me-2 px-4" >
                                    {t('prompt.save_prompt')}
                                </button>
                            </TooltipComponent>
                        </div>
                    }
                    <div className="d-inline-block">
                        <TooltipComponent title={defaultActionCCount ==2500 ? t('prompt.btn.test_prompt.required_tooltip') : t('prompt.btn.test_prompt.tooltip')} >
                            <button id="testBtn" type="button" className={`btn btn-primary btn-md rounded-pill me-2 px-4 ${defaultActionCCount ==2500 ? 'disabled-item' : ''}`} 
                                onClick={testGPTBluePrompt} 
                            >
                                {t('prompt.btn.test_prompt.label')}
                            </button>
                        </TooltipComponent>
                    </div>
                    <div className="d-inline-block">
                        <TooltipComponent title={defaultActionCCount ==2500 ? t('prompt.btn.go_to_io_screen.required_tooltip') : t('prompt.btn.go_to_io_screen.tooltip')} >
                            <NavLink to={`${props?.selectedPromptData?.URLCODE ? DOMAIN_URL + '/app/askgpt/' + props?.selectedPromptData?.URLCODE : ''}`} target="_blank">
                                <button id="askGptBtn" type="button" className={`btn btn-primary btn-md rounded-pill me-2 px-4 ${defaultActionCCount ==2500 ? 'disabled-item' : ''}`}>
                                    {t('prompt.btn.go_to_io_screen.label')}
                                </button>
                            </NavLink>
                        </TooltipComponent>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default PromptObjectValues;