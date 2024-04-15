import { useCallback, useEffect, useState } from "react";
import Card from "../../../components/common/card/card";
import UserCard from "../../../components/common/user-card/user-card";
import {useRequestApprovalMutation,useRequestApprovalActionMutation } from "../../../api-integration/secure/secure";
import { fullPageLoader, updateAlertMessage} from "../../../api-integration/commonSlice";
import { useDispatch } from "react-redux";
import TooltipComponent from "../../../components/common/bootstrap-component/tooltip-component";
import Pagination from "../../../components/common/pagination/pagination";
import CircleSolid from "../../../components/common/icons/circle-solid-svg";
import { Link } from "react-router-dom";
import SubmitApprovalModal from "../../../components/secure/modals/submit-company-approval";
import RequestedAccountDetailsModal from "../../../components/secure/modals/requested-acc-details";
import { Modal } from "bootstrap";

const ApproveAccRequest = () => {
  const dispatch = useDispatch();

  const [approvalData, setApprovalData] = useState<any>();
  const [approvalAction, setApprovalAction] = useState("");

  const [userComment, setUserComment] = useState("");
  const [commentError, setCommentError] = useState(false);

  const [company, setCompany] = useState("")
  const [status, setStatus] = useState("")

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [currentItems, setCurrentItems] = useState([]);
  const paginatePrompt = (pageNumber: number) => setCurrentPage(pageNumber);

  const sendCommentModalId = "sendCommentModal";
  const sendApprovalDetailId = "sendApprovalDetailModal";


  const [requestApprovalAPI,{data: requestApprovalData,isLoading: isRequestDataLoading,isSuccess: isRequestDataSuccess, isError: isRequestDataError, error: RequestDataError,}] = 
  useRequestApprovalMutation();

  const [requestApprovalActionAPI,{data: requestApprovalAction,isLoading: isRequestApprovalLoading,isSuccess: isRequestApprovalSuccess,isError: isRequestApprovalError,error: RequestApprovalError}] 
  = useRequestApprovalActionMutation();

  useEffect(() => {
    const requestDetail = requestApprovalData?.companyRequestData;
    if (requestDetail) {
      dispatch(fullPageLoader(false));
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      setCurrentItems(requestDetail.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [requestApprovalData, currentPage, itemsPerPage, dispatch]);

  useEffect(() => {
    if (isRequestDataSuccess || isRequestDataError) {
      dispatch(fullPageLoader(false));
    }
  }, [isRequestDataSuccess, isRequestDataError]);

  useEffect(() => {
    if (isRequestApprovalSuccess) {
      dispatch(fullPageLoader(false));
      if (requestApprovalAction?.success == true) {
        dispatch(updateAlertMessage({status: "success",message: requestApprovalAction?.message,}));
        reloadTable();
      } 
      else {
        dispatch(updateAlertMessage({status: "error",message: requestApprovalAction?.message,}));
      }
    }
    if (isRequestApprovalError) {
      dispatch(updateAlertMessage({status: "error",message: requestApprovalAction?.message,}));
    }
  }, [isRequestApprovalError, isRequestApprovalSuccess]);

  useEffect(() => {
    reloadTable();
  }, []);

  const reloadTable = useCallback(() => {
    dispatch(fullPageLoader(true));
    const payload = {
      accid: 0,
    };
    requestApprovalAPI(payload);
  }, [requestApprovalAPI]);

  const handleActionUpdate = useCallback((approvalData: any, action: string) => {
      setUserComment("");
      setApprovalData(approvalData);
      setCompany(approvalData?.companyName)
      setApprovalAction(action);
      if(action === 'approved')
        setStatus("Approval")
      else if(action === 'rejected')
        setStatus("Rejection")
      else
        setStatus("Refer Back")
    },
    []);

  const handleApprovalname = useCallback((approvalData: any) => {
    setApprovalData(approvalData);
  }, [])

  const sendComment = () => {
    setCommentError(false);
    dispatch(fullPageLoader(true));
    requestApprovalActionAPI({
      accid: approvalData && approvalData?.accid,
      action: approvalAction,
      comment: userComment,
    }).then(() => {
      var myModalEl = document.getElementById(sendCommentModalId);
      if (myModalEl) {
        var modal = Modal.getInstance(myModalEl);
        modal?.hide();
      }
    });
  };

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
              id="approveAccount_requestsList"
              like={false}
              share={false}
              help={true}
              helpTitle="Approvals Review"
              helpContent="Content coming soon..."
              titleType={1}
              title="Approval(s) Review"
              Feedback={true}
              logo={true}
            >
              <div className="table-responsive">
                <table className="table table-sm table-bordered table-responsive text-sm">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Registration No.</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Website</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestApprovalData?.companyRequestData !== undefined && requestApprovalData?.companyRequestData !== null &&
                      (!currentItems || currentItems.length == 0 ? (
                        <tr>
                          <td colSpan={6}>No records found...</td>
                        </tr>
                      ) : (
                        currentItems.map((responseData: any, index: number) => (
                          <tr key={index}>
                             <TooltipComponent  title={responseData?.companyName}>
                            <td data-bs-toggle="modal"
                              data-bs-target={`#${sendApprovalDetailId}`}>
                              <p className="cursor-pointer" onClick={() => handleApprovalname(responseData)}> {responseData?.companyName}</p>
                            </td>
                            </TooltipComponent>
                            <td>{responseData?.companyRegNum}</td>
                            <td>{responseData?.companyType}</td>
                            <td>{responseData?.accountStatus}</td>
                            <td className="">
                              <Link to={responseData?.companyWebsite}  target="_blank">{responseData?.companyWebsite}</Link>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-between">
                                <TooltipComponent title="Approve this approval">
                                  <span
                                    className="mx-2 cursor-pointer"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${sendCommentModalId}`}
                                    onClick={() =>handleActionUpdate(responseData,"approved")}
                                  >
                                    <CircleSolid
                                      className=""
                                      fillColor="var(--bs-success)"
                                    />
                                  </span>
                                </TooltipComponent>
                                <TooltipComponent title="Reject this approval">
                                  <span
                                    className="mx-2 cursor-pointer"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${sendCommentModalId}`}
                                    onClick={() => handleActionUpdate(responseData,"rejected")}
                                  >
                                    <CircleSolid
                                      className=""
                                      fillColor="var(--bs-danger)"
                                    />
                                  </span>
                                </TooltipComponent>
                                <TooltipComponent title="Refer back this approval">
                                  <span
                                    className="mx-2 cursor-pointer"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#${sendCommentModalId}`}
                                    onClick={() => handleActionUpdate(responseData,"referback")}
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
              {isRequestDataLoading && (
                <div className="text-center">Loading...</div>
              )}
              {isRequestDataSuccess &&
                requestApprovalData?.companyRequestData !== null && requestApprovalData?.companyRequestData !== undefined && requestApprovalData?.companyRequestData.length > 0 && (
                  <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={requestApprovalData?.companyRequestData && requestApprovalData?.companyRequestData?.length}
                    paginate={paginatePrompt}
                    currentPage={currentPage}
                    pervNextNavFlag={true}
                    noOfLinksOnPage={10}
                    previousText="Previous"
                    nextText="Next"
                  />
                )}
            </Card>
          </div>
        </div>
      </div>
      <RequestedAccountDetailsModal 
        id={sendApprovalDetailId}   
        approveData={approvalData}
      />
      <SubmitApprovalModal
        id={sendCommentModalId}
        company = {company}
        status = {status}
        onSendComment={sendComment}
        commentError={commentError}
        setCommentError={setCommentError}
        userComment={userComment}
        setUserComment={setUserComment}
      />
    </>
  );
};

export default ApproveAccRequest;
