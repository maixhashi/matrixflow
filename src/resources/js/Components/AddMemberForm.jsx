import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../../css/AddMemberForm.css'


const AddMemberForm = ({ onMemberAdded }) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/members', { name });
            setName(''); // フォームをクリア
            if (onMemberAdded) {
                onMemberAdded(name); // 追加したメンバーの名前を親コンポーネントに渡す
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="form-row">
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Member Name"
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
