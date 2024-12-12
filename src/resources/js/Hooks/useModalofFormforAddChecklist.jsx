import { useDispatch, useSelector } from 'react-redux';
import { closeModalofFormforAddChecklist } from '../store/modalSlice';

export const useModalofFormforAddChecklist = () => {
  const dispatch = useDispatch();

  // Global State
  const showingModalofFormforAddChecklist = useSelector(state => state.modal.showingModalofFormforAddChecklist);

  // Event Handler
  const handleCloseModalofFormforAddChecklist = () => {
      dispatch(closeModalofFormforAddChecklist());
  };

  return {
    // Local State
    // Global State
    showingModalofFormforAddChecklist,
    // Event Handler
    handleCloseModalofFormforAddChecklist,
  };
};
