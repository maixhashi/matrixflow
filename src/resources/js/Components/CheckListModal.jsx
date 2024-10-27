import React from 'react';
import '../../css/CheckListModal.css';

const CheckListModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null; // モーダルが開いていない場合は何も表示しない

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

export default CheckListModal;
