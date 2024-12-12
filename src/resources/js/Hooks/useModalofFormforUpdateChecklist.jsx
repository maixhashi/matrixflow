import { useDispatch, useSelector } from 'react-redux';
import { closeModalofFormforUpdateChecklist } from '../store/modalSlice';


export const useModalofFormforUpdateChecklist = () => {
  const dispatch = useDispatch();

  // Local State
  // Global State
  const showingModalofFormforUpdateChecklist = useSelector(state => state.modal.showingModalofFormforUpdateChecklist);
  
  // Event Handler
  const handleCloseModalofFormforUpdateChecklist = () => {
    dispatch(closeModalofFormforUpdateChecklist());
  };

  // モーダルが開いていない場合は何も表示しない
  if (!showingModalofFormforUpdateChecklist) return null;
  
  return {
    // Local State
    // Global State
    showingModalofFormforUpdateChecklist,
    // Event Handler
    handleCloseModalofFormforUpdateChecklist,
  };
};
