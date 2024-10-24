import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers } from '../store/memberSlice'; 
import { fetchFlowsteps, assignFlowStep } from '../store/flowstepsSlice'; 
import MatrixView from '../Components/MatrixView';
import Document from '../Components/Document';
import FlashMessage from '../Components/FlashMessage';
import '../../css/CreateMatrixFlowPage.css';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout'; 

const CreateMatrixFlowPage = (props) => {
    const dispatch = useDispatch();
    const [flowsteps, setFlowsteps] = useState([]);
    const [membersUpdated, setMembersUpdated] = useState(false);
    const [flowstepsUpdated, setFlowstepsUpdated] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');
    const { workflowId } = props;

    const members = useSelector((state) => state.members);

    useEffect(() => {
        dispatch(fetchMembers(workflowId)); // workflowIdに基づいてメンバーを取得
        console.log('Fetched members:', members);
        dispatch(fetchFlowsteps(workflowId)); // workflowIdに基づいてフローステップを取得
    }, [dispatch, workflowId]);

    useEffect(() => {
        console.log('workflowId in CreateMatrixFlowPage:', workflowId);
    }, [workflowId]);

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
        dispatch(fetchFlowsteps(workflowId));

    };

    return (
        <AuthenticatedLayout>
            <div className="welcome-container">
                <FlashMessage message={flashMessage} />
                <div className="content-container">
                    <Document />
                    <MatrixView
                        members={members}
                        flowsteps={flowsteps}
                        onAssignFlowStep={handleAssignFlowStep}
                        onMemberAdded={handleMemberAdded}
                        onFlowStepAdded={handleFlowStepAdded}
                        workflowId={workflowId}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateMatrixFlowPage;
