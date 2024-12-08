import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlowsteps, deleteFlowstepAsync, updateFlowstepName } from '../store/flowstepsSlice';
import { openUpdateFlowstepModal } from '../store/modalSlice';
import { setSelectedFlowstep, setSelectedMember, setSelectedStepNumber } from '../store/selectedSlice';

export const useFlowstep = (flowstep) => {
  if (!flowstep) {
    return <div>フローステップのデータがありません</div>;
  }
  
  const dispatch = useDispatch();
  
  // Local State
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(flowstep.name); // Initial value from flowstep.name
  const [isHovered, setIsHovered] = useState(false); // Hover state
  
  // Global State
  const selectedMember = useSelector((state) => state.selected.selectedMember);
  const selectedStepNumber = useSelector((state) => state.selected.selectedStepNumber);
  const selectedFlowstep = useSelector((state) => state.selected.selectedFlowstep);
  const workflowId = useSelector((state) => state.workflow.workflowId);
  
  // Event Handler
  const handleDelete = async () => {
    setIsDeleting(true); // Set deleting state
    await dispatch(deleteFlowstepAsync(flowstep.id)); // Dispatch delete action
    setIsDeleting(false); // Reset deleting state
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
    setNewName(flowstep.name); // Reset the name to the original value
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setNewName(flowstep.name); // Reset the name to the original value
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateFlowstepName({ id: flowstep.id, updatedFlowstep: { name: newName } }));
    setIsEditing(false); // Close the form after submitting
    dispatch(fetchFlowsteps(workflowId));
  };
  
  const handleOpenUpdateFlowstepModal = (member, flowstep, stepNumber) => {
    dispatch(setSelectedMember(selectedMember));
    dispatch(setSelectedStepNumber(stepNumber));
    dispatch(setSelectedFlowstep(flowstep));
    dispatch(openUpdateFlowstepModal());
  };
  
  return { 
    // Local State
    isDeleting, setIsDeleting, isEditing, setIsEditing, newName, setNewName, isHovered, setIsHovered,
    // Global State
    selectedMember, selectedStepNumber, selectedFlowstep,
    // Event Handler
    handleDelete, handleEditClick, handleCancel, handleSubmit, handleOpenUpdateFlowstepModal
  };
};