import { useTranslation } from "react-i18next";
import TooltipComponent from "../../common/bootstrap-component/tooltip-component"
import { useEffect } from "react";
import { draggableBootstrapModal } from "../../common/modal/draggable-modal";

interface PromptDeployModalProps {
  id: string;
  onConfirm: () => void;
}

const PromptDeployModal: React.FC<PromptDeployModalProps> = ({ id, onConfirm }) => {
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
                Confirm Deployment
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to deploy?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default PromptDeployModal;