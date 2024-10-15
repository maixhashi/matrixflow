import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import AddMemberForm from '../Components/AddMemberForm';
import ModalforAddFlowStepForm from '../Components/ModalforAddFlowStepForm'; // モーダルをインポート
import AddFlowStepForm from '../Components/AddFlowStepForm'; // モーダル内に表示するフォーム
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';

const MatrixView = ({ members, flowsteps, onAssignFlowStep, onMemberAdded }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedStepNumber, setSelectedStepNumber] = useState(null);
    const [nextStepNumber, setNextStepNumber] = useState(1);
    const [currentFlowSteps, setCurrentFlowSteps] = useState(flowsteps); // Flow Stepsの状態を追加

    useEffect(() => {
        if (currentFlowSteps.length > 0) {
            const maxFlowNumber = Math.max(...currentFlowSteps.map(step => step.flow_number));
            setNextStepNumber(maxFlowNumber + 1);
        } else {
            setNextStepNumber(1);
        }
    }, [currentFlowSteps]);

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

    // Flow Stepを追加する関数
    const handleAddFlowStep = (newFlowStep) => {
        setCurrentFlowSteps((prevSteps) => [...prevSteps, newFlowStep]); // 新しいFlow Stepを追加
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <h2>Matrix View</h2>
                {members.length === 0 && currentFlowSteps.length === 0 ? (
                    <p>No data available.</p>
                ) : (
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="matrix-corner-header">Members / FlowStep</th>
                                {currentFlowSteps.map((flowstep) => (
                                    <th key={flowstep.id} className="matrix-header">STEP {flowstep.flow_number}</th>
                                ))}
                                <th className="matrix-header next-step-column">STEP {nextStepNumber}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <MemberRow 
                                    key={member.id} 
                                    member={member} 
                                    flowsteps={currentFlowSteps} 
                                    onAssignFlowStep={onAssignFlowStep} 
                                    openModal={openModal} 
                                    nextStepNumber={nextStepNumber} 
                                />
                            ))}
                            <tr>
                                <td className="matrix-side-header">
                                    <div className="member-cell">
                                        <AddMemberForm onMemberAdded={onMemberAdded} />
                                    </div>
                                </td>
                                {currentFlowSteps.map((flowstep) => (
                                    <td key={flowstep.id} className="matrix-cell">
                                        <div></div>
                                    </td>
                                ))}
                                <td className="matrix-cell next-step-column">
                                    <button 
                                        className="add-step-button" 
                                        onClick={() => openModal(null, nextStepNumber)}
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
                        nextStepNumber={nextStepNumber}
                        onAddFlowStep={handleAddFlowStep} // 新しいFlow Stepを追加する関数を渡す
                    />
                </ModalforAddFlowStepForm>
            </div>
        </DndProvider>
    );
};

const MemberRow = ({ member, flowsteps, onAssignFlowStep, openModal, nextStepNumber }) => {
    return (
        <tr>
            <td className="matrix-side-header">
                <div className="member-cell">
                    <div>{member.name}</div>
                    <div className="member-icon">
                        <FontAwesomeIcon icon={faUser} size="2x" />
                    </div>
                </div>
            </td>
            {flowsteps.map((flowstep) => {
                const assignedMembersBeforeDrop = flowstep.members ? flowstep.members.map(m => m.id) : [];

                const [{ isOver }, drop] = useDrop({
                    accept: 'FLOWSTEP',
                    drop: (item) => {
                        onAssignFlowStep(member.id, item.id, assignedMembersBeforeDrop);
                    },
                    collect: (monitor) => ({
                        isOver: monitor.isOver(),
                    }),
                });

                return (
                    <td 
                        key={flowstep.id} 
                        className="matrix-cell" 
                        ref={drop}
                        style={{ backgroundColor: isOver ? '#f0f0f0' : 'white' }}
                    >
                        {/* FlowStep がある場合は FlowStep を表示し、ない場合は + アイコンを表示 */}
                        {flowstep.members && flowstep.members.some(m => m.id === member.id) ? (
                            <FlowStep flowstep={flowstep} />
                        ) : (
                            <button 
                                className="add-step-button" 
                                onClick={() => openModal(member, flowstep.flow_number)} // メンバーとステップ番号を渡す
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        )}
                    </td>
                );
            })}
            {/* STEP n+1 のセルに + アイコンを表示し、スタイルを追加 */}
            <td className="matrix-cell next-step-column">
                <button 
                    className="add-step-button" 
                    onClick={() => openModal(member, nextStepNumber)} // メンバーと次のSTEP番号を渡す
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </td>
        </tr>
    );
};

export default MatrixView;
