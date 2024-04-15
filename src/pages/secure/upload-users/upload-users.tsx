import React, { useEffect } from 'react';
import UserCard from '../../../components/common/user-card/user-card';
import FileUploadComponent from '../../../components/secure/file-upload/file-upload';
import { useDispatch } from 'react-redux';
import { fullPageLoader, updateAlertMessage } from '../../../api-integration/commonSlice';
import { useUploadUsersMutation } from '../../../api-integration/secure/secure';
import { useTranslation } from 'react-i18next';
import Card from '../../../components/common/card/card';
import { draggableBootstrapModal } from '../../../components/common/modal/draggable-modal';

interface IFileData {
    name: string;
    size: number;
    type: string;
    lastModified: number;
    file: string;
}

interface UploadUserProps
{
    id: string;
}

// This file is no longer needed. Did not know wheteher I should delete it or not...

const UploadUsers: React.FC<UploadUserProps> = ({id}) => {
    // const { t } = useTranslation();
    // const expectedFileObject = {
    //     FILE_TYPE: ['text/csv', 'application/pdf'],
    //     FILE_SIZE: 5242880, // 5MB
    //     FILE_TYPE_ERROR_MSG: t('message.file_type_csv_pdf_error'),
    //     FILE_SIZE_ERROR_MSG: t('message.file_size_5MB_error')
    // };
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     const modalElement = document.getElementById(id);
    //     if (modalElement) {
    //         draggableBootstrapModal(modalElement);
    //     }
    //     dispatch(fullPageLoader(false));
    //     // countryListAPI({}); // Fetch country list
    // }, [id]);
    
    // useEffect(() => {
    //     dispatch(fullPageLoader(false));
    // }, [dispatch]);

    // const [uploadUsersAPI, { data: UploadUser, isLoading: isUploadingUser, isSuccess: isUploadingUserSuccess, isError: isUploadingUserError  }] =
    // useUploadUsersMutation();

    // const handleUploadUsers = (data: IFileData) => {
    //     const payload = {
    //         fileData: data,
    //         uploadType: "uploadUsers"
    //     }
    //     dispatch(fullPageLoader(true));
    //     uploadUsersAPI(payload);
    // }

    // useEffect(() => {
    //     if (isUploadingUserSuccess) {
    //         dispatch(fullPageLoader(false));
    //         if (UploadUser?.success == false) {
    //             dispatch(updateAlertMessage({ status: 'error', message: UploadUser?.message }));
    //         } 
    //         else if (UploadUser?.success == true) {
    //             dispatch(updateAlertMessage({ status: 'success', message: UploadUser?.message }));                
    //         } 
    //         else {
    //             dispatch(updateAlertMessage({ status: 'error', message: t('message.common_error') }));
    //         }
    //     }
    //     if (isUploadingUserError) {
    //         dispatch(fullPageLoader(false));
    //         dispatch(updateAlertMessage({ status: 'error', message: UploadUser?.message }));
    //     }
    // }, [isUploadingUserSuccess, isUploadingUserError, dispatch])

    // return (
    //     <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
    //         <div className="modal-dialog">
    //             <div className="modal-content">
    //                 <div className="modal-header">
    //                     <h5 className="modal-title" id={`${id}Label`}>
    //                     Upload User
    //                     </h5>
    //                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //                 </div>
    //                 <div className="modal-body">
    //                     {/*  */}
    //                     <FileUploadComponent 
    //                         expectedFileObject={expectedFileObject} 
    //                         handleFileUpload={handleUploadUsers} 
    //                         showUploadButton={true}
    //                         isFileInputRequired={true}
    //                     />
    //                 </div>
    //                 <div className="modal-footer">
    //                 <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('buttons.close.label')}</button>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
    return (
        <></>
    )
};

export default UploadUsers;