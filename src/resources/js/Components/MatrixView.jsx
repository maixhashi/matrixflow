// MatrixView.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import FlowStep from '../Components/Flowstep';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../../css/MatrixView.css';
import AddMemberForm from '../Components/AddMemberForm'; // Import your AddMemberForm component

const MatrixView = ({ members, flowsteps, onAssignFlowStep }) => {
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
                            </tr>
                        </thead>
                        <tbody>
                            {members.map((member) => (
                                <tr key={member.id}>
                                    <td className="matrix-side-header">
                                        <div className="member-cell">
                                            <div>
                                                {member.name}
                                            </div>
                                            <div className="member-icon">
                                                <FontAwesomeIcon icon={faUser} size="2x" />
                                            </div>
                                        </div>
                                    </td>
                                    {flowsteps.map((flowstep) => {
                                        // 事前に関連するメンバーIDを取得
                                        const assignedMembersBeforeDrop = flowstep.members ? flowstep.members.map(m => m.id) : [];

                                        // ドロップ処理を設定
                                        const [{ isOver }, drop] = useDrop({
                                            accept: 'FLOWSTEP',
                                            drop: (item) => {
                                                // メンバーIDを取得
                                                onAssignFlowStep(
                                                    member.id, 
                                                    item.id, 
                                                    assignedMembersBeforeDrop // ドロップ前の関連メンバーIDを渡す
                                                );
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
                                                style={{ backgroundColor: isOver ? '#f0f0f0' : 'white' }} // ドロップエリアの色を変更
                                            >
                                                {flowstep.members && flowstep.members.some(m => m.id === member.id) ? (
                                                    <FlowStep flowstep={flowstep} />
                                                ) : (
                                                    <div></div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            {/* Add the AddMemberForm row */}
                            <tr>
                                <td className="matrix-side-header">
                                    <div className="member-cell">
                                        <AddMemberForm /> {/* Render your AddMemberForm component here */}
                                    </div>
                                </td>
                                {flowsteps.map((flowstep) => (
                                    <td key={flowstep.id} className="matrix-cell">
                                        <div></div> {/* Empty cell for alignment */}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </DndProvider>
    );
};

export default MatrixView;
