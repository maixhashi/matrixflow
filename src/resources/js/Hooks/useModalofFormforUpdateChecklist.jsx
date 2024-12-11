import { useDispatch, useSelector } from 'react-redux';
import { closeCheckListModal } from '../store/modalSlice';


export const useModalofFormforUpdateChecklist = () => {
  const dispatch = useDispatch();

  // Local State
  // Global State
  const isCheckListModalOpen = useSelector(state => state.modal.isCheckListModalOpen);
  
  // Event Handler
  const handleCloseChecklistModal = () => {
    dispatch(closeCheckListModal());
  };

  // モーダルが開いていない場合は何も表示しない
  if (!isCheckListModalOpen) return null;
  
  return {
    // Local State
    // Global State
    isCheckListModalOpen,
    // Event Handler
    handleCloseChecklistModal,
  };
};
