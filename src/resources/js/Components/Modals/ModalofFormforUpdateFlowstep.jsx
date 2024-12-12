import React from 'react';
import { useModalofFormforUpdateFlowstep } from '../../Hooks/useModalofFormforUpdateFlowstep'

import '../../../css/ModalofFormforAddFlowstep.css';

const ModalofFormforUpdateFlowstep = ({ onClose, children }) => {
    const {
        // Local State
        // Global State
        showingModalofFormforUpdateFlowstep,
        // Event Handler
        handleCloseModalofFormforUpdateFlowstep,
    } = useModalofFormforUpdateFlowstep();
    
    
    if (!showingModalofFormforUpdateFlowstep) return null; // モーダルが開いていない場合は何も表示しない

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseModalofFormforUpdateFlowstep}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ModalofFormforUpdateFlowstep;
