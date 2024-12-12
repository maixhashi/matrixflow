import React from 'react';
import { useModalofFormforAddChecklist } from '../../Hooks/useModalofFormforAddChecklist';
import '../../../css/ModalofFormforAddFlowstep.css';

const ModalofFormforAddChecklist = ({ onClose, children }) => {
    const {
        // Local State
        // Global State
        showingModalofFormforAddChecklist,
        // Event Handler
        handleCloseModalofFormforAddChecklist,
      } = useModalofFormforAddChecklist();


    if (!showingModalofFormforAddChecklist) return null; // モーダルが開いていない場合は何も表示しない

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseModalofFormforAddChecklist}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ModalofFormforAddChecklist;
