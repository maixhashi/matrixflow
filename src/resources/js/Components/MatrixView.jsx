import React from 'react';

// FontAwesomeのアイコンのインポート
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSquarePlus, faArrowUp, faArrowDown, faTrash, faEdit, faPlus, faClipboardCheck, faDatabase, faSave, faCancel } from '@fortawesome/free-solid-svg-icons';

// コンポーネントのインポート
import Flowstep from '../Components/Flowstep';

// Form
import FormforAddMember from '../Components/Forms/FormforAddMember';
import FormforAddFlowstep from '../Components/Forms/FormforAddFlowstep';
import FormforUpdateFlowstep from '../Components/Forms/FormforUpdateFlowstep';
import FormforAddChecklist from '../Components/Forms/FormforAddChecklist';
import FormforUpdateChecklist from '../Components/Forms/FormforUpdateChecklist';

// Modal
import ModalofFormforAddFlowstep from '../Components/ModalofFormforAddFlowstep';
import ModalofFormforUpdateFlowstep from '../Components/ModalofFormforUpdateFlowstep';
import ModalofFormforAddChecklist from '../Components/ModalofFormforAddChecklist';
import CheckListModal from '../Components/CheckListModal';

import ArrowRenderer from '../Components/ArrowRenderer';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// カスタムフック
import { useCheckItemColumn } from '../Hooks/useCheckItemColumn'
import { useMatrixCol } from '../Hooks/useMatrixCol'
import { useMatrixRow } from '../Hooks/useMatrixRow'
import { useMatrixView } from '../Hooks/useMatrixView'

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
                    <FormforUpdateChecklist
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
                        <Flowstep
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

const MatrixView = ({ onAssignFlowStep, onFlowStepAdded }) => {
    const { 
        // Local State
        isHovered, setIsHovered, isEditingToolsystemName, setIsEditingToolsystemName, updatedToolsystemName, setUpdatedToolsystemName,
        isModalforAddCheckListFormOpen, selectedStepNumber, maxFlowNumber, orderedMembers,
    
        // Global State
        dataBaseIconPositions, flowstepPositions, selectedMember,
        flowsteps, isAddFlowstepModalOpen, isUpdateFlowstepModalOpen, workflowId,
    
        // Event Handler
        handleMemberAdded, handleOpenAddFlowstepModalonMatrixView, openAddCheckListModal, closeAddCheckListModal, moveRow,
        handleUpdateFlowStepNumber, handleUpdateToolsystemName, handleMemberDelete, handleSetSelectedToolsystem,
    } = useMatrixView();
    

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
                                        <FormforAddMember
                                            onMemberAdded={handleMemberAdded}
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
                                        <FormforAddMember
                                            onMemberAdded={handleMemberAdded}
                                        />
                                    </div>
                                </td>

                                {Array.from({ length: maxFlowNumber === 0 ? 1 : 2 * maxFlowNumber - 1 }, (_, i) => {
                                    const isOddColumn = i % 2 !== 0; // 奇数列かどうかを判定
                                    const flow_number = !isOddColumn ? Math.floor(i / 2) + 1 : null; // 偶数列の場合のみ flow_number を計算
                                    const flowstep = !isOddColumn ? flowsteps.find(step => step.flow_number === flow_number) : null; // 偶数列のみ取得
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
                                                {!isOddColumn && hasFlowsteps && hasToolSystem && (
                                                    <>
                                                        <FontAwesomeIcon icon={faDatabase} color="navy" className="dataBaseIcon fa-xl" />
                                                        <div className="toolsystem-name-container">
                                                            {isEditingToolsystemName ? (
                                                                // フォーム表示
                                                                <form
                                                                    onSubmit={(e) => {
                                                                        e.preventDefault();
                                                                        handleUpdateToolsystemName(updatedToolsystemName);
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        value={updatedToolsystemName}
                                                                        onChange={(e) => setUpdatedToolsystemName(e.target.value)}
                                                                        className="toolsystem-name-input"
                                                                    />
                                                                    <div className="toolsystem-name-editing-form-buttons">
                                                                        <button type="submit" className="toolsystem-name-save-button">
                                                                            <FontAwesomeIcon icon={faSave} color="navy" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="toolsystem-name-cancel-button"
                                                                            onClick={() => setIsEditingToolsystemName(false)}
                                                                        >
                                                                            <FontAwesomeIcon icon={faCancel} color="navy" />
                                                                        </button>
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
                                                                            key={toolsystem.id}
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
                <ModalofFormforAddFlowstep>
                    <FormforAddFlowstep
                        members={orderedMembers}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
                        onFlowStepAdded={onFlowStepAdded}
                    />
                </ModalofFormforAddFlowstep>
            )}

            {/* モーダルの表示 */}
            {isUpdateFlowstepModalOpen && (
                <ModalofFormforUpdateFlowstep>
                    <FormforUpdateFlowstep
                        members={orderedMembers}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
                        onFlowStepAdded={onFlowStepAdded}
                        workflowId={workflowId}
                    />
                </ModalofFormforUpdateFlowstep>
            )}


                
                <ModalofFormforAddChecklist isOpen={isModalforAddCheckListFormOpen} onClose={closeAddCheckListModal}>
                    <FormforAddChecklist
                        members={orderedMembers}
                        member={selectedMember}
                        stepNumber={selectedStepNumber}
                        nextStepNumber={maxFlowNumber + 1}
                        onClose={closeAddCheckListModal}
                        onFlowStepAdded={onFlowStepAdded}
                        workflowId={workflowId}
                    />
                </ModalofFormforAddChecklist>
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