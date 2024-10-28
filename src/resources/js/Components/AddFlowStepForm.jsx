import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addFlowstep, deleteFlowstepAsync, fetchFlowsteps } from '../store/flowstepsSlice'; // Adjust the import path as needed
import '../../css/AddFlowStepForm.css';

const AddFlowStepForm = ({ members = [], onFlowStepAdded = () => {}, member = null, stepNumber = '', nextStepNumber, workflowId }) => {
    const [name, setName] = useState(''); 
    const [error, setError] = useState(null);
    const [flowNumber, setFlowNumber] = useState(stepNumber); 
    const [selectedMembers, setSelectedMembers] = useState(member ? [member.id] : []); 
    const [selectedStepNumber, setSelectedStepNumber] = useState(stepNumber); 
    const [searchTerm, setSearchTerm] = useState(''); 

    const dispatch = useDispatch(); // Get the dispatch function

    useEffect(() => {
        if (member) {
            setSelectedMembers([member.id]);
        }
        if (stepNumber) {
            setFlowNumber(stepNumber);
            setSelectedStepNumber(stepNumber);
        }
    }, [member, stepNumber]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const flowstepData = {
            name: name,
            flow_number: flowNumber,
            member_id: selectedMembers,
            step_number: selectedStepNumber,
        };
        console.log('Sending data:', flowstepData, 'to workflowId:', workflowId); // 送信されるデータをログ

        try {
            // Reduxアクションをディスパッチ
            const action = await dispatch(addFlowstep({ workflowId, newFlowstep: flowstepData })).unwrap();
            setName(''); // 入力をクリア
            console.log('Flowstep added:', action); // 成功した場合の処理
            dispatch(fetchFlowsteps(workflowId));
        } catch (error) {
            console.error('Error adding Flowstep:', error); // エラーの詳細をログ
            setError('Failed to add Flowstep.'); // エラーメッセージを設定
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
                <div>
                    <label>フローステップ名:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                        placeholder="担当者がフローとして行うことを入力しましょう"
                    />
                </div>
                <div>
                    <label>ステップNo.:</label>
                    <select
                        value={selectedStepNumber}
                        onChange={handleStepChange}
                        required
                    >
                        {Array.from({ length: nextStepNumber }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                STEP {index + 1}
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

export default AddFlowStepForm;
