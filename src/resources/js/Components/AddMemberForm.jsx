import React, { useState } from 'react';
import axios from 'axios';

const AddMemberForm = ({ onMemberAdded }) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/members', { name });
            setName(''); // フォームをクリア
            if (onMemberAdded) {
                onMemberAdded(); // 親コンポーネントのコールバックを呼び出し
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Member Name"
                required
            />
            <button type="submit">Add Member</button>
        </form>
    );
};

export default AddMemberForm;
