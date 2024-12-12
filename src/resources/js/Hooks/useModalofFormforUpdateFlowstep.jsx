import { useDispatch, useSelector } from 'react-redux';
import { closeModalofFormforUpdateFlowstep } from '../store/modalSlice';

export const useModalofFormforUpdateFlowstep = () => {
  const dispatch = useDispatch();
    
  // Global State
  const showingModalofFormforUpdateFlowstep = useSelector(state => state.modal.showingModalofFormforUpdateFlowstep);

  // Event Handler
  const handleCloseModalofFormforUpdateFlowstep = () => {
      dispatch(closeModalofFormforUpdateFlowstep());
  };

  return {
    // Local State
    // Global State
    showingModalofFormforUpdateFlowstep,
    // Event Handler
    handleCloseModalofFormforUpdateFlowstep,
  };
};
