import React from 'react';
import '../../css/ModalofFormforAddFlowstep.css';
import { closeDocumentSettingsModal } from '../store/modalSlice';
import { useDispatch } from 'react-redux';


const ModalforDocumentSettings = ({ onClose, children }) => {
    const dispatch = useDispatch();

    const handleCloseDocumentSettingsModal = () => {
        dispatch(closeDocumentSettingsModal());
    }


    return (
        <div className="modal-overlay">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseDocumentSettingsModal}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ModalforDocumentSettings;
