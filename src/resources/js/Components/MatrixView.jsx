import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import AddMemberForm from '../Components/AddMemberForm';
import ModalforAddFlowStepForm from '../Components/ModalforAddFlowStepForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';

const MatrixCol = ({ flowsteps, members, openModal, flowNumber, onAssignFlowStep }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FLOWSTEP',
        drop: (item) => {
            const droppedFlowStepId = item.id;
            const member = members[0];
            onAssignFlowStep(member.id, droppedFlowStepId);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <td className="matrix-cell" ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'white' }}>
            {members.map((member) => {
                const flowstep = flowsteps.find(
                    step => step.flow_number === flowNumber && step.members.some(m => m.id === member.id)
                );
                return (
                    <div key={member.id} className="member-cell">
                        {flowstep ? (
                            <FlowStep flowstep={flowstep} />
                        ) : (
                            <button 
                                className="add-step-button" 
                                onClick={() => openModal(member, flowNumber)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        )}
                    </div>
                );
            })}
        </td>
    );
};

const MatrixRow = ({ member, flowsteps, onAssignFlowStep, openModal, maxFlowNumber, index, moveRow }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ROW',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [index]);

    const [, drop] = useDrop(() => ({
        accept: 'ROW',
        hover: (item) => {
            if (item.index !== index) {
                moveRow(item.index, index);
                item.index = index; // Update the index to reflect the new position
            }
        },
    }), [index, moveRow]);

    return (
        <tr ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <td className="matrix-side-header">
                <div className="member-cell">
                    <div>{member.name}</div>
                    <div className="member-icon">
                        <FontAwesomeIcon icon={faUser} size="2x" />
                    </div>
                </div>
            </td>
            {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => (
                <MatrixCol
                    key={flowNumber}
                    flowsteps={flowsteps}
                    members={[member]}
                    openModal={openModal}
                    flowNumber={flowNumber}
                    onAssignFlowStep={onAssignFlowStep}
                />
            ))}
            <td className="matrix-cell next-step-column">
                <button
                    className="add-step-button"
                    onClick={() => openModal(member, maxFlowNumber + 1)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </td>
        </tr>
    );
};

const MatrixView = ({ initialMembers, flowsteps, onAssignFlowStep, onMemberAdded, onFlowStepAdded }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedStepNumber, setSelectedStepNumber] = useState(null);
    const [maxFlowNumber, setMaxFlowNumber] = useState(0);
    const [members, setMembers] = useState([]); // ここは変更しない
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    useEffect(() => {
        const fetchMembers = async () => {
            const response = await fetch('/api/members');
            const data = await response.json();
            setMembers(data); // order_on_matrixを考慮したデータを設定
        };

        fetchMembers();
    }, []);

    useEffect(() => {
        if (flowsteps.length > 0) {
            const maxFlowNumber = Math.max(0, ...flowsteps.map(step => step.flow_number));
            setMaxFlowNumber(maxFlowNumber);
        } else {
            setMaxFlowNumber(0);
        }
    }, [flowsteps]);

    const openModal = (member, stepNumber) => {
        setSelectedMember(member);
        setSelectedStepNumber(stepNumber);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMember(null);
        setSelectedStepNumber(null);
        setIsModalOpen(false);
    };

    const moveRow = async (fromIndex, toIndex) => {
        const updatedMembers = [...members]; // ここでmembersを参照
        const [movedMember] = updatedMembers.splice(fromIndex, 1);
        updatedMembers.splice(toIndex, 0, movedMember);
        setMembers(updatedMembers); // membersステートを更新
    
        // サーバーに新しい順序を保存
        const response = await saveOrderToServer(updatedMembers);
        if (response.success) {
            console.log('Order saved successfully'); // 成功メッセージ
        } else {
            console.error('Error saving order:', response.error); // エラーメッセージ
        }
    };
        
    const saveOrderToServer = async (updatedMembers) => {
        try {
            const response = await fetch('/api/save-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ member_ids: updatedMembers.map(member => member.id) }),
            });
    
            // レスポンスをJSONとしてパース
            const data = await response.json();
            return data; // レスポンスデータを返す
        } catch (error) {
            console.error('Error saving order:', error);
            return { success: false, error }; // エラーを返す
        }
    };
    
    
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="matrix-container">
                <h2>Matrix View</h2>
                {members.length === 0 && flowsteps.length === 0 ? ( // memberListをmembersに変更
                    <p>No data available.</p>
                ) : (
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="matrix-corner-header">Members / FlowStep</th>
                                {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => (
                                    <th key={flowNumber} className="matrix-header">STEP {flowNumber}</th>
                                ))}
                                <th className="matrix-header next-step-column">STEP {maxFlowNumber + 1}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member, index) => ( // memberListをmembersに変更
                                <MatrixRow
                                    key={member.id}
                                    member={member}
                                    flowsteps={flowsteps}
                                    onAssignFlowStep={onAssignFlowStep}
                                    openModal={openModal}
                                    maxFlowNumber={maxFlowNumber}
                                    index={index} // Pass the index to MatrixRow
                                    moveRow={moveRow} // Pass moveRow function to MatrixRow
                                />
                            ))}
                            <tr>
                                <td className="matrix-side-header">
                                    <div className="member-cell">
                                        <AddMemberForm onMemberAdded={onMemberAdded} />
                                    </div>
                                </td>
                                {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => (
                                    <td key={flowNumber} className="matrix-cell">
                                        <div></div>
                                    </td>
                                ))}
                                <td className="matrix-cell next-step-column">
                                    <button 
                                        className="add-step-button" 
                                        onClick={() => openModal(null, maxFlowNumber + 1)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                <ModalforAddFlowStepForm isOpen={isModalOpen} onClose={closeModal}>
                    <AddFlowStepForm
                        members={members}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
                        onFlowStepAdded={onFlowStepAdded}
                    />
                </ModalforAddFlowStepForm>
            </div>
        </DndProvider>
    );
};

export default MatrixView;
