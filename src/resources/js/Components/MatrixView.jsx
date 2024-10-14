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

const MatrixView = ({ members, flowsteps, onAssignFlowStep, onMemberAdded, onAddFlowStep }) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示状態
    const [selectedMember, setSelectedMember] = useState(null); // 選択されたメンバー
    const [selectedStepNumber, setSelectedStepNumber] = useState(null); // 選択されたSTEP番号
    const [nextStepNumber, setNextStepNumber] = useState(1); // 次のSTEP番号を初期値として1に設定

    // flowsteps の最大 flow_number + 1 を次のSTEP番号に設定
    useEffect(() => {
        if (flowsteps.length > 0) {
            const maxFlowNumber = Math.max(...flowsteps.map(step => step.flow_number));
            setNextStepNumber(maxFlowNumber + 1);
        } else {
            setNextStepNumber(1); // flowsteps が空の場合、デフォルトで 1
        }
    }, [flowsteps]);

    // モーダルを開く関数（メンバーとステップ番号を渡す）
    const openModal = (member, stepNumber) => {
        setSelectedMember(member); // 選択されたメンバーを設定
        setSelectedStepNumber(stepNumber); // 選択されたSTEP番号を設定
        setIsModalOpen(true); // モーダルを開く
    };

    // モーダルを閉じる関数
    const closeModal = () => {
        setSelectedMember(null);
        setSelectedStepNumber(null);
        setIsModalOpen(false);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <h2>Matrix View</h2>
                {members.length === 0 || flowsteps.length === 0 ? (
                    <p>No data available.</p>
                ) : (
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="matrix-corner-header">Members / FlowStep</th>
                                {flowsteps.map((flowstep) => (
                                    <th key={flowstep.id} className="matrix-header">STEP {flowstep.flow_number}</th>
                                ))}
                                {/* STEP n+1 を表示し、スタイルを追加 */}
                                <th className="matrix-header next-step-column">STEP {nextStepNumber}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <MemberRow 
                                    key={member.id} 
                                    member={member} 
                                    flowsteps={flowsteps} 
                                    onAssignFlowStep={onAssignFlowStep} 
                                    openModal={openModal} // モーダルを開く関数を渡す
                                    nextStepNumber={nextStepNumber} // 次のSTEP番号を渡す
                                />
                            ))}
                            <tr>
                                <td className="matrix-side-header">
                                    <div className="member-cell">
                                        <AddMemberForm onMemberAdded={onMemberAdded} />
                                    </div>
                                </td>
                                {flowsteps.map((flowstep) => (
                                    <td key={flowstep.id} className="matrix-cell">
                                        <div></div>
                                    </td>
                                ))}
                                {/* STEP n+1 の最後のセルにスタイルを追加 */}
                                <td className="matrix-cell next-step-column">
                                    <button 
                                        className="add-step-button" 
                                        onClick={() => openModal(null, nextStepNumber)} // STEP n+1 を追加
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {/* AddFlowStepFormモーダルを表示 */}
                <ModalforAddFlowStepForm isOpen={isModalOpen} onClose={closeModal}>
                    <AddFlowStepForm
                        members={members}
                        member={selectedMember}
                        stepNumber={selectedStepNumber} // 選択されたSTEP番号を渡す
                        nextStepNumber={nextStepNumber} // 次のSTEP番号を渡す
                        onAddFlowStep={onAddFlowStep}
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
