import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberList = () => {
    const [members, setMembers] = useState([]);

    // メンバーリストを取得する関数
    const fetchMembers = async () => {
        try {
            const response = await axios.get('/api/members');
            setMembers(response.data); // APIから取得したデータをセット
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };

    // コンポーネントがマウントされた時にメンバーリストを取得
    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <div>
            <h2>Member List</h2>
            <ul>
                {members.map((member) => (
                    <li key={member.id}>{member.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default MemberList;
