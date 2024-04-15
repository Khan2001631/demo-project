import { useTranslation } from "react-i18next";
import Card from "../../../common/card/card";
import { set, useForm } from "react-hook-form";
import { useCopyPromptsMutation, usePromptStatisticsMutation } from "../../../../api-integration/secure/prompts";
import { useEffect, useState } from "react";
import { fullPageLoader, updateAlertMessage, updateUser } from "../../../../api-integration/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Flag from '../../../../assets/icons/bluePrompt.svg';

import TooltipComponent from "../../../common/bootstrap-component/tooltip-component";
import HelpModal from "../../../common/help-modal/help-modal";
import { use } from "i18next";
import WelcomeNonLoginCard from "../../../common/modal/welcome-non-login-user";
import ConfirmationPopup from "../../../common/modal/confirmation-popup";



interface askGptFormInterface {
  userPrompt: string,
  authorView: boolean,
  autoSave: boolean,
  ManualEffort: number,
  dontShowExeAlert: boolean,
}

interface Props {
  prompt: any,
  TriggerAskGpt: (data: any) => void,
  askGptResponse: any,
  loading: boolean,
  isLibraryTypeChanged: boolean,
  setWiderLayout: (widerLayout: boolean) => void;
}

const PromptExecution = (props: Props) => {
  const promptId = props?.prompt?.GPTBLUEPROMPTID;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [userEmail, setUserEmail] = useState('');
  const [gain, setGain] = useState(2);
  const [showBluePrompt, setShowBluePrompt] = useState(false);
  const [averageCCUsed, setAverageCCUsed] = useState(0);  
  const [editAccess, setEditAcccess] = useState(false);
  const [formData, setFormData] = useState<askGptFormInterface>();
  const [helpTitle, setHelpTitle] = useState('');
  const [helpContent, setHelpContent] = useState('');
  const { user } = useSelector((state: any) => state.commonSlice);
  const [dontShowExeAlert, setDontShowExeAlert] = useState<boolean>();
  const [isHidden, setIsHidden] = useState(props?.isLibraryTypeChanged);
  const { register, handleSubmit, trigger, formState: { errors }, setValue, getValues, watch, reset } = useForm<askGptFormInterface>();
  const userPromptHasValue = watch('userPrompt');
  
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
  const [getPromptsStatisticsAPI, { data: promptStats, isLoading, isSuccess: promptStatsIsSuccess, isError: promptStatsIsError, error }] =
    usePromptStatisticsMutation();  

  
  const [copyPromptsAPI, { data: copyPromptsData, isLoading: isCopyPromptLoading, isSuccess: isCopyPromptSuccess, isError: isCopyPromptError, error: copyPromptError }] =
    useCopyPromptsMutation();

  //const showWelcomeCard = !(isLoggedIn || params.id == '' || !params.id || params.id == undefined || params.id == null); 
    
  const showWelcomeCard = !isLoggedIn;

  const onSubmit = (data: askGptFormInterface) => {
    if (dontShowExeAlert) {
            props.TriggerAskGpt({
        ...data,
        authorView: data?.authorView ? 1 : 0,
        autoSave: data?.autoSave ? 1 : 0,
        promptExeAlert: 0  //value of dontShowExeAlert checkbox in modal is checked OR value from DB is set as True then pass 0 to prompt i.e. dont show execution alert in future
      })
    }
    else{
      setFormData(data);
    }
  }
  const handleConfirmPromptExecution = () => {
    if (formData) {
      props.TriggerAskGpt({
        ...formData,
        authorView: formData?.authorView ? 1 : 0,
        autoSave: formData?.autoSave ? 1 : 0,
        promptExeAlert: dontShowExeAlert ? 0 : 1 //if checkbox is checked i.e. dont show execution alert in future so pass 0 else pass 1
      })
    }
  };
  
  const handleChange = (event: any) => {
    setUserEmail(event.target.value);
  };
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
    setIsHidden(props?.isLibraryTypeChanged);
  }, [props?.isLibraryTypeChanged]);

  useEffect(() => {
    if (promptId !== undefined) {
      reset();
      dispatch(fullPageLoader(true));
      getPromptsStatisticsAPI({ GPTBluePromptId: promptId });
      setValue('userPrompt', props?.prompt?.DEFAULTACTION);
      setValue('authorView', props?.prompt?.AUTHORVIEW ? true : false);
      if(user?.promptExeAlert == 1){
        setDontShowExeAlert(false);
      }else{
        setDontShowExeAlert(true);
      }
      let userHasAccess = false;
      props?.prompt?.promptTeam?.map((promptUser: any) => {
        if (user?.userId == promptUser?.USERID) {
          userHasAccess = true
        }
      })
      if (user?.id == props?.prompt?.OWNERUSERID || userHasAccess) {
        setEditAcccess(true);
      } else {
        setEditAcccess(false);
      }
    }
  }, [promptId]);


  useEffect(() => {
    if (promptStatsIsSuccess || promptStatsIsError) {
      dispatch(fullPageLoader(false));
    }
    if (promptStatsIsError) {
      dispatch(updateAlertMessage({ status: 'error', message: t('prompt.analytics_fetch_error') }));
    }
    if (promptStatsIsSuccess) {
      if (promptStats?.success == false && promptStats?.statusCode != 401) {
        if (promptStats?.status == 'FETCH_ERROR' || promptStats?.status == 'PARSING_ERROR') {
          dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
        } else {
          dispatch(updateAlertMessage({ status: 'error', message: promptStats?.message }));
        }
      }
    }
  }, [promptStatsIsSuccess, promptStatsIsError]);

  const selectLayoutMode = (e: any) => {
    if (e.target.value == 0) {
      props.setWiderLayout(true);
    } else {
      props.setWiderLayout(false);
    }
  }
  
  const copyPrompt = () => {
    dispatch(fullPageLoader(true));
    copyPromptsAPI({ "GPTBluePromptId": props?.prompt?.GPTBLUEPROMPTID });
  }

  useEffect(() => {
    if(props?.prompt?.AverageToken) {
      setAverageCCUsed(props?.prompt?.AverageToken);
    }
    else {
      setAverageCCUsed(0);
    }
  }, [props?.prompt?.AverageToken]);

  useEffect(() => {
    if(props?.prompt?.BLUEPROMPT == 1) {
      setShowBluePrompt(true);
    }else {
      setShowBluePrompt(false);
    }
  }, [props?.prompt?.BLUEPROMPT]);

  const bottomText = props?.prompt?.OWNERFIRSTNAME
    ? `Author: ${props.prompt.OWNERFIRSTNAME} ${props.prompt.OWNERLASTNAME}, ${props.prompt.OWNERCOMPANY}`
    : '';
  
  
  const handleAbortPromptExecution = () => {
    //console.log('User cancelled');
  };
  return (
    <>
      <Card id="io_promptExecution" titleType={1} cardHeightClass="h-100" title={t('prompt.prompt_exection_title')} help={params.id ? true : false} Feedback={params.id ? true : false} like={params.id ? true : false} share={params.id ? true : false} settings={editAccess} settingsClicked={() => navigate(`/app/prompts/edit/${promptId}`)} logo=
        {true} bottomTextFlag={true} bottomText={bottomText} helpTitle={t('prompt.io_ai_prompt_execution.help.title')} helpContent={t('prompt.io_ai_prompt_execution.help.content')}>
          
        {((!params.id && !props?.prompt) || props?.isLibraryTypeChanged) &&
          <div>
            <div className="row">
              <div className="col-12">
                <div className="my-3">
                  <h4>{t('prompt.prompt_select')}</h4>
                </div>
              </div>
            </div>
          </div>
        }
        <div className={`${params.id ? '' : 'd-none'} ${props?.prompt ? '' : 'd-none'} ${isHidden ? 'd-none': ''}`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-lg-7">
                <h6 className="cursor-pointer"
                  data-bs-toggle="modal" 
                  data-bs-target='#prompt_name_help'
                  onClick={() => {setHelpTitle(props?.prompt?.PROMPTNAME); setHelpContent(props?.prompt?.PROMPTDESCRIPTION);}}
                >
                  {showBluePrompt && <img src={Flag} className='h-1-5 cursor-pointer'/>}
                  {props?.prompt?.PROMPTNAME}
                </h6>
                <div className="mb-3 ">
                  <textarea 
                    className={`form-control ${errors?.userPrompt ? 'is-invalid' : ''}`} 
                    id="userPrompt" 
                    {...register('userPrompt', { required: true })} 
                    rows={5} 
                  />
                  <div className="invalid-feedback">
                    {errors.userPrompt && errors.userPrompt.type == 'required' && t('prompt.askgpt_required')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-1 w-50">
                    <input type="range" className="form-range bc-range" min="0" max="1" step="1" onChange={selectLayoutMode} />
                    <div className="d-flex justify-content-between">
                      <TooltipComponent title={t('text.simple.tooltip')}>
                          <small>{t('text.simple.label')}</small>
                        </TooltipComponent>
                        <TooltipComponent title={t('text.advance.tooltip')}>
                          <small>{t('text.advance.label')}</small>
                        </TooltipComponent>
                    </div>
                  </div>
                  
                  {props?.prompt?.OPENSOURCE == 1 && isLoggedIn &&
                    <div className="d-inline-block">
                      <TooltipComponent title={user?.isProfileComplete ? t('buttons.copy_prompt.tooltip') : t('buttons.copy_prompt_profile_incomplete.tooltip')} >
                        <button type="button" className={`btn btn-primary btn-md rounded-pill me-2 px-4 ${user?.isProfileComplete ? '' : 'disabled-item'}`} onClick={copyPrompt}>
                          {t('buttons.copy_prompt.label')}
                        </button>
                      </TooltipComponent>
                    </div>
                  }  
                  <div className="d-inline-block">
                    <TooltipComponent title={userPromptHasValue ? t('buttons.ask_GPTBlue.tooltip') : t('prompt.askgpt_required')} >
                      <button 
                        id="savePromptBtn" type="submit" 
                        className="btn btn-primary btn-md rounded-pill px-4"
                        disabled={props?.loading || !userPromptHasValue}
                        data-bs-toggle={dontShowExeAlert ? undefined : "modal"}
                        data-bs-target={dontShowExeAlert ? undefined : "#promptExecutingConfirmModal"}
                      >
                        {t('buttons.ask_GPTBlue.label')}
                      </button>
                    </TooltipComponent>
                  </div>
                  <div>
                    <div className='mb-1'>{t('text.average_cc_used.label')}: {averageCCUsed}</div> 
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="row">
                  <div className="col-lg-12">
                    <h6>
                      <TooltipComponent title={t('prompt.prompt_productivity_tooltip')} ><span>{t('prompt.prompt_productivity')}</span></TooltipComponent>
                    </h6>
                    <div className="input-group input-group-sm">
                      <input type="number" value={gain}
                        step="0.25" id="ManualEffort"
                        className={`form-control form-control-sm text-end ${errors?.ManualEffort ? 'is-invalid' : ''}`}
                        aria-label="gainValue"
                        aria-describedby="gainValue"
                        {...register('ManualEffort', { maxLength: 8 })}
                        onKeyDown={(e) => {
                          if (['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                              return;
                          }
                          let inputValue = Number((e.target as HTMLInputElement).value + e.key);
                          if (inputValue > 99999999) {
                              e.preventDefault();
                          }
                        }}
                        onChange={(e) => setGain(Number(e.target.value))}
                      />
                      <span className="input-group-text" id="gainValue" dangerouslySetInnerHTML={{ __html: t('prompt.manual_hours.label') }}></span>
                    </div>
                    <div className="invalid-feedback">
                      {errors.ManualEffort && errors.ManualEffort.type === 'maxLength' && t('prompt.manual_hours.validation_message.maxlength')}
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="pe-1">A</div>
                      <strong>{new Intl.NumberFormat('en-US').format(Math.round(((gain * 60) / 5) * 100) / 100)} x</strong>
                      <div className="ps-1">{t('prompt.gain')}</div>
                    </div>
                  </div>
                  {/* <div className="col-lg-4">
                    <div className="mb-2 form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="autoSave" {...register('autoSave')} />
                      <label className="form-check-label" htmlFor="autoSafe">
                        {t('common.auto_save')}
                      </label>
                    </div>
                    <div className="mb-2 form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="authorView" {...register('authorView')} />
                      <label className="form-check-label" htmlFor="authorView">
                        {t('text.prompt_author.label_view')}
                      </label>
                    </div>
                  </div> */}
                </div> 
                <div className=''>
                    <img src={props?.prompt?.promptImage} className="img-fluid h-7 border border-primary rounded" alt="prompt avatar" />
                </div>  
              </div>
            </div>
          </form>
        </div>
      </Card >
      <HelpModal  
          title={helpTitle} 
          content={helpContent} 
          id='prompt_name_help'
      />
      <WelcomeNonLoginCard id="welcomeNonLoginCardModal" showWelcomeCard={showWelcomeCard} referalKey={props?.prompt?.OWNERREFERRALID}/>
      <ConfirmationPopup id="promptExecutingConfirmModal" title={t('modals.prompt_execution_corfirmmation.title')} 
        content={averageCCUsed === 0 ? t('message.confirm_prompt_execution_cc_notavailable') : `${t('message.confirm_prompt_execution')} ${averageCCUsed} ${t('message.will_be')}`}
        onConfirm={handleConfirmPromptExecution} 
        onAbort={handleAbortPromptExecution}
        setDoNotAsk={setDontShowExeAlert} 
      />
    </>
  )
}

export default PromptExecution;