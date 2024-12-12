import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowsteps } from '../store/flowstepsSlice';
import { setSelectedMember, setSelectedFlowstep, setSelectedStepNumber } from '../store/selectedSlice';
import { setFlowstepPositions } from '../store/positionSlice';
import { openModalofFormforAddFlowstep } from '../store/modalSlice';

export const useMatrixCol = (member, flowNumber) => {
  const dispatch = useDispatch();

  const workflowId = useSelector((state) => state.workflow.workflowId);
  
  useEffect(() => {
    dispatch(fetchFlowsteps(workflowId)); // コンポーネントがマウントされたときにフローステップを取得
  }, [dispatch, workflowId]);
  
  // Ensure flowsteps is an array
  const flowsteps = useSelector((state) => state.flowsteps);
  const validFlowsteps = Array.isArray(flowsteps) ? flowsteps : [];

  const showingModalofFormforAddFlowstep = useSelector(state => state.modal.showingModalofFormforAddFlowstep);

  const handleOpenModalofFormforAddFlowstep = (member, flowNumber) => {
      dispatch(setSelectedMember(member));
      dispatch(setSelectedStepNumber(flowNumber));
      dispatch(openModalofFormforAddFlowstep(member, flowNumber));
  };

  // faDaseBaseアイコンの位置情報を取得
  const flowstepPositions = useSelector((state) => state.positions.flowstepPositions);

  useEffect(() => {
    const getFlowstepPositions = () => {
      const icons = document.querySelectorAll('.Flowstep');
      const positionsArray = Array.from(icons).map(icon => {
        const rect = icon.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      });
      dispatch(setFlowstepPositions(positionsArray));
    };

    // DOMが更新された後に位置を取得
    getFlowstepPositions();

    // 位置情報を再取得するためにDOMの変化を監視
    const observer = new MutationObserver(getFlowstepPositions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [dispatch]);

  // Reduxから選択されたメンバーとフローステップの状態を取得
  const selectedMember = useSelector((state) => state.selected.selectedMember);
  const selectedStepNumber = useSelector((state) => state.selected.selectedStepNumber);
  const selectedFlowstep = useSelector((state) => state.selected.selectedFlowstep);

  const handleSetSelectedFlowstep = (flowstep) => {
    dispatch(setSelectedFlowstep(flowstep));
  }

  return { 
    workflowId, showingModalofFormforAddFlowstep, flowstepPositions, selectedMember, selectedStepNumber, selectedFlowstep,
    validFlowsteps,
    // Event Handler
    handleOpenModalofFormforAddFlowstep, handleSetSelectedFlowstep,
  };
};
