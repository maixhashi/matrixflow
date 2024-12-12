import React from 'react';
import '../../../css/ModalofFormforUpdateChecklist.css';
import { useModalofFormforUpdateChecklist } from '../../Hooks/useModalofFormforUpdateChecklist';

const CheckListModal = ({ children }) => {
    const {
        // Local State
        // Global State
        // Event Handler
        handleCloseModalofFormforUpdateChecklist,
    } = useModalofFormforUpdateChecklist();
    
    return (
        <div className="modal-overlay" onClick={handleCloseModalofFormforUpdateChecklist}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseModalofFormforUpdateChecklist}>×</button>
                {children}
            </div>
        </div>
    );
};

export default CheckListModal;
