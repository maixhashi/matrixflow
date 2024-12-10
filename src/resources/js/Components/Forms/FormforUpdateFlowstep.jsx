import React from 'react';
import { useFormforUpdateFlowstep } from '../../Hooks/useFormforUpdateFlowstep';

// FontAwesomeのアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

import '../../../css/FormforUpdateFlowstep.css';

const FormforUpdateFlowstep = ({ members = [], nextStepNumber }) => {
    const {
        // Local State
        name, setName, toolsystemName, setToolsystemName, description, setDescription,
        flowNumber, setFlowNumber, selectedMembers, setSelectedMembers,
        // Global State
        selectedFlowstep, selectedToolsystem,
        // Event Handler
        handleSubmit,
        // const
      } = useFormforUpdateFlowstep();
    
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

export default FormforUpdateFlowstep;
