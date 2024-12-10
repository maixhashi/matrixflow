import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFlowstep, fetchFlowsteps } from '../store/flowstepsSlice';
import { fetchToolsByFlowstep, addToolsystemForFlowstep } from '../store/toolsystemSlice';

export const useFormforUpdateFlowstep = () => {
  // Local State
  const [name, setName] = useState('');
  const [toolsystemName, setToolsystemName] = useState('');
  const [description, setDescription] = useState('');
  const [flowNumber, setFlowNumber] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Global State
  const selectedFlowstep = useSelector((state) => state.selected.selectedFlowstep);
  const selectedToolsystem = useSelector((state) => state.selected.selectedToolsystem);
  const workflowId = useSelector((state) => state.workflow.workflowId);
  
  const dispatch = useDispatch();

  useEffect(() => {
      if (selectedFlowstep) {
          setName(selectedFlowstep.name);
          setDescription(selectedFlowstep.description);
          setFlowNumber(selectedFlowstep.flow_number);

          // 関連するToolsystemの取得
          dispatch(fetchToolsByFlowstep(selectedFlowstep.id));
      }
  }, [selectedFlowstep, dispatch]);

  // Event Handler
  const handleSubmit = async (e) => {
      e.preventDefault();
  
      const flowstepData = {
          id: selectedFlowstep.id,
          name: name,
          description: description,
          flow_number: selectedFlowstep.flow_number,
          member_id: selectedMembers,
      };
  
      try {
          // フローステップの更新
          await dispatch(updateFlowstep({ workflowId, updatedFlowstep: flowstepData })).unwrap();
  
          // Toolsystem の追加
          await dispatch(
              addToolsystemForFlowstep({
                  flowstepId: selectedFlowstep.id,
                  toolsystemName: toolsystemName, // ツール名を送信
              })
          ).unwrap();
  
          // フローステップリストを再取得
          dispatch(fetchFlowsteps(workflowId));
      } catch (error) {
          console.error('エラー:', error);
      }
  };
  
  return {
    // Local State
    name, setName, toolsystemName, setToolsystemName, description, setDescription,
    flowNumber, setFlowNumber, selectedMembers, setSelectedMembers,
    // Global State
    selectedFlowstep, selectedToolsystem,
    // Event Handler
    handleSubmit,
    // const
  };
};
