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
        dispatch(fetchMembers(workflowId));
        dispatch(fetchFlowsteps(workflowId));
    }, [dispatch, workflowId]);

    const handleMemberAdded = (member) => {
        const memberName = member.name || 'Unknown Member';
        setMembersUpdated(!membersUpdated);
        setFlashMessage(`メンバーを追加しました：${memberName}`);
        setTimeout(() => setFlashMessage(''), 5000);
    };
    
    const handleFlowStepAdded = () => {
        setFlowstepsUpdated(!flowstepsUpdated);
        setFlashMessage('フローステップを追加しました');
        setTimeout(() => setFlashMessage(''), 5000);
    };

    const handleAssignFlowStep = (memberId, flowstepId, assignedMembersBeforeDrop) => {
        dispatch(assignFlowStep({ memberId, flowstepId, assignedMembersBeforeDrop, workflowId }))
            .unwrap()
            .then(() => {
                const assignedMember = members.find(member => member.id === memberId);
                const memberName = assignedMember ? assignedMember.name : 'Unknown Member';
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
        <div>
            <FlashMessage message={flashMessage} />
            <div className="content-container">
                <div className="sidebar">
                    <Document 
                        workflowId={workflowId}
                    />
                </div>
                <div className="main-content">
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
        </div>
    );
};

export default CreateMatrixFlowPage;
