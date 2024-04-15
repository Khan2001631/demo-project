import React, { useEffect } from 'react';
import { draggableBootstrapModal } from '../../common/modal/draggable-modal';

interface ApproveAccRequestData {
    companyAge: string,
    companyType: string,
    updated: string,
    companySize: string,
    companyWebsite: string,
    created: string,
    companyRegNum: string,
    accountStatus: string,
    companyName: string,
    headline: string,
    updatedby: string,
    companyRevenue: string,
    createdby: string,
    about: string;
    createdByFirstname: string;
    createdByLastname: string;
    updatedByFirstname: string;
    updatedByLastname: string;
}
interface RequestedAccountDetailsModalProps {
    id: string;
    approveData: ApproveAccRequestData;
}

const RequestedAccountDetailsModal: React.FC<RequestedAccountDetailsModalProps> = ({ id, approveData }) => {
    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
          draggableBootstrapModal(modalElement);
        }
    }, [id]);

    return (
        <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${id}Label`}>
                            Compay Details
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {approveData && <>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Name:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.companyName || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                            <label><strong> Description:</strong></label>
                            </div>
                            <div className='col-md-8'>
                            {approveData?.about || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                            <label><strong> Formed:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.companyAge || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                            <label><strong> Revenue:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.companyRevenue || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Type:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.companyType || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Size:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.companySize || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Headline:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.headline || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Created:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {new Date(approveData?.created).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) || "-"}       
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Created By First Name:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.createdByFirstname || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Created By Last Name:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.createdByLastname || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Updated By First Name:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.updatedByFirstname || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Updated By Last Name:</strong></label> 
                            </div>
                            <div className='col-md-8'>
                            {approveData?.updatedByLastname || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-4">
                                <label><strong> Updated:</strong></label> 
                            </div>
                            <div className='col-md-8    '>
                            {new Date(approveData?.updated).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) || "-"}                            </div>   
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
};

export default RequestedAccountDetailsModal;
