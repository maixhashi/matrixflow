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

// MatrixColコンポーネント
const MatrixCol = ({ flowstep, members, onAssignFlowStep, openModal }) => {
    return (
        <td className="matrix-cell">
            {members.map((member) => {
                const isAssigned = flowstep.members && flowstep.members.some(m => m.id === member.id);
                return (
                    <div key={member.id} className="member-cell">
                        {isAssigned ? (
                            <FlowStep flowstep={flowstep} />
                        ) : (
                            <button 
                                className="add-step-button" 
                                onClick={() => openModal(member, flowstep.flow_number)}
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

// MatrixRowコンポーネント
const MatrixRow = ({ member, flowsteps, onAssignFlowStep, openModal, nextStepNumber }) => {
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
            {flowsteps.map((flowstep) => (
                <MatrixCol 
                    key={flowstep.id} 
                    flowstep={flowstep} 
                    members={[member]} 
                    onAssignFlowStep={onAssignFlowStep} 
                    openModal={openModal} 
                />
            ))}
            <td className="matrix-cell next-step-column">
                <button 
                    className="add-step-button" 
                    onClick={() => openModal(member, nextStepNumber)}
                >
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </td>
        </tr>
    );
};

// MatrixViewコンポーネント
const MatrixView = ({ members, flowsteps, onAssignFlowStep, onMemberAdded, onFlowStepAdded }) => {
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
                {members.length === 0 && flowsteps.length === 0 ? (
                    <p>No data available.</p>
                ) : (
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="matrix-corner-header">Members / FlowStep</th>
                                {flowsteps.map((flowstep) => (
                                    <th key={flowstep.id} className="matrix-header">STEP {flowstep.flow_number}</th>
                                ))}
                                <th className="matrix-header next-step-column">STEP {nextStepNumber}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <MatrixRow 
                                    key={member.id} 
                                    member={member} 
                                    flowsteps={flowsteps} 
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
                                {flowsteps.map((flowstep) => (
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

                {/* AddFlowStepFormモーダルを表示 */}
                <ModalforAddFlowStepForm isOpen={isModalOpen} onClose={closeModal}>
                    <AddFlowStepForm
                        members={members}
                        member={selectedMember}
                        stepNumber={selectedStepNumber} // 選択されたSTEP番号を渡す
                        nextStepNumber={nextStepNumber} // 次のSTEP番号を渡す
                        onFlowStepAdded={onFlowStepAdded}
                    />
                </ModalforAddFlowStepForm>
            </div>
        </DndProvider>
    );
};

export default MatrixView;
