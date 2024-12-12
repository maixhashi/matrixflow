import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFlowstep, deleteFlowstepAsync, fetchFlowsteps } from '../store/flowstepsSlice';

export const useFormforAddFlowstep = (members, stepNumber) => {
  // Local State
  const [name, setName] = useState(''); 
  const [error, setError] = useState(null);
  const [flowNumber, setFlowNumber] = useState(stepNumber); 
  const [selectedMembers, setSelectedMembers] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  
  // Global State
  const selectedMember = useSelector((state) => state.selected.selectedMember);
  const selectedStepNumber = useSelector((state) => state.selected.selectedStepNumber);
  const workflowId = useSelector((state) => state.workflow.workflowId);

  const dispatch = useDispatch();

  useEffect(() => {
      if (selectedMember) {
          setSelectedMembers([selectedMember.id]);
      }
      if (stepNumber) {
          setFlowNumber(stepNumber);
      }
  }, [selectedMember, stepNumber]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
  
      const flowstepData = {
          name: name,
          flow_number: flowNumber || selectedStepNumber, // flow_number が設定されていない場合は selectedStepNumber を使用
          member_id: selectedMembers,
          step_number: selectedStepNumber,
      };
      console.log('Sending data:', flowstepData, 'to workflowId:', workflowId); // データ確認用
  
      try {
          const action = await dispatch(addFlowstep({ workflowId, newFlowstep: flowstepData })).unwrap();
          setName('');
          console.log('Flowstep added:', action);
          dispatch(fetchFlowsteps(workflowId));
      } catch (error) {
          console.error('Error adding Flowstep:', error);
          setError('Failed to add Flowstep.');
      }
  };
  
  const handleDelete = (id) => {
      dispatch(deleteFlowstepAsync(id));
  };

  const handleMemberChange = (e) => {
      const options = e.target.options;
      const value = [];
      for (let i = 0; i < options.length; i++) {
          if (options[i].selected) {
              value.push(options[i].value);
          }
      }
      setSelectedMembers(value);
  };

  const handleStepChange = (e) => {
      setFlowNumber(e.target.value);
  };

  const filteredMembers = members.filter((m) => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    // Local State
    name, setName, error, setError, flowNumber, setFlowNumber, 
    selectedMembers, setSelectedMembers, searchTerm, setSearchTerm,
    // Global State
    selectedMember, selectedStepNumber,
    // Event Handler
    handleSubmit, handleDelete, handleMemberChange, handleStepChange,
    // const
    filteredMembers,
  };
};
