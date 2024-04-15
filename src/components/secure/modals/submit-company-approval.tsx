import React, { useEffect } from 'react';
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";

interface SendCommentModalProps {
    id: string;
    company: string;
    status: string;
    onSendComment: () => void;
    commentError: boolean;
    setCommentError: (error: boolean) => void;
    userComment: string;
    setUserComment: (comment: string) => void;
}

const SubmitApprovalModal: React.FC<SendCommentModalProps> = ({ id, onSendComment,commentError, setCommentError, userComment, setUserComment, company, status }) => {
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
                        {company}
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <label>Enter comment for <strong>{status}</strong></label>
                    <input type="text" 
                    value={userComment}
                        className={`form-control form-control-lg ${commentError ? 'is-invalid' : ''}`} 
                        placeholder="Enter a comment"
                        onChange={(e: any) => {
                            setUserComment(e.target.value);
                            if (e.target.value.length < 500) {
                              setCommentError(false);
                            }
                            else{
                                setCommentError(true);
                            }
                        }} 
                    />
                    {commentError && <div className="invalid-feedback">Comment is required and not more than 500 characters.</div>}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={onSendComment}>Submit</button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitApprovalModal;
