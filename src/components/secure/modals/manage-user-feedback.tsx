import { useEffect } from "react";
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";

interface UserFeedbackData {
    "FEEDBACKCONTENT": string;
    "FEEDBACKRESOLUTION": string;
    "FEEDBACKTILECODE": string;
    "FEEBACKSTATUS": string;
    "FEEDBACKDETAILS": string;
    "FEEDBACKPRIORITY":string;
    "FEEDBACKTITLE": string; 
    "FEEDBACKTILEPAGE": string;
    "FEEDBACKBACKGROUND": string;
    "FEEDBACKTYPE": string;
}

interface ManageUserFeedbackModalProps {
    id: string;
    feedbackData: UserFeedbackData;
}

const ManageUserFeedbackModal: React.FC<ManageUserFeedbackModalProps> = ({id, feedbackData}) => {

    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
          draggableBootstrapModal(modalElement);
        }
    }, [id]);
    
    return (
        <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>
                            Compay Details
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {feedbackData && <>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Title:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKTITLE || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                            <label><strong> Content:</strong></label>
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKCONTENT || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                            <label><strong> Status:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEBACKSTATUS || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                            <label><strong> Background:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKBACKGROUND || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Details:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKDETAILS || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Title Page:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKTILEPAGE || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Priority:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKPRIORITY || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Resolution:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKRESOLUTION || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Type:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKTYPE || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Title Code:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {feedbackData?.FEEDBACKTILECODE || "-"}
                            </div>   
                        </div>
                        </>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageUserFeedbackModal;