import React, { useState, useEffect } from 'react';
import MemberList from '../Components/MembersList';
import AddMemberForm from '../Components/AddMemberForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import FlowstepList from '../Components/FlowstepList';
import MatrixView from '../Components/MatrixView';
import FlashMessage from '../Components/FlashMessage';

const Welcome = () => {
    const [members, setMembers] = useState([]);
    const [flowsteps, setFlowsteps] = useState([]);
    const [membersUpdated, setMembersUpdated] = useState(false);
    const [flowstepsUpdated, setFlowstepsUpdated] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');


    // メンバーが追加されたときにメンバーリストを更新
    const handleMemberAdded = () => {
        setMembersUpdated(!membersUpdated); // ステートをトグルしてリストを再レンダリング
    };

    // フローステップが追加されたときにフローステップリストを更新
    const handleFlowStepAdded = () => {
        setFlowstepsUpdated(!flowstepsUpdated); // ステートをトグルしてリストを再レンダリング
    };

    // FlowStepをメンバーに割り当てる関数を追加
    const handleAssignFlowStep = async (memberId, flowstepId, assignedMembersBeforeDrop) => {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        try {
            const response = await fetch('/api/assign-flowstep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    memberId,
                    flowstepId,
                    assignedMembersBeforeDrop,
                }),
            });
    
            if (response.ok) {
                // memberId に対応するメンバー名を取得
                const assignedMember = members.find(member => member.id === memberId);
                const memberName = assignedMember ? assignedMember.name : 'Unknown Member';
                
                console.log(`Assigned FlowStep ${flowstepId} to Member ${memberName}`);
                
                // メッセージを設定して表示
                setFlashMessage(`担当者を ${memberName} に変更しました。`);
                
                // メンバーとフローステップの状態を更新
                setMembersUpdated(!membersUpdated);
                setFlowstepsUpdated(!flowstepsUpdated);
            } else {
                setFlashMessage("Failed to assign FlowStep");
            }
        } catch (error) {
            setFlashMessage("Error assigning FlowStep");
            console.error("Error assigning FlowStep:", error);
        }
        
        // 5秒後にメッセージを消す
        setTimeout(() => setFlashMessage(''), 5000);
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

            <FlashMessage message={flashMessage} />
            <h2>Matrix View</h2>
            <MatrixView members={members} flowsteps={flowsteps} onAssignFlowStep={handleAssignFlowStep} />
        </div>
    );
};

export default Welcome;
