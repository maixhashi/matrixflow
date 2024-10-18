import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMembers, updateMemberName } from '../store/memberSlice';
import { fetchFlowsteps, updateFlowStepNumber } from '../store/flowstepsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus, faArrowUp, faArrowDown, faTrash } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import AddMemberForm from '../Components/AddMemberForm';
import ModalforAddFlowStepForm from '../Components/ModalforAddFlowStepForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';

const MatrixCol = ({ openModal, flowNumber, onAssignFlowStep, updateFlowStepNumber, member }) => {
    const dispatch = useDispatch();
    const members = useSelector((state) => state.members); // Reduxストアからメンバーリストを取得
    const flowsteps = useSelector((state) => state.flowsteps); // Redux ストアから flowsteps を取得

    useEffect(() => {
        dispatch(fetchMembers()); // コンポーネントがマウントされたときにメンバーを取得
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchFlowsteps()); // コンポーネントがマウントされたときにフローステップを取得
    }, [dispatch]);

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

    return (
        <td className="matrix-cell" ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'white' }}>
            {/* flowstepsをループして、flow_numberとメンバーに基づいて表示 */}
            {flowsteps
                .filter(step => step.flow_number === flowNumber && step.members.some(m => m.id === member.id)) // flow_numberとメンバーでフィルタリング
                .map(flowstep => (
                    <div key={flowstep.id} className="member-cell">
                        <FlowStep flowstep={flowstep} />
                    </div>
                ))}
            
            {/* FlowStepが存在しない場合にボタンを表示 */}
            {!flowsteps.some(step => step.flow_number === flowNumber && step.members.some(m => m.id === member.id)) && (
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

const MatrixRow = ({ member, onAssignFlowStep, openModal, maxFlowNumber, index, moveRow, updateFlowStepNumber, onMemberDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(member.name); // 初期値を member.name に設定

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

    // Redux ストアからメンバーリストを取得
    const members = useSelector((state) => state.members); 
    const flowsteps = useSelector((state) => state.flowsteps); 

    useEffect(() => {
        dispatch(fetchMembers()); // コンポーネントがマウントされたときにメンバーを取得
    }, [dispatch]);

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleNameEdit = async () => {
        // メンバー名を更新するアクションをディスパッチ
        await dispatch(updateMemberName({ id: member.id, name: newName }));
        setIsEditing(false);
    };

    return (
        <tr 
        ref={(node) => drag(drop(node))} 
            style={{ opacity: isDragging ? 0.5 : 1 }} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: 'relative' }}
        >
            <td className="matrix-side-header">
                <div className="member-cell">
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={newName} 
                            onChange={handleNameChange} 
                            onBlur={handleNameEdit} // フォーカスが外れたときに自動的に保存
                            onKeyPress={(e) => { if (e.key === 'Enter') handleNameEdit(); }} // Enterで保存
                        />
                    ) : (
                        <>
                            <div onClick={() => setIsEditing(true)}>{member.name}</div>
                            <div className="member-icon">
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
                    // members={[member]}
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

const MatrixView = ({ initialMembers, onAssignFlowStep, onMemberAdded, onFlowStepAdded }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedStepNumber, setSelectedStepNumber] = useState(null);
    const [maxFlowNumber, setMaxFlowNumber] = useState(0);
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const dispatch = useDispatch();

    const members = useSelector((state) => state.members); // Reduxストアからメンバーリストを取得
    const flowsteps = useSelector((state) => state.flowsteps); // Redux ストアから flowsteps を取得

    useEffect(() => {
        dispatch(fetchMembers()); // コンポーネントがマウントされたときにメンバーを取得
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchFlowsteps()); // コンポーネントがマウントされたときにフローステップを取得
    }, [dispatch]);

    useEffect(() => {
        if (flowsteps.length > 0) {
            const maxFlowNumber = Math.max(0, ...flowsteps.map(step => step.flow_number));
            setMaxFlowNumber(maxFlowNumber);
        } else {
            setMaxFlowNumber(0);
        }
    }, [flowsteps]);

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

    const handleUpdateFlowStepNumber = async (flowStepId, newFlowNumber) => {
        // ReduxのupdateFlowStepNumberをdispatch
        dispatch(updateFlowStepNumber({ flowStepId, newFlowNumber }));
    };

    const handleMemberDelete = async (memberId) => {
        try {
            const response = await fetch(`/api/members/${memberId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            if (response.ok) {
                // Update state to remove the deleted member
                setMembers(members.filter(member => member.id !== memberId));
                console.log(`Member with ID ${memberId} deleted successfully.`);
            } else {
                console.error('Failed to delete member.');
            }
        } catch (error) {
            console.error('Error deleting member:', error);
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
                                    updateFlowStepNumber={handleUpdateFlowStepNumber}
                                    onMemberDelete={handleMemberDelete}
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
