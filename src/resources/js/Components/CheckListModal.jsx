import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../css/CheckListModal.css';
import { closeCheckListModal } from '../store/modalSlice';

const CheckListModal = ({ children }) => {
    const dispatch = useDispatch();
    const isCheckListModalOpen = useSelector(state => state.modal.isCheckListModalOpen);

    // モーダルが開いていない場合は何も表示しない
    if (!isCheckListModalOpen) return null;

    // モーダルを閉じる
    const handleCloseChecklistModal = () => {
        dispatch(closeCheckListModal());
    };

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
