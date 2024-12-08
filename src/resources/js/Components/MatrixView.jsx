import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Store Redux Sliceのインポート
import { fetchMembers, updateMemberName, deleteMember } from '../store/memberSlice';
import { fetchFlowsteps, updateFlowStepNumber } from '../store/flowstepsSlice';
import { fetchCheckLists, selectCheckListsByColumn } from '../store/checklistSlice';
import { openCheckListModal, openAddFlowstepModal } from '../store/modalSlice';
import { setSelectedMember, setSelectedFlowstep, setSelectedStepNumber, setSelectedToolsystem } from '../store/selectedSlice';
import { setDataBaseIconPositions, setFlowstepPositions } from '../store/positionSlice';
import { updateToolsystemForFlowstep } from '../store/toolsystemSlice';

// FontAwesomeのアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSquarePlus, faArrowUp, faArrowDown, faTrash, faEdit, faPlus, faClipboardCheck, faDatabase, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';

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
import ArrowRenderer from '../Components/ArrowRenderer';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// カスタムフック
import { useCheckItemColumn } from '../Hooks/useCheckItemColumn'
import { useMatrixCol } from '../Hooks/useMatrixCol'
import { useMatrixRow } from '../Hooks/useMatrixRow'

// スタイル
import '../../css/MatrixView.css';

// コンポーネントの定義
const CheckItemColumn = ({ member, flowNumber, openAddCheckListModal }) => {
    const { 
        workflowId, isCheckListModalOpen,
        checkListsForFlowNumber, hasCheckList,
        selectedCheckList,
        handleOpenChecklistModal,
    } = useCheckItemColumn(flowNumber);

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

const MatrixCol = ({ member, flowNumber, onAssignFlowStep, updateFlowStepNumber }) => {
    const { 
        workflowId,
        validFlowsteps,
        handleOpenAddFlowstepModal, handleSetSelectedFlowstep,
    } = useMatrixCol(member, flowNumber);

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
            {validFlowsteps
                .filter(step => 
                    step.flow_number === flowNumber && 
                    Array.isArray(step.members) && 
                    step.members.some(m => m.id === member.id) // Check if members is an array
                )
                .map(flowstep => (
                    <div key={flowstep.id} className="member-cell" onClick={() => handleSetSelectedFlowstep(flowstep)}>
                        <FlowStep
                            member={member}
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
    openAddCheckListModal,
    maxFlowNumber,
    index,
    moveRow,
    updateFlowStepNumber,
    onMemberDelete,
    }) => {

    const {
        isHovered, setIsHovered, isEditing, setIsEditing, newName, checkLists, 
        workflowId,
        handleOpenAddFlowstepModal, handleAddCheckItem, handleNameChange, handleNameEdit
    } = useMatrixRow(member)

    // DnD 
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
    const [isHovered, setIsHovered] = useState(false);
    const [isEditingToolsystemName, setIsEditingToolsystemName] = useState(false);
    const [updatedToolsystemName, setUpdatedToolsystemName] = useState(''); // toolsystem.nameの初期値で初期化
    const [isModalforAddCheckListFormOpen, setIsModalforAddCheckListFormOpen] = useState(false);
    // const [selectedMember, setSelectedMember] = useState(null);
    const [selectedStepNumber, setSelectedStepNumber] = useState(null);
    const [maxFlowNumber, setMaxFlowNumber] = useState(0);
    const [orderedMembers, setOrderedMembers] = useState([]);
    
    const dispatch = useDispatch();

    // faDaseBaseアイコンの位置情報を取得
    const dataBaseIconPositions = useSelector((state) => state.positions.dataBaseIconPositions);
    const flowstepPositions = useSelector((state) => state.positions.flowstepPositions);

    useEffect(() => {
        console.log("dataBaseIconPositions:", dataBaseIconPositions); // Reduxから位置情報を確認
        console.log("flowstepPositions:", flowstepPositions); // Reduxから位置情報を確認
      }, [dataBaseIconPositions, flowstepPositions]);

    useEffect(() => {
      const getDatabaseIconPositions = () => {
        const icons = document.querySelectorAll('.dataBaseIcon');
        const positionsArray = Array.from(icons).map(icon => {
          const rect = icon.getBoundingClientRect();
          return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          };
        });
        dispatch(setDataBaseIconPositions(positionsArray));
      };
  
      // DOMが更新された後に位置を取得
      getDatabaseIconPositions();
  
      // 位置情報を再取得するためにDOMの変化を監視
      const observer = new MutationObserver(getDatabaseIconPositions);
      observer.observe(document.body, { childList: true, subtree: true });
  
      return () => {
        observer.disconnect();
      };
    }, [dispatch]);
    
    // Reduxストアから指定のworkflowIdに関連するメンバーとフローステップを取得
    const selectedMember = useSelector((state) => state.selected.selectedMember);
    const selectedFlowstep = useSelector((state) => state.selected.selectedFlowstep);
    const selectedToolsystem = useSelector((state) => state.selected.selectedToolsystem);
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
        

    const handleOpenAddFlowstepModalonMatrixView = (member, stepNumber) => {
        dispatch(setSelectedMember(member));
        dispatch(setSelectedStepNumber(stepNumber));
        dispatch(openAddFlowStepModal());
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

    const handleUpdateToolsystemName = async (toolsystemName) => {
        try {
            // toolsystem.name を更新
            await dispatch(updateToolsystemForFlowstep({ 
                flowstepId: selectedFlowstep.id, 
                toolsystemId: selectedToolsystem.id,
                toolsystemName: toolsystemName 
            })).unwrap(); // エラー時にキャッチできるようにunwrapを使用
            
            // flowstepの状態を再取得
            dispatch(fetchFlowsteps(workflowId));
            
            // 編集モードを終了
            setIsEditingToolsystemName(false);
        } catch (error) {
            console.error('更新エラー:', error);
        }
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

    const handleSetSelectedToolsystem = (toolsystem) => {
        dispatch(setSelectedToolsystem(toolsystem))
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="matrix-container">
                <div className="matrix-title"></div>
                {orderedMembers.length === 0 && flowsteps.length === 0 ? (
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

                                {Array.from({ length: maxFlowNumber === 0 ? 1 : 2 * maxFlowNumber - 1 }, (_, i) => {
                                    const isOddColumn = i % 2 === 0; // 奇数番目の列
                                    const flowstep = flowsteps.find(step => step.flow_number === i + 1); // `flow_number` に基づいて取得
                                    const hasFlowsteps = flowsteps.length > 0;
                                    const hasToolSystem = Array.isArray(flowstep?.toolsystems) && flowstep.toolsystems.length > 0;

                                    return (
                                        <td 
                                            key={i} 
                                            className={`matrix-cell-between-steps ${!hasFlowsteps ? 'next-step-column' : ''}`}
                                        >
                                            <div
                                                className="matrix-empty-cell-between-steps"
                                                onMouseEnter={() => setIsHovered(true)}
                                                onMouseLeave={() => setIsHovered(false)}
                                            >
                                                {isOddColumn && hasFlowsteps && hasToolSystem && (
                                                    <>
                                                        <FontAwesomeIcon icon={faDatabase} color="navy" className="dataBaseIcon fa-xl" />
                                                        <div className="toolsystem-name-container">
                                                            {isEditingToolsystemName ? (
                                                                // フォーム表示
                                                                <form
                                                                    onSubmit={(e) => {
                                                                        e.preventDefault();
                                                                        // toolsystem.name を更新する処理を実行
                                                                        handleUpdateToolsystemName(updatedToolsystemName);
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        value={updatedToolsystemName} // stateで管理する更新後の名前
                                                                        onChange={(e) => setUpdatedToolsystemName(e.target.value)} // 入力値の更新
                                                                        className="toolsystem-name-input"
                                                                    />
                                                                    <div className="toolsystem-name-editing-form-buttons">
                                                                        <div>
                                                                            <button type="submit" className="toolsystem-name-save-button">
                                                                                <FontAwesomeIcon icon={faSave} color="navy" />
                                                                            </button>
                                                                        </div>
                                                                        <div>
                                                                            <button
                                                                                type="button"
                                                                                className="toolsystem-name-cancel-button"
                                                                                onClick={() => setIsEditingToolsystemName(false)} // 編集モードを終了
                                                                            >
                                                                                <FontAwesomeIcon icon={faCancel} color="navy" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </form>

                                                            ) : (
                                                            // 名前表示
                                                            <div className="toolsystem-name-container">
                                                                <div className="toolsystem-name">
                                                                    {flowstep.toolsystems.map((toolsystem, index) => (
                                                                        <span key={index}>
                                                                            {toolsystem.name}
                                                                            {index < flowstep.toolsystems.length - 1 && ', '}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                {isHovered && flowstep.toolsystems.map(toolsystem => (
                                                                    <div
                                                                        key={toolsystem.id} // toolsystemのIDがある場合を想定
                                                                        className="toolsystem-name-edit-icon"
                                                                        onClick={() => {
                                                                            setIsEditingToolsystemName(true);
                                                                            handleSetSelectedToolsystem(toolsystem);
                                                                        }}
                                                                        style={{ marginLeft: '5px' }}
                                                                    >
                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    );
                                })}


                                {maxFlowNumber > 0 && (  // maxFlowNumber が 1 より大きい場合のみ表示
                                    <td className="matrix-cell next-step-column next-step-column-faRoadBarrier">
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                )}

            {/* モーダルの表示 */}
            {isAddFlowstepModalOpen && (
                <ModalforAddFlowStepForm>
                    <AddFlowStepForm
                        members={orderedMembers}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
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

            {flowstepPositions.map((position, index) => (
             dataBaseIconPositions[index] && (
                <ArrowRenderer key={index} from={position} to={dataBaseIconPositions[index]} color="gray" strokeWidth={2} />
                )
            ))}

        </DndProvider>
    );
};

export default MatrixView;