import React, { useState } from 'react';
import MemberList from '../Components/MembersList';
import AddMemberForm from '../Components/AddMemberForm';

const App = () => {
    const [membersUpdated, setMembersUpdated] = useState(false);

    // メンバーが追加されたときにメンバーリストを更新
    const handleMemberAdded = () => {
        setMembersUpdated(!membersUpdated); // ステートをトグルしてリストを再レンダリング
    };

    return (
        <div>
            <h1>Member Management</h1>
            <AddMemberForm onMemberAdded={handleMemberAdded} />
            <MemberList key={membersUpdated} /> {/* ステート変更でリストをリフレッシュ */}
        </div>
    );
};

export default App;
