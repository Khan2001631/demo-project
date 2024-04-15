import React, { useEffect, useState } from 'react';
import UserCard from '../../../components/common/user-card/user-card';
import PromptControls from '../../../components/secure/prompt-controls/prompt-controls';
import { useAskGPTRefineResultTestMutation, useAskGPTTestMutation, useCreatePromptMutation, useGetFunctionDetailMutation, useGetPromptsMutation, useVersionHistoryMutation } from '../../../api-integration/secure/prompts';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import { useDispatch, useSelector } from 'react-redux';

import PromptList from '../../../components/common/prompt-list/prompt-list';
import AiResponse from '../../../components/secure/create-prompts/ai-response/ai-response';
import Statistics from '../../../components/common/statistics/statistics';
import PromptObject from '../../../components/secure/prompt-object/prompt-object';
import PromptObjectValues from '../../../components/secure/prompt-object-values/prompt-object-values';
import PromptTips from '../../../components/secure/prompt-tips/prompt-tips';
import { useTranslation } from 'react-i18next';
import { useUpdateModelMutation } from '../../../api-integration/secure/secure';
import { use } from 'i18next';

interface IPromptFormData {
    gptBluePromptId: number;
    //varibles  of promptControls 
    PROMPTNAME: string;
    PROMPTDESCRIPTION: string;
    AUTOSAVE: number | boolean;
    AUTHORVIEW: number | boolean;
    ALLOWTOCOPY: number | boolean;
    CUSTOMDATA: number | boolean;
    FUNCTIONCALL: number | boolean;
    SPONSOREDPROMPT: number | boolean;
    ITERATIVETASK: string;
    PUBLICACCESSIBILITY: number;
    PROMPTLEVEL: string;
    OPENSOURCE: number | boolean;
    promptImage: string;
    CUSTOMMODELID: number;
    PREMIUMPRICECC: number;

    //variables of promptObjectValues
    DEFAULTACTION: string; 
    ACTORDEFINITION: string;
    ENVIRONMENTCONTEXT: string;
    CHALLENGEDESCRIPTION: string;
    DATAHANDLING: string;
    OBJECTIVE: string;
    AUDIENCE: string;
    TASK: string;
    ITERATIVEPREPROMPTTASKS: string;
    ITERATIVEPOSTPROMPTFORMAT: string;
    WRITINGSTYLE: string;
    TIMELINEPRIORITY: string;
    OUTPUTFORMAT: string;
    PROMPTREFERENCES: string;
    FUNCTIONID: number;
}

const FramePrompt: React.FC = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const defaultPromptLevel = 0;
    const location = useLocation();
    const navigate = useNavigate();
    const versionHistoryPayload = location?.state?.versionDetails;
    // State for version history data
    //const [versionHistoryData, setVersionHistoryData] = useState<IPromptFormData | null>(null);
    // Define state for promptData
    const [loacalPromptData, setLoacalPromptData] = useState<IPromptFormData | null>(null);
    const { user } = useSelector((state: any) => state.commonSlice);
    const [accountTypeForCCDeduction, setAccountTypeForCCDeduction] = useState<any>(user.libraryType == 'org' ? 'corp' : 'user')
    const [refineResposne, setRefineResposne] = useState();
    const [childConstIterativePrePromptTask, setChildConstIterativePrePromptTask] = useState('');
    const [childConstIterativePostPromptFormat, setChildConstIterativePostPromptFormat] = useState('');
    const [isChildFormSubmitted, setIsChildFormSubmitted] = useState(false);
    const [childConstDefaultActionCCount, setChildConstDefaultActionCCount] = useState(0);
    //Set the latest form data of PromptControls and PromptObjectValues
    //This will be used to call the API when either PromptControls and PromptObjectValues are updated
    //If we add any new field in PromptControls or PromptObjectValues, we need to add that field here
    const [promptFormData, setPromptFormData] = useState<IPromptFormData>({
        gptBluePromptId: params?.id ? +params?.id : 0,
        PROMPTNAME: '',
        PROMPTDESCRIPTION: '',
        AUTOSAVE: 0,
        AUTHORVIEW: 0,
        ALLOWTOCOPY: 0,
        CUSTOMDATA: 0,
        FUNCTIONCALL: 0,
        SPONSOREDPROMPT: 0,
        ITERATIVETASK: '',
        PUBLICACCESSIBILITY: 0,
        PROMPTLEVEL: '',
        OPENSOURCE: 0,
        promptImage: '',
        CUSTOMMODELID: 0,
        DEFAULTACTION: '',
        ACTORDEFINITION: '',
        ENVIRONMENTCONTEXT: '',
        CHALLENGEDESCRIPTION: '',
        DATAHANDLING: '',
        OBJECTIVE: '',
        AUDIENCE: '',
        TASK: '',
        ITERATIVEPREPROMPTTASKS: '',
        ITERATIVEPOSTPROMPTFORMAT: '',
        WRITINGSTYLE: '',
        TIMELINEPRIORITY: '',
        OUTPUTFORMAT: '',
        PROMPTREFERENCES: '',
        FUNCTIONID: 0,
        PREMIUMPRICECC: 0
    });
    
    const [getPromptsAPI, { data: selectedPromptData, isLoading: isLoadingSelectedPrompt, isSuccess: isSucccessSelectedPrompt, isError: isErrorSelectedPrompt, error: errorSelectedPrompt }] =
        useGetPromptsMutation();
    const [getAllFunctionDetailAPI, { data: functionDetailData, isLoading: isFunctionDetailLoading, isSuccess: isFunctionDetailSuccess, isError: isFunctionDetailError, error: functionDetailError }] =
        useGetFunctionDetailMutation();
    const [refineResultsGPTAPI, { data: refineResulsResponse, isLoading: refineResulsLoading, isSuccess: refineResulsSuccess, isError: isRefineResulsError, error: refineResulsError }] =
        useAskGPTRefineResultTestMutation();
    const [askGPTAPI, { data: askGPTResponse, isLoading: isAskGPTLoading, isSuccess: isAskGPTSuccess, isError: isAskGPTError, error: askGPTError }] =
        useAskGPTTestMutation();
    const [getAllGPTCustomModelAPI, { data: gptCustomModelData, isLoading: isGPTCustomModelLoading, isSuccess: isGPTCustomModelSuccess, isError: isGPTCustomModelError, error: gptCustomModelError }]
        = useUpdateModelMutation();
    const [createPromptAPI, { data: createPromptResponse, isLoading: isCreatePromptLoading, isSuccess: isCreatePromptSuccess, isError: isCreatePromptError, error: createPromptError}] =
        useCreatePromptMutation();
    const [getVersionHistory, { data: versionHistory, isLoading: isLoadingVersionHistory, isSuccess: isSucccessVersionHistory, isError: isErrorVersionHistory, error: errorVersionHistory }] =
        useVersionHistoryMutation();

    useEffect(() => {
        dispatch(fullPageLoader(true));
        getAllGPTCustomModelAPI({customModelId: 0});
    }, []);

    // Call getVersionHistory when versionHistoryPayload changes
    useEffect(() => {
        if (versionHistoryPayload) {
            getVersionHistory(versionHistoryPayload);
        }
    }, [versionHistoryPayload]);
    useEffect(() => {
        if (isSucccessVersionHistory) {
            //setVersionHistoryData(versionHistory);
            dispatch(fullPageLoader(false));
        }
        if (isErrorVersionHistory) {
            dispatch(fullPageLoader(false));
        }
    }, [isSucccessVersionHistory, isErrorVersionHistory]);

    const handlePromptFormDataSubmit = () => {
        // Call API here with promptFormData of PromptControls and PromptObjectValues
        // Set isFormChildSubmitted to true when the form is submitted
        setIsChildFormSubmitted(true);
    };
    useEffect(() => {
        if (isChildFormSubmitted && promptFormData.PROMPTNAME.length > 0) {
            // Call API here with promptFormData of PromptControls and PromptObjectValues
            //dispatch(fullPageLoader(true));
            createPromptAPI(promptFormData);
            // Reset isChildFormSubmitted to false after calling the API
            setIsChildFormSubmitted(false);
        }
    }, [promptFormData, isChildFormSubmitted]);
    
    const handlePromptFieldChange = (field: string, value: any) => {
        //Handles the change of promptFormData in PromptControls and PromptObjectValues
        setPromptFormData(prevState => {
            const updatedState = { ...prevState, [field]: value };
            return updatedState;
        });
    };

    
    useEffect(() => {
        if (isCreatePromptSuccess) {
            //dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'success', message: createPromptResponse?.message, timeout: 1000 }));
            if(createPromptResponse?.success == true){
                navigate(`/app/prompts/edit/${createPromptResponse?.promptId}`)
            }
        }
        if (isCreatePromptError || createPromptResponse?.success == false) {
            //dispatch(fullPageLoader(false));
            dispatch(updateAlertMessage({ status: 'error', message: createPromptResponse?.message, timeout: 1000 }));
        }
    }, [isCreatePromptSuccess, isCreatePromptError]);
    
    useEffect(() => {
        if (isGPTCustomModelSuccess || isGPTCustomModelError || gptCustomModelError) {
            dispatch(fullPageLoader(false));
        }
    }, [isGPTCustomModelSuccess, isGPTCustomModelError, gptCustomModelError]);

    useEffect(() => {
        if (askGPTResponse || refineResulsResponse) {
            if (askGPTResponse?.success == false && askGPTResponse?.statusCode != 401) {
            if (askGPTResponse?.status == 'FETCH_ERROR' || askGPTResponse?.status == 'PARSING_ERROR') {
                dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
            } else {
                dispatch(updateAlertMessage({ status: 'error', message: askGPTResponse?.message }));
            }
            }
            if (refineResulsResponse?.success == false && refineResulsResponse?.statusCode != 401) {
            if (refineResulsResponse?.status == 'FETCH_ERROR' || refineResulsResponse?.status == 'PARSING_ERROR') {
                dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
            } else {
                dispatch(updateAlertMessage({ status: 'error', message: refineResulsResponse?.message }));
            }
            }
            // if (refineResulsResponse?.statusCode == 401) {
            // dispatch(updateIsSessionExpired(true));
            // dispatch(updateReloadPageAfterSessionExpired(false));
            // setFunctionToCallAfterRefresh('refine');
            // }
            // if (askGPTResponse?.statusCode == 401) {
            // dispatch(updateIsSessionExpired(true));
            // dispatch(updateReloadPageAfterSessionExpired(false));
            // setFunctionToCallAfterRefresh('ask');
            // }
            if (refineResulsResponse?.success == true) {
            setRefineResposne(refineResulsResponse);
            }
        }
        }, [askGPTResponse, refineResulsResponse])

    const [isLibraryTypeChanged, setIsLibraryTypeChanged] = useState(false);
    const handleLibraryTypeChange = (value: boolean) => {
        setIsLibraryTypeChanged(value);
    };
    const [reloadCheck,setReloadCheck] = useState(false);
    const handleReloadCheck = () => {
        setReloadCheck(!reloadCheck);
    }; 
    const [childConstFreeze, setChildConstFreeze] = useState<string | null>(null);
    const handleChildConstFreeze = (freeze: string) => {
        setChildConstFreeze(freeze);
    };

    const [selectedPromptObject, setSelectedPromptObject] = useState('promptActorDefinition');
    const handlePromptObjectClick = (PromptObjectId: string) => {
        setSelectedPromptObject(PromptObjectId);
    };

    const [childConstIterative, setChildConstIterative] = useState(false);
    const handleChildConstIterative = (iterative: boolean) => {
        setChildConstIterative(iterative);
    };

    const [childConstFunctionCall, setChildConstFunctionCall] = useState(false);
    const handleChildConstFunctionCall = (functionCall: boolean) => {
        setChildConstFunctionCall(functionCall);
    };
    const [childConstCustomModelId, setChildConstCustomModelId] = useState('');
    const handleChildConstCustomModelId = (customModelId: string) => {
        setChildConstCustomModelId(customModelId);
    };


    const [childConstCustomData, setChildConstCustomData] = useState(false);
    const handleChildConstCustomData = (customData: boolean) => {
        setChildConstCustomData(customData);
    };
    const [childConstPromptLevel, setChildConstPromptLevel] = useState(defaultPromptLevel);
    const handleChildConstPromptLevel = (promptLevel: number) => {
        setChildConstPromptLevel(promptLevel);
    };
    const [childConstAutoSave, setChildConstAutoSave] = useState(false);
    const handleChildConstAutoSave = (autoSave: boolean) => {
        setChildConstAutoSave(autoSave);
    };

    useEffect(() => {
        let promptdata = versionHistory?.promptHistory?.[0] || selectedPromptData?.promptDetail?.[0];
        if ( promptdata) {
            dispatch(fullPageLoader(false));
            setLoacalPromptData(promptdata);
            setChildConstFreeze(promptdata.PROMPTSTAUS);
            setChildConstIterative(promptdata.ITERATIVETASK =="yes" ? true : false);
            setChildConstFunctionCall(promptdata.FUNCTIONCALL == 1 ? true : false);
            setChildConstCustomModelId(promptdata.customModelDetail?.[0]?.CUSTOMMODELID);
            setChildConstPromptLevel(promptdata.PROMPTLEVEL == 'S' ? 0 : promptdata.PROMPTLEVEL == 'A' ? 1 : promptdata.PROMPTLEVEL == 'E'? 2 : defaultPromptLevel);
            setChildConstCustomData(promptdata.CUSTOMDATA == 1 ? true : false);
            setChildConstIterativePrePromptTask(promptdata.ITERATIVEPREPROMPTTASKS);
            setChildConstIterativePostPromptFormat(promptdata.ITERATIVEPOSTPROMPTFORMAT);
            setChildConstAutoSave(promptdata.AUTOSAVE == 1 ? true : false);
            setChildConstDefaultActionCCount(2500 - promptdata.DEFAULTACTION.length);
            const newPromptData = promptdata;
            if (newPromptData) {
                const updatedPromptData: Partial<IPromptFormData> = {};
                for (const key in promptFormData) {
                    if (key in newPromptData) {
                        updatedPromptData[key as keyof IPromptFormData] = newPromptData[key as keyof IPromptFormData];
                    }
                }
                setPromptFormData(prevState => ({ ...prevState, ...updatedPromptData }));
            }
        }
        if (isErrorSelectedPrompt) {
            dispatch(fullPageLoader(false));
        }
    }, [ isSucccessSelectedPrompt, isErrorSelectedPrompt, versionHistory]);

    useEffect(() => {
        if (params.id) {
            dispatch(fullPageLoader(true));
            Promise.all([
                getPromptsAPI({GPTBluePromptId: params?.id}),
                getAllFunctionDetailAPI({}),
            ]).then(() => {
                dispatch(fullPageLoader(false));
            });
        }
    }, [params.id, getPromptsAPI, getAllFunctionDetailAPI, getAllGPTCustomModelAPI]);

    const handleTestGPTBluePrompt = (payload: any) => {
        const modifiedPayload = {
            ...payload,
            accountType: accountTypeForCCDeduction,
            page: "dtd"
        };
        dispatch(fullPageLoader(true));
        askGPTAPI(modifiedPayload);
        setReloadCheck(true);
    };
    const handlePrePromptTaskChange = (value: string) => {
        setChildConstIterativePrePromptTask(value);
    };
    const handlePostPromptFormatChange = (value: string) => {
        setChildConstIterativePostPromptFormat(value);
    };
    const handleChildConstDefaultActionCCount = (value: number) => {
        setChildConstDefaultActionCCount(value);
    };

    const refineResult = (html: any, localUserFirstPromptId: number) => {
        const payload = {
            "gptQuestionResponseTextarea": html,
            "GPTBluePromptId": parseInt(params?.id || '0'),
            "repetitivePrePromptTasks": childConstIterativePrePromptTask || '',
            "repetitivePostPromptFormat": childConstIterativePostPromptFormat || '',
            "refineQuestionResponseBtn": "",
            "accountType": accountTypeForCCDeduction,
            "customData": childConstCustomData ? 1 : 0,
            "functionCall": childConstFunctionCall ? 1 : 0,
            "autoSave": childConstAutoSave ? 1 : 0,
            "customModelId": childConstCustomModelId,
            "userFirstPromptId": localUserFirstPromptId,
            "page": "dtd"
        }
        refineResultsGPTAPI(payload);
    }

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-lg-3">
                    <UserCard />
                </div>
                <div className="col-lg-9">
                    {/* selectedPromptData prop that passing to PromptControls to be undefined when isSucccessSelectedPrompt is false. This way, the useEffect in child component will not run when isSucccessSelectedPrompt is false. */}
                    <PromptControls 
                        selectedPromptData={isSucccessSelectedPrompt ? loacalPromptData : undefined} 
                        mode={params.id ? 'edit' : 'create'} 
                        onConstFreezeSet={handleChildConstFreeze}
                        onConstIterativeSet={handleChildConstIterative}
                        onConstFunctionCallSet={handleChildConstFunctionCall} 
                        onConstCustomDataSet={handleChildConstCustomData}
                        onConstPromptLevelSet={handleChildConstPromptLevel}
                        customModelData={isGPTCustomModelSuccess ? gptCustomModelData : undefined}
                        onConstCustomModelIdSet={handleChildConstCustomModelId}
                        onConstAutoSaveSet={handleChildConstAutoSave}
                        onPromptFieldChange={handlePromptFieldChange} 
                        onPromptFormDataSubmit={handlePromptFormDataSubmit}
                        childConstDefaultActionCCount={childConstDefaultActionCCount}
                    />
                </div> 
            </div>
            <div className="row">
                <div className="col-lg-3">
                {params.id 
                ? 
                (   
                    <PromptObject 
                        onPromptObjectClick={handlePromptObjectClick}
                        childConstIterative={childConstIterative}
                        childConstFunctionCall={childConstFunctionCall}
                        childConstPromptLevel={childConstPromptLevel}
                    />
                ) 
                : 
                (
                    <PromptList 
                        actionURL={'/app/prompts/edit'} 
                        includePublicPrompt={false} 
                        setIsLibraryTypeChanged={setIsLibraryTypeChanged} 
                        onLibraryTypeChange={handleLibraryTypeChange} 
                    />
                )
                }
                </div>
                <div className="col-lg-6">
                    {params.id && isSucccessSelectedPrompt &&
                    <>
                        <div className="mb-3">
                            <PromptObjectValues
                                selectedPromptData={isSucccessSelectedPrompt ? loacalPromptData : undefined} 
                                functionDetailData={isFunctionDetailSuccess ? functionDetailData : undefined}
                                selectedPromptObject={selectedPromptObject}
                                childConstFreeze={childConstFreeze}
                                childConstIterative={childConstIterative}
                                childConstAutoSave={childConstAutoSave}
                                childConstFunctionCall={childConstFunctionCall}
                                childConstCustomModelId={childConstCustomModelId}
                                childConstCustomData={childConstCustomData}
                                onTestGPTBluePrompt={handleTestGPTBluePrompt}
                                onPrePromptTaskChange={handlePrePromptTaskChange}
                                onPostPromptFormatChange={handlePostPromptFormatChange}
                                onPromptFieldChange={handlePromptFieldChange} 
                                onPromptFormDataSubmit={handlePromptFormDataSubmit}
                                onConstDefaultActionCCountSet={handleChildConstDefaultActionCCount}
                            />
                        </div>
                        <AiResponse 
                            page="dtd" 
                            loading={isAskGPTLoading} 
                            refineLoading={refineResulsLoading} 
                            askGPTResponse={askGPTResponse} 
                            refineResults={refineResposne} 
                            isAskGPTError={isAskGPTError} 
                            isRefineError={isRefineResulsError} 
                            isIterative={childConstIterative} 
                            refineResult={refineResult} 
                        />
                    </>
                    }
                </div>
                <div className="col-lg-3">
                    {params.id && isSucccessSelectedPrompt &&
                    <>
                        <div className="mb-3">
                            <PromptTips selectedPromptObject={selectedPromptObject} />
                        </div>
                        <Statistics 
                            id="dtd_analytics" 
                            reloadCheck = {reloadCheck} 
                            handleReloadCheck={handleReloadCheck} 
                            statsType="prompt"
                        />
                    </>
                    }
                </div>
            </div>
        </div>
    );
};

export default FramePrompt;

