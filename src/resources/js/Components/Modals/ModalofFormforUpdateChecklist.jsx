import React from 'react';
import '../../../css/ModalofFormforUpdateChecklist.css';
import { useModalofFormforUpdateChecklist } from '../../Hooks/useModalofFormforUpdateChecklist';

const CheckListModal = ({ children }) => {
    const {
        // Local State
        // Global State
        // Event Handler
        handleCloseChecklistModal,
    } = useModalofFormforUpdateChecklist();
    
    return (
        <div className="modal-overlay" onClick={handleCloseChecklistModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseChecklistModal}>×</button>
                {children}
            </div>
        </div>
    );
};

export default CheckListModal;
