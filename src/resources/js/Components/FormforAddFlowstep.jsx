import React from 'react';

// カスタムフックのインポート
import { useFormforAddFlowstep } from '../Hooks/useFormforAddFlowstep';

// FontAwesomeのアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

// スタイル
import '../../css/FormforAddFlowstep.css';

const FormforAddFlowstep = ({ members, stepNumber, nextStepNumber}) => {
    const {
        // Local State
        name, setName, flowNumber, 
        selectedMembers, searchTerm, setSearchTerm,
        // Global State
        // Event Handler
        handleSubmit, handleMemberChange, handleStepChange,
        // const
        filteredMembers,
    } = useFormforAddFlowstep(members, stepNumber)
    

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

export default FormforAddFlowstep;
