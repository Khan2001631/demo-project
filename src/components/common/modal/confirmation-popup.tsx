import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { draggableBootstrapModal } from './draggable-modal';
import TooltipComponent from '../bootstrap-component/tooltip-component';

interface ConfirmationPopupProps {
    id: string;
    title: string;
    content: string;
    onConfirm: () => void;
    onAbort: () => void;
    setDoNotAsk: (value: boolean) => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ id, title, content, onConfirm, onAbort, setDoNotAsk }) => {
    const { t } = useTranslation();
    

    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
          draggableBootstrapModal(modalElement);
        }
      }, [id]);

    const handleConfirm = () => {
        onConfirm();
    };

    const handleAbort = () => {
        onAbort();
    };
    const handleDoNotAskChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDoNotAsk(event.target.checked);
    };

    return (
        <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>
                            {title}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p dangerouslySetInnerHTML={{ __html: content }}></p>
                        <div className="mb-3 form-check">
                            <input type="checkbox" 
                                className="form-check-input" 
                                id="doNotShowCheckbox"
                                //checked={doNotAsk}
                                onChange={handleDoNotAskChange}
                            /> 
                            <label className="form-check-label" htmlFor="doNotShowCheckbox">
                                {t('message.donot_ask')}
                            </label>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <TooltipComponent title={t('buttons.abort.tooltip')}>
                            <button type="button" className="btn btn-secondary" 
                                data-bs-dismiss="modal" 
                                onClick={handleAbort}
                            >
                                {t('buttons.abort.label')}
                            </button>
                        </TooltipComponent>
                        <TooltipComponent title={t('buttons.ok.tooltip')}>
                            <button type="button" className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleConfirm}
                            >
                                {t('buttons.ok.label')}
                            </button>
                        </TooltipComponent>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;