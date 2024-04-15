import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";

interface SendCommentModalProps {
    id: string;
    onSendComment: () => void;
    commentError: boolean;
    setCommentError: (error: boolean) => void;
    userComment: string;
    setUserComment: (comment: string) => void;
}

const SubmitApprovalModal: React.FC<SendCommentModalProps> = ({ id, onSendComment,commentError, setCommentError, userComment, setUserComment }) => {
    const {t} = useTranslation();

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
                        {t('buttons.add_comment.label')}
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <input type="text" 
                    value={userComment}
                        className={`form-control form-control-lg ${commentError ? 'is-invalid' : ''}`} 
                        placeholder={t('inputs.text.comment.placeholder')}
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
                    {commentError && <div className="invalid-feedback">{t('inputs.text.comment.invalid')}</div>}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('buttons.close.label')}</button>
                    <button type="button" className="btn btn-primary"
                        onClick={onSendComment}>{"Submit"}
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitApprovalModal;