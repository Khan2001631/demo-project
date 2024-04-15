import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";

interface PromptsData {
    "z_gptblue_task_version_history__rid": number,
    "o_gptblue_prompt_framing__environment_context": string,
    "o_gptblue_prompt_framing__URLCode": string,
    "o_gptblue_prompt_framing__updated": string,
    "o_gptblue_prompt_framing__challenge_description": string,
    "o_gptblue_prompt_framing__sponsoredPrompt": number,
    "firstname": string,
    "o_gptblue_prompt_framing__userdefaultprompt": string,
    "o_gptblue_prompt_framing__updatedby": number,
    "promptCategory": string,
    "o_gptblue_prompt_framing__additional_considerations": string,
    "o_gptblue_prompt_framing__open_source": number,
    "lastname": string,
    "o_gptblue_prompt_framing__status": string,
    "o_gptblue_prompt_framing__writing_style": string,
    "o_gptblue_prompt_framing__allowToCopy": number,
    "o_gptblue_prompt_framing__data_handling": string,
    "o_gptblue_prompt_framing__level": string,
    "LIB_name": string,
    "o_gptblue_prompt_framing__objectives": string,
    "o_gptblue_prompt_framing__autosave": number,
    "o_gptblue_prompt_framing__name": string,
    "o_gptblue_prompt_framing__functionCalling": number,
    "o_gptblue_cluster__rid": number | null,
    "LIB_ID": number,
    "o_gptblue_prompt_framing__id": number,
    "o_gptblue_prompt_framing__description": string,
    "o_gptblue_prompt_framing__prepromt": string,
    "o_gptblue_prompt_framing__repetitive_prePrompt": string,
    "o_gptblue_prompt_framing__createdby": number,
    "o_gptblue_prompt_framing__authorView": number,
    "o_gptblue_prompt_framing__Timeline_and_priorities": string,
    "o_gptblue_prompt_framing__audience": string,
    "o_gptblue_prompt_framing__postprompt": string,
    "o_gptblue_prompt_framing__repetitive_postPrompt": string,
    "o_gptblue_prompt_framing__blc_status": string,
    "o_gptblue_prompt_framing__task_structure": string,
    "o_gptblue_prompt_framing__repetitive_flag": string,
    "o_gptblue_prompt_framing__references": string,
    "o_gptblue_prompt_framing__customData": number,
    "o_gptblue_prompt_framing__actordefinition": string,
    "o_gptblue_prompt_framing__publicAccessibility": number,
    "o_gptblue_prompt_framing__created": string,
    "promptLibStatus": string,
    "o_gptblue_prompt_framing__dynamic_action": string
}
interface PromptDetailsModalProps {
    id: string;
    promptsData: PromptsData;
}

const PromptDetailsModal: React.FC<PromptDetailsModalProps> = ({ id, promptsData }) => {
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
                            {"Prompt Details"}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                <div className="modal-body">
                    {promptsData && <>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Actor/Persona:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__actordefinition || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Environment Context:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__environment_context || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong> Elaborate Challenge Description:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__challenge_description || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong>Data Handling:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__data_handling || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong>Objective:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__objectives || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong>Audience:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__audience  || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong>Task:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__task_structure || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong>Default:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__userdefaultprompt || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong>Writing Style:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__writing_style || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong>Timeleine:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__Timeline_and_priorities || "-"}
                            </div>   
                        </div>
                        <div className='mb-2 row' >
                            <div className="col-md-3">
                                <label><strong>Reference:</strong></label> 
                            </div>
                            <div className='col-md-9'>
                            {promptsData?.o_gptblue_prompt_framing__references || "-"}
                            </div>   
                        </div>
                    </>}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('buttons.close.label')}</button>
                    
                </div>
                </div>
            </div>
        </div>
    );
};

export default PromptDetailsModal;
