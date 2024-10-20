import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, deleteMemberForGuest } from '../store/memberSliceForGuest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import AddMemberFormForGuest from '../Components/AddMemberFormForGuest';
import ModalforAddFlowStepForm from '../Components/ModalforAddFlowStepForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';

const MatrixCol = ({ openModal, flowNumber, member }) => {
    const flowsteps = useSelector((state) => state.flowstepsForGuest);

    return (
        <td className="matrix-cell">
            {flowsteps
                .filter(step => step.flow_number === flowNumber && step.members.some(m => m.id === member.id))
                .map(flowstep => (
                    <div key={flowstep.id} className="member-cell">
                        <FlowStep flowstep={flowstep} />
                    </div>
                ))}
            {!flowsteps.some(step => step.flow_number === flowNumber && step.members.some(m => m.id === member.id)) && (
                <div className="member-cell">
                    <button className="add-step-button" onClick={() => openModal(member, flowNumber)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            )}
        </td>
    );
};

const MatrixRow = ({ member, openModal, maxFlowNumber, index, moveRow }) => {
    const [isHovered, setIsHovered] = useState(false);

    const dispatch = useDispatch();

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
                moveRow(item.index, index); // This will only update the local order
                item.index = index; // Update the index to reflect the new position
            }
        },
    }), [index, moveRow]);

    const onMemberDelete = (id) => {
        dispatch(deleteMemberForGuest(id));
    };

    return (
        <tr
            ref={(node) => drag(drop(node))} 
            style={{ opacity: isDragging ? 0.5 : 1 }} 
        >
            <td className="matrix-side-header">
                <div
                    className="member-cell" 
                    onMouseEnter={() => setIsHovered(true)} 
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
                >
                    {member.name}
                    <button onClick={() => onMemberDelete(member.id)} className="delete-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    {isHovered && (
                        <div className="drag-icon">
                            <FontAwesomeIcon icon={faArrowUp} />
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    )}
                </div>
            </td>
            {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => (
                <MatrixCol key={flowNumber} member={member} openModal={openModal} flowNumber={flowNumber} />
            ))}
            <td className="matrix-cell next-step-column">
                <button className="add-step-button" onClick={() => openModal(member, maxFlowNumber + 1)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </td>
        </tr>
    );
};

const MatrixViewForGuest = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [maxFlowNumber, setMaxFlowNumber] = useState(0);
    const dispatch = useDispatch();
    
    const members = useSelector((state) => state.membersForGuest) || []; // Reduxの状態
    const flowsteps = useSelector((state) => state.flowstepsForGuest) || [];
    
    const [orderedMembers, setOrderedMembers] = useState([]);

    // `members`の変更時に`orderedMembers`を更新
    useEffect(() => {
        setOrderedMembers(members);
    }, [members]);

    useEffect(() => {
        dispatch(fetchMembers()); // メンバーを取得
    }, [dispatch]);

    const openModal = (member, stepNumber) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedMember(null);
        setIsModalOpen(false);
    };

    // ローカルで行の順序を移動（DnD用）
    const moveRow = (fromIndex, toIndex) => {
        const updatedMembers = [...orderedMembers];
        const [movedMember] = updatedMembers.splice(fromIndex, 1);
        updatedMembers.splice(toIndex, 0, movedMember);
        setOrderedMembers(updatedMembers); // ローカルな状態のみ更新
    };

    useEffect(() => {
        if (flowsteps && flowsteps.length > 0) {
            const maxFlowNumber = Math.max(0, ...flowsteps.map(step => step.flow_number));
            setMaxFlowNumber(maxFlowNumber);
        } else {
            setMaxFlowNumber(0);
        }
    }, [flowsteps]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="matrix-container">
                <div className="matrix-title">MatrixFlow</div>
                <table className="matrix-table">
                    <thead>
                        <tr>
                            <th className="matrix-corner-header">Members / FlowStep</th>
                            {Array.from({ length: maxFlowNumber }, (_, i) => (
                                <th key={i} className="matrix-header">STEP {i + 1}</th>
                            ))}
                            <th className="matrix-header next-step-column">STEP {maxFlowNumber + 1}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderedMembers.map((member, index) => (
                            <MatrixRow 
                                key={member.id} 
                                member={member} 
                                openModal={openModal} 
                                maxFlowNumber={maxFlowNumber} 
                                index={index} 
                                moveRow={moveRow} 
                            />
                        ))}
                        <tr>
                            <td className="matrix-side-header">
                                <AddMemberFormForGuest />
                            </td>
                            {Array.from({ length: maxFlowNumber }, (_, i) => (
                                <td key={i} className="matrix-cell"></td>
                            ))}
                            <td className="matrix-cell next-step-column">
                                <button className="add-step-button" onClick={() => openModal(null, maxFlowNumber + 1)}>
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <ModalforAddFlowStepForm isOpen={isModalOpen} onClose={closeModal}>
                    <AddFlowStepForm
                        member={selectedMember}
                        onClose={closeModal}
                        onFlowStepAdded={(newFlowStep) => {
                            dispatch(addFlowstep(newFlowStep));
                        }}
                    />
                </ModalforAddFlowStepForm>
            </div>
        </DndProvider>
    );
};

export default MatrixViewForGuest;
