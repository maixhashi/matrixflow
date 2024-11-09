import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Store Redux Sliceのインポート
import { fetchMembers, updateMemberName, deleteMember } from '../store/memberSlice';
import { fetchFlowsteps, updateFlowStepNumber } from '../store/flowstepsSlice';
import { fetchCheckLists, selectCheckListsByColumn } from '../store/checklistSlice';
import { openCheckListModal, openAddFlowstepModal } from '../store/modalSlice';
import { setSelectedMember, setSelectedStepNumber } from '../store/selectedSlice';


// FontAwesomeのアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSquarePlus, faArrowUp, faArrowDown, faTrash, faEdit, faRoadBarrier, faPlus, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

// コンポーネントのインポート
import FlowStep from '../Components/Flowstep';
import AddMemberForm from '../Components/AddMemberForm';
import AddFlowStepForm from '../Components/AddFlowStepForm';
import UpdateFlowStepForm from '../Components/UpdateFlowStepForm';
import AddCheckListForm from '../Components/AddCheckListForm';
import ModalforAddFlowStepForm from '../Components/ModalforAddFlowStepForm';
import ModalforUpdateFlowStepForm from '../Components/ModalforUpdateFlowStepForm';
import ModalforAddCheckListForm from '../Components/ModalforAddCheckListForm';
import CheckListModal from '../Components/CheckListModal';
import CheckListModalContent from '../Components/CheckListModalContent';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// スタイル
import '../../css/MatrixView.css';


// コンポーネントの定義
const CheckItemColumn = ({ member, flowNumber, openAddCheckListModal, workflowId }) => {
    const dispatch = useDispatch();

    const checkListsFromStore = useSelector(selectCheckListsByColumn);
    const checkListsForFlowNumber = checkListsFromStore[flowNumber] || [];
    
    const [selectedCheckList, setSelectedCheckList] = useState(null); // 選択されたチェックリストを保持する状態
    
    const hasCheckList = checkListsForFlowNumber.some(checklist => checklist.workflow_id === workflowId);
    console.log("hasCheckList:", hasCheckList);

    // モーダルを開く
    const isCheckListModalOpen = useSelector(state => state.modal.isCheckListModalOpen);
    const handleOpenChecklistModal = (checklist) => {
        dispatch(openCheckListModal({ checkList: checklist }));
    };

    return (
        <td className="matrix-check-item-column">
            {hasCheckList ? (
                <div className="check-item" onClick={() => handleOpenChecklistModal(checkListsForFlowNumber[0])}>
                    <FontAwesomeIcon icon={faClipboardCheck} /> {/* 1つだけ表示 */}
                </div>
            ) : (
                <div className="check-item" onClick={() => openAddCheckListModal(member, flowNumber)}>
                    <FontAwesomeIcon icon={faPlus} /> {/* チェック項目追加 */}
                </div>
            )}

            {/* モーダルの表示 */}
            {isCheckListModalOpen && (
                <CheckListModal 
                    checkList={selectedCheckList} // 選択されたチェックリストをモーダルに渡す
                >
                    <CheckListModalContent
                      workflowId={workflowId}
                      flowNumber={flowNumber}
                      checkListsForFlowNumber={checkListsForFlowNumber}
                    />
                </CheckListModal >
            )}
        </td>
    );
};

const MatrixCol = ({ openAddFlowStepModal, openAddCheckListModal, flowNumber, onAssignFlowStep, updateFlowStepNumber, member, workflowId }) => {
    const dispatch = useDispatch();
    const flowsteps = useSelector((state) => state.flowsteps); // Redux ストアから flowsteps を取得

    useEffect(() => {
        dispatch(fetchFlowsteps(workflowId)); // コンポーネントがマウントされたときにフローステップを取得
    }, [dispatch, workflowId]);

    useEffect(() => {
        console.log('workflowId in MatrixRow:', workflowId);
    }, [workflowId]);


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

    const isAddFlowstepModalOpen = useSelector(state => state.modal.isAddFlowstepModalOpen);
    const handleOpenAddFlowstepModal = (member, stepNumber) => {
        dispatch(setSelectedMember(member));
        dispatch(setSelectedStepNumber(stepNumber));
        dispatch(openAddFlowstepModal(member, stepNumber));
    };


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
                            flowNumber={flowNumber}
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
                        onClick={() => handleOpenAddFlowstepModal(member, flowNumber)}
                    >
                        <FontAwesomeIcon icon={faSquarePlus} />
                    </button>
                </div>
            )}
        </td>
    );
};

const MatrixRow = ({
    member,
    onAssignFlowStep,
    openAddFlowStepModal,
    openAddCheckListModal,
    maxFlowNumber,
    index,
    moveRow,
    updateFlowStepNumber,
    onMemberDelete,
    workflowId,
    }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(member.name);
    const [checkLists, setCheckLists] = useState({}); // チェックリストの状態管理

    const selectedMember = useSelector((state) => state.selected.selectedMember);
    const selectedStepNumber = useSelector((state) => state.selected.selectedStepNumber);
      // 状態をコンソールに表示
    console.log('selectedMember:', selectedMember);
    console.log('selectedStepNumber:', selectedStepNumber);

  
    const dispatch = useDispatch();
    
    // Reduxからチェックリストを取得
    const checkListsFromStore = useSelector(selectCheckListsByColumn);

    useEffect(() => {
        // チェックリストを取得
        dispatch(fetchCheckLists(workflowId));
        dispatch(fetchMembers(workflowId)); // メンバーも取得
    }, [dispatch, workflowId]);

    useEffect(() => {
        // チェックリストのデータを状態にセット
        if (checkListsFromStore) {
            setCheckLists(checkListsFromStore);
            console.log("checkListsFromStore by useEffect on MatrixRow" ,JSON.stringify(checkListsFromStore, null, 2));
        }
    }, [checkListsFromStore]);

    const isAddFlowstepModalOpen = useSelector(state => state.modal.isAddFlowstepModalOpen);
    const handleOpenAddFlowstepModal = (member, stepNumber) => {
        dispatch(setSelectedMember(member));
        dispatch(setSelectedStepNumber(stepNumber));
        dispatch(openAddFlowstepModal(member, stepNumber));
    };


    const handleAddCheckItem = (flowNumber) => {
        const newCheckItemId = Date.now(); // 一意のIDを生成
        const newCheckItem = {
            id: newCheckItemId,
            check_content: `New Check Item ${flowNumber}`,
            member_id: member.id,
        };

        setCheckLists((prev) => ({
            ...prev,
            [flowNumber]: prev[flowNumber]
                ? prev[flowNumber].map(checkItem => ({
                    ...checkItem,
                    check_items: [...(checkItem.check_items || []), newCheckItem],
                }))
                : [{ check_items: [newCheckItem] }],
        }));
    };

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
                item.index = index;
            }
        },
    }), [index, moveRow]);

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleNameEdit = async () => {
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
            {Array.from({ length: maxFlowNumber }, (_, i) => i + 1).map((flowNumber) => {
                const checkItems = checkLists[flowNumber]?.[0]?.check_items || []; // チェックアイテムを取得

                return (
                    <React.Fragment key={flowNumber}>
                        <MatrixCol
                            member={member}
                            isDragging={isDragging}
                            openAddFlowStepModal={openAddFlowStepModal}
                            openAddCheckListModal={openAddCheckListModal}
                            flowNumber={flowNumber}
                            onAssignFlowStep={onAssignFlowStep}
                            updateFlowStepNumber={updateFlowStepNumber}
                            workflowId={workflowId}
                        />
                        {flowNumber < maxFlowNumber && (
                            <CheckItemColumn
                                member={member}
                                flowNumber={flowNumber}
                                checkItems={checkItems}
                                onAddCheckItem={() => handleAddCheckItem(flowNumber)}
                                openAddCheckListModal={openAddCheckListModal}
                                workflowId={workflowId}
                            />
                        )}
                    </React.Fragment>
                );
            })}
            <td className="matrix-cell next-step-column">
                <button onClick={() => handleOpenAddFlowstepModal(member, maxFlowNumber + 1)} className="add-step-button">
                    <FontAwesomeIcon icon={faSquarePlus} />
                </button>
            </td>
        </tr>
    );
};


const MatrixView = ({ onAssignFlowStep, onMemberAdded, onFlowStepAdded, workflowId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalforAddCheckListFormOpen, setIsModalforAddCheckListFormOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedStepNumber, setSelectedStepNumber] = useState(null);
    const [maxFlowNumber, setMaxFlowNumber] = useState(0);
    const [orderedMembers, setOrderedMembers] = useState([]);
    
    const dispatch = useDispatch();
    
    // Reduxストアから指定のworkflowIdに関連するメンバーとフローステップを取得
    const members = useSelector((state) => state.members);
    const flowsteps = useSelector((state) => state.flowsteps);
    const isAddFlowstepModalOpen = useSelector((state) => state.modal.isAddFlowstepModalOpen);
    const isUpdateFlowstepModalOpen = useSelector((state) => state.modal.isUpdateFlowstepModalOpen);
    
    useEffect(() => {
        dispatch(fetchMembers(workflowId));
        dispatch(fetchFlowsteps(workflowId));
    }, [dispatch, workflowId]);

    useEffect(() => {
        if (flowsteps.length > 0) {
            const maxFlowNumber = Math.max(0, ...flowsteps.map(step => step.flow_number));
            setMaxFlowNumber(maxFlowNumber);
        } else {
            setMaxFlowNumber(0);
        }
    }, [flowsteps]);

    useEffect(() => {
        setOrderedMembers(members);
    }, [members]);

    const handleMemberAdded = async (newMember) => {
        await onMemberAdded(newMember); // Call the provided onMemberAdded function
        dispatch(fetchMembers()); // Fetch updated members from the Redux store
    };
        

    const openAddFlowStepModal = (member, stepNumber) => {
        setSelectedMember(member);
        setSelectedStepNumber(stepNumber);
        setIsModalOpen(true);
    };

    const handleOpenAddFlowstepModalonMatrixView = (member, stepNumber) => {
        setSelectedMember(member);
        setSelectedStepNumber(stepNumber);
        dispatch(openAddFlowStepModal());
    };

    const closeAddFlowStepModal = () => {
        setSelectedMember(null);
        setSelectedStepNumber(null);
        setIsModalOpen(false);
    };

    const openAddCheckListModal = (member, stepNumber) => {
        setSelectedMember(member);
        setSelectedStepNumber(stepNumber);
        setIsModalforAddCheckListFormOpen(true);
    };

    const closeAddCheckListModal = () => {
        setSelectedMember(null);
        setSelectedStepNumber(null);
        setIsModalforAddCheckListFormOpen(false);
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
            const response = await axios.post('/api/save-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
                                    <button onClick={() => handleOpenAddFlowstepModalonMatrixView(null, 2)} className="add-step-button">
                                        <FontAwesomeIcon icon={faSquarePlus} />
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
                                {Array.from({ length: maxFlowNumber }, (_, i) => (
                                    <React.Fragment key={i}>
                                        <th className="matrix-header">STEP {i + 1}</th>
                                        {i < maxFlowNumber - 1 && <th className="matrix-header-between-steps"></th>} {/* チェック項目列を表示 */}
                                    </React.Fragment>
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
                                    openAddFlowStepModal={openAddFlowStepModal}
                                    openAddCheckListModal={openAddCheckListModal}
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
                                {Array.from({ length: maxFlowNumber === 0 ? 1 : 2 * maxFlowNumber - 1 }, (_, i) => (
                                    <td key={i} className="matrix-cell-between-steps">
                                        <div className="matrix-empty-cell-between-steps">
                                            <FontAwesomeIcon icon={faRoadBarrier} color="navy" size="1x" />
                                        </div> {/* This keeps the cell empty for alignment */}
                                    </td> // ここを修正
                                ))}
                                {maxFlowNumber > 0 && (  // maxFlowNumber が 1 より大きい場合のみ表示
                                    <td className="matrix-cell next-step-column next-step-column-faRoadBarrier">
                                        <FontAwesomeIcon icon={faRoadBarrier} color="navy" size="1x" />
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                )}

            {/* モーダルの表示 */}
            {isAddFlowstepModalOpen && (
                <ModalforAddFlowStepForm isOpen={isAddFlowstepModalOpen} onClose={closeAddFlowStepModal}>
                    <AddFlowStepForm
                        members={orderedMembers}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
                        onClose={closeAddFlowStepModal}
                        onFlowStepAdded={onFlowStepAdded}
                        workflowId={workflowId}
                    />
                </ModalforAddFlowStepForm>
            )}

            {/* モーダルの表示 */}
            {isUpdateFlowstepModalOpen && (
                <ModalforUpdateFlowStepForm>
                    <UpdateFlowStepForm
                        members={orderedMembers}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
                        onClose={closeAddFlowStepModal}
                        onFlowStepAdded={onFlowStepAdded}
                        workflowId={workflowId}
                    />
                </ModalforUpdateFlowStepForm>
            )}


                
                <ModalforAddCheckListForm isOpen={isModalforAddCheckListFormOpen} onClose={closeAddCheckListModal}>
                    <AddCheckListForm
                        members={orderedMembers}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
                        onClose={closeAddCheckListModal}
                        onFlowStepAdded={onFlowStepAdded}
                        workflowId={workflowId}
                    />
                </ModalforAddCheckListForm>
            </div>
        </DndProvider>
    );
};

export default MatrixView;