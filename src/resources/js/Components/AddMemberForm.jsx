import React, { useState } from 'react';
import axios from 'axios';

const AddMemberForm = ({ onMemberAdded }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  // メンバー追加処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const memberData = { name }; // ここでmemberDataを定義

    try {
      const response = await axios.post('/api/members', memberData);
      console.log('Member added:', response.data);
      onMemberAdded(response.data); // 新しいメンバーをリストに追加するためのコールバック
      setName(''); // フォームをクリア
    } catch (error) {
      console.error('Error adding member:', error);
      setError('メンバーの追加に失敗しました。');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Member Name"
        required
      />
      <button type="submit">Add Member</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddMemberForm;
