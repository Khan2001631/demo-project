import { useEffect, useState } from "react";
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";
import { useDispatch } from "react-redux";
import { fullPageLoader} from '../../../api-integration/commonSlice';
import { SubmitHandler, useForm } from "react-hook-form";
import { Modal } from "bootstrap";


interface iModel {
    CUSTOMMODELID: number;
    MODELDISPLAYNAME: string;
    MODELDESCRIPTION: string;
    MODELACCESSIBILITY: string;
    MODELORGID: string;
};

interface ManageModelProps {
    id: string;
    currentUser: iModel | null;
    setReloadComponent: React.Dispatch<React.SetStateAction<boolean>>;
}

const  ManageModel: React.FC<ManageModelProps> =({id, currentUser, setReloadComponent}) =>
{
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, clearErrors } = useForm<iModel>();

    const [localCurrentUser, setLocalCurrentUser] = useState<iModel | null>(null);
    
    useEffect(() => {
        const modalElement = document.getElementById(id);
        if (modalElement) {
            draggableBootstrapModal(modalElement);
        }
        dispatch(fullPageLoader(false));
    }, [id]);

    useEffect(() => {
        if (currentUser)
            setLocalCurrentUser(currentUser);
        else         
            setLocalCurrentUser(null);
    }, [currentUser]);

    useEffect(() => {
        if (localCurrentUser !== null) {
            setValue('MODELDESCRIPTION', localCurrentUser?.MODELDESCRIPTION);
            setValue('MODELDISPLAYNAME', localCurrentUser?.MODELDISPLAYNAME);
         
        } 
        else {            
            setValue('MODELDESCRIPTION', '');
            setValue('MODELDISPLAYNAME', '');
        }
    }, [currentUser,localCurrentUser, setValue]);

    const resetModalValues = () => {
        setValue('MODELDESCRIPTION', '');
        setValue('MODELDISPLAYNAME', '');
    };

    const handleSave: SubmitHandler<iModel> = (data: any) => {
        // Close the modal manually
        const myModalEl = document.getElementById(id);
        if (myModalEl) {
            const modal = Modal.getInstance(myModalEl);
            if (modal) {
                modal?.hide();
                resetModalValues();
            }
        }
        // dispatch(fullPageLoader(true));
    };

    
    return(
        <div className="modal fade modal-draggable" data-bs-backdrop="false" id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id={`${id}Label`}>
                      Add Model
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => clearErrors(["MODELDISPLAYNAME","MODELDESCRIPTION"])}></button>
                </div>
                <form onSubmit={handleSubmit(handleSave)}>
                    <div className="modal-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="modelName" className="form-label">Model Name<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            id="modelName"
                                            maxLength={100}
                                            className={`form-control ${errors?.MODELDISPLAYNAME? 'is-invalid' : ''}`}
                                            placeholder="Enter Model Name"
                                            {...register('MODELDISPLAYNAME', { required: true})}
                                        />
                                         <div className="invalid-feedback">
                                            {errors.MODELDISPLAYNAME && errors.MODELDISPLAYNAME.type === 'required' && <p>Model Name is required.</p>}
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="col-lg-6">
                                    <div className="mt-4 text-center mx-auto">
                                        <input type="range" 
                                            className="form-range bc-range" 
                                            min="0" max="2" 
                                            step={0}
                                            // Here we can register or set values according to the requirements... 
                                            // value={accessibilityNumber || ''}
                                            // onChange={handleAccessability}
                                        />
                                        <div className="d-flex justify-content-between">
                                            <small>Organizaton</small>
                                            <small>Company</small>
                                            <small>Public</small>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="modelDescription">Description<span className="text-danger">*</span></label>
                                        <textarea
                                            id="modelDescription"
                                            maxLength={500}
                                            className={`form-control ${errors?.MODELDESCRIPTION? 'is-invalid' : ''}`}
                                            {...register('MODELDESCRIPTION', { required: true })}
                                            placeholder="Enter some message."
                                        />
                                        <div className="invalid-feedback">
                                            {errors?.MODELDESCRIPTION && errors?.MODELDESCRIPTION.type === 'required' && <p>Model Description is required.</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mt-4 text-center mx-auto">
                                        <input type="range" 
                                            className="form-range bc-range" 
                                            min="0" max="1" 
                                            step={0} 
                                            // Here we can register or set values according to the requirements...
                                        />
                                        <div className="d-flex justify-content-between">
                                            <small>Inactive</small>
                                            <small>Active</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => clearErrors(["MODELDISPLAYNAME","MODELDESCRIPTION"])}>Close</button>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}

export default ManageModel;