import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeUpdateFlowstepModal } from '../store/modalSlice';
import '../../css/ModalforAddFlowStepForm.css';

const ModalforUpdateFlowStepForm = ({ isOpen, onClose, children }) => {
    const dispatch = useDispatch();
    
    const isUpdateFlowstepModalOpen = useSelector(state => state.modal.isUpdateFlowstepModalOpen);
    const handleCloseUpdateFlowstepModal = (member, selectedStepNumber) => {
        dispatch(closeUpdateFlowstepModal(member, selectedStepNumber));
    };
    
    if (!isUpdateFlowstepModalOpen) return null; // モーダルが開いていない場合は何も表示しない

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseUpdateFlowstepModal}>×</button>
                {children}
            </div>
        </div>
    );
};

export default ModalforUpdateFlowStepForm;
