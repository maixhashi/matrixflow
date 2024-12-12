import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers } from '../store/memberSlice';
import { fetchCheckLists, selectCheckListsByColumn } from '../store/checklistSlice';
import { setSelectedMember, setSelectedStepNumber } from '../store/selectedSlice';
import { openModalofFormforAddFlowstep } from '../store/modalSlice';

export const useMatrixRow = (member) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(member.name);
  const [checkLists, setCheckLists] = useState({}); // チェックリストの状態管理

  const selectedMember = useSelector((state) => state.selected.selectedMember);
  const selectedStepNumber = useSelector((state) => state.selected.selectedStepNumber);
  const workflowId = useSelector((state) => state.workflow.workflowId);

  const dispatch = useDispatch();
  
  // Reduxからチェックリストを取得
  const checkListsFromStore = useSelector(selectCheckListsByColumn);

  useEffect(() => {
      // チェックリストを取得
      dispatch(fetchCheckLists(workflowId));
      dispatch(fetchMembers(workflowId)); // メンバーも取得
  }, [dispatch, workflowId]);

  useEffect(() => {
      // チェックリストのデータを状態にセット
      if (checkListsFromStore) {
          setCheckLists(checkListsFromStore);
          console.log("checkListsFromStore by useEffect on MatrixRow" ,JSON.stringify(checkListsFromStore, null, 2));
      }
  }, [checkListsFromStore]);

  const showingModalofFormforAddFlowstep = useSelector(state => state.modal.showingModalofFormforAddFlowstep);
  const handleOpenModalofFormforAddFlowstep = (member, stepNumber) => {
      dispatch(setSelectedMember(member));
      dispatch(setSelectedStepNumber(stepNumber));
      dispatch(openModalofFormforAddFlowstep(member, stepNumber));
  };

  const handleAddCheckItem = (flowNumber) => {
      const newCheckItemId = Date.now(); // 一意のIDを生成
      const newCheckItem = {
          id: newCheckItemId,
          check_content: `New Check Item ${flowNumber}`,
          member_id: member.id,
      };

      setCheckLists((prev) => ({
          ...prev,
          [flowNumber]: prev[flowNumber]
              ? prev[flowNumber].map(checkItem => ({
                  ...checkItem,
                  check_items: [...(checkItem.check_items || []), newCheckItem],
              }))
              : [{ check_items: [newCheckItem] }],
      }));
  };

  const handleNameChange = (e) => {
      setNewName(e.target.value);
  };

  const handleNameEdit = async () => {
      await dispatch(updateMemberName({ id: member.id, name: newName }));
      setIsEditing(false);
  };

  return { 
    isHovered, setIsHovered, isEditing, setIsEditing, newName, setNewName, checkLists, setCheckLists,
    selectedMember, selectedStepNumber, checkListsFromStore, showingModalofFormforAddFlowstep,
    handleOpenModalofFormforAddFlowstep, handleAddCheckItem, handleNameChange, handleNameEdit
  };
};
