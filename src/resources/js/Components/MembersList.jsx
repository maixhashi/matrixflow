import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MembersList = () => {
  const [members, setMembers] = useState([]);

  // メンバーリストを取得する関数
  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  // 初回レンダリング時にメンバーリストを取得
  useEffect(() => {
    fetchMembers();
  }, []);

  // 新しいメンバーが追加されたらリストを更新
  const handleMemberAdded = (newMember) => {
    setMembers((prevMembers) => [...prevMembers, newMember]);
  };

  return (
    <div>
      <h1>Member List</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>{member.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MembersList;
