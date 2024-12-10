import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, deleteMember } from '../store/memberSlice';
import { fetchFlowsteps, updateFlowStepNumber } from '../store/flowstepsSlice';
import { updateToolsystemForFlowstep } from '../store/toolsystemSlice';
import { setDataBaseIconPositions } from '../store/positionSlice';
import { setSelectedMember, setSelectedToolsystem } from '../store/selectedSlice';
import { openAddFlowstepModal } from '../store/modalSlice';

export const useMatrixView = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingToolsystemName, setIsEditingToolsystemName] = useState(false);
  const [updatedToolsystemName, setUpdatedToolsystemName] = useState(''); // toolsystem.nameの初期値で初期化
  const [isModalforAddCheckListFormOpen, setIsModalforAddCheckListFormOpen] = useState(false);
  // const [selectedMember, setSelectedMember] = useState(null);
  const [selectedStepNumber, setSelectedStepNumber] = useState(null);
  const [maxFlowNumber, setMaxFlowNumber] = useState(0);
  const [orderedMembers, setOrderedMembers] = useState([]);
  
  const dispatch = useDispatch();

  const workflowId = useSelector((state) => state.workflow.workflowId);
  // faDaseBaseアイコンの位置情報を取得
  const dataBaseIconPositions = useSelector((state) => state.positions.dataBaseIconPositions);
  const flowstepPositions = useSelector((state) => state.positions.flowstepPositions);

  useEffect(() => {
    const getDatabaseIconPositions = () => {
      const icons = document.querySelectorAll('.dataBaseIcon');
      const positionsArray = Array.from(icons).map(icon => {
        const rect = icon.getBoundingClientRect();
        return {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      });
      dispatch(setDataBaseIconPositions(positionsArray));
    };

    // DOMが更新された後に位置を取得
    getDatabaseIconPositions();

    // 位置情報を再取得するためにDOMの変化を監視
    const observer = new MutationObserver(getDatabaseIconPositions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [dispatch]);
  
  // Reduxストアから指定のworkflowIdに関連するメンバーとフローステップを取得
  const selectedMember = useSelector((state) => state.selected.selectedMember);
  const selectedFlowstep = useSelector((state) => state.selected.selectedFlowstep);
  const selectedToolsystem = useSelector((state) => state.selected.selectedToolsystem);
  const members = useSelector((state) => state.members);
  const flowsteps = useSelector((state) => state.flowsteps);
  const isAddFlowstepModalOpen = useSelector((state) => state.modal.isAddFlowstepModalOpen);
  const isUpdateFlowstepModalOpen = useSelector((state) => state.modal.isUpdateFlowstepModalOpen);
  
  useEffect(() => {
      dispatch(fetchMembers(workflowId));
      dispatch(fetchFlowsteps(workflowId));
  }, [dispatch, workflowId]);

  useEffect(() => {
      if (flowsteps.length > 0) {
          const maxFlowNumber = Math.max(0, ...flowsteps.map(step => step.flow_number));
          setMaxFlowNumber(maxFlowNumber);
      } else {
          setMaxFlowNumber(0);
      }
  }, [flowsteps]);

  useEffect(() => {
      setOrderedMembers(members);
  }, [members]);

  const handleMemberAdded = async (newMember) => {
      await onMemberAdded(newMember); // Call the provided onMemberAdded function
      dispatch(fetchMembers()); // Fetch updated members from the Redux store
  };
      
  const handleOpenAddFlowstepModalonMatrixView = (member, stepNumber) => {
      dispatch(setSelectedMember(member));
      dispatch(setSelectedStepNumber(stepNumber));
      dispatch(openAddFlowstepModal());
  };

  const openAddCheckListModal = (member, stepNumber) => {
      setSelectedMember(member);
      setSelectedStepNumber(stepNumber);
      setIsModalforAddCheckListFormOpen(true);
  };

  const closeAddCheckListModal = () => {
      setSelectedMember(null);
      setSelectedStepNumber(null);
      setIsModalforAddCheckListFormOpen(false);
  };

  const moveRow = async (fromIndex, toIndex) => {
      const updatedMembers = [...orderedMembers]; // orderedMembersを使用
      const [movedMember] = updatedMembers.splice(fromIndex, 1);
      updatedMembers.splice(toIndex, 0, movedMember);
      setOrderedMembers(updatedMembers); // 状態を更新

      const response = await saveOrderToServer(updatedMembers);
      if (response.success) {
          console.log('Order saved successfully');
          // 最新のフローステップを取得
          dispatch(fetchFlowsteps()); // Add this to ensure fresh data
      } else {
          console.error('Error saving order:', response.error);
      }
  };

  const saveOrderToServer = async (updatedMembers) => {
      try {
          const response = await axios.post('/api/save-order', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ member_ids: updatedMembers.map(member => member.id) }),
          });

          const data = await response.json();
          return data;
      } catch (error) {
          console.error('Error saving order:', error);
          return { success: false, error };
      }
  };

  const handleUpdateFlowStepNumber = async (flowStepId, newFlowNumber) => {
      // ReduxのupdateFlowStepNumberをdispatch
      dispatch(updateFlowStepNumber({ flowStepId, newFlowNumber }));
      dispatch(fetchFlowsteps(workflowId));
  };

  const handleUpdateToolsystemName = async (toolsystemName) => {
      try {
          // toolsystem.name を更新
          await dispatch(updateToolsystemForFlowstep({ 
              flowstepId: selectedFlowstep.id, 
              toolsystemId: selectedToolsystem.id,
              toolsystemName: toolsystemName 
          })).unwrap(); // エラー時にキャッチできるようにunwrapを使用
          
          // flowstepの状態を再取得
          dispatch(fetchFlowsteps(workflowId));
          
          // 編集モードを終了
          setIsEditingToolsystemName(false);
      } catch (error) {
          console.error('更新エラー:', error);
      }
  };    

  const handleMemberDelete = (memberId) => {
      dispatch(deleteMember(memberId))
          .then(() => {
              dispatch(fetchMembers(workflowId)); // Refresh members after deletion
          })
          .catch((error) => {
              console.error('Error deleting member:', error);
          });
  };

  const handleSetSelectedToolsystem = (toolsystem) => {
      dispatch(setSelectedToolsystem(toolsystem))
  };

  return { 
    // Local State
    isHovered, setIsHovered, isEditingToolsystemName, setIsEditingToolsystemName, updatedToolsystemName, setUpdatedToolsystemName,
    isModalforAddCheckListFormOpen, setIsModalforAddCheckListFormOpen, selectedStepNumber, setSelectedStepNumber,
    maxFlowNumber, setMaxFlowNumber, orderedMembers, setOrderedMembers,

    // Global State
    dataBaseIconPositions, flowstepPositions, selectedMember, selectedFlowstep, selectedToolsystem,
    members, flowsteps, isAddFlowstepModalOpen, isUpdateFlowstepModalOpen, workflowId,

    // Event Handler
    handleMemberAdded, handleOpenAddFlowstepModalonMatrixView, openAddCheckListModal, closeAddCheckListModal, moveRow,
    handleUpdateFlowStepNumber, handleUpdateToolsystemName, handleMemberDelete, handleSetSelectedToolsystem,
  };
};
