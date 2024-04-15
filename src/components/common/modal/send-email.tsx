import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { draggableBootstrapModal } from './draggable-modal';

interface SendEmailProps {
    id: string;
    onSendEmail: () => void;
    emailError: boolean;
    setEmailError: (error: boolean) => void;
    userEmail: string;
    setUserEmail: (comment: string) => void;
    emailPattern?: RegExp;
}

const SendEmailModal: React.FC<SendEmailProps> = ({ id, onSendEmail, emailError, setEmailError, userEmail,setUserEmail, emailPattern  }) => {
    const { t } = useTranslation();

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
                        {t('inputs.text.email.label')}
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <input type="email" 
                        className={`form-control form-control-lg ${emailError ? 'is-invalid' : ''}`} 
                        placeholder={t('inputs.text.email.placeholder')}
                        onChange={(e: any) => {
                            setUserEmail(e.target.value);
                            if (e.target.value.length > 0 && e.target.value.match(emailPattern) !== null && e.target.value.length < 250) {
                                setEmailError(false);
                            }
                            else{
                                setEmailError(true);
                            }
                        }} 
                    />
                    {emailError && <div className="invalid-feedback">{t('inputs.text.email.placeholder')}</div>}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('buttons.close.label')}</button>
                    <button type="button" className="btn btn-primary"
                        onClick={onSendEmail}>{t('common.send')}
                    </button>
                </div>
                </div>
            </div>
        </div>
    );
};

export default SendEmailModal;