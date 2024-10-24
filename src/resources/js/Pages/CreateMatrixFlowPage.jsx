import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers } from '../store/memberSlice'; 
import { assignFlowStep } from '../store/flowstepsSlice'; 
import MatrixView from '../Components/MatrixView';
import Document from '../Components/Document';
import FlashMessage from '../Components/FlashMessage';
import '../../css/CreateMatrixFlowPage.css';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout'; 

const CreateMatrixFlowPage = () => {
    const dispatch = useDispatch();
    const [flowsteps, setFlowsteps] = useState([]);
    const [membersUpdated, setMembersUpdated] = useState(false);
    const [flowstepsUpdated, setFlowstepsUpdated] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');
    const [workflowId, setWorkflowId] = useState(null); // 一意のワークフローIDを保存

    const members = useSelector((state) => state.members);

    useEffect(() => {
        dispatch(fetchMembers());
    }, [dispatch]);

    const handleCreateWorkflow = async () => {
        try {
            const response = await fetch('/api/workflows', { method: 'POST' });
            const data = await response.json();
            setWorkflowId(data.id); // 新しいワークフローIDを保存
            setFlashMessage(`Workflow created with ID: ${data.id}`);
            setTimeout(() => setFlashMessage(''), 5000);
        } catch (error) {
            console.error('Error creating workflow:', error);
            setFlashMessage('Failed to create workflow');
            setTimeout(() => setFlashMessage(''), 5000);
        }
    };

    const handleMemberAdded = (member) => {
        const memberName = member.name || 'Unknown Member'; // メンバー名がオブジェクトのプロパティとして存在することを確認
        setMembersUpdated(!membersUpdated);
        setFlashMessage(`メンバーを追加しました：${memberName}`);
        setTimeout(() => setFlashMessage(''), 5000);
    };
    
    const handleFlowStepAdded = () => {
        // 必要に応じてFlowStep追加ロジックにワークフローIDを追加
        setFlowstepsUpdated(!flowstepsUpdated);
        setFlashMessage('フローステップを追加しました');
        setTimeout(() => setFlashMessage(''), 5000);
    };

    const handleAssignFlowStep = (memberId, flowstepId, assignedMembersBeforeDrop) => {
        // 割り当てペイロードにworkflowIdを含める
        dispatch(assignFlowStep({ memberId, flowstepId, assignedMembersBeforeDrop, workflowId }))
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
        const fetchFlowsteps = async () => {
            const response = await fetch('/api/flowsteps');
            const data = await response.json();
            setFlowsteps(data);
        };

        fetchFlowsteps();
    }, [flowstepsUpdated]);

    return (
        <AuthenticatedLayout>
            <div className="welcome-container">
                <FlashMessage message={flashMessage} />
                <button onClick={handleCreateWorkflow}>フローを作成する</button>
                <div className="content-container">
                    <Document />
                    <MatrixView
                        members={members}
                        flowsteps={flowsteps}
                        onAssignFlowStep={handleAssignFlowStep}
                        onMemberAdded={handleMemberAdded}
                        onFlowStepAdded={handleFlowStepAdded}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateMatrixFlowPage;
