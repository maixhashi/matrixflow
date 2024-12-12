import { useDispatch, useSelector } from 'react-redux';
import { closeModalofFormforAddFlowstep } from '../store/modalSlice';

export const useModalofFormforAddFlowstep = () => {
  const dispatch = useDispatch();

  // Global State
  const showingModalofFormforAddFlowstep = useSelector(state => state.modal.showingModalofFormforAddFlowstep);

  // Event Handler
  const handleCloseModalofFormforAddFlowstep = () => {
      dispatch(closeModalofFormforAddFlowstep());
  };

  return {
    // Local State
    // Global State
    showingModalofFormforAddFlowstep,
    // Event Handler
    handleCloseModalofFormforAddFlowstep,
  };
};
