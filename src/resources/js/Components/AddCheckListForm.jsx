import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { fetchCheckLists, addCheckList } from '../store/checklistSlice'; // Adjust the import path as needed
import '../../css/AddCheckListForm.css';

const AddCheckListForm = ({ members = [], onFlowStepAdded = () => {}, member, stepNumber, nextStepNumber, workflowId }) => {
    const [name, setName] = useState(''); 
    const [error, setError] = useState(null);
    const [flowNumber, setFlowNumber] = useState(stepNumber); 
    const [selectedMembers, setSelectedMembers] = useState(member ? [member.id] : []); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedStepNumber, setSelectedStepNumber] = useState(stepNumber || 1); // デフォルト値をstepNumberに設定
    const dispatch = useDispatch(); // Get the dispatch function

    useEffect(() => {
        if (member && member.id) {
            console.log("Member object:", member); // memberオブジェクトの内容を確認
            setSelectedMembers([member.id]);
        } else {
            console.log("Member is undefined or missing id");
        }
        if (stepNumber) {
            setFlowNumber(stepNumber);
            setSelectedStepNumber(stepNumber);
        }
    }, [member, stepNumber]);
    
    useEffect(() => {
        console.log("Updated selectedMembers:", selectedMembers);
    }, [selectedMembers]);
        

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // selectedStepNumberの値を確認
        console.log('Selected Step Number before submitting:', selectedStepNumber);
    
        // チェックリストのデータを構成
        const checklistData = {
            name: name,
            flownumber_for_checklist: selectedStepNumber, // STEP番号を使用
            member_id: selectedMembers
        };
    
        console.log('Sending checklist data:', checklistData, 'to workflowId:', workflowId); // 送信されるデータをログ
    
        try {
            // Reduxアクションをディスパッチ
            const action = await dispatch(addCheckList({ workflowId, checklist: checklistData })).unwrap();
            setName(''); // 入力をクリア
            console.log('Checklist added:', action); // 成功した場合の処理
            // 必要に応じて、チェックリストを再取得する
            dispatch(fetchCheckLists(workflowId)); // チェックリストを再取得
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Validation errors:', error.response.data.errors);
            } else {
                console.error('Error adding Checklist:', error);
            }
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
        setSelectedStepNumber(e.target.value);
    };

    const filteredMembers = members.filter((m) => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="AddCheckListForm-title-container">
                    <div className="AddCheckListForm-title-icon">
                        <FontAwesomeIcon icon={faClipboardCheck} />
                    </div>
                    <div className="AddCheckListForm-title">
                        チェックリストを作成する
                    </div>
                    <div className="AddCheckListForm-title-icon">
                        <FontAwesomeIcon icon={faClipboardCheck} />
                    </div>
                </div>
                <div>
                    <label>チェックリスト:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                        placeholder="次のフローステップに進む前のチェック事項を入力"
                    />
                </div>
                <div>
                    <label>ステップNo.:</label>
                    <select
                        value={selectedStepNumber}
                        onChange={handleStepChange}
                        required
                    >
                        {Array.from({ length: nextStepNumber-2 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                STEP {index + 1} → STEP {index + 2}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>担当者を検索:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="担当者を名前検索できます"
                    />
                </div>
                <div>
                    <label>担当者を選択:</label>
                    <select
                        multiple
                        value={selectedMembers}
                        onChange={handleMemberChange}
                        required
                    >
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>No members available</option>
                        )}
                    </select>
                </div>
                <button type="submit">フローステップを追加</button>
            </form>
        </div>
    );
};

export default AddCheckListForm;
