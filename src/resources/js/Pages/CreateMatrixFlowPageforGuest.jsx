import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MatrixViewForGuest from '../Components/MatrixViewForGuest';
import FlashMessage from '../Components/FlashMessage';
import '../../css/CreateMatrixFlowPage.css'; // CSSファイルをインポート

const CreateMatrixFlowPageforGuest = () => {
    const dispatch = useDispatch();
    const [flashMessage, setFlashMessage] = useState('');

    const flowsteps = useSelector((state) => state.flowstepsForGuest);

    const handleMemberAdded = (memberName) => {
        setMembersUpdated(!membersUpdated);
        setFlashMessage(`メンバーを追加しました：${memberName}`);
        setTimeout(() => setFlashMessage(''), 5000);
    };

    const handleAddFlowstep = async (newFlowstep) => {
      dispatch(addFlowstep(newFlowstep)); // Add new flowstep
    };


    const handleAssignFlowStep = (memberId, flowstepId, assignedMembersBeforeDrop) => {
        dispatch(assignFlowStep({ memberId, flowstepId, assignedMembersBeforeDrop }))
            .unwrap()
            .then(() => {
                const assignedMember = members.find(member => member.id === memberId);
                const memberName = assignedMember ? assignedMember.name : 'Unknown Member';
                setFlashMessage(`担当者を ${memberName} に変更しました。`);
                setMembersUpdated(prevState => !prevState);
            })
            .catch((error) => {
                console.error('Error assigning FlowStep:', error);
                setFlashMessage("FlowStepの割り当てに失敗しました");
            });

        setTimeout(() => setFlashMessage(''), 5000);
    };

    return (
      <div className="welcome-container">
          <FlashMessage message={flashMessage} />
          <MatrixViewForGuest/>
      </div>
    );
};

export default CreateMatrixFlowPageforGuest;
