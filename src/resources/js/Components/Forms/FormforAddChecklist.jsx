import React from 'react';

// FontAwesomeアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
// スタイルのインポート
import '../../css/AddCheckListForm.css';
// カスタムフックのインポート
import { useFormforAddChecklist } from '../Hooks/useFormforAddChecklist'

const FormforAddChecklist = ({ members = [], member, stepNumber, nextStepNumber }) => {
    const { 
        // Local State
        name, setName, 
        selectedMembers,
        searchTerm, setSearchTerm,
        selectedStepNumber,
        // Global State
          // none
        // Event Handler
        handleSubmit, handleMemberChange, handleStepChange,
        // const
        filteredMembers
    } = useFormforAddChecklist(members, member, stepNumber)

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
                <button type="submit">チェック項目を追加</button>
            </form>
        </div>
    );
};

export default FormforAddChecklist;
