import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFlowstep, deleteFlowstepAsync, fetchFlowsteps } from '../store/flowstepsSlice'; // Adjust the import path as needed

// FontAwesomeのアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

// スタイル
import '../../css/AddFlowStepForm.css';

const AddFlowStepForm = ({ members = [], onFlowStepAdded = () => {}, member = null, stepNumber = '', nextStepNumber, workflowId }) => {
    const [name, setName] = useState(''); 
    const [error, setError] = useState(null);
    const [flowNumber, setFlowNumber] = useState(stepNumber); 
    const [selectedMembers, setSelectedMembers] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    
    const selectedMember = useSelector((state) => state.selected.selectedMember);
    const selectedStepNumber = useSelector((state) => state.selected.selectedStepNumber);

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

    return (
        <>
            <div className="AddFlowStepForm-title">
                <FontAwesomeIcon icon={faSquarePlus} className="AddFlowStepForm-title-icon" />
                フローステップの追加
                <FontAwesomeIcon icon={faSquarePlus} className="AddFlowStepForm-title-icon" />
            </div>
            <div>
                <form className="form-container" onSubmit={handleSubmit}>
                    <div>
                        <label>フローステップ名:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="担当者がフローとして行うことを入力しましょう" />
                    </div>
                    <div>
                        <label>ステップNo.:</label>
                        <select
                            value={flowNumber}
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
                            placeholder="担当者を名前検索できます" />
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
        </>
    );
};

export default AddFlowStepForm;
