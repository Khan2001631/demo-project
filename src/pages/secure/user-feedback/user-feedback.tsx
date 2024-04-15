import {useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Card from "../../../components/common/card/card";
import UserCard from "../../../components/common/user-card/user-card";
import { useGetUserFeedbackMutation } from "../../../api-integration/secure/secure";
import { fullPageLoader } from '../../../api-integration/commonSlice';
import Pagination from "../../../components/common/pagination/pagination";
import TooltipComponent from "../../../components/common/bootstrap-component/tooltip-component";
import ManageUserFeedbackModal from "../../../components/secure/modals/manage-user-feedback"


const UserFeedback = () => {

    const dispatch = useDispatch();

    const [feedback, setFeedback] = useState<any>();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [currentItems, setCurrentItems] = useState([]);

    const sendUserFeedbackModalId = "sendUserFeedbackModalId" 

    const [getFeedbackAPI,{data: feedbackData, isLoading: isFeedbackLoading, isSuccess: isFeedbackSuccess, isError: isFeedbackError, error: FeedbackError }] = useGetUserFeedbackMutation();

    useEffect(() => {
        const feedback = feedbackData?.userfeedbackDetailJSON;
        if (feedback) {
          dispatch(fullPageLoader(false));
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
          setCurrentItems(feedback.slice(indexOfFirstItem, indexOfLastItem));
        }
      }, [feedbackData, currentPage, itemsPerPage, dispatch]);
      const paginatePrompt = (pageNumber: number) => setCurrentPage(pageNumber);

    useEffect(() => {
        dispatch(fullPageLoader(true))
        getFeedbackAPI({frqid: 0})
    },[])


    useEffect(() => {
        if(isFeedbackSuccess || isFeedbackError || FeedbackError)
            dispatch(fullPageLoader(false))
    },[isFeedbackSuccess, isFeedbackError, FeedbackError])

    const  handleName = (feedback: any) => setFeedback(feedback)

    return(
        <>
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <UserCard/>
                </div>
                <div className="col-md-9">
                <Card id="manageUserFeedback_FrqList" like={false} share={false} help={true} helpTitle="Feedback" helpContent="Content coming soon..." titleType={1} title="Feedback List(s)" Feedback={false} logo={true}
            >
                <div className="table-responsive">
                <table className="table table-sm table-bordered table-responsive text-sm">
                <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Code</th>
                      <th>Page</th>
                      <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                {feedbackData?.userfeedbackDetailJSON !== undefined && feedbackData?.userfeedbackDetailJSON !== null &&
                      (!currentItems || currentItems.length == 0 ? (
                        <tr>
                          <td className="text-center" colSpan={6}>No records found</td>
                        </tr>
                      ) : (
                        currentItems.map((feedback: any, index: number) => (
                          <tr key={index}>
                            <TooltipComponent  title={feedback?.FEEDBACKTITLE}>
                            <td data-bs-toggle="modal"
                              data-bs-target={`#${sendUserFeedbackModalId}`}>
                              <p className="cursor-pointer" onClick={() => handleName(feedback)}> {feedback?.FEEDBACKTITLE}</p>
                            </td>
                            </TooltipComponent>
                            <td>{feedback?.FEEDBACKTYPE}</td>
                            <td>{feedback?.FEEDBACKPRIORITY}</td>
                            <td>{feedback?.FEEDBACKTILECODE}</td>
                            <td>{feedback?.FEEDBACKTILEPAGE}</td>
                            <td>{feedback?.FEEBACKSTATUS}</td>
                          </tr>
                        ))
                      ))}
                </tbody>
                </table>
                </div>
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={feedbackData?.userfeedbackDetailJSON && feedbackData?.userfeedbackDetailJSON?.length}
                    paginate={paginatePrompt}
                    currentPage={currentPage}
                    pervNextNavFlag={true}
                    noOfLinksOnPage={10}
                    previousText="Previous"
                    nextText="Next"
                />
            </Card>
                </div>
            </div>
        </div>
        <ManageUserFeedbackModal id={sendUserFeedbackModalId} feedbackData={feedback}/>
        </>
    )
}


export default UserFeedback;