import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { assignFlowStep, fetchFlowsteps } from '../store/flowstepsSlice'; // Import your Redux actions
import MemberList from '../Components/MembersList';
import AddMemberForm from '../Components/AddMemberForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import FlowstepList from '../Components/FlowstepList';
import MatrixView from '../Components/MatrixView';
import FlashMessage from '../Components/FlashMessage';

const Welcome = () => {
    const dispatch = useDispatch(); // Initialize dispatch
    const [members, setMembers] = useState([]);
    const [flowsteps, setFlowsteps] = useState([]);
    const [membersUpdated, setMembersUpdated] = useState(false);
    const [flowstepsUpdated, setFlowstepsUpdated] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');

    // メンバーが追加されたときの処理
    const handleMemberAdded = (memberName) => {
        setMembersUpdated(!membersUpdated); // ステートをトグルしてリストを再レンダリング
        setFlashMessage(`メンバーを追加しました：${memberName}`); // 追加したメンバーの名前を表示
        setTimeout(() => setFlashMessage(''), 5000); // 5秒後にメッセージを消す
    };

    // フローステップが追加されたときにフローステップリストを更新
    const handleFlowStepAdded = () => {
        setFlowstepsUpdated(!flowstepsUpdated); // ステートをトグルしてリストを再レンダリング
        setFlashMessage('FlowStep added successfully!'); // フラッシュメッセージを設定
        setTimeout(() => setFlashMessage(''), 5000); // 5秒後にメッセージを消す
    };

    // FlowStepをメンバーに割り当てる関数を追加
    const handleAssignFlowStep = (memberId, flowstepId, assignedMembersBeforeDrop) => {
        dispatch(assignFlowStep({ memberId, flowstepId, assignedMembersBeforeDrop })) // Dispatch the action
            .unwrap()
            .then(() => {
                const assignedMember = members.find(member => member.id === memberId);
                const memberName = assignedMember ? assignedMember.name : 'Unknown Member';

                console.log(`Assigned FlowStep ${flowstepId} to Member Id:${memberId}`);
                console.log(`Assigned FlowStep ${flowstepId} to Member Name:${memberName}`);
                setFlashMessage(`担当者を ${memberName} に変更しました。`);
                
                setMembersUpdated(prevState => !prevState);
                setFlowstepsUpdated(prevState => !prevState);
            })
            .catch((error) => {
                console.error('Error assigning FlowStep:', error);
                setFlashMessage("Failed to assign FlowStep");
            });

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
            <MemberList key={membersUpdated} />

            <h1>Flowstep Management</h1>
            <AddFlowStepForm members={members} onFlowStepAdded={handleFlowStepAdded} />
            <FlowstepList onFlowStepUpdated={handleFlowStepAdded} />

            <FlashMessage message={flashMessage} />
            <h2>Matrix View</h2>
            <MatrixView
                members={members}
                flowsteps={flowsteps}
                onAssignFlowStep={handleAssignFlowStep}
                onMemberAdded={handleMemberAdded}
                onFlowStepAdded={handleFlowStepAdded}
            />
        </div>
    );
};

export default Welcome;
