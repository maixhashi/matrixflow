import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateFlowstep, fetchFlowsteps } from '../store/flowstepsSlice';
import { fetchToolsByFlowstep, updateToolsForFlowstep } from '../store/toolsystemSlice';

// FontAwesomeのアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

import '../../css/UpdateFlowStepForm.css';

const UpdateFlowStepForm = ({ members = [], nextStepNumber, workflowId }) => {
    const [name, setName] = useState('');
    const [toolsystemName, setToolsystemName] = useState('');
    const [description, setDescription] = useState('');
    const [flowNumber, setFlowNumber] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    const dispatch = useDispatch();

    const selectedFlowstep = useSelector((state) => state.selected.selectedFlowstep);

    useEffect(() => {
        if (selectedFlowstep) {
            setName(selectedFlowstep.name);
            setDescription(selectedFlowstep.description);
            setFlowNumber(selectedFlowstep.flow_number);

            // 関連するToolsystemの取得
            dispatch(fetchToolsByFlowstep(selectedFlowstep.id));
        }
    }, [selectedFlowstep, dispatch]);

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
                updateToolsForFlowstep({
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
    
    return (
        <>
            <div className="AddFlowStepForm-title">
                <FontAwesomeIcon icon={faSquarePlus} className="AddFlowStepForm-title-icon" />
                フローステップの追加
                <FontAwesomeIcon icon={faSquarePlus} className="AddFlowStepForm-title-icon" />
            </div>

            <form className="form-container" onSubmit={handleSubmit}>
                <div>
                    <label>フローステップ名:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>ステップNo.:</label>
                    <select value={flowNumber} onChange={(e) => setFlowNumber(e.target.value)} required>
                        {Array.from({ length: nextStepNumber }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                STEP {index + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>担当者を選択:</label>
                    <select
                        multiple
                        value={selectedMembers}
                        onChange={(e) => {
                            const options = e.target.options;
                            const selected = [];
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].selected) selected.push(options[i].value);
                            }
                            setSelectedMembers(selected);
                        }}
                    >
                        {members.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>ツールシステム名:</label>
                    <input
                        type="text"
                        value={toolsystemName}
                        onChange={(e) => setToolsystemName(e.target.value)}
                    />
                </div>
                <button type="submit">フローステップを更新</button>
            </form>
        </>
    );
};

export default UpdateFlowStepForm;
