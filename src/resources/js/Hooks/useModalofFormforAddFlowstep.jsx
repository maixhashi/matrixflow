import { useDispatch, useSelector } from 'react-redux';
import { closeAddFlowstepModal } from '../store/modalSlice';

export const useModalofFormforAddFlowstep = () => {
  const dispatch = useDispatch();

  // Global State
  const isAddFlowstepModalOpen = useSelector(state => state.modal.isAddFlowstepModalOpen);

  // Event Handler
  const handleCloseAddFlowstepModal = () => {
      dispatch(closeAddFlowstepModal());
  };

  return {
    // Local State
    // Global State
    isAddFlowstepModalOpen,
    // Event Handler
    handleCloseAddFlowstepModal,
  };
};
