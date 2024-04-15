import { useTranslation } from "react-i18next";
import TooltipComponent from "../../common/bootstrap-component/tooltip-component"
import { useEffect } from "react";
import { draggableBootstrapModal } from "../modal/draggable-modal";


interface HelpModalProps {
  id: string;
  title: string | undefined,
  content: any | undefined,
  onGenerateKey?: () => void,
}

const HelpModal: React.FC<HelpModalProps> = ({ id, title, content, onGenerateKey }) => {
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
                {title}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            {content && 
              <div className="modal-body" 
                dangerouslySetInnerHTML={{ __html: content }}
              >
              </div>
            }
            <div className="modal-footer">
              <TooltipComponent title={t('help_modal.btn.close.tooltip')}>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  {t('help_modal.btn.close.label')}
                </button>
              </TooltipComponent>
              {onGenerateKey &&
                <TooltipComponent title={t('userProfile.form_field.referal_key.btn.done.tooltip')} >
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onGenerateKey}>
                    {t('userProfile.form_field.referal_key.btn.done.label')}
                  </button>
                </TooltipComponent>
              }
            </div>
          </div>
        </div>
    </div>
  );
};

export default HelpModal;