import React, { useState, useEffect } from 'react';
import MemberList from '../Components/MembersList';
import AddMemberForm from '../Components/AddMemberForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import FlowstepList from '../Components/FlowstepList';
import MatrixView from '../Components/MatrixView';

const Welcome = () => {
    const [members, setMembers] = useState([]);
    const [flowsteps, setFlowsteps] = useState([]);
    const [membersUpdated, setMembersUpdated] = useState(false);
    const [flowstepsUpdated, setFlowstepsUpdated] = useState(false);

    // メンバーが追加されたときにメンバーリストを更新
    const handleMemberAdded = () => {
        setMembersUpdated(!membersUpdated); // ステートをトグルしてリストを再レンダリング
    };

    // フローステップが追加されたときにフローステップリストを更新
    const handleFlowStepAdded = () => {
        setFlowstepsUpdated(!flowstepsUpdated); // ステートをトグルしてリストを再レンダリング
    };

    // FlowStepをメンバーに割り当てる関数を追加
    const handleAssignFlowStep = async (memberId, flowstepId) => {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        try {
            const response = await fetch('/api/assign-flowstep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token, // CSRFトークンをヘッダーに追加
                },
                body: JSON.stringify({ memberId, flowstepId }),
            });

            if (response.ok) {
                console.log(`Assigned FlowStep ${flowstepId} to Member ${memberId}`);
                // ここで必要に応じてメンバーやフローステップの状態を更新することができます
            } else {
                console.error("Failed to assign FlowStep");
            }
        } catch (error) {
            console.error("Error assigning FlowStep:", error);
        }
    };

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch('/api/members');
            const data = await response.json();
            setMembers(data);
        };

        fetchMembers();
    }, [membersUpdated]);

    useEffect(() => {
        const fetchFlowsteps = async () => {
            const response = await fetch('/api/flowsteps');
            const data = await response.json();
            setFlowsteps(data);
        };

        fetchFlowsteps();
    }, [flowstepsUpdated]);

    return (
        <div>
            <h1>Member Management</h1>
            <AddMemberForm onMemberAdded={handleMemberAdded} />
            <MemberList key={membersUpdated} /> {/* ステート変更でリストをリフレッシュ */}

            <h1>Flowstep Management</h1>
            <AddFlowStepForm members={members} onFlowStepAdded={handleFlowStepAdded} />
            <FlowstepList onFlowStepUpdated={handleFlowStepAdded} /> {/* フローステップリストを表示 */}

            <h2>Matrix View</h2>
            <MatrixView members={members} flowsteps={flowsteps} onAssignFlowStep={handleAssignFlowStep} />
        </div>
    );
};

export default Welcome;
