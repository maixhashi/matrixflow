import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import AddMemberForm from '../Components/AddMemberForm';
import ModalforAddFlowStepForm from '../Components/ModalforAddFlowStepForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';

const MatrixCol = ({ flowsteps, members, openModal, flowNumber, onAssignFlowStep, updateFlowStepNumber }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FLOWSTEP',
        drop: (item) => {
            const droppedFlowStepId = item.id;
            const member = members[0];

            onAssignFlowStep(member.id, droppedFlowStepId);
            // Call the function to update the flowstep number
            updateFlowStepNumber(droppedFlowStepId, flowNumber);
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

const MatrixRow = ({ member, flowsteps, onAssignFlowStep, openModal, maxFlowNumber, index, moveRow, updateFlowStepNumber }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ROW',
        item: { index, memberId: member.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [index, member.id]);

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
        <tr 
            ref={(node) => drag(drop(node))} 
            style={{ opacity: isDragging ? 0.5 : 1 }} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <td className="matrix-side-header" style={{ position: 'relative' }}>
                <div className="member-cell">
                    <div>{member.name}</div>
                    <div className="member-icon">
                        <FontAwesomeIcon icon={faUser} size="2x" />
                    </div>
                    {isHovered && (
                        <div className="drag-icon">
                            <FontAwesomeIcon icon={faArrowUp} />
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    )}
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
                    updateFlowStepNumber={updateFlowStepNumber}
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
    const [members, setMembers] = useState([]);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    useEffect(() => {
        fetchMembers(); // Initial fetch of members
    }, []);

    useEffect(() => {
        if (flowsteps.length > 0) {
            const maxFlowNumber = Math.max(0, ...flowsteps.map(step => step.flow_number));
            setMaxFlowNumber(maxFlowNumber);
        } else {
            setMaxFlowNumber(0);
        }
    }, [flowsteps]);

    const fetchMembers = async () => {
        const response = await fetch('/api/members');
        const data = await response.json();
        setMembers(data); // order_on_matrixを考慮したデータを設定
    };

    const handleMemberAdded = async (newMember) => {
        await onMemberAdded(newMember); // Call the provided onMemberAdded function
        await fetchMembers(); // Fetch updated members
    };

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
        const updatedMembers = [...members];
        const [movedMember] = updatedMembers.splice(fromIndex, 1);
        updatedMembers.splice(toIndex, 0, movedMember);
        setMembers(updatedMembers);

        const response = await saveOrderToServer(updatedMembers);
        if (response.success) {
            console.log('Order saved successfully');
        } else {
            console.error('Error saving order:', response.error);
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

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error saving order:', error);
            return { success: false, error };
        }
    };

    const updateFlowStepNumber = async (flowStepId, newFlowNumber) => {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        try {
            const response = await fetch('/api/update-flowstep-stepnumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    flowStepId,
                    newFlowNumber,
                }),
            });
    
            if (response.ok) {
                console.log(`Updated FlowStep ${flowStepId} to new step number ${newFlowNumber}`);
                // Optionally refresh flowsteps or do other updates
            } else {
                console.error("Failed to update FlowStep number");
            }
        } catch (error) {
            console.error("Error updating FlowStep number:", error);
        }
    };
    

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="matrix-container">
                <h2>Matrix View</h2>
                {members.length === 0 && flowsteps.length === 0 ? (
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
                            {members.map((member, index) => (
                                <MatrixRow
                                    key={member.id}
                                    member={member}
                                    flowsteps={flowsteps}
                                    onAssignFlowStep={onAssignFlowStep}
                                    openModal={openModal}
                                    maxFlowNumber={maxFlowNumber}
                                    index={index}
                                    moveRow={moveRow}
                                    updateFlowStepNumber={updateFlowStepNumber} 
                                />
                            ))}
                            <tr>
                                <td className="matrix-side-header">
                                    <div className="member-cell">
                                        <AddMemberForm onMemberAdded={handleMemberAdded} />
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
                        onClose={closeModal}
                        onFlowStepAdded={onFlowStepAdded}
                    />
                </ModalforAddFlowStepForm>
            </div>
        </DndProvider>
    );
};

export default MatrixView;
