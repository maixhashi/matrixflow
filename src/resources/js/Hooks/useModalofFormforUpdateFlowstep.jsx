import { useDispatch, useSelector } from 'react-redux';
import { closeUpdateFlowstepModal } from '../store/modalSlice';

export const useModalofFormforUpdateFlowstep = () => {
  const dispatch = useDispatch();
    
  // Global State
  const isUpdateFlowstepModalOpen = useSelector(state => state.modal.isUpdateFlowstepModalOpen);

  // Event Handler
  const handleCloseUpdateFlowstepModal = () => {
      dispatch(closeUpdateFlowstepModal());
  };

  return {
    // Local State
    // Global State
    isUpdateFlowstepModalOpen,
    // Event Handler
    handleCloseUpdateFlowstepModal,
  };
};
