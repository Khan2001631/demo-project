import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { draggableBootstrapModal } from '../../common/modal/draggable-modal';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../api-integration/commonSlice';

interface WelcomeNoteProps {
    id: string;
    showWelcomeNote: boolean;
}

const WelcomeNote: React.FC<WelcomeNoteProps> = ({ id, showWelcomeNote }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [show, setShow] = useState(showWelcomeNote);
  
    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
            draggableBootstrapModal(modalElement);
        }
    }, [id]);

    const handleClose = () => {
        setShow(false);
        const user = JSON.parse(localStorage.getItem('user') as string);
        user.showWelcomeNote = false;
        dispatch(updateUser(user));
        localStorage.setItem('user', JSON.stringify(user));
    }
    
    return (
        <div className={`modal modal-draggable ${show ? 'd-block' : ''}`} id={id} tabIndex={-1} data-bs-backdrop="false" aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id={`${id}Label`}>
                        Welcome Note
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                    <p>
                        Congratulations on joining the GPTBlue! As a brand new user, you're starting off with 2,500 Callom Coins (CC) as a token of appreciation for choosing us.
                    </p>
                    <p>
                        But wait, there's more! We believe in rewarding our users for their engagement and participation. That's why we're excited to let you know that you'll receive an additional 7,500 CC simply by completing your profile. It's easy! Just click on your photo to get started.
                    </p>
                    {/* <p>
                        Callom Coins (CC) are our virtual currency, designed to reward you for your activity. You can use them to execute prompts. The more you engage, the more CC you'll earn. So, what are you waiting for? Dive in and start earning!
                    </p> */}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                </div>
                </div>
            </div>
        </div>

        
    );
};

export default WelcomeNote;