import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fullPageLoader, updateUser, updateAlertMessage, updateIsSessionExpired, updateReloadPageAfterSessionExpired } from "../../../api-integration/commonSlice";
import UserCard from "../../../components/common/user-card/user-card";
import { useGetPromptsApprovalMutation, usePostPromptsApprovalMutation } from '../../../api-integration/secure/secure';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/common/card/card';
import Pagination from '../../../components/common/pagination/pagination';
import { FormatDate } from '../../../util/util';
import CircleSolid from '../../../components/common/icons/circle-solid-svg';
import TooltipComponent from '../../../components/common/bootstrap-component/tooltip-component';
import { Modal } from "bootstrap";
import { useCommentPromptMutation } from "../../../api-integration/public/common";
import SubmitApprovalModal from "../../../components/secure/modals/submit-prompt-approval";
import PromptDetailsModal from "../../../components/secure/modals/prompt-details";

interface PromptsData {
  o_gptblue_prompt_framing__actordefinition: string;
  // Define other properties as needed
}
const PromptsApproval = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [userComment, setUserComment] = useState('');  
  const [promptsData, setPromptsData] = useState({
    "z_gptblue_task_version_history__rid": 0,
    "o_gptblue_prompt_framing__environment_context": "",
    "o_gptblue_prompt_framing__URLCode": "",
    "o_gptblue_prompt_framing__updated": "",
    "o_gptblue_prompt_framing__challenge_description": "",
    "o_gptblue_prompt_framing__sponsoredPrompt": 0,
    "firstname": "",
    "o_gptblue_prompt_framing__userdefaultprompt": "",
    "o_gptblue_prompt_framing__updatedby": 0,
    "promptCategory": "",
    "o_gptblue_prompt_framing__additional_considerations": "",
    "o_gptblue_prompt_framing__open_source": 0,
    "lastname": "Mohammad-BD",
    "o_gptblue_prompt_framing__status": "",
    "o_gptblue_prompt_framing__writing_style": "",
    "o_gptblue_prompt_framing__allowToCopy": 0,
    "o_gptblue_prompt_framing__data_handling": "",
    "o_gptblue_prompt_framing__level": "",
    "LIB_name": "BlueCallom Prompt Library",
    "o_gptblue_prompt_framing__objectives": "",
    "o_gptblue_prompt_framing__autosave": 0,
    "o_gptblue_prompt_framing__name": "",
    "o_gptblue_prompt_framing__functionCalling": 0,
    "o_gptblue_cluster__rid": null,
    "LIB_ID": 1,
    "o_gptblue_prompt_framing__id": 0,
    "o_gptblue_prompt_framing__description": "",
    "o_gptblue_prompt_framing__prepromt": "",
    "o_gptblue_prompt_framing__repetitive_prePrompt": "",
    "o_gptblue_prompt_framing__createdby": 0,
    "o_gptblue_prompt_framing__authorView": 0,
    "o_gptblue_prompt_framing__Timeline_and_priorities": "",
    "o_gptblue_prompt_framing__audience": "",
    "o_gptblue_prompt_framing__postprompt": "",
    "o_gptblue_prompt_framing__repetitive_postPrompt": "",
    "o_gptblue_prompt_framing__blc_status": "",
    "o_gptblue_prompt_framing__task_structure": "",
    "o_gptblue_prompt_framing__repetitive_flag": "",
    "o_gptblue_prompt_framing__references": "",
    "o_gptblue_prompt_framing__customData": 0,
    "o_gptblue_prompt_framing__actordefinition": "",
    "o_gptblue_prompt_framing__publicAccessibility": 0,
    "o_gptblue_prompt_framing__created": "",
    "promptLibStatus": "rejected",
    "o_gptblue_prompt_framing__dynamic_action": ""
});
  const [promptsAction, setPromptsAction] = useState('');
  const [commentError, setCommentError] = useState(false);
  // PAGINATION -PromptsApprovalDataChange page
  const paginatePrompt = (pageNumber: number) => setCurrentPage(pageNumber);
  const [
    PromptsApprovalAPI,
    {
      data: PromptsApprovalData,
      isLoading: isPromptsDataLoading,
      isSuccess: isPromptsDataSuccess,
      isError: isPromptsDataError,
      error: promptsApprovalError,
    },
  ] = useGetPromptsApprovalMutation();
  const [commentAPI, { data: commentResposne, isLoading: isCommentLoading, isSuccess: isCommentSuccess, isError: isCommentError, error: ommentError }] =
  useCommentPromptMutation();
  const [
    PromptsApprovalActionAPI,
    {
      data: PromptsApprovalAction,
      isLoading: isPromptsActionLoading,
      isSuccess: isPromptsActionSuccess,
      isError: isPromptsActionError,
      error: promptsActionApprovalError,
    },
  ] = usePostPromptsApprovalMutation();

  const reloadTable = useCallback(() => {
    dispatch(fullPageLoader(true));
    const payload = {
        GPTBluePromptId: 0,
      };
      PromptsApprovalAPI(payload);
  }, [PromptsApprovalAPI])

  useEffect(() => {
    reloadTable();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [currentItems, setCurrentItems] = useState([]);
  const sendCommentModalId = "sendCommentModal";
  const sendPromptDetailId = "sendPromptDetailModal";

  useEffect(() => {
    const functionDetail = PromptsApprovalData?.functionDetail;
    if (functionDetail) {
      dispatch(fullPageLoader(false));
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;

      setCurrentItems(functionDetail.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [PromptsApprovalData, currentPage, itemsPerPage, dispatch]);

  useEffect(() => {
    if (isPromptsDataSuccess || isPromptsDataError) {
      dispatch(fullPageLoader(false));
    }
  }, [isPromptsDataSuccess, isPromptsDataError]);

  const handleActionUpdate = useCallback((promptsData: any, action: string) => {
    setUserComment('')
    setPromptsData(promptsData);
    setPromptsAction(action);
  }, [])
  const handlePromptname = useCallback((promptsData: any) => {
    setPromptsData(promptsData);
  }, [])

  useEffect(() => {
    if (isPromptsActionSuccess) {
      dispatch(fullPageLoader(false));
      if (PromptsApprovalAction?.success == true) {
        dispatch(updateAlertMessage({status: "success", message: PromptsApprovalAction?.message}));
        reloadTable();
      } 
      else {
        dispatch(updateAlertMessage({status: "error", message: PromptsApprovalAction?.message}));
      }
    }
    if (isPromptsActionError) {
      dispatch(updateAlertMessage({ status: "error", message: PromptsApprovalAction?.message}));
    }
  }, [isPromptsActionError, isPromptsActionSuccess]);
 const sendComment = () => {
      setCommentError(false);
      dispatch(fullPageLoader(true));
      PromptsApprovalActionAPI({
      GPTBluePromptId: promptsData && promptsData?.o_gptblue_prompt_framing__id,
      action: promptsAction,
      lib_id: promptsData && promptsData?.LIB_ID,
      comment: userComment
      })
      .then(() => {
        // Close the modal manually
        var myModalEl = document.getElementById(sendCommentModalId)
        if (myModalEl) {
          var modal = Modal.getInstance(myModalEl)
          modal?.hide()
        }
      })
  }
  return (
    <>
      <div className="container">
        <div className="row mb-4">
          <div className="col-lg-3 mb-3">
            <div className="mb-3">
              <UserCard />
            </div>
          </div>
          <div className="col-lg-9">
            <Card
              id="promptManager_promptReview"
              like={false}
              share={false}
              help={true}
              helpTitle={t("promptsapproval.help.title")}
              helpContent={t("promptsapproval.help.content")}
              titleType={1}
              title={t("promptsapproval.title")}
              Feedback={true}
              logo={true}
            >
              <div className="table-responsive">
                <table className="table table-sm table-bordered table-responsive text-sm">
                  <thead>
                    <tr>
                      <th>{t("promptsapproval.table.prompt_name")}</th>
                      <th>{t("promptsapproval.table.author_name")}</th>
                      <th>{t("promptsapproval.table.created_date")}</th>
                      <th>{t("promptsapproval.table.library")}</th>
                      <th>{"Prompt Category"}</th>
                      <th>{t("promptsapproval.table.prompt_lib_status")}</th>
                      <th>{t("promptsapproval.table.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PromptsApprovalData?.functionDetail !== undefined && PromptsApprovalData?.functionDetail !== null &&
                      (!currentItems || currentItems.length == 0 ? (
                        <tr>
                          <td colSpan={6}>{t("message.no_record_found")}</td>
                        </tr>
                      ) : (
                        currentItems.map((promptsData: any, index: number) => (
                          <tr key={index}>
                            <TooltipComponent  title={promptsData?.o_gptblue_prompt_framing__description}>
                            <td data-bs-toggle="modal"
                              data-bs-target={`#${sendPromptDetailId}`}>
                              <p className="cursor-pointer" onClick={() => handlePromptname(promptsData)}> {promptsData?.o_gptblue_prompt_framing__name}</p>
                            </td>
                            </TooltipComponent>
                            <td>{promptsData?.lastname}</td>
                            <td>
                              {FormatDate(
                                promptsData?.o_gptblue_prompt_framing__created
                              )}
                            </td>
                            <td>{promptsData?.LIB_name}</td>
                            <td className="">
                              {
                                promptsData?.promptCategory
                              }
                            </td>
                            <td className="">
                              {promptsData.promptLibStatus}
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-between">
                                <TooltipComponent
                                  title={t("promptsapproval.btn.green.tooltip")}
                                >
                                  <span
                                    className="mx-2 cursor-pointer"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${sendCommentModalId}`}
                                    onClick={() =>
                                      handleActionUpdate(promptsData, "approved")
                                    }

                                  >
                                    <CircleSolid className="" fillColor="var(--bs-success)" />
                                  </span>
                                </TooltipComponent>
                                <TooltipComponent
                                  title={t("promptsapproval.btn.red.tooltip")}
                                >
                                  <span
                                    className="mx-2 cursor-pointer"
                                    data-bs-toggle="modal"
                              data-bs-target={`#${sendCommentModalId}`}
                                    onClick={() =>
                                      handleActionUpdate(promptsData, "blocked")
                                    }
                                  >
                                    <CircleSolid className="" fillColor="var(--bs-danger)" />
                                  </span>
                                </TooltipComponent>
                                <TooltipComponent
                                  title={t("promptsapproval.btn.yellow.tooltip")}
                                >
                                  <span
                                    className="mx-2 cursor-pointer"
                                    data-bs-toggle="modal"
                              data-bs-target={`#${sendCommentModalId}`}
                                    onClick={() =>
                                      handleActionUpdate(promptsData, "rejected")
                                    }
                                  >
                                    <CircleSolid
                                      className=""
                                      fillColor="var(--bs-warning)"
                                    />
                                  </span>
                                </TooltipComponent>
                              </div>
                            </td>
                          </tr>
                        ))
                      ))}
                  </tbody>
                </table>
              </div>
              {isPromptsDataLoading && (
                <div className="text-center">{t("message.loading")}</div>
              )}
              {isPromptsDataSuccess &&
                PromptsApprovalData?.functionDetail !== null && PromptsApprovalData?.functionDetail !== undefined &&
                PromptsApprovalData?.functionDetail.length > 0 && (
                  <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={PromptsApprovalData?.functionDetail && PromptsApprovalData?.functionDetail?.length}
                    paginate={paginatePrompt}
                    currentPage={currentPage}
                    pervNextNavFlag={true}
                    noOfLinksOnPage={10}
                    previousText={t("pagination.text.prev")}
                    nextText={t("pagination.text.next")}
                  />
                )}
            </Card>
          </div>
        </div>
      </div>
      <PromptDetailsModal 
        id={sendPromptDetailId}   
        promptsData={promptsData}
      />
      <SubmitApprovalModal 
        id={sendCommentModalId} 
        onSendComment={sendComment}
        commentError={commentError} 
        setCommentError={setCommentError} 
        userComment={userComment} 
        setUserComment={setUserComment}  
        
      />
    </>
  );
};

export default PromptsApproval;
