import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMember } from '../store/memberSlice'; // アクションのパスを正確に指定
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import '../../css/AddMemberForm.css';

const AddMemberForm = ({ workflowId }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const dispatch = useDispatch(); // Dispatch を取得

    useEffect(() => {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
    
        const memberData = { name }; // 送信するデータを準備
        console.log('Sending data:', memberData, 'to workflowId:', workflowId); // 送信されるデータをログ
    
        try {
            // Reduxアクションをディスパッチ
            const action = await dispatch(addMember({ workflowId, newMember: memberData })).unwrap();
            setName(''); // 入力をクリア
            console.log('Member added:', action); // 成功した場合の処理
        } catch (error) {
            console.error('Error adding member:', error); // エラーの詳細をログ
            setError('Failed to add member.'); // エラーメッセージを設定
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="mb-4">
            {error && <div className="error-message">{error}</div>}
            <div className="form-row">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="担当者の名前を入力"
                        required
                    />
                </div>
                <div>
                    <button type="submit">
                        <FontAwesomeIcon icon={faUserPlus} size="2x" />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddMemberForm;
