import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fullPageLoader, updateAlertMessage, updateCurrentPrompt, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from "../../../api-integration/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { useVersionHistoryMutation } from "../../../api-integration/secure/prompts";
import { useTranslation } from "react-i18next";
import UserCard from "../../../components/common/user-card/user-card";
import PromptList from "../../../components/common/prompt-list/prompt-list";
import Statistics from "../../../components/common/statistics/statistics";
import Card from "../../../components/common/card/card";
import { FormatDate } from "../../../util/util";
import Pagination from "../../../components/common/pagination/pagination";

const PromptObject = React.lazy(() => import("../../../components/secure/prompt-object/prompt-object"))


const PromptsVersionHistory = () => {
    const { t } = useTranslation();

    const defaultPromptLevel = 2;
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentState, setCurrentState] = useState('Actor');
    const [versionCurrentState, setVersionCurrentState] = useState('ACTORDEFINITION');
    const [currentLabel, setCurrentLabel] = useState('Actor/Persona');
    const [isIterative, setIsIterative] = useState<boolean>(false);
    const [versionHistoryList, setVersionHistoryList] = useState<any>([])
    const [reloadCheck, setReloadCheck] = useState(false)

    const [getVersionHistory, { data: versionHistory, isLoading: isLoadingVersionHistory, isSuccess: isSucccessVersionHistory, isError: isErrorVersionHistory, error: errorVersionHistory }] =
        useVersionHistoryMutation();


    // PAGINATION - State
    const [currentPage, setCurrentPage] = useState(1);
    const [currentCompletePage, setCurrentCompletePage] = useState(1);
    const itemsCompletePerPage = 1;
    let currentCompleteItems = [];
    const itemsPerPage = 10;
    let currentItems = [];
    const [childConstIterative, setChildConstIterative] = useState(false);
    const handleChildConstIterative = (iterative: boolean) => {
        setChildConstIterative(iterative);
    };

    const [childConstFunctionCall, setChildConstFunctionCall] = useState(false);
    const handleChildConstFunctionCall = (functionCall: boolean) => {
        setChildConstFunctionCall(functionCall);
    };
    const [childConstPromptLevel, setChildConstPromptLevel] = useState(defaultPromptLevel);
    const handleChildConstPromptLevel = (promptLevel: number) => {
        setChildConstPromptLevel(promptLevel);
    };
    const [selectedPromptObject, setSelectedPromptObject] = useState('promptActorDefinition');
    const handlePromptObjectClick = (PromptObjectId: string) => {
        PromptObjectId === "promptActorDefinition" && setVersionCurrentState("ACTORDEFINITION");
        PromptObjectId === "promptActorDefinition" && setCurrentLabel("Actor/Person");
        PromptObjectId === "promptEnvContext" && setVersionCurrentState("ENVIRONMENTCONTEXT");
        PromptObjectId === "promptEnvContext" && setCurrentLabel("Environment Context");
        PromptObjectId === "promptChallengeDesc" && setVersionCurrentState("CHALLENGEDESCRIPTION");
        PromptObjectId === "promptChallengeDesc" && setCurrentLabel("Elaborate Challenge Description");
        PromptObjectId === "promptDataHandling" && setVersionCurrentState("DATAHANDLING");
        PromptObjectId === "promptDataHandling" && setCurrentLabel("Data Handling");
        PromptObjectId === "promptGptblueObj" && setVersionCurrentState("OBJECTIVE");
        PromptObjectId === "promptGptblueObj" && setCurrentLabel("Objective");
        PromptObjectId === "promptAudience" && setVersionCurrentState("AUDIENCE");
        PromptObjectId === "promptAudience" && setCurrentLabel("Audience");
        PromptObjectId === "promptTask" && setVersionCurrentState("TASK");
        PromptObjectId === "promptTask" && setCurrentLabel("Task");
        PromptObjectId === "promptDAction" && setVersionCurrentState("DEFAULTACTION");
        PromptObjectId === "promptDAction" && setCurrentLabel("Default Action*");
        PromptObjectId === "promptWritingStyle" && setVersionCurrentState("WRITINGSTYLE");
        PromptObjectId === "promptWritingStyle" && setCurrentLabel("Writing Style");
        PromptObjectId === "promptTimeline" && setVersionCurrentState("TIMELINEPRIORITY");
        PromptObjectId === "promptTimeline" && setCurrentLabel("Timeline and priorities");
        PromptObjectId === "promptOFormat" && setVersionCurrentState("OUTPUTFORMAT");
        PromptObjectId === "promptOFormat" && setCurrentLabel("Output Format");
        PromptObjectId === "promptReferences" && setVersionCurrentState("PROMPTREFERENCES");
        PromptObjectId === "promptReferences" && setCurrentLabel("References");
        setSelectedPromptObject(PromptObjectId);
    };


    useEffect(() => {
        if (isSucccessVersionHistory) {
            if (versionHistory?.success == true) {
                if (versionHistory?.promptHistory?.length > 0) {
                    setVersionHistoryList(versionHistory?.promptHistory)
                }
            }
        }
    }, [isSucccessVersionHistory, versionHistory])
    // PAGINATION - Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const paginateComplete = (pageNumber: number) => setCurrentCompletePage(pageNumber);
    if (versionHistoryList) {
        dispatch(fullPageLoader(false));
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const indexOfLastCompleteItem = currentCompletePage * itemsCompletePerPage;
        const indexOfFirstCompleteItem = indexOfLastCompleteItem - itemsCompletePerPage;
        currentItems = versionHistoryList?.slice(indexOfFirstItem, indexOfLastItem);
        currentCompleteItems = versionHistoryList?.slice(indexOfFirstCompleteItem, indexOfLastCompleteItem);
    }


    const handleReloadCheck = () => {
        setReloadCheck(false)
    }

    useEffect(() => {
        if (params.id) {
            const payload = { GPTBluePromptId: params?.id, gptbluePrjOwnerId: 0, gptbluePrjMemberId: 0 }
            const versionHistorypayload = { GPTBluePromptId: params?.id }
            dispatch(fullPageLoader(true));
            getVersionHistory(versionHistorypayload)
        }
    }, [params.id])

    const handleVersionSelector = (e: any) => {
        const versionDetails: { GPTBluePromptId: string | undefined; PROMPTVERSIONID: string } = { GPTBluePromptId: params?.id, PROMPTVERSIONID: e.target.value };

        navigate(`/app/prompts/edit/${params.id}`, { state: { versionDetails } })
        //  alert(e.target.value);
    }

    return (
        <div className="container">
            <div className="row d-flex mb-4">
                <div className="col-xl-3 col-lg-4 col-md-12 col-sm-12">
                    <UserCard />
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <Card id="promptVersionHistory_PromptVersioning" cardHeightClass={'h-100'} like={false} share={false} help={true} helpTitle={t('promptsVersionHistory.help.title')} helpContent={t('promptsVersionHistory.help.content')} titleType={1} title={"Prompt Versioning"} Feedback={true} logo={true}>

                        <h4 className="fw-bold">{"Social Media Engagement Prompt"}</h4>
                        <h4 className="fw-bold">{"Post Comment Inspiration"}</h4>
                        {isSucccessVersionHistory && (
                            versionHistory.statusCode !== 200 ? (
                                <div>
                                    <label>
                                        {versionHistory.message}
                                    </label>
                                </div>
                            ) : (
                                currentCompleteItems.map((version: any) => (
                                    <textarea value={version?.promptDescription} rows={4} className="form-control" disabled>
                                    </textarea>
                                ))))}
                    </Card>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                    <Statistics id="dtd_analytics" cardHeightClass={'h-100'} reloadCheck={reloadCheck} handleReloadCheck={handleReloadCheck} />
                </div>
            </div>

            <div className="row d-flex">
                <div className="col-xl-3 col-lg-4 col-md-12 col-sm-12">
                    {params.id ? (
                        <PromptObject onPromptObjectClick={handlePromptObjectClick}
                            childConstIterative={childConstIterative}
                            childConstFunctionCall={childConstFunctionCall}
                            childConstPromptLevel={childConstPromptLevel} />
                    ) : (
                        <PromptList actionURL={'/app/prompts/edit'} includePublicPrompt={false} />
                    )}
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    {
                        params.id &&
                        <>
                            <Card id="promptVersionHistory_CompletePrompt" cardHeightClass={'h-100'} titleType={1} title={"Complete Prompt"} help={true} Feedback={true} logo={true} share={false} helpTitle={"Version History"} helpContent={"Version History content is coming soon.."}>
                                <div className="flex row">
                                    {isLoadingVersionHistory && <div className="text-center">{"Loading..."}</div>}
                                    {isSucccessVersionHistory && versionHistoryList.length > 0 &&
                                        <Pagination
                                            itemsPerPage={itemsCompletePerPage}
                                            totalItems={versionHistoryList.length}
                                            paginate={paginateComplete}
                                            currentPage={currentCompletePage}
                                            pervNextNavFlag={true}
                                            noOfLinksOnPage={1}
                                        />
                                    }
                                    <div className="container">

                                        {/* {JSON.stringify(currentCompleteItems)} */}
                                        {isSucccessVersionHistory && (!currentCompleteItems || (currentCompleteItems.length == 0) ? (
                                            <tr>
                                                <td colSpan={6}>
                                                    {"No Record"}
                                                </td>
                                            </tr>
                                        ) : (
                                            currentCompleteItems.map((version: any) => (
                                                <>
                                                    <div className="d-flex justify-content-evenly" key={version?.promptHistoryId}>
                                                        <table className="table table-sm table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th>Author</th>
                                                                    <th>Prompt Description</th>
                                                                    <th>Date</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <td>{version?.promptTeam[0]?.FIRSTNAME || "-"}</td>
                                                                    <td>{version?.PROMPTDESCRIPTION}</td>
                                                                    <td>{FormatDate(version?.CREATEDON)}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="fw-bold"> {currentLabel}</label>
                                                        <textarea className="form-control" value={version[versionCurrentState]} disabled></textarea>
                                                    </div>
                                                    <button className="btn btn-primary rounded-pill px-4" value={version?.PROMPTVERSIONID} onClick={(e) => handleVersionSelector(e)}>{"Select Version"}</button>
                                                </>
                                            ))
                                        )
                                        )}
                                    </div>
                                </div>

                            </Card>
                        </>
                    }
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                    <Card id="promptVersionHistory_VersionHistory" cardHeightClass={'h-100'} titleType={1} title={"Version History"} help={true} Feedback={true} logo={true} share={false} helpTitle={t('versionhistory.help.title')} helpContent={t('versionhistory.help.content')}>
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered">
                                <thead>
                                    <tr>
                                        <th>Author</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isSucccessVersionHistory && (!currentItems || (currentItems.length == 0) ? (
                                        <tr>
                                            <td colSpan={6}>
                                                {"No Record"}
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((version: any) => (
                                            <tr key={version?.PROMPTVERSIONID}>
                                                <td>{version?.promptTeam[0]?.FIRSTNAME}</td>
                                                <td>{FormatDate(version?.CREATEDON)}</td>
                                            </tr>
                                        ))
                                    )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {isLoadingVersionHistory && <div className="text-center">{"Loading...."}</div>}
                        {isSucccessVersionHistory && versionHistoryList.length > 0 &&
                            <Pagination
                                itemsPerPage={itemsPerPage}
                                totalItems={versionHistoryList.length}
                                paginate={paginate}
                                currentPage={currentPage}
                                pervNextNavFlag={true}
                                noOfLinksOnPage={2}
                                previousText={t('pagination.text.prev')}
                                nextText={t('pagination.text.next')}
                            />
                        }

                    </Card>

                </div>
            </div>
        </div>
    )
}

export default PromptsVersionHistory;
