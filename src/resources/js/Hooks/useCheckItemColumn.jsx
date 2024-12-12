import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCheckListsByColumn } from '../store/checklistSlice';
import { openModalofFormforUpdateChecklist } from '../store/modalSlice';


export const useCheckItemColumn = (flowNumber) => {
  const dispatch = useDispatch();

  const workflowId = useSelector((state) => state.workflow.workflowId); // Redux ストアから flowsteps を取得
  const showingModalofFormforUpdateChecklist = useSelector(state => state.modal.showingModalofFormforUpdateChecklist);
  
  const checkListsFromStore = useSelector(selectCheckListsByColumn);
  const checkListsForFlowNumber = checkListsFromStore[flowNumber] || [];
  const hasCheckList = checkListsForFlowNumber.some(checklist => checklist.workflow_id === workflowId);
  
  const [selectedCheckList, setSelectedCheckList] = useState(null); // 選択されたチェックリストを保持する状態
  
  // モーダルを開く
  const handleOpenModalofFormforUpdateChecklist = (checklist) => {
    dispatch(openModalofFormforUpdateChecklist({ checkList: checklist }));
  };
  
  return { 
    workflowId, showingModalofFormforUpdateChecklist,
    checkListsForFlowNumber, hasCheckList,
    selectedCheckList, setSelectedCheckList,
    handleOpenModalofFormforUpdateChecklist,
  };
};
