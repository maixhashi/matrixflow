import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMembers, updateMemberName, deleteMember } from '../store/memberSlice';
import { fetchFlowsteps, updateFlowStepNumber } from '../store/flowstepsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faArrowUp, faArrowDown, faTrash, faEdit, faRoadBarrier } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import AddMemberForm from '../Components/AddMemberForm';
import ModalforAddFlowStepForm from '../Components/ModalforAddFlowStepForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';

const MatrixCol = ({ openModal, flowNumber, onAssignFlowStep, updateFlowStepNumber, member }) => {
    const dispatch = useDispatch();
    const flowsteps = useSelector((state) => state.flowsteps); // Redux ストアから flowsteps を取得
    const { workflowId } = useParams();

    useEffect(() => {
        dispatch(fetchFlowsteps(workflowId)); // コンポーネントがマウントされたときにフローステップを取得
    }, [dispatch, workflowId]);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'FLOWSTEP',
        drop: (item) => {
            const droppedFlowStepId = item.id;
            onAssignFlowStep(member.id, droppedFlowStepId); // 現在のメンバーを使用
            updateFlowStepNumber(droppedFlowStepId, flowNumber);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Ensure flowsteps is an array
    const validFlowsteps = Array.isArray(flowsteps) ? flowsteps : [];

    return (
        <td className="matrix-cell" ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'white' }}>
            {/* flowstepsをループして、flow_numberとメンバーに基づいて表示 */}
            {validFlowsteps
                .filter(step => 
                    step.flow_number === flowNumber && 
                    Array.isArray(step.members) && 
                    step.members.some(m => m.id === member.id) // Check if members is an array
                )
                .map(flowstep => (
                    <div key={flowstep.id} className="member-cell">
                        <FlowStep
                            flowstep={flowstep}
                            workflowId={workflowId}
                        />
                    </div>
                ))}
            
            {/* FlowStepが存在しない場合にボタンを表示 */}
            {!validFlowsteps.some(step => 
                step.flow_number === flowNumber && 
                Array.isArray(step.members) && 
                step.members.some(m => m.id === member.id) // Check if members is an array
            ) && (
                <div className="member-cell">
                    <button 
                        className="add-step-button" 
                        onClick={() => openModal(member, flowNumber)}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            )}
        </td>
    );
};

const MatrixRow = ({ member, onAssignFlowStep, openModal, maxFlowNumber, index, moveRow, updateFlowStepNumber, onMemberDelete, workflowId }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(member.name); // Set initial value to member.name

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

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchMembers(workflowId)); // Fetch members when component mounts
    }, [dispatch]);

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleNameEdit = async () => {
        // Dispatch an action to update the member name
        await dispatch(updateMemberName({ id: member.id, name: newName }));
        setIsEditing(false);
    };

    return (
        <tr ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <td className="matrix-side-header">
                <div className="member-cell" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={newName} 
                            onChange={handleNameChange} 
                            onBlur={handleNameEdit} 
                            onKeyPress={(e) => { if (e.key === 'Enter') handleNameEdit(); }} 
                            style={{ marginRight: '5px' }} 
                        />
                    ) : (
                        <>
                            <div onClick={() => setIsEditing(true)} style={{ marginRight: '5px' }}>
                                {member.name}
                            </div>
                            {isHovered && (
                                <div className="edit-icon" onClick={() => setIsEditing(true)} style={{ marginLeft: '5px' }}>
                                    <FontAwesomeIcon icon={faEdit} size="1x" />
                                </div>
                            )}
                            <div className="member-icon" style={{ marginRight: '15px', marginLeft: 'auto' }}>
                                <FontAwesomeIcon icon={faUser} size="2x" />
                            </div>
                        </>
                    )}
                    {isHovered && (
                        <div className="drag-icon">
                            <FontAwesomeIcon icon={faArrowUp} />
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    )}
                    <button onClick={() => onMemberDelete(member.id)} className="delete-button">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </td>
            {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => (
                <MatrixCol
                    key={flowNumber}
                    member={member}
                    openModal={openModal}
                    flowNumber={flowNumber}
                    onAssignFlowStep={onAssignFlowStep}
                    updateFlowStepNumber={updateFlowStepNumber}
                    workflowId={workflowId}
                />
            ))}
            <td className="matrix-cell next-step-column">
                <button className="add-step-button" onClick={() => openModal(member, maxFlowNumber + 1)}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </td>
        </tr>
    );
};

const MatrixView = ({ onAssignFlowStep, onMemberAdded, onFlowStepAdded }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedStepNumber, setSelectedStepNumber] = useState(null);
    const [maxFlowNumber, setMaxFlowNumber] = useState(0);
    const [orderedMembers, setOrderedMembers] = useState([]); // 行の順序を管理するための状態を追加
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const dispatch = useDispatch();
    const { workflowId } = useParams();

    // Reduxストアから指定のworkflowIdに関連するメンバーとフローステップを取得
    const members = useSelector((state) => state.members);
    const flowsteps = useSelector((state) => state.flowsteps);
    
    useEffect(() => {
        dispatch(fetchMembers(workflowId)); // workflowIdに基づいてメンバーを取得
        console.log('Fetched members:', members);
        dispatch(fetchFlowsteps(workflowId)); // workflowIdに基づいてフローステップを取得
        console.log('Fetched flowsteps:', flowsteps);
    }, [dispatch, workflowId]);

    useEffect(() => {
        console.log('workflowId:', workflowId);
    }, [workflowId]);



    useEffect(() => {
        if (flowsteps.length > 0) {
            const maxFlowNumber = Math.max(0, ...flowsteps.map(step => step.flow_number));
            setMaxFlowNumber(maxFlowNumber);
        } else {
            setMaxFlowNumber(0);
        }
    }, [flowsteps]);

    useEffect(() => {
        setOrderedMembers(members); // メンバーの初期順序を設定
    }, [members]);

    const handleMemberAdded = async (newMember) => {
        await onMemberAdded(newMember); // Call the provided onMemberAdded function
        dispatch(fetchMembers()); // Fetch updated members from the Redux store
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
        const updatedMembers = [...orderedMembers]; // orderedMembersを使用
        const [movedMember] = updatedMembers.splice(fromIndex, 1);
        updatedMembers.splice(toIndex, 0, movedMember);
        setOrderedMembers(updatedMembers); // 状態を更新

        const response = await saveOrderToServer(updatedMembers);
        if (response.success) {
            console.log('Order saved successfully');
            // 最新のフローステップを取得
            dispatch(fetchFlowsteps()); // Add this to ensure fresh data
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

    const handleUpdateFlowStepNumber = async (flowStepId, newFlowNumber) => {
        // ReduxのupdateFlowStepNumberをdispatch
        dispatch(updateFlowStepNumber({ flowStepId, newFlowNumber }));
        dispatch(fetchFlowsteps(workflowId));
    };

    const handleMemberDelete = (memberId) => {
        dispatch(deleteMember(memberId))
            .then(() => {
                dispatch(fetchMembers(workflowId)); // Refresh members after deletion
            })
            .catch((error) => {
                console.error('Error deleting member:', error);
            });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="matrix-container">
                <div className="matrix-title"></div>
                {orderedMembers.length === 0 && flowsteps.length === 0 ? (
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
                            <tr>
                                <td className="matrix-side-header">
                                    <div className="member-cell">
                                        <AddMemberForm
                                            onMemberAdded={handleMemberAdded}
                                            workflowId={workflowId}
                                        />
                                    </div>
                                </td>
                                <td className="matrix-cell next-step-column">
                                    <button onClick={() => openModal(null, 2)} className="add-step-button">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="matrix-corner-header">担当者 / フローステップ</th>
                                {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => (
                                    <th key={flowNumber} className="matrix-header">STEP {flowNumber}</th>
                                ))}
                                <th className="matrix-header next-step-column">STEP {maxFlowNumber + 1}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderedMembers.map((member, index) => (
                                <MatrixRow
                                    key={member.id}
                                    member={member}
                                    flowsteps={flowsteps}
                                    onAssignFlowStep={onAssignFlowStep}
                                    openModal={openModal}
                                    maxFlowNumber={maxFlowNumber}
                                    index={index}
                                    moveRow={moveRow}
                                    updateFlowStepNumber={handleUpdateFlowStepNumber}
                                    onMemberDelete={handleMemberDelete}
                                    workflowId={workflowId}
                                />
                            ))}
                            <tr>
                                <td className="matrix-side-header">
                                    <div className="member-cell">
                                        <AddMemberForm
                                            onMemberAdded={handleMemberAdded}
                                            workflowId={workflowId}
                                        />
                                    </div>
                                </td>
                                {Array.from({ length: maxFlowNumber }, (_, i) => (
                                    <td key={i} className="matrix-cell">
                                        <div className="matrix-empty-cell"><FontAwesomeIcon icon={faRoadBarrier} color="navy" size="1x" /></div> {/* This keeps the cell empty for alignment */}
                                    </td>
                                ))}
                                <td className="matrix-cell next-step-column">
                                    <button onClick={() => openModal(null, maxFlowNumber + 1)} className="add-step-button">
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                <ModalforAddFlowStepForm isOpen={isModalOpen} onClose={closeModal}>
                    <AddFlowStepForm
                        members={orderedMembers}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
                        onClose={closeModal}
                        onFlowStepAdded={onFlowStepAdded}
                        workflowId={workflowId}
                    />
                </ModalforAddFlowStepForm>
            </div>
        </DndProvider>
    );
};

export default MatrixView;