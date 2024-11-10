import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFlowstep, deleteFlowstepAsync, fetchFlowsteps } from '../store/flowstepsSlice'; // インポートパスを適宜調整
import '../../css/UpdateFlowStepForm.css';

const UpdateFlowStepForm = ({ members = [], nextStepNumber, workflowId }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const [flowNumber, setFlowNumber] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();

    const selectedMember = useSelector((state) => state.selected.selectedMember);
    const selectedStepNumber = useSelector((state) => state.selected.selectedStepNumber);
    const selectedFlowstep = useSelector((state) => state.selected.selectedFlowstep);

    useEffect(() => {
        if (selectedFlowstep) {
            setName(selectedFlowstep.name);
            setDescription(selectedFlowstep.description);
            setFlowNumber(selectedFlowstep.flow_number);
        }
        if (selectedMember) {
            setSelectedMembers([selectedMember.id]);
        }
        console.log("selectedMembers:", selectedMembers);
    }, [selectedFlowstep, selectedMember]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const flowstepData = {
            id: selectedFlowstep.id,
            name: name,
            description: description,
            flow_number: selectedFlowstep.flow_number,
            member_id: selectedMembers,
            step_number: selectedFlowstep?.flow_number,
        };
        console.log('更新するデータ:', flowstepData, 'workflowId:', workflowId);

        try {
            const action = await dispatch(updateFlowstep({ workflowId, updatedFlowstep: flowstepData })).unwrap();
            console.log('フローステップが更新されました:', action);
            dispatch(fetchFlowsteps(workflowId));
        } catch (error) {
            console.error('フローステップの更新エラー:', error);
            setError('フローステップの更新に失敗しました。');
        }
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
                            <option disabled>メンバーが利用できません</option>
                        )}
                    </select>
                </div>
                <div>
                    <label>詳細:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} 
                        required
                        placeholder="フローの詳細を入力しましょう"
                    />
                </div>
                <div>
                    <button type="submit">フローステップを更新</button>
                </div>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default UpdateFlowStepForm;
