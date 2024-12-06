import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCheckListsByColumn } from '../store/checklistSlice';
import { openCheckListModal } from '../store/modalSlice';


export const useCheckItemColumn = (flowNumber) => {
  const dispatch = useDispatch();

  const workflowId = useSelector((state) => state.workflow.workflowId); // Redux ストアから flowsteps を取得
  const isCheckListModalOpen = useSelector(state => state.modal.isCheckListModalOpen);
  
  const checkListsFromStore = useSelector(selectCheckListsByColumn);
  const checkListsForFlowNumber = checkListsFromStore[flowNumber] || [];
  const hasCheckList = checkListsForFlowNumber.some(checklist => checklist.workflow_id === workflowId);
  
  const [selectedCheckList, setSelectedCheckList] = useState(null); // 選択されたチェックリストを保持する状態
  
  // モーダルを開く
  const handleOpenChecklistModal = (checklist) => {
    dispatch(openCheckListModal({ checkList: checklist }));
  };
  
  return { 
    workflowId, isCheckListModalOpen,
    checkListsForFlowNumber, hasCheckList,
    selectedCheckList, setSelectedCheckList,
    handleOpenChecklistModal,
  };
};
