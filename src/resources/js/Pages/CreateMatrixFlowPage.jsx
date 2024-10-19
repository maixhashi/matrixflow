import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers } from '../store/memberSlice'; 
import { assignFlowStep } from '../store/flowstepsSlice'; 
import MatrixView from '../Components/MatrixView';
import FlashMessage from '../Components/FlashMessage';
import '../../css/CreateMatrixFlowPage.css'; // CSSファイルをインポート
import { Inertia } from '@inertiajs/inertia'; // Inertiaオブジェクトのインポート
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout'; // AuthenticatedLayoutをインポート

const CreateMatrixFlowPage = () => {
    const dispatch = useDispatch();
    const [flowsteps, setFlowsteps] = useState([]);
    const [membersUpdated, setMembersUpdated] = useState(false);
    const [flowstepsUpdated, setFlowstepsUpdated] = useState(false);
    const [flashMessage, setFlashMessage] = useState('');

    const members = useSelector((state) => state.members);

    useEffect(() => {
        dispatch(fetchMembers());
    }, [dispatch]);

    const handleMemberAdded = (memberName) => {
        setMembersUpdated(!membersUpdated);
        setFlashMessage(`メンバーを追加しました：${memberName}`);
        setTimeout(() => setFlashMessage(''), 5000);
    };

    const handleFlowStepAdded = () => {
        setFlowstepsUpdated(!flowstepsUpdated);
        setFlashMessage('FlowStep added successfully!');
        setTimeout(() => setFlashMessage(''), 5000);
    };

    const handleAssignFlowStep = (memberId, flowstepId, assignedMembersBeforeDrop) => {
        dispatch(assignFlowStep({ memberId, flowstepId, assignedMembersBeforeDrop }))
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
                <MatrixView
                    members={members}
                    flowsteps={flowsteps}
                    onAssignFlowStep={handleAssignFlowStep}
                    onMemberAdded={handleMemberAdded}
                    onFlowStepAdded={handleFlowStepAdded}
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateMatrixFlowPage;
