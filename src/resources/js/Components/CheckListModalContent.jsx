import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { fetchCheckLists, addCheckList, selectCheckListsByFlowNumber } from '../store/checklistSlice'; // Adjust the import path as needed
import '../../css/CheckListModalContent.css';

const CheckListModalContent = ({ workflowId, flowNumber, checkListsForFlowNumber }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCheckLists(workflowId)); // フェッチする必要があれば
    }, [dispatch, workflowId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const checklistData = {
            name,
            flownumber_for_checklist: flowNumber, // flowNumberを使用
        };

        try {
            await dispatch(addCheckList({ workflowId, checklist: checklistData })).unwrap();
            setName(''); // 入力をクリア
            dispatch(fetchCheckLists(workflowId)); // チェックリストを再取得
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Validation errors:', error.response.data.errors);
                setError('Validation error occurred.');
            } else {
                console.error('Error adding Checklist:', error);
                setError('An error occurred while adding the checklist.');
            }
        }
    };

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

export default CheckListModalContent;
