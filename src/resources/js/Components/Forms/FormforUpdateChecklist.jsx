import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { useFormforUpdateChecklist } from '../../Hooks/useFormforUpdateChecklist';
import '../../../css/FormforUpdateChecklist.css';

const FormforUpdateChecklist = ({ flowNumber, checkListsForFlowNumber }) => {
    const {
        // Local State
        name, setName, error,
        // Global State
        // Event Handler
        handleSubmit,
    } = useFormforUpdateChecklist(flowNumber);

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
                    <label>チェックリスト名:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                        placeholder="チェックリストの名前を入力してください"
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit">チェックリストを追加</button>
            </form>

            <h3>既存のチェックリスト</h3>
            <ul className="checklist-container">
                {checkListsForFlowNumber.map((checklist) => (
                    <li key={checklist.id} className="checklists">{checklist.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default FormforUpdateChecklist;
