import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAddFlowstepModal } from '../store/modalSlice';
import '../../css/ModalforAddFlowStepForm.css';

const ModalforAddFlowStepForm = ({ isOpen, onClose, children }) => {
    const dispatch = useDispatch();
    
    const isAddFlowstepModalOpen = useSelector(state => state.modal.isAddFlowstepModalOpen);
    const handleCloseAddFlowstepModal = (member, selectedStepNumber) => {
        dispatch(closeAddFlowstepModal(member, selectedStepNumber));
    };
    
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
