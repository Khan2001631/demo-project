import { useState, useEffect } from "react";
import { usePublicPromptDetailsMutation } from "../../../api-integration/public/common";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserCard from "../../../components/common/user-card/user-card";
import PromptList from "../../../components/common/prompt-list/prompt-list";
import PromptExecution from "../../../components/public/common/prompt-execution/prompt-execution";
import AiResponse from "../../../components/secure/create-prompts/ai-response/ai-response";
import { usePublicAskGPTMutation, usePublicAskGPTRefineResultMutation } from "../../../api-integration/secure/prompts";
import { fullPageLoader, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired, updateUser } from "../../../api-integration/commonSlice";
import Statistics from "../../../components/common/statistics/statistics";


const AskGPT = () => {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useDispatch();
  const [iterativeFormDisplayClass, setIterativeFormDisplayClass] = useState<string>('d-none')
  const [defaultAction, serDefaultAction] = useState<string>('')
  const [projectName, setProjectName] = useState<string>('')
  const [isIterative, setIsIterative] = useState<boolean>(false)
  const [gptResponseText, setGptReponseText] = useState<string>('')
  const [promptId, setPromptId] = useState<any>();
  const [firstPromptId, setFirstPromptId] = useState<any>(promptId);
  const [propsResultLoading, setPropsResultLoading] = useState(false);
  const [searchAgain, setSearchAgain] = useState(false);
  const [projectId, setProjectId] = useState();
  const [isLibraryTypeChanged, setIsLibraryTypeChanged] = useState(false);
  const { user } = useSelector((state: any) => state.commonSlice);
  const [refineResposne, setRefineResposne] = useState();
  const [refinePayload, setRefinePayload] = useState<any>({});
  const [askGptPayload, setAskGptPayload] = useState<any>({});
  const [widerLayout, setWiderLayout] = useState(false);
  const [aiResponse, setAIResponse] = useState<any>({});
  const [reloadCheck,setReloadCheck] = useState(false);
  const [userFirstPromptId, setUserFirstPromptId] = useState<any>({});
  const [accountTypeForCCDeduction, setAccountTypeForCCDeduction] = useState<any>(user.libraryType == 'org' ? 'corp' : 'user')
  const [functionToCallAfterRefresh, setFunctionToCallAfterRefresh] = useState<any>('')
  const [localpromptExeAlert, setLocalpromptExeAlert] = useState<number>(0);
  const isSessionExpired = useSelector((state: any) => state.commonSlice.isSessionExpired);

  const [getPromptsAPI, { data: singlePrompt, isLoading: isLoadingSinglePrompt, isSuccess: isSucccessSinglePrompt, isError: isErrorSinglePrompt, error: errorSinglePrompt }] =
    usePublicPromptDetailsMutation();

  const [askGPTAPI, { data: askGPTResponse, isLoading: isAskGPTLoading, isSuccess: isAskGPTSuccess, isError: isAskGPTError, error: askGPTError }] =
    usePublicAskGPTMutation();

  const [refineResultsGPTAPI, { data: refineResulsResponse, isLoading: refineResulsLoading, isSuccess: refineResulsSuccess, isError: isRefineResulsError, error: refineResulsError }] =
    usePublicAskGPTRefineResultMutation();

  const askGPTBlue = (data: any) => {
    setLocalpromptExeAlert(data?.promptExeAlert);
    setAskGptPayload({
      GPTBluePromptId: parseInt(singlePrompt?.promptDetail[0]?.GPTBLUEPROMPTID || '0'),
      accountType: accountTypeForCCDeduction,
      page: "io",
      ...data
    })
    askGPTAPI({
      GPTBluePromptId: parseInt(singlePrompt?.promptDetail[0]?.GPTBLUEPROMPTID || '0'),
      accountType: accountTypeForCCDeduction, 
      page: "io",
      ...data
    })
  }
  const handleLibraryTypeChange = () => {
    setIsLibraryTypeChanged(false);
  };

  const refineResultAPI = (html: any) => {
    const payload = {
      "userPrompt": html,
      "GPTBluePromptId": parseInt(singlePrompt?.promptDetail[0]?.GPTBLUEPROMPTID || '0'),
      "userFirstPromptId": userFirstPromptId,
      "accountType": accountTypeForCCDeduction,
      "page": "io"
    }
    setRefinePayload(payload);
    refineResultsGPTAPI(payload)
  }

  useEffect(() => {
    if (isSucccessSinglePrompt || isErrorSinglePrompt) {
      dispatch(fullPageLoader(false));
    }
    if (isErrorSinglePrompt) {
      dispatch(updateAlertMessage({ status: 'error', message: t('prompt.prompts_fetching_error') }));
    }
    if (isSucccessSinglePrompt) {
      //send form data to patch
      if (singlePrompt?.success == true) {
        setIsIterative(singlePrompt?.promptDetail?.[0]['ITERATIVETASK'] == 'yes' ? true : false)
        setProjectName(singlePrompt?.promptDetail?.[0]['PROMPTNAME'])
        serDefaultAction(singlePrompt?.promptDetail?.[0]['DEFAULTACTION'])
        setPromptId(singlePrompt?.promptDetail?.[0]?.GPTBLUEPROMPTID);
        setProjectId(singlePrompt?.promptDetail?.[0]?.GPTBLUEPROMPTID)
      } else {
        dispatch(updateAlertMessage({ status: 'error', message: singlePrompt?.message }));
      }
    }
  }, [isSucccessSinglePrompt, isErrorSinglePrompt, isLoadingSinglePrompt]);

  useEffect(() => {
    if (askGPTResponse || refineResulsResponse) {
      dispatch(fullPageLoader(false));
      if (askGPTResponse) {
        if (askGPTResponse?.success == false && askGPTResponse?.statusCode != 401) {
          if (askGPTResponse?.status == 'FETCH_ERROR' || askGPTResponse?.status == 'PARSING_ERROR') {
            dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
          } else {
            dispatch(updateAlertMessage({ status: 'error', message: askGPTResponse?.message }));
          }
        } else {
          setAIResponse(askGPTResponse);
          setUserFirstPromptId(askGPTResponse?.userPromptId);
          setReloadCheck(true);
          let user = JSON.parse(localStorage.getItem('user') as string);
          user.promptExeAlert = localpromptExeAlert;
          dispatch(updateUser(user));
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
      // if (askGPTResponse?.statusCode == 401) {
      //   dispatch(updateIsSessionExpired(true));
      //   dispatch(updateReloadPageAfterSessionExpired(false));
      //   setFunctionToCallAfterRefresh('askgpt');
      // }
      if (refineResulsResponse) {
        if (refineResulsResponse?.success == false && refineResulsResponse?.statusCode != 401) {
          if (refineResulsResponse?.status == 'FETCH_ERROR' || refineResulsResponse?.status == 'PARSING_ERROR') {
            dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
          } else {
            dispatch(updateAlertMessage({ status: 'error', message: refineResulsResponse?.message }));
          }
        } else {
          setRefineResposne(refineResulsResponse);
          setAIResponse(refineResulsResponse);
          setReloadCheck(true);
        }
      }
      // if (refineResulsResponse?.statusCode == 401) {
      //   dispatch(updateIsSessionExpired(true));
      //   dispatch(updateReloadPageAfterSessionExpired(false));
      //   setFunctionToCallAfterRefresh('refine');
      // }
    }
  }, [askGPTResponse, refineResulsResponse])

  useEffect(() => {
    if (params?.id) {
      const payload = { "promptPublicCode": params?.id, "page": "io"}
      dispatch(fullPageLoader(true));
      getPromptsAPI(payload);
      setAIResponse(false);
    }
  }, [params?.id])

  useEffect(() => {
    if (isSessionExpired == false && functionToCallAfterRefresh != '') {
      if (functionToCallAfterRefresh == 'refine') refineResultsGPTAPI(refinePayload)
      if (functionToCallAfterRefresh == 'askgpt') askGPTAPI(askGptPayload)

    }
  }, [isSessionExpired])

  const onSubmit = (data: string) => {
    setGptReponseText(data);
    setIterativeFormDisplayClass('')
  };

  const handleSubmit = (data: string) => {
    setPromptId(data);
    setFirstPromptId(data);
    // setIterativeFormDisplayClass('')
  };

  const isLoadingResult = (data: boolean) => {
    setPropsResultLoading(data);
  }

  const handleReloadCheck = ()=>{
    setReloadCheck(!reloadCheck)
  }
  const handleWiderLayout = (data: boolean) => {
    setWiderLayout(data);
  }

  return (
    <>
      <div className="container">
        
        <div className="row mb-4">
          <div className="col-lg-3">
            <UserCard />
          </div>
          <div className={`col-lg-${widerLayout ? '9' : '6'}`}>
            <PromptExecution 
              prompt={singlePrompt?.promptDetail?.[0]} 
              askGptResponse={aiResponse} 
              TriggerAskGpt={askGPTBlue} 
              loading={isAskGPTLoading || refineResulsLoading} 
              isLibraryTypeChanged={isLibraryTypeChanged}
              setWiderLayout={handleWiderLayout} 
            />
          </div>
          {!widerLayout && 
          <div className="col-lg-3">
            <Statistics cardHeightClass="h-100" id="io_analytics" reloadCheck = {reloadCheck} handleReloadCheck={handleReloadCheck} statsType="prompt"/>
          </div>
          }
        </div>
        <div className="row d-flex">
          <div className="col-lg-3">
            <PromptList askGptResponse={aiResponse} loading={isAskGPTLoading || refineResulsLoading} setIsLibraryTypeChanged={setIsLibraryTypeChanged} onLibraryTypeChange={handleLibraryTypeChange}/>
          </div>
          <div className="col-lg-9">
            <AiResponse onRatingPrompt={handleReloadCheck} TriggerAskGpt={askGPTBlue} prompt={singlePrompt?.promptDetail?.[0]} page="io" loading={isAskGPTLoading} refineLoading={refineResulsLoading} askGPTResponse={aiResponse} refineResults={refineResposne} isAskGPTError={isAskGPTError} isRefineError={isRefineResulsError} isIterative={isIterative} refineResult={refineResultAPI} isLibraryTypeChanged={isLibraryTypeChanged}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default AskGPT;