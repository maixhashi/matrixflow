import React from 'react';
import { useModalofFormforAddFlowstep } from '../Hooks/useModalofFormforAddFlowstep';
import '../../css/ModalofFormforAddFlowstep.css';

const ModalforAddFlowStepForm = ({ onClose, children }) => {
    const {
        // Local State
        // Global State
        isAddFlowstepModalOpen,
        // Event Handler
        handleCloseAddFlowstepModal,
      } = useModalofFormforAddFlowstep();

    
    if (!isAddFlowstepModalOpen) return null; // モーダルが開いていない場合は何も表示しない

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseAddFlowstepModal}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ModalforAddFlowStepForm;
