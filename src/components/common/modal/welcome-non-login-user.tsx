import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { draggableBootstrapModal } from '../../common/modal/draggable-modal';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import TooltipComponent from '../bootstrap-component/tooltip-component';

interface WelcomeCardProps {
    id: string;
    showWelcomeCard: boolean;
    referalKey?: string
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ id, showWelcomeCard, referalKey }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [show, setShow] = useState(showWelcomeCard);
  
    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
            draggableBootstrapModal(modalElement);
        }
    }, [id]);


    const handleRedirect = ()=>{
        setShow(false)
        return referalKey? navigate(`/referral/${referalKey}`):navigate('/login')
        
    }
    
    return (
        <div className={`modal modal-draggable ${show ? 'd-block' : ''}`} id={id} tabIndex={-1} data-bs-backdrop="false" aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id={`${id}Label`}>
                        {t('modals.welcome_non_loggedin.title')}
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={()=> setShow(false)}></button>
                </div>
                <div className="modal-body">
                    <p dangerouslySetInnerHTML={{ __html: t('message.welcome_non_loggedin_msg') }}></p>
                </div>
                <div className="modal-footer">
                    <TooltipComponent title={t('buttons.register.tooltip')}>
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleRedirect}>{t('buttons.register.label')}</button>
                    </TooltipComponent>
                </div>
                </div>
            </div>
        </div>

        
    );
};

export default WelcomeCard;