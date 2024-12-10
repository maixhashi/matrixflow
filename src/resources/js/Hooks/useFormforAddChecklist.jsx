import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCheckLists, addCheckList } from '../store/checklistSlice';
import { deleteFlowstepAsync } from '../store/flowstepsSlice';

export const useFormforAddChecklist = (members, member, stepNumber) => {
    const dispatch = useDispatch();
  
    // Local State
    const [name, setName] = useState(''); 
    const [error, setError] = useState(null);
    const [flowNumber, setFlowNumber] = useState(stepNumber); 
    const [selectedMembers, setSelectedMembers] = useState(member ? [member.id] : []); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedStepNumber, setSelectedStepNumber] = useState(stepNumber || 1); // デフォルト値をstepNumberに設定
  
    // Global State
    const workflowId = useSelector((state) => state.workflow.workflowId);
  
    useEffect(() => {
        if (member && member.id) {
            setSelectedMembers([member.id]);
        }
        if (stepNumber) {
            setFlowNumber(stepNumber);
            setSelectedStepNumber(stepNumber);
        }
    }, [member, stepNumber]);
  
    // Event Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        // チェックリストのデータを構成
        const checklistData = {
            name: name,
            flownumber_for_checklist: selectedStepNumber, // STEP番号を使用
            member_id: selectedMembers
        };
    
        // Reduxアクションをディスパッチ
        await dispatch(addCheckList({ workflowId, checklist: checklistData })).unwrap();
        setName(''); // 入力をクリア
        // 必要に応じて、チェックリストを再取得する
        dispatch(fetchCheckLists(workflowId)); // チェックリストを再取得
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
        setSelectedStepNumber(e.target.value);
    };
  
    const filteredMembers = members.filter((m) => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return { 
      // Local State
      name, setName, error, setError, flowNumber, setFlowNumber, selectedMembers, setSelectedMembers,
      searchTerm, setSearchTerm, selectedStepNumber, setSelectedStepNumber,
      // Event Handler
      handleSubmit, handleDelete, handleMemberChange, handleStepChange,
      // const
      filteredMembers
    };
  }; // ここに1つだけ閉じ括弧を残す
  