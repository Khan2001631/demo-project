import React, { useEffect } from 'react';
import FileUploadComponent from '../../../components/secure/file-upload/file-upload';
import { useDispatch } from 'react-redux';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import { useTranslation } from 'react-i18next';
import { useUploadUsersMutation } from '../../../api-integration/secure/secure';
import { draggableBootstrapModal } from '../../../components/common/modal/draggable-modal';
import { Modal } from 'bootstrap';

interface IFileData {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    file: string;
}

interface UploadUserModalProps
{
    id: string;
}

const UploadUsersModal: React.FC<UploadUserModalProps> = ({id}) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const expectedFileObject = {
        FILE_TYPE: ['csv'],
        FILE_SIZE: 5242880, // 5MB
        FILE_TYPE_ERROR_MSG: t('message.file_type_csv_pdf_error'),
        FILE_SIZE_ERROR_MSG: t('message.file_size_5MB_error')
    };

    const [uploadUsersAPI, { data: uploadUserData, isLoading: isUploadUserLoading, isSuccess: isUploadUserSuccess, isError: isUploadUserError, error: uploadUserError  }] =
    useUploadUsersMutation();

    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
            draggableBootstrapModal(modalElement);
        }
        dispatch(fullPageLoader(false));
    }, [id]);

    useEffect(() => {
       if(isUploadUserSuccess)
        {
            dispatch(fullPageLoader(false))
            if(uploadUserData?.success === true)
            {
                dispatch(updateAlertMessage({ status: 'success', message: uploadUserData?.message }));

            }
            else if(uploadUserData?.status === 'FETCH_ERROR' || uploadUserData?.status === 'PARSING_ERROR')
            {
                dispatch(updateAlertMessage({ status: 'error', message: "Unable to access server right now, Please try again later." }));
            }
            else if(uploadUserData?.success === false)
            {
                dispatch(updateAlertMessage({status:"error", message: uploadUserData?.message}))
            }
        }
        else if(isUploadUserError || uploadUserError)
        {
            dispatch(fullPageLoader(false))
        }
    },[isUploadUserSuccess, isUploadUserError, uploadUserError])



    const handleUploadUsers = (data: IFileData) => {
        const payload = {
            fileData: data,
            uploadType: "uploadUsers"
        }
        const myModalEl = document.getElementById(id);
        if (myModalEl) {
            const modal = Modal.getInstance(myModalEl);
            if (modal) {
                modal?.hide();
            }
        }
        dispatch(fullPageLoader(true))
        uploadUsersAPI(payload);
    }

    return (
        <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
             <div className="modal-dialog modal-lg">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>
                        Upload User
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <FileUploadComponent 
                            expectedFileObject={expectedFileObject} 
                            handleFileUpload={handleUploadUsers} 
                            showUploadButton={true}
                            isFileInputRequired={true}
                        />
                    </div>
                    <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('buttons.close.label')}</button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default UploadUsersModal;