import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCheckLists, addCheckList } from '../store/checklistSlice';

export const useFormforUpdateChecklist = (flowNumber) => {
  // Local State
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  // Global State
  const workflowId = useSelector(state => state.workflow.workflowId);
  
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(fetchCheckLists(workflowId)); // フェッチする必要があれば
  }, [dispatch, workflowId]);

  // Event Handler 
  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);

      const checklistData = {
          name,
          flownumber_for_checklist: flowNumber, // flowNumberを使用
      };

      try {
          await dispatch(addCheckList({ workflowId, checklist: checklistData })).unwrap();
          setName(''); // 入力をクリア
          dispatch(fetchCheckLists(workflowId)); // チェックリストを再取得
      } catch (error) {
          if (error.response && error.response.status === 422) {
              console.error('Validation errors:', error.response.data.errors);
              setError('Validation error occurred.');
          } else {
              console.error('Error adding Checklist:', error);
              setError('An error occurred while adding the checklist.');
          }
      }
  };

  return {
    // Local State
    name, setName, error, setError,
    // Global State
    workflowId,
    // Event Handler
    handleSubmit,
  };
};
